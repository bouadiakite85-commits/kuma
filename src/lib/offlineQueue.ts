// KUMA Offline Outbox & Local Storage Engine
// Manages store-and-forward offline messaging queue and local SQLite/IndexedDB persistence

import { Message, MessageStatus } from '../types';

export interface QueuedOfflineItem {
  id: string;
  chatId: string;
  targetRecipientPhone?: string;
  targetRecipientName?: string;
  message: Message;
  queuedAt: number;
  attemptsCount: number;
  dataSizeKb: number;
  retryReason?: string;
}

const STORAGE_KEY = 'kuma_offline_outbox_queue';
const DB_METRICS_KEY = 'kuma_local_db_metrics';

class KumaOfflineQueueManager {
  private queue: QueuedOfflineItem[] = [];
  private listeners: ((queue: QueuedOfflineItem[]) => void)[] = [];

  constructor() {
    this.loadQueue();
  }

  private loadQueue() {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        this.queue = JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load offline queue:', e);
      this.queue = [];
    }
  }

  private saveQueue() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.queue));
      this.notifyListeners();
    } catch (e) {
      console.error('Failed to save offline queue:', e);
    }
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => {
      try {
        listener([...this.queue]);
      } catch (e) {
        console.error(e);
      }
    });
  }

  public subscribe(callback: (queue: QueuedOfflineItem[]) => void): () => void {
    this.listeners.push(callback);
    callback([...this.queue]);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  public getQueue(): QueuedOfflineItem[] {
    return [...this.queue];
  }

  public getQueueCount(): number {
    return this.queue.length;
  }

  public getTotalQueuedSizeKb(): number {
    return this.queue.reduce((acc, item) => acc + (item.dataSizeKb || 2), 0);
  }

  public enqueueMessage(chatId: string, message: Message, recipientName?: string, recipientPhone?: string): QueuedOfflineItem {
    // Calculate approximate size
    let dataSizeKb = 1.2;
    if (message.type === 'voice' && message.voiceNote) {
      dataSizeKb = message.voiceNote.compressedSizeKb || message.voiceNote.audioSizeKb || 18;
    } else if (message.type === 'image') {
      dataSizeKb = message.transferredSizeKb || 45;
    } else if (message.type === 'mobile_money') {
      dataSizeKb = 0.8;
    } else if (message.content) {
      dataSizeKb = Math.max(0.5, Math.round(message.content.length * 0.002 * 10) / 10);
    }

    const item: QueuedOfflineItem = {
      id: `queue_${message.id}`,
      chatId,
      targetRecipientName: recipientName,
      targetRecipientPhone: recipientPhone,
      message: {
        ...message,
        status: 'pending_offline'
      },
      queuedAt: Date.now(),
      attemptsCount: 0,
      dataSizeKb
    };

    // Remove duplicates if already queued
    this.queue = this.queue.filter((q) => q.message.id !== message.id);
    this.queue.push(item);
    this.saveQueue();
    return item;
  }

  public removeFromQueue(messageId: string) {
    this.queue = this.queue.filter((q) => q.message.id !== messageId && q.id !== messageId);
    this.saveQueue();
  }

  public clearQueue() {
    this.queue = [];
    this.saveQueue();
  }

  // Flush all queued items when online or via P2P relay
  public async flushQueue(
    sendHandler: (item: QueuedOfflineItem) => Promise<boolean>
  ): Promise<{ successCount: number; failedCount: number }> {
    if (this.queue.length === 0) return { successCount: 0, failedCount: 0 };

    let successCount = 0;
    let failedCount = 0;
    const itemsToProcess = [...this.queue];

    for (const item of itemsToProcess) {
      try {
        item.attemptsCount += 1;
        const success = await sendHandler(item);
        if (success) {
          this.removeFromQueue(item.message.id);
          successCount++;
        } else {
          failedCount++;
        }
      } catch (e) {
        failedCount++;
        item.retryReason = String(e);
      }
    }

    this.saveQueue();
    return { successCount, failedCount };
  }
}

export const kumaOfflineQueue = new KumaOfflineQueueManager();

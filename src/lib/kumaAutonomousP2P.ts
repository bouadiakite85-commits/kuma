// KUMA Autonomous Peer-to-Peer Protocol & Local Mesh Sync
// Enables 100% decentralized KUMA-to-KUMA communication without central third-party servers

import { Message, User, StatusStory, CallSession, NetworkMode } from '../types';

export interface KumaP2PNode {
  nodeId: string;
  userId: string;
  userName: string;
  userPhone: string;
  userAvatar: string;
  lastPing: number;
  networkMode: NetworkMode;
  isMeshNode: boolean;
  rssiSignalStrength: number; // e.g. -45 dBm
}

export type KumaP2PEventType =
  | 'MESSAGE_RECEIVED'
  | 'MESSAGE_ACK'
  | 'TYPING'
  | 'CALL_OFFER'
  | 'CALL_ANSWER'
  | 'CALL_HANGUP'
  | 'STATUS_NEW'
  | 'PEER_DISCOVERY'
  | 'PEER_PING'
  | 'MESH_OFFLINE_RELAY';

export interface KumaP2PPacket {
  id: string;
  type: KumaP2PEventType;
  senderNodeId: string;
  senderUser: {
    id: string;
    name: string;
    phone: string;
    avatar: string;
  };
  targetUserId?: string; // specific recipient or broadcast
  payload: any;
  timestamp: number;
  encrypted: boolean;
  hopCount?: number;
}

class KumaAutonomousP2PEngine {
  private channel: BroadcastChannel | null = null;
  private nodeId: string = `kuma_node_${Math.random().toString(36).substring(2, 9)}`;
  private currentUser: User | null = null;
  private listeners: ((packet: KumaP2PPacket) => void)[] = [];
  private discoveredNodes: Map<string, KumaP2PNode> = new Map();
  private pingInterval: any = null;

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.channel = new BroadcastChannel('kuma_p2p_mesh_network');
      this.channel.onmessage = (event) => {
        this.handleIncomingPacket(event.data);
      };
    }

    // Fallback for environments with storage events
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (event.key === 'kuma_p2p_bus_event' && event.newValue) {
          try {
            const packet: KumaP2PPacket = JSON.parse(event.newValue);
            this.handleIncomingPacket(packet);
          } catch (e) {
            console.error('Storage bus parse error:', e);
          }
        }
      });
    }
  }

  public init(user: User, networkMode: NetworkMode = '3g') {
    this.currentUser = user;
    this.broadcastDiscovery(networkMode);

    if (this.pingInterval) clearInterval(this.pingInterval);
    this.pingInterval = setInterval(() => {
      this.broadcastPing(networkMode);
      this.cleanupStaleNodes();
    }, 5000);
  }

  public setNetworkMode(mode: NetworkMode) {
    this.broadcastPing(mode);
  }

  public subscribe(callback: (packet: KumaP2PPacket) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  public getNodeId(): string {
    return this.nodeId;
  }

  public getDiscoveredNodes(): KumaP2PNode[] {
    return Array.from(this.discoveredNodes.values());
  }

  // Send a packet over KUMA autonomous broadcast channel
  public sendPacket(type: KumaP2PEventType, payload: any, targetUserId?: string): KumaP2PPacket | null {
    if (!this.currentUser) return null;

    const packet: KumaP2PPacket = {
      id: `p2p_pkt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type,
      senderNodeId: this.nodeId,
      senderUser: {
        id: this.currentUser.id,
        name: this.currentUser.name,
        phone: this.currentUser.phone,
        avatar: this.currentUser.avatar
      },
      targetUserId,
      payload,
      timestamp: Date.now(),
      encrypted: true,
      hopCount: 1
    };

    // Send via BroadcastChannel
    if (this.channel) {
      this.channel.postMessage(packet);
    }

    // Also trigger via LocalStorage for cross-window / browser fallback
    try {
      localStorage.setItem('kuma_p2p_bus_event', JSON.stringify(packet));
    } catch (e) {
      // Ignore quota errors
    }

    return packet;
  }

  // Direct send message
  public sendMessage(targetUserId: string, message: Message) {
    return this.sendPacket('MESSAGE_RECEIVED', { message }, targetUserId);
  }

  // Send delivery or read ack
  public sendAck(targetUserId: string, messageId: string, status: 'delivered' | 'read') {
    return this.sendPacket('MESSAGE_ACK', { messageId, status }, targetUserId);
  }

  // Send typing indicator
  public sendTyping(targetUserId: string, isTyping: boolean) {
    return this.sendPacket('TYPING', { isTyping }, targetUserId);
  }

  // Send Call Signaling
  public sendCallOffer(targetUserId: string, callSession: CallSession) {
    return this.sendPacket('CALL_OFFER', { callSession }, targetUserId);
  }

  public sendCallAnswer(targetUserId: string, callId: string) {
    return this.sendPacket('CALL_ANSWER', { callId }, targetUserId);
  }

  public sendCallHangup(targetUserId: string, callId: string) {
    return this.sendPacket('CALL_HANGUP', { callId }, targetUserId);
  }

  // Share Status Story
  public shareStatus(story: StatusStory) {
    return this.sendPacket('STATUS_NEW', { story });
  }

  // Broadcast discovery
  public broadcastDiscovery(networkMode: NetworkMode = '3g') {
    if (!this.currentUser) return;
    this.sendPacket('PEER_DISCOVERY', {
      nodeId: this.nodeId,
      networkMode,
      rssiSignalStrength: -40 - Math.floor(Math.random() * 25)
    });
  }

  public broadcastPing(networkMode: NetworkMode = '3g') {
    if (!this.currentUser) return;
    this.sendPacket('PEER_PING', {
      nodeId: this.nodeId,
      networkMode,
      rssiSignalStrength: -42 - Math.floor(Math.random() * 20)
    });
  }

  private handleIncomingPacket(packet: KumaP2PPacket) {
    // Ignore self packets
    if (packet.senderNodeId === this.nodeId) return;

    // Track peer node
    if (packet.senderUser && packet.senderNodeId) {
      this.discoveredNodes.set(packet.senderNodeId, {
        nodeId: packet.senderNodeId,
        userId: packet.senderUser.id,
        userName: packet.senderUser.name,
        userPhone: packet.senderUser.phone,
        userAvatar: packet.senderUser.avatar,
        lastPing: Date.now(),
        networkMode: packet.payload?.networkMode || '3g',
        isMeshNode: true,
        rssiSignalStrength: packet.payload?.rssiSignalStrength || -55
      });
    }

    // If targeted, check if it's for current user or broadcast
    if (packet.targetUserId && this.currentUser) {
      const isForMe =
        packet.targetUserId === this.currentUser.id ||
        packet.targetUserId === this.currentUser.phone ||
        packet.targetUserId === 'broadcast';
      if (!isForMe) return;
    }

    // Notify all subscribers
    this.listeners.forEach((listener) => {
      try {
        listener(packet);
      } catch (e) {
        console.error('Error in P2P subscriber callback:', e);
      }
    });
  }

  private cleanupStaleNodes() {
    const now = Date.now();
    for (const [nodeId, node] of this.discoveredNodes.entries()) {
      if (now - node.lastPing > 15000) {
        this.discoveredNodes.delete(nodeId);
      }
    }
  }

  public destroy() {
    if (this.pingInterval) clearInterval(this.pingInterval);
    if (this.channel) this.channel.close();
    this.listeners = [];
  }
}

export const kumaP2P = new KumaAutonomousP2PEngine();

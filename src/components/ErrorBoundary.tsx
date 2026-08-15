import React, { Component, ReactNode, ErrorInfo } from 'react';
import { RefreshCw, ShieldAlert, Wrench } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isRepaired: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isRepaired: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorInfo: null,
      isRepaired: false
    };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[KUMA Error Boundary Caught]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleSafeRepair = () => {
    try {
      const savedUser = localStorage.getItem('kuma_auth_user');
      const savedContacts = localStorage.getItem('kuma_contacts');

      sessionStorage.clear();
      
      if (savedUser) localStorage.setItem('kuma_auth_user', savedUser);
      if (savedContacts) localStorage.setItem('kuma_contacts', savedContacts);

      this.setState({ isRepaired: true, hasError: false, error: null });
      window.location.reload();
    } catch (e) {
      window.location.reload();
    }
  };

  override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-800/80 rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-emerald-950 border border-amber-400/50 flex items-center justify-center mx-auto text-amber-400">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-black text-amber-300">Protection KUMA Anti-Erreur</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Une exception a été interceptée et isolée pour protéger vos données locales et messages chiffrés.
              </p>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-left font-mono text-[10px] text-emerald-400 max-h-24 overflow-y-auto">
              {this.state.error?.message || 'Erreur d\'exécution inconnue'}
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={this.handleSafeRepair}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
              >
                <Wrench className="w-4 h-4 text-amber-300" />
                <span>RÉPARER ET REDÉMARRER KUMA</span>
              </button>

              <button
                onClick={() => window.location.reload()}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Recharger la page</span>
              </button>
            </div>

            <p className="text-[10px] text-slate-500">
              Mode résilience locale actif • Vos clés E2EE et contacts sont conservés.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

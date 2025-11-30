import React from 'react';

/**
 * Hata Sınırı (Error Boundary)
 * Alt bileşenlerde oluşan JavaScript hatalarını yakalar ve gösterir
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  /**
   * Hata oluştuğunda state'i güncelle
   */
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  /**
   * Hata log'lanması
   */
  componentDidCatch(error, errorInfo) {
    console.error('Hata yakalandı:', error, errorInfo);
  }

  render() {
    // Hata varsa hata sayfasını göster
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-lg p-6 text-center">
            <h1 className="text-2xl font-semibold text-red-400 mb-2">Bir Hata Oluştu</h1>
            <p className="text-slate-300 mb-6 text-sm">{this.state.error?.message}</p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.href = '/';
              }}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md font-medium"
            >
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
      );
    }

    // Hata yoksa alt bileşenleri render et
    return this.props.children;
  }
}

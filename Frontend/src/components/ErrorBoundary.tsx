import React from "react";

export class ErrorBoundary extends React.Component<{
  children: React.ReactNode
}, { hasError: boolean; error?: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, info: any) {
    // Log error to service if needed
    // console.error(error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: '#1f2937', background: '#f9fafb', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ fontSize: 32, marginBottom: 16 }}>Something went wrong.</h1>
          <pre style={{ color: '#dc2626', background: '#fef2f2', padding: 16, borderRadius: 8, maxWidth: 600, overflow: 'auto', border: '1px solid #fecaca' }}>{String(this.state.error)}</pre>
          <p style={{ color: '#6b7280', marginTop: 24 }}>Try refreshing the page or contact support if the issue persists.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

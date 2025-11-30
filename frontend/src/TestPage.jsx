import React from 'react';

export default function TestPage() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#1a1a1a', color: '#fff', minHeight: '100vh' }}>
      <h1>Test Sayfası - Frontend Çalışıyor!</h1>
      <p>Bu sayfa frontend'in çalıştığını gösterir.</p>
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#333' }}>
        <p><strong>API Base URL:</strong> {process.env.REACT_APP_API_URL || 'http://localhost:3000'}</p>
        <p><strong>Window Location:</strong> {window.location.href}</p>
      </div>
    </div>
  );
}

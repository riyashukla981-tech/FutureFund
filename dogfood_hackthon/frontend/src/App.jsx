import React from 'react';

export default function App() {
  return (
    <main style={{
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      background: '#f4f7fb',
      color: '#1f2937'
    }}>
      <section style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '2rem 3rem',
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        maxWidth: '680px',
        textAlign: 'center'
      }}>
        <h1 style={{ marginBottom: '0.75rem' }}>Dogfood Platform</h1>
        <p style={{ margin: 0, lineHeight: 1.6 }}>
          A starter dashboard for tracking feedback, product quality, and team review workflows.
        </p>
      </section>
    </main>
  );
}

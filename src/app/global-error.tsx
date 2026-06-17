'use client';

import { useEffect } from 'react';

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          padding: '24px',
          background: 'linear-gradient(135deg, #02131f 0%, #06263a 48%, #0d314c 100%)',
          color: '#f8fbff',
          fontFamily: 'system-ui, sans-serif'
        }}
      >
        <main
          style={{
            width: 'min(560px, 100%)',
            borderRadius: '28px',
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(4, 19, 31, 0.84)',
            boxShadow: '0 36px 100px rgba(0,0,0,0.34)',
            padding: '32px'
          }}
        >
          <p
            style={{
              margin: 0,
              color: '#72d8ff',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase'
            }}
          >
            Error de aplicación
          </p>
          <h1 style={{ margin: '12px 0 10px', fontSize: '2rem', lineHeight: 1.05 }}>Algo falló al renderizar la página</h1>
          <p style={{ margin: 0, color: 'rgba(248, 251, 255, 0.72)', lineHeight: 1.7 }}>
            Reintentá la carga. Si el problema persiste, revisamos el error en consola y el último cambio aplicado.
          </p>

          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: '20px',
              border: 'none',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, #01c9e2, #58e6ff)',
              color: '#002033',
              font: 'inherit',
              fontWeight: 700,
              padding: '0.95rem 1.1rem',
              cursor: 'pointer'
            }}
          >
            Reintentar
          </button>
        </main>
      </body>
    </html>
  );
}

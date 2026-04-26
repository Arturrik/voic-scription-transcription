import { useRef, useState } from 'react';

export default function SupportScreen() {
  const [message, setMessage] = useState('');
  const textRef = useRef<HTMLTextAreaElement>(null);

  const handleTextChange = (value: string) => {
    setMessage(value);
    if (!textRef.current) return;
    textRef.current.style.height = 'auto';
    textRef.current.style.height = `${textRef.current.scrollHeight}px`;
  };

  return (
    <section style={{ padding: '48px 0', width: '100%' }}>
      <div className="section-container" style={{ maxWidth: '840px' }}>
        <div className="card-glass" style={{ borderRadius: '20px', padding: '28px' }}>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '8px' }}>Поддержка</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '18px' }}>
            Встроенный чат пока в демо-режиме. Оставьте обращение:
          </p>
          <textarea
            ref={textRef}
            rows={4}
            value={message}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Опишите вопрос или проблему..."
            style={{
              width: '100%',
              resize: 'none',
              overflow: 'hidden',
              borderRadius: '12px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              padding: '12px',
              marginBottom: '12px',
            }}
          />
          <button
            style={{
              padding: '10px 16px',
              borderRadius: '10px',
              border: 'none',
              background: 'var(--accent)',
              color: 'white',
              cursor: 'pointer',
              display: 'block',
              margin: '0 auto',
            }}
          >
            Отправить обращение
          </button>
        </div>
      </div>
    </section>
  );
}

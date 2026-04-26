import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function ReferralScreen() {
  const [copied, setCopied] = useState(false);
  const referralLink = 'https://tspk.app/r/demo-partner';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = referralLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section style={{ padding: '48px 0', width: '100%' }}>
      <div className="section-container" style={{ maxWidth: '900px' }}>
        <div className="card-glass" style={{ borderRadius: '20px', padding: '28px' }}>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '8px' }}>Партнерская программа</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Демо-экран реферальной механики без backend.
          </p>

          {/* Метка сверху */}
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>
            Ваша ссылка
          </div>

          {/* Поле со ссылкой и кнопкой копирования */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 14px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border)',
              marginBottom: '12px',
            }}
          >
            <code
              style={{
                flex: 1,
                fontSize: '0.9rem',
                color: 'var(--text-muted)',
                fontFamily: "'Inter', system-ui, monospace",
                wordBreak: 'break-all',
                userSelect: 'all',
              }}
            >
              {referralLink}
            </code>
            <button
              onClick={handleCopy}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '10px',
                background: copied ? 'rgba(16, 185, 129, 0.15)' : 'rgba(124, 106, 247, 0.1)',
                border: `1px solid ${copied ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-accent)'}`,
                color: copied ? '#10b981' : 'var(--accent-soft)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flexShrink: 0,
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                if (!copied) e.currentTarget.style.background = 'rgba(124, 106, 247, 0.2)';
              }}
              onMouseLeave={(e) => {
                if (!copied) e.currentTarget.style.background = 'rgba(124, 106, 247, 0.1)';
              }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Скопировано' : 'Копировать'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '10px' }}>
            {[
              ['Приглашено пользователей', '12'],
              ['Начислено бонусов', '3 400 ₽'],
              ['Активных приглашений', '7'],
            ].map(([title, value]) => (
              <div key={title} style={{ padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{title}</div>
                <div style={{ color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: 700 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
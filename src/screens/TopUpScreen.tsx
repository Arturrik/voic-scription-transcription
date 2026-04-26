import { useState } from 'react';

interface TopUpScreenProps {
  balance: number;
  onTopUp: (amount: number) => void;
}

export default function TopUpScreen({ balance, onTopUp }: TopUpScreenProps) {
  const quickAmounts = [500, 1000, 2000, 5000];
  const [amountInput, setAmountInput] = useState('1000');
  const parsedAmount = Number(amountInput);

  return (
    <section style={{ padding: '48px 0', width: '100%' }}>
      <div className="section-container" style={{ maxWidth: '720px' }}>
        <div className="card-glass" style={{ borderRadius: '20px', padding: '28px' }}>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '8px', color: 'var(--text-primary)' }}>Пополнение баланса</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '18px' }}>
            Текущий баланс: <strong>{balance.toLocaleString()} ₽</strong>
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '10px' }}>
            {quickAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => setAmountInput(String(amount))}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  background: 'rgba(255,255,255,0.03)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                }}
              >
                Выбрать {amount.toLocaleString()} ₽
              </button>
            ))}
          </div>
          <div style={{ marginTop: '14px' }}>
            <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '0.9rem' }}>
              Сумма пополнения
            </label>
            <input
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value.replace(/[^\d]/g, ''))}
              placeholder="Введите сумму"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                marginBottom: '12px',
              }}
            />
            <button
              onClick={() => {
                if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) return;
                onTopUp(parsedAmount);
              }}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                background: 'var(--accent)',
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Оплатить {Number.isFinite(parsedAmount) && parsedAmount > 0 ? `${parsedAmount.toLocaleString()} ₽` : ''}
            </button>
          </div>
          <div style={{ marginTop: '14px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Оплата и статусы успешно/ошибка работают как демо-сценарий.
          </div>
        </div>
      </div>
    </section>
  );
}

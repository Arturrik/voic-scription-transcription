import { X, FileAudio, Clock, CreditCard } from 'lucide-react';

interface CostModalProps {
  fileName: string;
  duration: string;
  durationSeconds: number;
  cost: number;
  balance: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function CostModal({ 
  fileName, 
  duration, 
  durationSeconds,
  cost, 
  balance, 
  onConfirm, 
  onCancel 
}: CostModalProps) {
  const remaining = balance - cost;
  const minutes = Math.ceil(durationSeconds / 60);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        animation: 'fadeIn 0.3s ease',
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: 'var(--bg-card)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--border)',
          borderRadius: '24px',
          padding: '32px',
          maxWidth: '450px',
          width: '90%',
          animation: 'fadeInUp 0.3s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Подтверждение обработки
          </h3>
          <button
            onClick={onCancel}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* File Info */}
        <div
          style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'var(--accent-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileAudio size={20} color="var(--accent-soft)" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ 
                fontSize: '0.9rem', 
                fontWeight: 600, 
                color: 'var(--text-primary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {fileName}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={12} />
                {duration} • {minutes} мин
              </div>
            </div>
          </div>

          <div style={{ height: '1px', background: 'var(--border)', margin: '16px 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Тариф</span>
            <span style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>12 ₽/мин</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Стоимость обработки</span>
            <span style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600 }}>{cost} ₽</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Текущий баланс</span>
            <span style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>{balance.toLocaleString()} ₽</span>
          </div>
          <div style={{ height: '1px', background: 'var(--border)', margin: '12px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 600 }}>Остаток после списания</span>
            <span style={{ color: remaining >= 0 ? '#10b981' : '#ef4444', fontSize: '1rem', fontWeight: 700 }}>
              {remaining.toLocaleString()} ₽
            </span>
          </div>
        </div>

        {/* Warning if low balance */}
        {remaining < 500 && remaining >= 0 && (
          <div style={{
            padding: '12px 16px',
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '8px',
            marginBottom: '16px',
            color: '#f59e0b',
            fontSize: '0.85rem',
          }}>
            ⚠️ После оплаты останется мало средств. Рекомендуем пополнить баланс.
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: '12px',
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
              fontSize: '0.95rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            disabled={remaining < 0}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: '12px',
              background: remaining < 0 ? 'var(--text-muted)' : 'var(--accent)',
              border: 'none',
              color: 'white',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: remaining < 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              boxShadow: remaining < 0 ? 'none' : '0 4px 20px rgba(124,106,247,0.3)',
            }}
          >
            {remaining < 0 ? 'Недостаточно средств' : 'Подтвердить'}
          </button>
        </div>
      </div>
    </div>
  );
}
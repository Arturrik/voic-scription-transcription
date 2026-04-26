import type { AppNotification } from '../App';

interface NotificationsScreenProps {
  notifications: AppNotification[];
  onOpenItem: (id: string) => void;
  onBack: () => void;
}

export default function NotificationsScreen({ notifications, onOpenItem, onBack }: NotificationsScreenProps) {
  return (
    <section style={{ padding: '48px 0', width: '100%' }}>
      <div className="section-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '18px' }}>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--text-primary)' }}>Центр уведомлений</h2>
          <button
            onClick={onBack}
            style={{ border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', borderRadius: '10px', padding: '8px 12px', cursor: 'pointer' }}
          >
            Назад
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {notifications.map((item) => (
            <button
              key={item.id}
              onClick={() => onOpenItem(item.id)}
              className="card-glass"
              style={{
                borderRadius: '14px',
                padding: '16px',
                textAlign: 'left',
                border: `1px solid ${item.read ? 'var(--border)' : 'var(--border-accent)'}`,
                background: 'rgba(255,255,255,0.03)',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.title}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>{item.description}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '6px' }}>{item.date}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

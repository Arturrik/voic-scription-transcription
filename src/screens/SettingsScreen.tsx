import { useState } from 'react';
import { User, Bell, CreditCard, Palette, Shield, Check, ChevronRight, Mail, Smartphone, MessageCircle } from 'lucide-react';

interface SettingItem {
  id: string;
  title: string;
  description: string;
  type: 'toggle' | 'button' | 'select';
  value?: boolean;
  action?: string;
}

interface SettingsSection {
  id: string;
  icon: React.ElementType;
  title: string;
  items: SettingItem[];
}

interface SettingsScreenProps {
  onNavigate: (screen: string) => void;
}

export default function SettingsScreen({ onNavigate }: SettingsScreenProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    autoTopUp: false,
    darkTheme: true,
  });

  const toggleSetting = (id: string) => {
    setToggles(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const sections: SettingsSection[] = [
    {
      id: 'profile',
      icon: User,
      title: 'Профиль',
      items: [
        { id: 'name', title: 'Имя', description: 'Алексей Иванов', type: 'button', action: 'Редактировать' },
        { id: 'email', title: 'Email', description: 'alexey.ivanov@company.ru', type: 'button', action: 'Редактировать' },
        { id: 'phone', title: 'Телефон', description: '+7 (999) 123-45-67', type: 'button', action: 'Редактировать' },
      ],
    },
    {
      id: 'notifications',
      icon: Bell,
      title: 'Уведомления',
      items: [
        { id: 'pushNotifications', title: 'Push-уведомления', description: 'Уведомления в браузере', type: 'toggle', value: toggles.pushNotifications },
        { id: 'emailNotifications', title: 'Email-уведомления', description: 'Отправлять копии на email', type: 'toggle', value: toggles.emailNotifications },
        { id: 'smsNotifications', title: 'SMS-уведомления', description: 'Уведомления о завершении', type: 'toggle', value: toggles.smsNotifications },
        { id: 'telegram', title: 'Telegram', description: 'Подключить бота', type: 'button', action: 'Подключить' },
      ],
    },
    {
      id: 'interface',
      icon: Palette,
      title: 'Интерфейс',
      items: [
        { id: 'darkTheme', title: 'Темная тема', description: 'Темный режим оформления', type: 'toggle', value: toggles.darkTheme },
        { id: 'language', title: 'Язык интерфейса', description: 'Русский', type: 'button', action: 'Изменить' },
        { id: 'defaultFormat', title: 'Формат по умолчанию', description: 'TXT для выжимок, TXT для транскрибаций', type: 'button', action: 'Изменить' },
      ],
    },
  ];

  const activeSection = sections.find(s => s.id === activeTab);

  const handleButtonClick = (sectionId: string, itemId: string) => {
    if (sectionId === 'profile') {
      onNavigate('profile');
    }
    // Другие разделы можно расширить при необходимости
  };

  return (
    <section style={{ padding: '48px 0', width: '100%' }}>
      <div className="section-container">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Настройки
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Управление аккаунтом и предпочтениями
          </p>
        </div>

        {/* Settings Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px' }}>
          {/* Sidebar */}
          <div
            className="card-glass"
            style={{
              padding: '20px',
              borderRadius: '20px',
              height: 'fit-content',
            }}
          >
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: activeTab === section.id ? 'var(--accent-muted)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  marginBottom: '4px',
                  transition: 'all 0.2s',
                }}
              >
                <section.icon
                  size={18}
                  color={activeTab === section.id ? 'var(--accent-soft)' : 'var(--text-muted)'}
                />
                <span
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: activeTab === section.id ? 600 : 400,
                    color: activeTab === section.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                  }}
                >
                  {section.title}
                </span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div
            className="card-glass"
            style={{
              padding: '28px',
              borderRadius: '20px',
            }}
          >
            {activeSection && (
              <>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '24px' }}>
                  {activeSection.title}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {activeSection.items.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px 0',
                        borderBottom: '1px solid var(--border)',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {item.description}
                        </div>
                      </div>

                      {item.type === 'toggle' && (
                        <button
                          onClick={() => toggleSetting(item.id)}
                          style={{
                            width: '50px',
                            height: '26px',
                            borderRadius: '13px',
                            background: toggles[item.id] ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
                            border: 'none',
                            cursor: 'pointer',
                            position: 'relative',
                            transition: 'background 0.3s',
                          }}
                        >
                          <span
                            style={{
                              position: 'absolute',
                              top: '2px',
                              left: toggles[item.id] ? '26px' : '2px',
                              width: '22px',
                              height: '22px',
                              borderRadius: '50%',
                              background: 'white',
                              transition: 'left 0.3s',
                            }}
                          />
                        </button>
                      )}

                      {item.type === 'button' && (
                        <button
                          onClick={() => handleButtonClick(activeSection.id, item.id)}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-secondary)',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.2s',
                          }}
                        >
                          {item.action}
                          <ChevronRight size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
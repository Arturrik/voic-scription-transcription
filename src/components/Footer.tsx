import { useTheme } from '../context/ThemeContext';
import type { Screen } from '../App';

interface FooterProps {
  onNavigate: (screen: Screen) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const { theme } = useTheme();
  const year = new Date().getFullYear();

  return (
    <footer style={{
      position: 'relative',
      zIndex: 1,
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border)',
      marginTop: 'auto',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '64px 40px 48px 40px' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '48px',
          justifyContent: 'space-between',
          marginBottom: '48px',
        }}>
          <div style={{ maxWidth: '280px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                minWidth: '42px',
                borderRadius: '12px',
                background: 'rgba(124,106,247,0.1)',
                border: '1px solid rgba(124,106,247,0.2)',
                color: 'var(--accent-soft)',
                fontSize: '0.9rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                ТС
              </div>
              <div>
                <div style={{ color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 600, marginBottom: '3px' }}>
                  VoicScript Транскрибация
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                  AI-сервис транскрибации
                </div>
              </div>
            </div>
            <p style={{
              color: 'var(--text-muted)',
              fontSize: '0.82rem',
              lineHeight: 1.65,
            }}>
              Превращайте аудио и видео записи в текст с точностью до 95%. AI-анализ, выжимки и структурирование диалогов.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '48px' }}>
            <div>
              <h4 style={{
                color: 'var(--text-muted)',
                fontSize: '0.65rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '18px',
              }}>
                Разделы
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { href: '#home', label: 'Главная' },
                  { href: '#dashboard', label: 'Мои файлы' },
                  { href: '#history', label: 'История' },
                ].map(({ href, label }) => (
                  <button
                    key={href}
                    onClick={() => onNavigate(href === '#home' ? 'home' : href === '#dashboard' ? 'dashboard' : 'history')}
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.85rem',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{
                color: 'var(--text-muted)',
                fontSize: '0.65rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '18px',
              }}>
                Контакты
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  support@VoicScript-transcription.ru
                </span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  +7 (999) 123-45-67
                </span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ height: '1px', background: 'var(--border)', marginBottom: '28px' }} />

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', lineHeight: 1.6 }}>
            © {year} VoicScript Транскрибация. Все права защищены.
            <br />
            Сервис предназначен для обработки аудио и видеоматериалов.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--accent)',
              boxShadow: '0 0 10px var(--accent), 0 0 20px rgba(124,106,247,0.4)',
            }} />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
              Система онлайн-транскрибации
            </span>
          </div>
        </div>
      </div>

      <div style={{
        height: '2px',
        background: 'linear-gradient(90deg, transparent, var(--accent), var(--gold), transparent)',
        opacity: 0.4,
      }} />
    </footer>
  );
}
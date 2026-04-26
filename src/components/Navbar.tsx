import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import type { Screen } from '../App';
import { Bell } from 'lucide-react';

interface NavbarProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  balance: number;
  unreadCount: number;
  isAuthorized: boolean;
}

const PROFILE_KEY = 'tspk-profile';

interface StoredProfile {
  firstName?: string;
  lastName?: string;
  avatar?: string | null;
}

export default function Navbar({ currentScreen, onNavigate, balance, unreadCount, isAuthorized }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [initials, setInitials] = useState('?');
  const { theme } = useTheme();

  const loadProfileData = () => {
    try {
      const saved = localStorage.getItem(PROFILE_KEY);
      if (saved) {
        const parsed: StoredProfile = JSON.parse(saved);
        setAvatar(parsed.avatar || null);
        const first = parsed.firstName || 'А';
        const last = parsed.lastName || 'И';
        setInitials(`${first[0]}${last[0]}`.toUpperCase());
      }
    } catch (e) {
      console.error('Error loading profile:', e);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      loadProfileData();
    } else {
      setAvatar(null);
      setInitials('?');
    }

    const handleStorage = () => {
      if (isAuthorized) loadProfileData();
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('profileUpdated', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('profileUpdated', handleStorage);
    };
  }, [isAuthorized]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { id: 'home' as Screen, label: 'Главная' },
    { id: 'dashboard' as Screen, label: 'Мои файлы' },
    { id: 'history' as Screen, label: 'История' },
    { id: 'settings' as Screen, label: 'Настройки' },
    { id: 'topup' as Screen, label: 'Баланс' },
    { id: 'referral' as Screen, label: 'Партнерка' },
    { id: 'support' as Screen, label: 'Поддержка' },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled ? 'var(--nav-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--nav-border)' : '1px solid transparent',
        transition: 'background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease',
      }}
    >
      <div
        style={{
          maxWidth: '1460px',
          margin: '0 auto',
          padding: '0 24px',
          height: '78px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <button
          onClick={() => onNavigate('home')}
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            <span style={{
              color: 'var(--text-primary)',
              fontWeight: 700,
              fontSize: '0.88rem',
              lineHeight: 1.2,
              letterSpacing: '0.01em',
              textAlign: 'left',
            }}>
              VS
            </span>
            <span style={{
              color: 'var(--text-muted)',
              fontWeight: 400,
              fontSize: '0.68rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              textAlign: 'left',
            }}>
              Транскрибация
            </span>
          </div>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }} className="nav-desktop">
          {isAuthorized && links.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              style={{
                color: currentScreen === id ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontSize: '0.875rem',
                textDecoration: 'none',
                letterSpacing: '0.01em',
                fontWeight: currentScreen === id ? 600 : 400,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 0.2s',
                position: 'relative',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={(e) => {
                if (currentScreen !== id) {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              {label}
              {currentScreen === id && (
                <span style={{
                  position: 'absolute',
                  bottom: '-4px',
                  left: '0',
                  right: '0',
                  height: '2px',
                  background: 'var(--accent)',
                  borderRadius: '2px',
                }} />
              )}
            </button>
          ))}

          {isAuthorized && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '100px',
              background: 'var(--accent-muted)',
              border: '1px solid var(--border-accent)',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--accent-soft)',
            }}>
              <span>{balance.toLocaleString()} ₽</span>
            </div>
          )}

          {isAuthorized && (
            <button
              onClick={() => onNavigate('notifications')}
              style={{
                border: '1px solid var(--border)',
                borderRadius: '40px',
                width: '25px',
                height: '36px',
                background: 'rgba(255,255,255,0.04)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                position: 'relative',
              }}
              title="Уведомления"
            >
              <Bell size={20} color="var(--accent)" strokeWidth={3}/>
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: '#ef4444',
                    color: 'white',
                    fontSize: '0.65rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {Math.min(unreadCount, 9)}
                </span>
              )}
            </button>
          )}

          <button
            onClick={() => onNavigate(isAuthorized ? 'profile' : 'auth')}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: avatar
                ? `url(${avatar}) center/cover no-repeat`
                : 'linear-gradient(135deg, var(--accent) 0%, var(--accent-soft) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: isAuthorized ? '0.85rem' : '1rem',
              color: 'white',
              border: currentScreen === 'profile' ? '2px solid var(--gold)' : 'none',
              cursor: 'pointer',
              flexShrink: 0,
              boxShadow: currentScreen === 'profile' ? '0 0 0 4px rgba(124,106,247,0.2)' : 'none',
              transition: 'all 0.2s',
              overflow: 'hidden',
              position: 'relative',
            }}
            title={isAuthorized ? 'Личный кабинет' : 'Войти'}
          >
            {!avatar && (isAuthorized ? initials : '?')}
          </button>

          <ThemeToggle />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} className="nav-mobile-btn">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: 'block',
                  width: '22px',
                  height: '1.5px',
                  background: 'var(--text-secondary)',
                  borderRadius: '2px',
                  transform: menuOpen
                    ? i === 0 ? 'translateY(6.5px) rotate(45deg)' : i === 2 ? 'translateY(-6.5px) rotate(-45deg)' : 'scaleX(0)'
                    : 'none',
                  transition: 'transform 0.3s ease',
                }}
              />
            ))}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          style={{
            background: 'var(--mobile-menu-bg)',
            backdropFilter: 'blur(24px)',
            borderBottom: '1px solid var(--nav-border)',
            padding: '16px 32px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            animation: 'fadeInUp 0.2s ease',
          }}
        >
          {isAuthorized && links.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => {
                onNavigate(id);
                setMenuOpen(false);
              }}
              style={{
                color: currentScreen === id ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontSize: '1rem',
                textDecoration: 'none',
                padding: '12px 0',
                borderBottom: '1px solid var(--border)',
                background: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                borderTop: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                fontWeight: currentScreen === id ? 600 : 400,
              }}
            >
              {label}
            </button>
          ))}

          <button
            onClick={() => {
              onNavigate(isAuthorized ? 'profile' : 'auth');
              setMenuOpen(false);
            }}
            style={{
              color: currentScreen === 'profile' ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontSize: '1rem',
              textDecoration: 'none',
              padding: '12px 0',
              borderBottom: '1px solid var(--border)',
              background: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              borderTop: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              fontWeight: currentScreen === 'profile' ? 600 : 400,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: avatar
                ? `url(${avatar}) center/cover no-repeat`
                : 'linear-gradient(135deg, var(--accent) 0%, var(--accent-soft) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isAuthorized ? '0.75rem' : '0.9rem',
              fontWeight: 600,
              color: 'white',
              overflow: 'hidden',
            }}>
              {!avatar && (isAuthorized ? initials : '?')}
            </div>
            {isAuthorized ? 'Личный кабинет' : 'Войти'}
          </button>

          {isAuthorized && (
            <div>
              <button
                onClick={() => {
                  onNavigate('notifications');
                  setMenuOpen(false);
                }}
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '1rem',
                  textDecoration: 'none',
                  padding: '12px 0',
                  borderBottom: '1px solid var(--border)',
                  background: 'none',
                  borderLeft: 'none',
                  borderRight: 'none',
                  borderTop: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                Уведомления ({unreadCount})
              </button>
              <button
                onClick={() => {
                  onNavigate('referral');
                  setMenuOpen(false);
                }}
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '1rem',
                  textDecoration: 'none',
                  padding: '12px 0',
                  borderBottom: '1px solid var(--border)',
                  background: 'none',
                  borderLeft: 'none',
                  borderRight: 'none',
                  borderTop: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                Партнерская программа
              </button>
              <button
                onClick={() => {
                  onNavigate('support');
                  setMenuOpen(false);
                }}
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '1rem',
                  textDecoration: 'none',
                  padding: '12px 0',
                  borderBottom: '1px solid var(--border)',
                  background: 'none',
                  borderLeft: 'none',
                  borderRight: 'none',
                  borderTop: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                Поддержка
              </button>
            
              <span>{balance.toLocaleString()} ₽</span>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
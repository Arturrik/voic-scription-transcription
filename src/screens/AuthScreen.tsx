import { useState } from 'react';

interface AuthScreenProps {
  onSuccess: () => void;
}

export default function AuthScreen({ onSuccess }: AuthScreenProps) {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'phone' | 'code'>('phone');

  return (
    <section style={{ 
      padding: '48px 0', 
      width: '100%',
      minHeight: 'calc(100vh - 78px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div className="section-container" style={{ maxWidth: '520px', width: '100%' }}>
        <div className="card-glass" style={{ borderRadius: '20px', padding: '40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            
            <h2 style={{ fontSize: '1.8rem', marginBottom: '8px', color: 'var(--text-primary)', fontWeight: 700 }}>
              Добро пожаловать на VoicScript
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              Войдите, чтобы продолжить работу с сервисом
            </p>
          </div>

          {step === 'phone' ? (
            <>
              <label style={{ 
                display: 'block', 
                color: 'var(--text-secondary)', 
                fontSize: '0.85rem', 
                fontWeight: 500,
                marginBottom: '8px' 
              }}>
                Номер телефона
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 (999) 123-45-67"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  marginBottom: '20px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
              />
              <button
                onClick={() => setStep('code')}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'var(--accent)',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 20px rgba(124,106,247,0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 24px rgba(124,106,247,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(124,106,247,0.3)';
                }}
              >
                Получить код
              </button>
            </>
          ) : (
            <>
              <label style={{ 
                display: 'block', 
                color: 'var(--text-secondary)', 
                fontSize: '0.85rem', 
                fontWeight: 500,
                marginBottom: '8px' 
              }}>
                Код из SMS
              </label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Введите 4 цифры"
                maxLength={4}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  marginBottom: '20px',
                  textAlign: 'center',
                  letterSpacing: '0.5em',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
              />
              <button
                onClick={onSuccess}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'var(--accent)',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 20px rgba(124,106,247,0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 24px rgba(124,106,247,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(124,106,247,0.3)';
                }}
              >
                Войти
              </button>
              <button
                onClick={() => setStep('phone')}
                style={{
                  width: '100%',
                  marginTop: '12px',
                  padding: '10px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                ← Назад к вводу телефона
              </button>
            </>
          )}

          <p style={{ 
            color: 'var(--text-muted)', 
            fontSize: '0.8rem', 
            textAlign: 'center', 
            marginTop: '24px' 
          }}>
          </p>
        </div>
      </div>
    </section>
  );
}
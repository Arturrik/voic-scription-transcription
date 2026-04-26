import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { User, Mail, Phone, Check, X, Edit2, Save, Upload } from 'lucide-react';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string | null;
}

interface ProfileScreenProps {
  onBack: () => void;
}

const STORAGE_KEY = 'tspk-profile';

const DEFAULT_PROFILE: UserProfile = {
  firstName: 'Алексей',
  lastName: 'Иванов',
  email: 'alexey.ivanov@company.ru',
  phone: '+7 (999) 123-45-67',
  avatar: null,
};

const loadProfileFromStorage = (): UserProfile => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.firstName && parsed.lastName && parsed.email && parsed.phone) {
        return { ...DEFAULT_PROFILE, ...parsed };
      }
    }
  } catch (e) {
    console.error('Error loading profile:', e);
  }
  return { ...DEFAULT_PROFILE };
};

const saveProfileToStorage = (profile: UserProfile) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving profile:', e);
  }
};

const notifyProfileUpdate = () => {
  window.dispatchEvent(new CustomEvent('profileUpdated'));
};

export default function ProfileScreen({ onBack }: ProfileScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<UserProfile>(loadProfileFromStorage);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

  useEffect(() => {
    setEditedProfile(profile);
  }, [profile]);

  const handleSave = () => {
    setProfile(editedProfile);
    saveProfileToStorage(editedProfile);
    setIsEditing(false);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
    notifyProfileUpdate();
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleChange = (field: keyof UserProfile, value: string) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение (JPEG, PNG, GIF, WebP)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Размер файла не должен превышать 2MB');
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setEditedProfile(prev => ({ ...prev, avatar: result }));
      setIsUploading(false);
    };
    reader.onerror = () => {
      alert('Ошибка при загрузке изображения');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setEditedProfile(prev => ({ ...prev, avatar: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const fields = [
    { id: 'firstName' as const, label: 'Имя', icon: User, value: editedProfile.firstName, type: 'text' },
    { id: 'lastName' as const, label: 'Фамилия', icon: User, value: editedProfile.lastName, type: 'text' },
    { id: 'email' as const, label: 'Email', icon: Mail, value: editedProfile.email, type: 'email' },
    { id: 'phone' as const, label: 'Телефон', icon: Phone, value: editedProfile.phone, type: 'tel' },
  ];

  const displayProfile = isEditing ? editedProfile : profile;
  const initials = getInitials(displayProfile.firstName, displayProfile.lastName);

  return (
    <section style={{ padding: '48px 0', width: '100%', minHeight: 'calc(100vh - 68px)' }}>
      <div className="section-container">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {showSaveSuccess && (
          <div
            style={{
              position: 'fixed',
              top: '90px',
              right: '32px',
              background: 'rgba(16, 185, 129, 0.95)',
              backdropFilter: 'blur(10px)',
              padding: '16px 24px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.95rem',
              boxShadow: '0 10px 40px rgba(16, 185, 129, 0.3)',
              zIndex: 1000,
              animation: 'fadeInUp 0.3s ease',
            }}
          >
            <Check size={20} />
            Изменения сохранены
          </div>
        )}

        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Личный кабинет
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              Управление персональной информацией
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    background: 'transparent',
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <X size={16} />
                  Отмена
                </button>
                <button
                  onClick={handleSave}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    background: 'var(--accent)',
                    border: 'none',
                    color: 'white',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 20px rgba(124,106,247,0.3)',
                  }}
                >
                  <Save size={16} />
                  Сохранить
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  background: 'var(--accent)',
                  border: 'none',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 20px rgba(124,106,247,0.3)',
                }}
              >
                <Edit2 size={16} />
                Редактировать
              </button>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px' }}>
          <div className="card-glass" style={{ padding: '32px', borderRadius: '20px', height: 'fit-content' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div
                onClick={handleAvatarClick}
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: displayProfile.avatar
                    ? `url(${displayProfile.avatar}) center/cover no-repeat`
                    : 'linear-gradient(135deg, var(--accent) 0%, var(--accent-soft) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: displayProfile.avatar ? '0' : '2.5rem',
                  fontWeight: 700,
                  color: 'white',
                  position: 'relative',
                  boxShadow: '0 8px 32px rgba(124,106,247,0.3)',
                  cursor: isEditing ? 'pointer' : 'default',
                  overflow: 'hidden',
                }}
              >
                {!displayProfile.avatar && initials}

                {isEditing && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0,0,0,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      gap: '8px',
                      opacity: isUploading ? 1 : 0,
                      transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={(e) => !isUploading && (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={(e) => !isUploading && (e.currentTarget.style.opacity = '0')}
                  >
                    {isUploading ? (
                      <div style={{
                        width: '24px',
                        height: '24px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTopColor: 'white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                    ) : (
                      <>
                        <Upload size={24} color="white" />
                        <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: 500 }}>
                          {displayProfile.avatar ? 'Изменить' : 'Загрузить'}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {isEditing && displayProfile.avatar && (
                <button
                  onClick={handleRemoveAvatar}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: 'transparent',
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    marginBottom: '12px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ef4444';
                    e.currentTarget.style.borderColor = '#ef4444';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                >
                  Удалить фото
                </button>
              )}

              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                {displayProfile.firstName} {displayProfile.lastName}
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Всего транскрибаций
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>47</div>
              </div>
              <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Часов обработано
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>128</div>
              </div>
              <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Сэкономлено времени
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>64 ч</div>
              </div>
            </div>
          </div>

          <div className="card-glass" style={{ padding: '32px', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '24px' }}>
              Персональная информация
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              {fields.map((field) => (
                <div key={field.id} style={{ gridColumn: field.id === 'email' || field.id === 'phone' ? 'span 2' : 'span 1' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    <field.icon size={14} />
                    {field.label}
                  </label>
                  {isEditing ? (
                    <input
                      type={field.type}
                      value={field.value}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        borderRadius: '12px',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem',
                        outline: 'none',
                        transition: 'all 0.2s',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--accent)';
                        e.target.style.boxShadow = '0 0 0 3px rgba(124,106,247,0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--border)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        padding: '14px 16px',
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem',
                      }}
                    >
                      {field.value}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '24px' }}>
                Информация об аккаунте
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>
                    ID аккаунта
                  </label>
                  <div style={{ padding: '14px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.9rem', fontFamily: 'monospace' }}>
                    TSPK-7842-2934
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>
                    Дата регистрации
                  </label>
                  <div style={{ padding: '14px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                    15 января 2026
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
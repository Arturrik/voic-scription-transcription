import { useState } from 'react';
import { FileAudio, FileVideo, Check, Loader2, Clock, Plus, AlertTriangle, RotateCcw } from 'lucide-react';
import type { TranscriptionFile } from '../App';
import CostModal from '../components/CostModal';

interface DashboardScreenProps {
  files: TranscriptionFile[];
  onFileSelect: (file: TranscriptionFile) => void;
  onNavigate: (screen: string) => void;
  onRetry: (fileId: string) => void;
  totalStats: {
    totalTranscriptions: number;
    totalHours: number;
    timeSaved: number;
  };
}

export default function DashboardScreen({ files, onFileSelect, onNavigate, onRetry, totalStats }: DashboardScreenProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const balance = 2450;

  const stats = [
    { label: 'Всего транскрибаций', value: totalStats.totalTranscriptions, icon: FileAudio, color: '#7c6af7' },
    { label: 'Часов обработано', value: totalStats.totalHours, suffix: 'ч', icon: Clock, color: '#c9a96e' },
    { label: 'Экономия времени', value: totalStats.timeSaved, suffix: 'ч', icon: Check, color: '#6a9fd8' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Loader2 size={20} className="animate-spin" />;
      case 'queued':
        return <Clock size={20} />;
      case 'analyzing':
        return <Loader2 size={20} className="animate-spin" />;
      case 'done':
        return <Check size={20} />;
      case 'error':
        return <AlertTriangle size={20} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return '#f59e0b';
      case 'queued':
        return '#7c6af7';
      case 'analyzing':
        return '#3b82f6';
      case 'done':
        return '#10b981';
      case 'error':
        return '#ef4444';
      default:
        return 'var(--text-muted)';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'processing':
        return 'Обработка...';
      case 'queued':
        return 'В очереди';
      case 'analyzing':
        return 'Анализируется';
      case 'done':
        return 'Готово';
      case 'error':
        return 'Ошибка';
      default:
        return status;
    }
  };

  return (
    <section style={{ padding: '48px 0', width: '100%' }}>
      <div className="section-container">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Рабочий кабинет
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Управляйте вашими транскрибациями и отслеживайте прогресс
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '16px',
          marginBottom: '32px',
        }}>
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="card-glass"
              style={{
                padding: '24px',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: `${stat.color}15`,
                  border: `1px solid ${stat.color}25`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <stat.icon size={22} color={stat.color} />
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {stat.value}{stat.suffix || ''}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Upload Zone */}
        <div
          className="card-glass"
          style={{
            padding: '32px',
            borderRadius: '20px',
            marginBottom: '32px',
            cursor: 'pointer',
            textAlign: 'center',
          }}
          onClick={() => setShowUploadModal(true)}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              margin: '0 auto 16px',
              borderRadius: '16px',
              background: 'var(--accent-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Plus size={24} color="var(--accent-soft)" />
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Загрузить новый файл
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Поддерживаются MP3, WAV, MP4, MOV до 2GB
          </div>
        </div>

        {/* Queue Section */}
        <div
          className="card-glass"
          style={{
            padding: '28px',
            borderRadius: '20px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Очередь обработки
            </h3>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {files.length} файла
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {files.map((file) => (
              <div
                key={file.id}
                onClick={() => file.status === 'done' && onFileSelect(file)}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  cursor: file.status === 'done' ? 'pointer' : 'default',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  if (file.status === 'done') {
                    e.currentTarget.style.borderColor = 'var(--border-accent)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: file.type === 'audio' ? 'rgba(124,106,247,0.1)' : 'rgba(201,169,110,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {file.type === 'audio' ? (
                    <FileAudio size={20} color="#7c6af7" />
                  ) : (
                    <FileVideo size={20} color="#c9a96e" />
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px', fontSize: '0.95rem' }}>
                    {file.name}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {file.type === 'audio' ? 'Аудио' : 'Видео'} • {file.duration} • {file.size}
                  </div>
                  {(file.status === 'processing' || file.status === 'analyzing') && file.progress !== undefined && (
                    <div style={{ marginTop: '8px' }}>
                      <div
                        style={{
                          width: '100%',
                          height: '4px',
                          background: 'var(--bg-secondary)',
                          borderRadius: '2px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${file.progress}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, var(--accent), var(--accent-soft))',
                            borderRadius: '2px',
                            transition: 'width 0.3s',
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '100px',
                    background: `${getStatusColor(file.status)}20`,
                    color: getStatusColor(file.status),
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    flexShrink: 0,
                  }}
                >
                  {getStatusIcon(file.status)}
                  {getStatusText(file.status)}
                </div>
                {file.status === 'error' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRetry(file.id);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginLeft: '8px',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(239,68,68,0.4)',
                      background: 'rgba(239,68,68,0.14)',
                      color: '#ef4444',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                    }}
                  >
                    <RotateCcw size={12} /> Повторить
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <CostModal
          fileName="Новый_файл.mp3"
          duration="30 минут"
          cost={360}
          balance={balance}
          onConfirm={() => {
            setShowUploadModal(false);
            onNavigate('dashboard');
          }}
          onCancel={() => setShowUploadModal(false)}
        />
      )}
    </section>
  );
}

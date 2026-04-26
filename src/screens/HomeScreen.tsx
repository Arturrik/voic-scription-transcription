import { useState, useRef, ChangeEvent } from 'react';
import { Upload, Link, FileAudio, Zap, Brain, Clock } from 'lucide-react';
import type { TranscriptionFile } from '../App';
import CostModal from '../components/CostModal';

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
  onUpload: (file: TranscriptionFile) => void;
  balance: number;
  isAuthorized: boolean;
}

export default function HomeScreen({ onNavigate, onUpload, balance, isAuthorized }: HomeScreenProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [linkValue, setLinkValue] = useState('');
  const [isFileBtnHovered, setIsFileBtnHovered] = useState(false);
  const [isFileBtnPressed, setIsFileBtnPressed] = useState(false);
  const [fileInfo, setFileInfo] = useState<{
    name: string;
    duration: string;
    durationSeconds: number;
    cost: number;
    size: string;
  } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.preload = 'metadata';
      audio.onloadedmetadata = () => {
        resolve(audio.duration);
      };
      audio.onerror = () => {
        resolve(0);
      };
      audio.src = URL.createObjectURL(file);
    });
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    if (mins === 0) return `${secs} сек`;
    return `${mins} мин ${secs} сек`;
  };

  const calculateCost = (durationSeconds: number): number => {
    const minutes = Math.ceil(durationSeconds / 60);
    return minutes * 12;
  };

  const handleFileSelect = async (file: File) => {
    if (!file.type.includes('audio') && !file.type.includes('video')) {
      alert('Пожалуйста, выберите аудио или видео файл (MP3, WAV, MP4, etc.)');
      return;
    }

    setSelectedFile(file);
    
    try {
      const durationSeconds = await getAudioDuration(file);
      const cost = calculateCost(durationSeconds);
      
      setFileInfo({
        name: file.name,
        duration: formatDuration(durationSeconds),
        durationSeconds,
        cost,
        size: formatFileSize(file.size),
      });
      
      setShowModal(true);
    } catch (error) {
      console.error('Error reading file:', error);
      alert('Ошибка при чтении файла');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleConfirmUpload = () => {
    if (selectedFile && fileInfo) {
      if (!isAuthorized) {
        onNavigate('auth');
        return;
      }
      const newFile: TranscriptionFile = {
        id: Date.now().toString(),
        name: fileInfo.name,
        type: selectedFile.type.includes('audio') ? 'audio' : 'video',
        duration: fileInfo.duration,
        size: fileInfo.size,
        status: 'processing',
        progress: 0,
        source: 'device',
        date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
        cost: fileInfo.cost,
      };
      
      onUpload(newFile);
      setShowModal(false);
      setSelectedFile(null);
      setFileInfo(null);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleLinkUpload = () => {
    if (!linkValue.trim()) return;
    if (!isAuthorized) {
      onNavigate('auth');
      return;
    }
    const newFile: TranscriptionFile = {
      id: Date.now().toString(),
      name: `Ссылка_${new Date().toLocaleTimeString('ru-RU')}.mp4`,
      type: 'video',
      duration: '22 мин',
      size: 'Источник: ссылка',
      status: 'queued',
      progress: 0,
      source: 'link',
      date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
      cost: 264,
    };
    onUpload(newFile);
    setLinkValue('');
    onNavigate('dashboard');
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedFile(null);
    setFileInfo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const features = [
    {
      icon: Brain,
      title: 'Точная транскрибация',
      desc: 'Распознавание речи с точностью до 95% даже при плохом качестве записи и нескольких спикерах.',
      color: '#7c6af7',
    },
    {
      icon: Zap,
      title: 'Молниеносная скорость',
      desc: '1 час записи обрабатывается за 5 минут. Получайте результат мгновенно без ожидания.',
      color: '#c9a96e',
    },
    {
      icon: Clock,
      title: 'AI-выжимки',
      desc: 'Автоматические summary, постановка задач и управленческие отчеты на основе диалога.',
      color: '#6a9fd8',
    },
  ];

  return (
    <div style={{ width: '100%' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,video/*,.mp3,.wav,.mp4,.mov,.m4a"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />

      <section
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: 'transparent',
        }}
      >
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            maxWidth: '860px',
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              borderRadius: '100px',
              padding: '7px 18px',
              marginBottom: '36px',
              background: 'rgba(124,106,247,0.08)',
              border: '1px solid rgba(124,106,247,0.18)',
              animation: 'fadeIn 0.8s ease 0.1s both',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--accent)',
                boxShadow: '0 0 8px var(--accent)',
                flexShrink: 0,
                animation: 'pulse-glow 2s ease-in-out infinite',
              }}
            />
            <span
              style={{
                color: 'var(--accent-soft)',
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              AI-Транскрибация
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.8rem, 8vw, 5.5rem)',
              fontWeight: 800,
              lineHeight: 1.08,
              marginBottom: '28px',
              letterSpacing: '-0.02em',
              animation: 'fadeInUp 0.8s ease 0.3s both',
            }}
          >
            <span
              style={{
                color: 'var(--accent)',
              }}
            >
              VoicScript Транскрибация
            </span>
          </h1>

          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: 'clamp(1rem, 2.2vw, 1.18rem)',
              lineHeight: 1.7,
              maxWidth: '560px',
              marginBottom: '52px',
              animation: 'fadeInUp 0.8s ease 0.55s both',
            }}
          >
            Превратите записи встреч, интервью и звонков в текст за считанные минуты.{' '}
            <span style={{ color: 'var(--text-muted)' }}>
              AI-анализ с разбивкой по спикерам и интеллектуальными выжимками.
            </span>
          </p>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              width: '100%',
              maxWidth: '600px',
              background: 'var(--bg-card)',
              backdropFilter: 'blur(20px)',
              border: `2px dashed ${isDragOver ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: '24px',
              padding: '48px 32px',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              marginBottom: '64px',
              animation: 'fadeInUp 0.8s ease 0.75s both',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {isDragOver && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(124,106,247,0.1)',
                  borderRadius: '24px',
                }}
              />
            )}
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  margin: '0 auto 20px',
                  borderRadius: '16px',
                  background: 'var(--accent-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Upload size={28} color="var(--accent-soft)" />
              </div>
              <div
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  marginBottom: '8px',
                  color: 'var(--text-primary)',
                }}
              >
                {isDragOver ? 'Отпустите файл здесь' : 'Перетащите файл сюда'}
              </div>
              <div
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem',
                  marginBottom: '24px',
                }}
              >
                или нажмите для выбора файла
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUploadClick();
                  }}
                  onMouseEnter={() => setIsFileBtnHovered(true)}
                  onMouseLeave={() => {
                    setIsFileBtnHovered(false);
                    setIsFileBtnPressed(false);
                  }}
                  onMouseDown={() => setIsFileBtnPressed(true)}
                  onMouseUp={() => setIsFileBtnPressed(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    background: isFileBtnHovered ? 'var(--accent-muted)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${isFileBtnHovered ? 'var(--border-accent)' : 'var(--border)'}`,
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    transform: isFileBtnPressed ? 'translateY(1px) scale(0.98)' : isFileBtnHovered ? 'translateY(-1px)' : 'translateY(0)',
                    boxShadow: isFileBtnHovered ? '0 6px 18px rgba(124,106,247,0.18)' : 'none',
                  }}
                >
                  <FileAudio size={16} />
                  Выбрать файл
                </button>
              </div>
              <div style={{ 
                marginTop: '16px', 
                color: 'var(--text-muted)', 
                fontSize: '0.75rem' 
              }}>
                Поддерживаемые форматы: MP3, WAV, MP4, M4A
              </div>
              <div style={{ marginTop: '18px', display: 'flex', gap: '8px' }}>
                <input
                  value={linkValue}
                  onChange={(e) => setLinkValue(e.target.value)}
                  placeholder="Или вставьте ссылку на аудио/видео"
                  style={{
                    flex: 1,
                    minWidth: 0,
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLinkUpload();
                  }}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-accent)',
                    background: 'var(--accent-muted)',
                    color: 'var(--accent-soft)',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                  }}
                >
                  <Link size={14} style={{ display: 'inline-block', verticalAlign: 'middle' }} /> Добавить
                </button>
              </div>
            </div>
          </div>

          <div
            className="features-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px',
              width: '100%',
              maxWidth: '100%',
              animation: 'fadeInUp 0.8s ease 0.95s both',
            }}
          >
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="card-glass"
                style={{
                  padding: '28px 24px',
                  borderRadius: '20px',
                  textAlign: 'left',
                  animationDelay: `${1 + i * 0.1}s`,
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: `${feature.color}15`,
                    border: `1px solid ${feature.color}25`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <feature.icon size={22} color={feature.color} />
                </div>
                <h3
                  style={{
                    color: 'var(--text-primary)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    marginBottom: '10px',
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.875rem',
                    lineHeight: 1.65,
                  }}
                >
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {showModal && fileInfo && (
        <CostModal
          fileName={fileInfo.name}
          duration={fileInfo.duration}
          durationSeconds={fileInfo.durationSeconds}
          cost={fileInfo.cost}
          balance={balance}
          onConfirm={handleConfirmUpload}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
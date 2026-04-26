import { useState } from 'react';
import { FileAudio, FileVideo, Check, Search, Download, Trash2 } from 'lucide-react';
import type { TranscriptionFile } from '../App';

interface HistoryScreenProps {
  files: TranscriptionFile[];
  onFileSelect: (file: TranscriptionFile) => void;
}

export default function HistoryScreen({ files, onFileSelect }: HistoryScreenProps) {
  const [filter, setFilter] = useState<'all' | 'audio' | 'video'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'done' | 'processing' | 'error'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filteredFiles = files.filter(file => {
    if (filter !== 'all' && file.type !== filter) return false;
    if (statusFilter !== 'all' && file.status !== statusFilter) return false;
    if (searchQuery && !file.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (dateFilter && !file.date.toLowerCase().includes(dateFilter.toLowerCase())) return false;
    return true;
  });

  const filters = [
    { id: 'all', label: 'Все' },
    { id: 'audio', label: 'Аудио' },
    { id: 'video', label: 'Видео' },
  ];

  return (
    <section style={{ padding: '48px 0', width: '100%' }}>
      <div className="section-container">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            История транскрибаций
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Все ваши завершенные транскрибации
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '24px', alignItems: 'center' }}>
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              style={{
                padding: '8px 16px',
                borderRadius: '100px',
                fontSize: '0.85rem',
                fontWeight: 500,
                background: filter === f.id ? 'var(--accent)' : 'var(--bg-card)',
                color: filter === f.id ? 'white' : 'var(--text-secondary)',
                border: `1px solid ${filter === f.id ? 'var(--accent)' : 'var(--border)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {f.label}
            </button>
          ))}
          {['all', 'done', 'processing', 'error'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status as any)}
              style={{
                padding: '8px 16px',
                borderRadius: '100px',
                fontSize: '0.85rem',
                fontWeight: 500,
                background: statusFilter === status ? 'var(--accent)' : 'var(--bg-card)',
                color: statusFilter === status ? 'white' : 'var(--text-secondary)',
                border: `1px solid ${statusFilter === status ? 'var(--accent)' : 'var(--border)'}`,
                cursor: 'pointer',
              }}
            >
              {status === 'all' ? 'Все статусы' : status === 'done' ? 'Готово' : status === 'processing' ? 'В работе' : 'Ошибка'}
            </button>
          ))}

          <div style={{ flex: 1, minWidth: '200px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '12px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
              }}
            >
              <Search size={16} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Поиск файлов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  width: '100%',
                }}
              />
            </div>
          </div>
          <div style={{ minWidth: '200px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '12px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
              }}
            >
              <input
                type="text"
                placeholder="Фильтр по дате..."
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  width: '100%',
                }}
              />
            </div>
          </div>
        </div>

        {/* History List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredFiles.map((file, index) => (
            <div
              key={file.id}
              onClick={() => onFileSelect(file)}
              className="card-glass"
              style={{
                padding: '20px 24px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                cursor: 'pointer',
                animationDelay: `${index * 0.05}s`,
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: file.type === 'audio' ? 'rgba(124,106,247,0.1)' : 'rgba(201,169,110,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {file.type === 'audio' ? (
                  <FileAudio size={22} color="#7c6af7" />
                ) : (
                  <FileVideo size={22} color="#c9a96e" />
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', fontSize: '1rem' }}>
                  {file.name}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  {file.date} • {file.type === 'audio' ? 'Аудио' : 'Видео'} • {file.duration} • {file.cost} ₽ • Статус: {file.status}
                </div>
                {file.comment && (
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '6px' }}>
                    Комментарий: {file.comment}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '100px',
                    background: 'rgba(16,185,129,0.1)',
                    color: '#10b981',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                  }}
                >
                  <Check size={14} />
                  Готово
                </div>

                <button
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    transition: 'all 0.2s',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle download
                  }}
                >
                  <Download size={16} />
                </button>

                <button
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    transition: 'all 0.2s',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle delete
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredFiles.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <Search size={48} color="var(--text-muted)" strokeWidth={1.2} />
            <p style={{ color: 'var(--text-secondary)', marginTop: '16px', fontSize: '1.1rem' }}>
              Нет файлов по выбранным фильтрам
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

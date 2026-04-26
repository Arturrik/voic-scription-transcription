import { Download, Edit2, Copy, RefreshCw, ArrowLeft, CheckCircle, Lightbulb, AlertTriangle, ListTodo } from 'lucide-react';
import type { TranscriptionFile } from '../App';

interface ResultScreenProps {
  file: TranscriptionFile;
  onUpdate: (updates: Partial<TranscriptionFile>) => void;
  onBack: () => void;
}

export default function ResultScreen({ file, onUpdate, onBack }: ResultScreenProps) {
  const transcriptText =
    file.transcriptText?.trim() ||
    'Транскрибация еще не завершена. Дождитесь статуса "Готово".';
  const summaryType = file.summaryType || 'managerial';

  const summary = [
    {
      icon: CheckCircle,
      title: 'Ключевые моменты',
      content: 'Клиент выразил заинтересованность в сотрудничестве. Основной фокус на интеграции с CRM и соблюдении сроков до конца квартала.',
      color: '#7c6af7',
    },
    {
      icon: ListTodo,
      title: 'Договоренности',
      content: `• Предоставить техническое задание до 15 марта
• Провести демонстрацию прототипа 20 марта
• Финальная презентация решения — 25 марта`,
      color: '#10b981',
    },
    {
      icon: Lightbulb,
      title: 'Задачи',
      content: `• Подготовить коммерческое предложение (ответственный: менеджер, срок: 14.03)
• Согласовать технические требования с IT-отделом
• Забронировать время для демо-презентации`,
      color: '#c9a96e',
    },
    {
      icon: AlertTriangle,
      title: 'Риски',
      content: 'Клиент отметил жесткие сроки. Задержка на любом этапе может привести к срыву сделки.',
      color: '#ef4444',
    },
  ];
  const selectedSummary = summaryType === 'brief' ? summary[0] : summaryType === 'tasks' ? summary[2] : summary[1];

  return (
    <section style={{ padding: '48px 0', width: '100%' }}>
      <div className="section-container">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '12px',
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              cursor: 'pointer',
              marginBottom: '16px',
              transition: 'all 0.2s',
            }}
          >
            <ArrowLeft size={16} />
            Назад к файлам
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                {file.name}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Обработано {file.date} • Стоимость: {file.cost} ₽
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  const next = prompt('Введите новое название', file.name);
                  if (next?.trim()) onUpdate({ name: next.trim() });
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <Edit2 size={16} />
                Переименовать
              </button>
              <button
                onClick={() => {
                  const blob = new Blob([transcriptText], { type: 'text/plain;charset=utf-8' });
                  const url = URL.createObjectURL(blob);
                  const anchor = document.createElement('a');
                  anchor.href = url;
                  anchor.download = `${file.name.replace(/\.[^.]+$/, '')}.txt`;
                  anchor.click();
                  URL.revokeObjectURL(url);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
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
                <Download size={16} />
                Скачать
              </button>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Transcript Panel */}
          <div
            className="card-glass"
            style={{
              padding: '24px',
              borderRadius: '20px',
              maxHeight: '70vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Полная транскрибация
              </h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
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
                  title="Копировать"
                >
                  <Copy size={14} />
                </button>
                <button
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
                  title="Редактировать"
                >
                  <Edit2 size={14} />
                </button>
              </div>
            </div>

            <div
              style={{
                color: 'var(--text-secondary)',
                lineHeight: 1.65,
                fontSize: '0.95rem',
                whiteSpace: 'pre-wrap',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              {transcriptText}
            </div>
            <div style={{ marginTop: '14px', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Комментарий:</span>
              <input
                value={file.comment || ''}
                onChange={(e) => onUpdate({ comment: e.target.value })}
                placeholder="Добавьте комментарий к транскрибации"
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Summary Panel */}
          <div
            className="card-glass"
            style={{
              padding: '24px',
              borderRadius: '20px',
              maxHeight: '70vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                AI-выжимка
              </h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() =>
                    onUpdate({
                      summaryType: summaryType === 'brief' ? 'managerial' : summaryType === 'managerial' ? 'tasks' : 'brief',
                    })
                  }
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
                  title="Сменить тип"
                >
                  <RefreshCw size={14} />
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              {[
                { id: 'brief', label: 'Краткая' },
                { id: 'managerial', label: 'Управленческая' },
                { id: 'tasks', label: 'Задачи' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => onUpdate({ summaryType: item.id as TranscriptionFile['summaryType'] })}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '10px',
                    border: '1px solid var(--border)',
                    background: summaryType === item.id ? 'var(--accent-muted)' : 'rgba(255,255,255,0.03)',
                    color: summaryType === item.id ? 'var(--accent-soft)' : 'var(--text-secondary)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <textarea
              placeholder="Инструкция к выжимке (опционально)"
              rows={3}
              style={{
                width: '100%',
                marginBottom: '16px',
                resize: 'vertical',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                background: 'rgba(255,255,255,0.03)',
                color: 'var(--text-primary)',
                padding: '10px',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[selectedSummary].map((section, index) => (
                <div key={`${section.title}-${index}`}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <section.icon size={16} color={section.color} />
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {section.title}
                    </h4>
                  </div>
                  <p
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.9rem',
                      lineHeight: 1.6,
                      paddingLeft: '24px',
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '8px' }}>Метаданные</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                Источник: {file.source === 'link' ? 'Ссылка' : 'Файл с устройства'}<br />
                Длительность: {file.duration}<br />
                Формат выгрузки: TXT (демо), PDF/DOCX в работе
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

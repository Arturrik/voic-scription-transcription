import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Включить светлую тему' : 'Включить тёмную тему'}
      title={isDark ? 'Светлая тема' : 'Тёмная тема'}
      style={{
        position: 'relative',
        display: 'inline-block',
        width: '3.5em',
        height: '2em',
        fontSize: '17px',
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        flexShrink: 0,
        outline: 'none',
      }}
    >
      {/* Скрытый чекбокс для управления состоянием */}
      <input
        type="checkbox"
        checked={isDark}
        onChange={toggle}
        style={{
          opacity: 0,
          width: 0,
          height: 0,
          position: 'absolute',
        }}
      />

      {/* Слайдер */}
      <span
        style={{
          position: 'absolute',
          cursor: 'pointer',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: isDark ? '#28096b' : '#522ba7',
          transition: '0.5s',
          borderRadius: '30px',
        }}
      />

      {/* Круглый ползунок */}
      <span
        style={{
          position: 'absolute',
          height: '1.4em',
          width: '1.4em',
          borderRadius: '50%',
          left: isDark ? '10%' : 'calc(90% - 1.4em)',
          bottom: '15%',
          boxShadow: isDark
            ? 'inset 8px -4px 0px 0px #fff000'
            : 'inset 15px -4px 0px 15px #fff000',
          background: isDark ? '#28096b' : '#522ba7',
          transition: '0.5s',
        }}
      />
    </button>
  );
}
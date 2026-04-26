type Theme = 'dark' | 'light';

const COLORS: Record<Theme, string> = {
  dark: '#0e0f14',
  light: '#f0eff8',
};

function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem('tspk-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

let _theme: Theme = getInitialTheme();
const _listeners = new Set<() => void>();

function notify() { _listeners.forEach(cb => cb()); }

function applyToDom(theme: Theme) {
  const bg = COLORS[theme];
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.style.backgroundColor = bg;
  document.body.style.backgroundColor = bg;
}

applyToDom(_theme);

export function toggle() {
  const next: Theme = _theme === 'dark' ? 'light' : 'dark';
  _theme = next;
  localStorage.setItem('tspk-theme', next);
  applyToDom(next);
  notify();
}

export function getSnapshot(): Theme { return _theme; }

export function subscribe(cb: () => void): () => void {
  _listeners.add(cb);
  return () => _listeners.delete(cb);
}

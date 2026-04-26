import { useEffect, useMemo, useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import DashboardScreen from './screens/DashboardScreen';
import HistoryScreen from './screens/HistoryScreen';
import SettingsScreen from './screens/SettingsScreen';
import ResultScreen from './screens/ResultScreen';
import AuthScreen from './screens/AuthScreen';
import TopUpScreen from './screens/TopUpScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ReferralScreen from './screens/ReferralScreen';
import SupportScreen from './screens/SupportScreen';



export type Screen =
  | 'home'
  | 'dashboard'
  | 'history'
  | 'settings'
  | 'result'
  | 'profile'
  | 'auth'
  | 'topup'
  | 'notifications'
  | 'referral'
  | 'support';


export interface TranscriptionFile {
  id: string;
  name: string;
  type: 'audio' | 'video';
  duration: string;
  size: string;
  status: 'queued' | 'analyzing' | 'processing' | 'done' | 'error';
  progress?: number;
  date: string;
  cost: number;
  transcriptText?: string;
  summaryType?: 'brief' | 'managerial' | 'tasks';
  comment?: string;
  source?: 'device' | 'link';
}

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'warning' | 'error' | 'info';
  date: string;
  read: boolean;
}

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('auth');
  const [balance, setBalance] = useState(1250);
  const [selectedFile, setSelectedFile] = useState<TranscriptionFile | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [files, setFiles] = useState<TranscriptionFile[]>([
    {
      id: '1',
      name: 'Совещание_15_03.mp3',
      type: 'audio',
      duration: '45 мин',
      size: '85 МБ',
      status: 'processing',
      progress: 61,
      date: '15 марта 2026',
      cost: 540,
      source: 'device',
    },
    {
      id: '2',
      name: 'Интервью_кандидат.mp4',
      type: 'video',
      duration: '30 мин',
      size: '240 МБ',
      status: 'queued',
      date: '14 марта 2026',
      cost: 360,
      source: 'link',
    },
    {
      id: 'demo-err',
      name: 'Подкаст_ошибка.mp3',
      type: 'audio',
      duration: '18 мин',
      size: '39 МБ',
      status: 'error',
      date: '13 марта 2026',
      cost: 216,
      source: 'device',
    },
    {
      id: '3',
      name: 'Звонок_клиент_12_03.mp3',
      type: 'audio',
      duration: '12 мин',
      size: '24 МБ',
      status: 'done',
      date: '12 марта 2026',
      cost: 144,
      transcriptText: 'Это демо-текст завершенной транскрибации. Здесь находится расшифровка разговора.',
      comment: 'Нужно отправить руководителю',
      source: 'device',
    },
    {
      id: '4',
      name: 'Встреча_команды_10_03.mp4',
      type: 'video',
      duration: '65 мин',
      size: '480 МБ',
      status: 'done',
      date: '10 марта 2026',
      cost: 780,
      transcriptText: 'В этой записи обсуждались сроки релиза, риски и распределение задач по команде.',
      source: 'link',
    },
  ]);

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'n-1',
      title: 'Транскрибация готова',
      description: 'Файл "Звонок_клиент_12_03.mp3" доступен для скачивания.',
      type: 'success',
      date: 'сегодня, 10:42',
      read: false,
    },
    {
      id: 'n-2',
      title: 'Ошибка обработки',
      description: 'Файл "Подкаст_ошибка.mp3" требует повторной попытки.',
      type: 'error',
      date: 'сегодня, 09:58',
      read: false,
    },
  ]);

  const handleNavigate = (screen: Screen) => {
    if (!isAuthorized && screen !== 'auth') {
      setCurrentScreen('auth');
    } else {
      setCurrentScreen(screen);
    }
    window.scrollTo(0, 0);
  };

  const handleFileSelect = (file: TranscriptionFile) => {
    setSelectedFile(file);
    setCurrentScreen('result');
  };

  const addNotification = (notification: Omit<AppNotification, 'id' | 'read'>) => {
    setNotifications((prev) => [
      {
        ...notification,
        id: Date.now().toString(),
        read: false,
      },
      ...prev,
    ]);
  };

  const handleUpload = (newFile: TranscriptionFile) => {
    setFiles(prev => [newFile, ...prev]);
    setBalance(prev => prev - newFile.cost);
    setCurrentScreen('dashboard');
  };

  const handleRetry = (fileId: string) => {
    setFiles((prev) =>
      prev.map((file) =>
        file.id === fileId
          ? { ...file, status: 'queued', progress: 0 }
          : file
      )
    );
  };

  const handleTopUp = (amount: number) => {
    setBalance((prev) => prev + amount);
    addNotification({
      title: 'Баланс пополнен',
      description: `Ваш баланс пополнен на ${amount.toLocaleString()} ₽`,
      type: 'success',
      date: 'только что',
    });
    setCurrentScreen('dashboard');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)));
  };

  const unreadCount = useMemo(() => notifications.filter((item) => !item.read).length, [notifications]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setFiles((prev) =>
        prev.map((file) => {
          if (file.status === 'queued') {
            return { ...file, status: 'analyzing', progress: 8 };
          }
          if (file.status === 'analyzing') {
            return { ...file, status: 'processing', progress: 22 };
          }
          if (file.status !== 'processing') {
            return file;
          }

          const next = Math.min((file.progress ?? 22) + 12, 100);
          if (next < 100) {
            return { ...file, progress: next };
          }

          addNotification({
            title: 'Транскрибация завершена',
            description: `Файл "${file.name}" готов к просмотру.`,
            type: 'success',
            date: 'только что',
          });
          return {
            ...file,
            status: 'done',
            progress: 100,
            transcriptText:
              file.transcriptText ??
              `Демо-результат для файла "${file.name}".\n\n- Основная тема: статус проекта\n- Решения: согласовать требования и сроки\n- Следующий шаг: подготовить финальную версию ТЗ.`,
          };
        })
      );
    }, 1800);

    return () => window.clearInterval(interval);
  }, []);

  return (
      <div style={{ 
       minHeight: '100vh', 
       width: '100%', 
       overflowX: 'hidden', 
       position: 'relative',
       background: 'var(--bg-primary)',
       display: 'flex',
       flexDirection: 'column',
      }}>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
          pointerEvents: 'none',
          zIndex: 999,
          opacity: 'var(--noise-opacity)' as any,
        }}
      />
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `
            linear-gradient(var(--hero-grid-color) 1px, transparent 1px),
            linear-gradient(90deg, var(--hero-grid-color) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />

      <Navbar 
        currentScreen={currentScreen} 
        onNavigate={handleNavigate}
        balance={balance}
        unreadCount={unreadCount}
        isAuthorized={isAuthorized}
      />

      <main style={{ position: 'relative', zIndex: 1, paddingTop: '78px', flex: 1 }}>
        {currentScreen === 'home' && (
          <HomeScreen 
            onNavigate={handleNavigate} 
            onUpload={handleUpload}
            balance={balance}
            isAuthorized={isAuthorized}
          />
        )}
        {currentScreen === 'dashboard' && (
          <DashboardScreen 
            files={files}
            onFileSelect={handleFileSelect}
            onNavigate={handleNavigate}
            onRetry={handleRetry}
            totalStats={{
              totalTranscriptions: 47,
              totalHours: 128,
              timeSaved: 64,
            }}
          />
        )}
        {currentScreen === 'history' && (
          <HistoryScreen 
            files={files}
            onFileSelect={handleFileSelect}
          />
        )}
        {currentScreen === 'settings' && (
          <SettingsScreen onNavigate={handleNavigate} />
        )}
        {currentScreen === 'auth' && (
          <AuthScreen
            onSuccess={() => {
              setIsAuthorized(true);
              setCurrentScreen('dashboard');
            }}
          />
        )}
        {currentScreen === 'topup' && <TopUpScreen balance={balance} onTopUp={handleTopUp} />}
        {currentScreen === 'notifications' && (
          <NotificationsScreen
            notifications={notifications}
            onOpenItem={(id) => markNotificationRead(id)}
            onBack={() => setCurrentScreen('dashboard')}
          />
        )}
        {currentScreen === 'referral' && <ReferralScreen />}
        {currentScreen === 'support' && <SupportScreen />}
        {currentScreen === 'result' && selectedFile && (
          <ResultScreen 
            file={selectedFile}
            onUpdate={(updates) => {
              setFiles((prev) => prev.map((item) => (item.id === selectedFile.id ? { ...item, ...updates } : item)));
              setSelectedFile((prev) => (prev ? { ...prev, ...updates } : prev));
            }}
            onBack={() => setCurrentScreen('dashboard')}
          />
        )}
        {currentScreen === 'profile' && (
          <ProfileScreen 
           onBack={() => handleNavigate('home')} 
          />
        )}
      </main>
      <div style={{ marginTop: '64px' }}></div>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
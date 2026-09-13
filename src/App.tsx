import { useState } from 'react';
import { ThemeMode } from './types/redact';
import { Header } from './components/Header';
import { Dropzone } from './components/Dropzone';
import { ShortcutsModal } from './components/ShortcutsModal';

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'beige' : 'dark';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        isDark ? 'bg-[#09090b] text-zinc-100' : 'bg-[#eee8dd] text-stone-900'
      }`}
    >
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onReset={() => {}}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center items-center">
        <Dropzone onFileSelect={() => {}} theme={theme} />
      </main>

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        theme={theme}
      />
    </div>
  );
}

import { useEffect, useState } from 'react';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

export default function ThemeToggle() {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('myno-theme') || 'system';
        }
        return 'system';
    });

    useEffect(() => {
        const root = document.documentElement;
        const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        root.classList.toggle('dark', isDark);
        localStorage.setItem('myno-theme', theme);
    }, [theme]);

    // Listen for system preference changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (theme === 'system') {
                const isDark = mediaQuery.matches;
                document.documentElement.classList.toggle('dark', isDark);
            }
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    const cycleTheme = () => {
        setTheme(prev => {
            if (prev === 'light') return 'dark';
            if (prev === 'dark') return 'system';
            return 'light';
        });
    };

    const getIcon = () => {
        if (theme === 'light') return SunIcon;
        if (theme === 'dark') return MoonIcon;
        return ComputerDesktopIcon;
    };

    const Icon = getIcon();
    const label = theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'System';

    return (
        <button
            onClick={cycleTheme}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            title={`Theme: ${label}`}
            aria-label={`Theme: ${label}`}
        >
            <Icon className="w-5 h-5 text-foreground" />
        </button>
    );
}
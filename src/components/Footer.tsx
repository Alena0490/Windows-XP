import { useState, useEffect, useRef } from 'react';
import type { ErrorType } from './CriticalError';
import useSound from '../hooks/useSound';
import StartMenu from './StartMenu';
import ErrorBubble from './ErrorBubble';
import VolumeMeter from './VolumeMeter';

import windowsLogo from '../img/logo.webp';
import InternetShortcut from '../img/InternetShortcut.webp';
import volume from '../img/Volume.webp';
import mute from '../img/Mute.webp'
import securityError from '../img/SecurityError.webp';

import './Footer.css';

export interface AppState {
    id: string;
    isOpen: boolean;
    isMinimized: boolean;
    setMinimized: (value: boolean | ((prev: boolean) => boolean)) => void;
    onOpen: () => void;
    icon: string;
    label: string;
}

interface FooterProps {
    handleFullscreen: () => void;
    onAppUnavailable: (type: ErrorType) => void;
    onLogOff: () => void;
    onTurnOff: () => void;
    onFileManagerOpen: (initialPath?: string[]) => void;
    onIEOpen: () => void;
    onPaintOpen: () => void;
    onMinesweeperOpen: () => void;
    onSolitaireOpen: () => void;
    onCalculatorOpen: () => void;
    onTerminalOpen: () => void;
    onNotepadOpen: () => void;
    onMediaPlayerOpen: () => void;
    onDisplayPropertiesOpen: () => void;
    apps: AppState[];
    fileManagerTitle: string;
    fileManagerIcon: string;
    globalVolume: number;
    onGlobalVolumeChange: (volume: number) => void;
    globalMuted: boolean;
    onGlobalMuteToggle: () => void;
}

const Footer = ({
    handleFullscreen,
    onAppUnavailable,
    onLogOff,
    onTurnOff,
    onFileManagerOpen,
    onIEOpen,
    onPaintOpen,
    onMinesweeperOpen,
    onSolitaireOpen,
    onCalculatorOpen,
    onTerminalOpen,
    onNotepadOpen,
    onMediaPlayerOpen,
    onDisplayPropertiesOpen,
    apps,
    fileManagerTitle,
    fileManagerIcon,
    globalVolume,
    onGlobalVolumeChange,
    globalMuted,
    onGlobalMuteToggle
}: FooterProps) => {
    const [time, setTime] = useState(new Date());
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showBubble, setShowBubble] = useState(false);
    const [showVolume, setShowVolume] = useState(false);

    const { playStart, playMinimize, playBalloon } = useSound(globalVolume, globalMuted);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close the start menu on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Update clock every second
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Show error bubble after 5 seconds, hide after 15 seconds
    useEffect(() => {
        const showTimer = setTimeout(() => {
            playBalloon();
            setShowBubble(true);
        }, 5000);
        const hideTimer = setTimeout(() => {
            setShowBubble(false);
        }, 15000);
        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <footer>
            <div className='left-menu'>
                <div
                    className='start'
                    ref={menuRef}
                    onClick={() => {
                        const nextState = !isMenuOpen;
                        setIsMenuOpen(nextState);
                        if (nextState) playStart();
                    }}
                    onDoubleClick={handleFullscreen}
                >
                    <StartMenu
                        key={isMenuOpen ? 'open' : 'closed'}
                        className={`start-menu ${isMenuOpen ? 'open' : ''}`}
                        onIEOpen={onIEOpen}
                        onPaintOpen={onPaintOpen}
                        onCalculatorOpen={onCalculatorOpen}
                        onMinesweeperOpen={onMinesweeperOpen}
                        onSolitaireOpen={onSolitaireOpen}
                        onTerminalOpen={onTerminalOpen}
                        onNotepadOpen={onNotepadOpen}
                        onMediaPlayerOpen={onMediaPlayerOpen}
                        onDisplayPropertiesOpen={onDisplayPropertiesOpen}
                        onAppUnavailable={onAppUnavailable}
                        onLogOff={onLogOff}
                        onTurnOff={onTurnOff}
                        onFileManagerOpen={onFileManagerOpen}
                        globalVolume={globalVolume}
                        globalMuted={globalMuted}
                    />
                    <img src={windowsLogo} alt='Windows XP Logo' />
                    <span>start</span>
                </div>

                <div className='menu-item'>
                    <img src={InternetShortcut} alt='Internet Shortcut Icon' />
                </div>

                {apps.map(app => app.isOpen && (
                    <div
                        key={app.id}
                        className={`taskbar-item ${!app.isMinimized ? 'taskbar-item--active' : ''}`}
                        onClick={() => {
                            if (app.isMinimized) playStart();
                            else playMinimize();
                            app.setMinimized(prev => !prev);
                        }}
                    >
                        <img src={app.id === 'filemanager' ? fileManagerIcon : app.icon} alt={app.label} />
                        <span>{app.id === 'filemanager' ? fileManagerTitle : app.label}</span>
                    </div>
                ))}
            </div>

            {showBubble && (
                <ErrorBubble onClose={() => setShowBubble(false)} />
            )}

            <div className='right-panel taskbar-item'>
                <img src={securityError} alt='Security Error Icon' />
                <img 
                    src={globalMuted || globalVolume === 0 ? mute : volume} 
                    alt='Volume Icon'
                    onClick={() => setShowVolume(prev => !prev)}
                />
                {showVolume && (
                    <VolumeMeter
                        volume={globalVolume}
                        onVolumeChange={onGlobalVolumeChange}
                        isMuted={globalMuted}
                        onMuteToggle={onGlobalMuteToggle}
                        onClose={() => setShowVolume(false)}
                    />
                )}
                <div className='time'>
                    {time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
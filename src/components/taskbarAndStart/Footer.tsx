import { useState, useEffect, useRef } from 'react';
import type { ErrorType } from '../CriticalError';
import useSound from '../../hooks/useSound';
import StartMenu from './StartMenu';
import ErrorBubble from './ErrorBubble';
import VolumeMeter from './VolumeMeter';
import TaskbarMenu from './TaskbarMenu';
import type { MenuItem } from './TaskbarMenu';
import Toolbar from './Toolbar';
import type { ToolbarItem } from './Toolbar';

import MyComputer from '../../img/MyComputer.webp';
import MyDocuments from '../../img/MyDocuments.webp';
// import RecycleBin from '../../img/RecycleBinEmpty.webp';
import URLIcon from '../../img/URL.webp';
import IEIcon from '../../img/ie.ico'
import DesktopIcon from '../../img/desktop.ico'
import MediaPlayerIcon from '../../img/wmp.ico'

import windowsLogo from '../../img/logo.webp';
// import InternetShortcut from '../../img/InternetShortcut.webp';
import volume from '../../img/sound.ico';
import mute from '../../img/mute.ico'
import securityError from '../../img/error.ico';

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
    activeWindowId?: string;
    bringToFront: (id: string) => void;
    handleFullscreen: () => void;
    onAppUnavailable: (type: ErrorType) => void;
    onLogOff: () => void;
    onTurnOff: () => void;
    onFileManagerOpen: (initialPath?: string[]) => void;
    onIEOpen: (url?: string) => void;
    onPaintOpen: () => void;
    onMinesweeperOpen: () => void;
    onSolitaireOpen: () => void;
    onCalculatorOpen: () => void;
    onTerminalOpen: () => void;
    onNotepadOpen: () => void;
    onMediaPlayerOpen: () => void;
    onDisplayPropertiesOpen: () => void;
    onRunOpen: () => void;
    apps: AppState[];
    fileManagerTitle: string;
    fileManagerIcon: string;
    globalVolume: number;
    onGlobalVolumeChange: (volume: number) => void;
    globalMuted: boolean;
    onGlobalMuteToggle: () => void;
    onOpenRecentDoc?: (doc: import('../../utils/recentDocs').RecentDoc) => void;
    plusTheme?: 'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
    binIcon: string;
}

const Footer = ({
    activeWindowId,
    bringToFront,
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
    onRunOpen,
    apps,
    fileManagerTitle,
    fileManagerIcon,
    globalVolume,
    onGlobalVolumeChange,
    globalMuted,
    onGlobalMuteToggle,
    onOpenRecentDoc,
    plusTheme,
    binIcon,
}: FooterProps) => {
    const [time, setTime] = useState(new Date());
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showBubble, setShowBubble] = useState(false);
    const [showVolume, setShowVolume] = useState(false);
    const [taskbarMenu, setTaskbarMenu] = useState<number | null>(null);
    const [linksOn, setLinksOn] = useState(false);
    const [desktopOn, setDesktopOn] = useState(false);
    const [quickLaunchOn, setQuickLaunchOn] = useState(true);
    const [addressOn, setAddressOn] = useState(false);


    const sounds = useSound(globalVolume, globalMuted);
    const themeSound = plusTheme === 'aquarium' ? sounds.aquarium
        : plusTheme === 'davinci' ? sounds.daVinci
        : plusTheme === 'nature' ? sounds.nature
        : plusTheme === 'space' ? sounds.space
        : null;
    const playStart    = () => themeSound ? themeSound.playOpen()     : sounds.playStart();
    // const playMinimize = () => themeSound ? themeSound.playMinimize() : sounds.playMinimize();
    const playBalloon  = () => themeSound ? themeSound.playAsterisk() : sounds.playBalloon();
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

    // Show Taskbaar menu
    const handleTaskbarContext = (e: React.MouseEvent) => {
        e.preventDefault();
        setTaskbarMenu(e.clientX);
    };



    const linksItems: ToolbarItem[] = [
        { label: 'Customize Links', icon: URLIcon, onClick: () => onIEOpen('https://web.archive.org/web/2003/http://www.microsoft.com/') },
        { label: 'Free Hotmail',    icon: URLIcon, onClick: () => onIEOpen('https://web.archive.org/web/2003/http://www.hotmail.com/') },
        { label: 'Windows',         icon: URLIcon, onClick: () => onIEOpen('https://web.archive.org/web/2003/http://www.microsoft.com/windows/') },
        { label: 'Windows Media',   icon: URLIcon, onClick: () => onIEOpen('https://web.archive.org/web/2003/http://www.windowsmedia.com/') },
    ];

    const desktopItems: ToolbarItem[] = [
        { label: 'My Computer',   icon: MyComputer,  onClick: () => onFileManagerOpen() },
        { label: 'My Documents',  icon: MyDocuments, onClick: () => onFileManagerOpen(['localdisc', 'c-documents', 'c-admin', 'documents']) },
        { label: 'Recycle Bin', icon: binIcon, onClick: () => onFileManagerOpen(['recyclebin']) },
    ];

    const taskbarMenuItems: MenuItem[] = [
        { label: 'Toolbars', hasSubmenu: true, children: [
            { label: 'Address', checked: addressOn, onClick: () => setAddressOn(prev => !prev) },
            { label: 'Links', checked: linksOn, onClick: () => setLinksOn(prev => !prev) },
            { label: 'Desktop', checked: desktopOn, onClick: () => setDesktopOn(prev => !prev) },
            { label: 'Quick Launch', checked: quickLaunchOn, onClick: () => setQuickLaunchOn(prev => !prev) },
        ] },
        { separator: true },
        { label: 'Cascade Windows', disabled: true },
        { label: 'Tile Windows Horizontally', disabled: true },
        { label: 'Tile Windows Vertically', disabled: true },
        { label: 'Show the Desktop', onClick: () => onFileManagerOpen(['localdisc', 'c-documents', 'c-admin', 'desktop']) },
        { separator: true },
        { label: 'Task Manager', disabled: true },
        { separator: true },
        { label: 'Lock the Taskbar', checked: true, disabled: true },
        { label: 'Properties', disabled: true },
    ];

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
        <footer onContextMenu={handleTaskbarContext}>
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
                        onRunOpen={onRunOpen}
                        onAppUnavailable={onAppUnavailable}
                        onLogOff={onLogOff}
                        onTurnOff={onTurnOff}
                        onFileManagerOpen={onFileManagerOpen}
                        globalVolume={globalVolume}
                        globalMuted={globalMuted}
                        onOpenRecentDoc={onOpenRecentDoc}
                        plusTheme={plusTheme}
                    />
                    <img src={windowsLogo} alt='Windows XP Logo' />
                    <span>start</span>
                </div>

                {/* <div className='menu-item'>
                    <img src={InternetShortcut} alt='Internet Shortcut Icon' />
                </div> */}
                <button
                    type="button"
                    className="quick-launch__item"
                    data-tooltip="Launch Internet Explorer Browser"
                    aria-label="Launch Internet Explorer Browser"
                    onDoubleClick={() => onIEOpen()}
                >
                    <img src={IEIcon} alt="" />
                </button>
                <button
                    type="button"
                    className="quick-launch__item"
                    data-tooltip="Show Desktop"
                    aria-label="Show Desktop"
                    onDoubleClick={() => onFileManagerOpen(['localdisc', 'c-documents', 'c-admin', 'desktop'])}
                >
                    <img src={DesktopIcon} alt="" />
                </button>
                <button
                    type="button"
                    className="quick-launch__item"
                    data-tip-title="Windows Media Player"
                    data-tip-desc="Plays your digital media including music, videos, CDs, DVDs, and Internet Radio."
                    onDoubleClick={() => onMediaPlayerOpen()}
                >
                    <img src={MediaPlayerIcon} alt="Windows Media Player" />
                </button>

                {apps.map(app => app.isOpen && (
                    <div
                        key={app.id}
                        className={`taskbar-item ${app.id === activeWindowId && !app.isMinimized ? 'taskbar-item--active' : ''}`}
                        onClick={() => {
                            const isActive = !app.isMinimized && app.id === activeWindowId;
                            if (isActive) {
                                // klik na aktivní okno → minimalizace
                                app.setMinimized(true);
                            } else if (app.isMinimized) {
                                // obnovit minimalizované okno + aktivovat
                                app.setMinimized(false);
                                bringToFront(app.id);
                            } else {
                                // okno na pozadí → jen vytáhnout dopředu
                                bringToFront(app.id);
                            }
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
          
            <div className="toolbar-group">
                {addressOn && (
                    <span
                        className="address-label"
                        onClick={(e) => setTaskbarMenu(e.clientX)}
                    >
                        Address
                    </span>
                )}
                {desktopOn && <Toolbar label="Desktop" items={desktopItems} />}
                {linksOn && <Toolbar label="Links" items={linksItems} />}
            </div>
            
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

            {/* TASKBAR MENU */}
            {taskbarMenu !== null && (
                <TaskbarMenu
                    x={taskbarMenu}
                    items={taskbarMenuItems}
                    onClose={() => setTaskbarMenu(null)}
                />
            )}
        </footer>
    );
};

export default Footer;

import { useState } from 'react';
import useSound from './hooks/useSound';
import useWindowState from './hooks/useWindowState';
import type { ErrorType } from './components/CriticalError';
import type { AppState } from './components/Footer';
import type { WMPTrack } from './components/mediaPlayer/types/WMPTrack';
import CriticalError from './components/CriticalError';
import ShutdownScreen from './components/ShutdownScreen';

import LoadingScreen from './components/XPLoading';
import LoginScreen from './components/LoginScreen';
import Game from './components/minesweeper/Game';
import Paint from './components/Paint/Paint';
import IEWindow from './components/IE/IEWindow';
import Calculator from './components/Calculator/Calculator';
import Footer from './components/Footer';
import Terminal from './components/terminal/Terminal';
import Notepad from './components/notepad/Notepad';
import FileManager from './components/files/FileManager';
import MediaPlayer from './components/mediaPlayer/MediaPlayer';

import MyComputer from './img/MyComputer.webp';
import IntertExplorer from './img/InternetExplorer6.webp';
import Bin from './img/RecycleBinEmpty.webp';
import MinesweeperIcon from './img/Minesweeper.webp';
import PaintIcon from './img/Paint.webp';
import CalculatorIcon from './img/Calculator.webp';
import TerminalIcon from './img/CommandPrompt.webp';
import NotepadIcon from './img/Notepad.webp';
import FolderIcon from './img/FolderClosed.webp';
import MediaPlayerIcon from './img/WindowsMediaPlayer 9.webp';
import Pacman from './img/Pacman.webp';
import NuPogodi from './img/nu-pogodi.webp';

import README_CONTENT from '../README.md?raw';

import './App.css';

interface FullscreenHTMLElement extends HTMLElement {
    webkitRequestFullscreen?: () => Promise<void>;
    msRequestFullscreen?: () => Promise<void>;
}

type CursorTheme = 'default' | 'white'  | 'gold' | 'silver' | 'hand' | 'modern';

type WindowId =
    | 'minesweeper'
    | 'ie'
    | 'paint'
    | 'calculator'
    | 'terminal'
    | 'notepad'
    | 'filemanager'
    | 'mediaplayer'
    | 'error';

const TERMINAL_APPS = [
    { name: 'Minesweeper', size: '23,060' },
    { name: 'Internet Explorer', size: '107,690' },
    { name: 'Paint', size: '80,250' },
    { name: 'Calculator', size: '15,780' },
    { name: 'Command Prompt', size: '5,290' },
    { name: 'Loading Screen', size: '9,920' },
    { name: 'Start Menu', size: '13,490' },
    { name: 'Taskbar', size: '3,370' },
    { name: 'Error Bubble', size: '600' },
    { name: 'Critical Error', size: '10,570' },
    { name: 'Notepad', size: '13,110' },
    { name: 'Shutdown Screen', size: '23,250' },
    { name: 'Shutdown Display', size: '1,160' },
    { name: 'File Manager', size: '195,670' },
    { name: 'Windows Media Player', size: '30,230' },
];

const App = () => {
    
    const minesweeper = useWindowState();
    const ie = useWindowState();
    const paint = useWindowState();
    const calculator = useWindowState();
    const terminal = useWindowState();
    const notepad = useWindowState();
    const filemanager = useWindowState();
    const mediaplayer = useWindowState();

    const [isIEOpen, setIsIEOpen] = useState(false);
    const [isPaintOpen, setIsPaintOpen] = useState(false);
    const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
    const [isMinesweeperOpen, setIsMinesweeperOpen] = useState(false);
    const [isTerminalOpen, setIsTerminalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeError, setActiveError] = useState<ErrorType | null>(null);
    const [isNotepadOpen, setIsNotepadOpen] = useState(false);
    const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);
    const [isMediaPlayerOpen, setIsMediaPlayerOpen] = useState(false);
    const [windowOrder, setWindowOrder] = useState<WindowId[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [shutdownMode, setShutdownMode] = useState<'logoff' | 'turnoff' | null>(null);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [fileManagerInitialPath, setFileManagerInitialPath] = useState<string[]>([]);
    const [fileManagerTitle, setFileManagerTitle] = useState('My Computer');
    const [fileManagerPathKey, setFileManagerPathKey] = useState(0);
    const [fileManagerIcon, setFileManagerIcon] = useState(FolderIcon);
    const [notepadInitialContent, setNotepadInitialContent] = useState<string | undefined>(undefined);
    const [notepadInitialFileName, setNotepadInitialFileName] = useState<string | undefined>(undefined);
    const [ieInitialUrl, setIeInitialUrl] = useState<string | undefined>(undefined);
    const [wmpTracks, setWmpTracks] = useState<WMPTrack[]>([]);
    const [wmpStartIndex, setWmpStartIndex] = useState(0);
    const [globalVolume, setGlobalVolume] = useState(1);
    const [globalMuted, setGlobalMuted] = useState(false);
    const [cursorTheme, setCursorTheme] = useState<CursorTheme>('modern');
    void setCursorTheme;

    const { playStart, playMinimize, playCriticalError, playShutDown, playLogOff } = useSound(globalVolume, globalMuted);

    // Bring active window to the front
    const bringToFront = (id: WindowId) => {
        setWindowOrder(prev => [...prev.filter(item => item !== id), id]);
    };

    // Remove closed window from order
    const removeFromOrder = (id: WindowId) => {
        setWindowOrder(prev => prev.filter(item => item !== id));
    };

    // Handle fullscreen request with cross-browser support
    const handleFullscreen = () => {
        const elem = document.documentElement as FullscreenHTMLElement;
        if (elem.requestFullscreen) elem.requestFullscreen();
        else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
        else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
    };

    // Open the critical error dialog
    const openError = (type: ErrorType) => {
        playCriticalError();
        setActiveError(type);
        bringToFront('error');
    };

    /*** MINIMIZE HANDLERS ***/

    // Minimize Minesweeper
    const handleMinesweeperMinimize = (value: boolean | ((prev: boolean) => boolean)) => {
        const nextValue = typeof value === 'function' ? value(minesweeper.isMinimized) : value;
        if (nextValue) playMinimize();
        else playStart();
        minesweeper.setIsMinimized(nextValue);
    };

    // Minimize IE
    const handleIEMinimize = (value: boolean | ((prev: boolean) => boolean)) => {
        const nextValue = typeof value === 'function' ? value(ie.isMinimized) : value;
        if (nextValue) playMinimize();
        else playStart();
        ie.setIsMinimized(nextValue);
    };

    // Minimize Paint
    const handlePaintMinimize = (value: boolean | ((prev: boolean) => boolean)) => {
        const nextValue = typeof value === 'function' ? value(paint.isMinimized) : value;
        if (nextValue) playMinimize();
        else playStart();
        paint.setIsMinimized(nextValue);
    };

    // Minimize Calculator
    const handleCalculatorMinimize = (value: boolean | ((prev: boolean) => boolean)) => {
        const nextValue = typeof value === 'function' ? value(calculator.isMinimized) : value;
        if (nextValue) playMinimize();
        else playStart();
        calculator.setIsMinimized(nextValue);
    };

    // Minimize Terminal
    const handleTerminalMinimize = (value: boolean | ((prev: boolean) => boolean)) => {
        const nextValue = typeof value === 'function' ? value(terminal.isMinimized) : value;
        if (nextValue) playMinimize();
        else playStart();
        terminal.setIsMinimized(nextValue);
    };

    // Minimize Notepad
    const handleNotepadMinimize = (value: boolean | ((prev: boolean) => boolean)) => {
        const nextValue = typeof value === 'function' ? value(notepad.isMinimized) : value;
        if (nextValue) playMinimize();
        else playStart();
        notepad.setIsMinimized(nextValue);
    };

    // Minimize File Manager
    const handleFileManagerMinimize = (value: boolean | ((prev: boolean) => boolean)) => {
        const nextValue = typeof value === 'function' ? value(filemanager.isMinimized) : value;
        if (nextValue) playMinimize();
        else playStart();
        filemanager.setIsMinimized(nextValue);
    };

    // Minimize Media Player
    const handleMediaPlayerMinimize = (value: boolean | ((prev: boolean) => boolean)) => {
        const nextValue = typeof value === 'function' ? value(mediaplayer.isMinimized) : value;
        if (nextValue) playMinimize();
        else playStart();
        mediaplayer.setIsMinimized(nextValue);
    };

    /*** OPEN HANDLERS ***/

    // Open app by desktop item id
    const handleOpenApp = (id: string) => {
        switch (id) {
            case 'desk1': openMinesweeper(); break;
            case 'desk2': openIE(); break;
            case 'desk3': openPaint(); break;
            case 'desk4': openNotepad(); break;
            case 'desk5': openFileManager(['localdisc']); break;
            case 'desk6': openCalculator(); break;
            case 'desk7': openTerminal(); break;
            case 'desk8': openFileManager(); break;
            case 'desk9': openFileManager(['recyclebin']); break;
            case 'desk10': openNotepad(README_CONTENT, 'About this project.md'); break;
            case 'desk11': openIE('https://alena0490.github.io/Pacman/'); break;
            case 'desk12': openIE('https://alena0490.github.io/Nu-pogodi/'); break;
            case 'desk13': openMediaPlayer(); break;
        }
    };

    // Open IE
    const openIE = (url?: string) => {
        setIeInitialUrl(url);
        if (!isIEOpen) {
            playStart();
            setIsIEOpen(true);
        } else if (ie.isMinimized) {
            handleIEMinimize(false);
        }
        bringToFront('ie');
    };

    // Open Minesweeper
    const openMinesweeper = () => {
        if (!isMinesweeperOpen) {
            playStart();
            setIsMinesweeperOpen(true);
        } else if (minesweeper.isMinimized) {
            handleMinesweeperMinimize(false);
        }
        bringToFront('minesweeper');
    };

    // Open Paint
    const openPaint = () => {
        if (!isPaintOpen) {
            playStart();
            setIsPaintOpen(true);
        } else if (paint.isMinimized) {
            handlePaintMinimize(false);
        }
        bringToFront('paint');
    };

    // Open Calculator
    const openCalculator = () => {
        if (!isCalculatorOpen) {
            playStart();
            setIsCalculatorOpen(true);
        } else if (calculator.isMinimized) {
            handleCalculatorMinimize(false);
        }
        bringToFront('calculator');
    };

    // Open Terminal
    const openTerminal = () => {
        if (!isTerminalOpen) {
            playStart();
            setIsTerminalOpen(true);
        } else if (terminal.isMinimized) {
            handleTerminalMinimize(false);
        }
        bringToFront('terminal');
    };

    // Open Notepad
    const openNotepad = (content?: string, fileName?: string) => {
        setNotepadInitialContent(content);
        setNotepadInitialFileName(fileName);
        if (!isNotepadOpen) {
            playStart();
            setIsNotepadOpen(true);
        } else if (notepad.isMinimized) {
            handleNotepadMinimize(false);
        }
        bringToFront('notepad');
    };

    // Open File Manager
    const openFileManager = (initialPath: string[] = []) => {
        setFileManagerInitialPath(initialPath);
        setFileManagerPathKey(prev => prev + 1);
        if (!isFileManagerOpen) {
            playStart();
            setIsFileManagerOpen(true);
        } else if (filemanager.isMinimized) {
            handleFileManagerMinimize(false);
        }
        bringToFront('filemanager');
    };

    // Open Media Player
    const openMediaPlayer = (tracks: WMPTrack[] = [], startIndex = 0) => {
        setWmpTracks(tracks);
        setWmpStartIndex(startIndex);
        if (!isMediaPlayerOpen) {
            playStart();
            setIsMediaPlayerOpen(true);
        } else if (mediaplayer.isMinimized) {
            handleMediaPlayerMinimize(false);
        }
        bringToFront('mediaplayer');
    };

    /*** SHUTDOWNSCREEN HANDLERS ***/

    // Open ShutdownScreen in the given mode
    const openShutdown = (mode: 'logoff' | 'turnoff') => {
        setShutdownMode(mode);
    };

    // Handle the selected ShutdownScreen action
    const handleShutdownAction = (action: 'switchuser' | 'logoff' | 'standby' | 'turnoff' | 'restart') => {
        setShutdownMode(null);

        if (action === 'turnoff' || action === 'restart' || action === 'standby') {
            playShutDown();
        } else {
            playLogOff();
        }

        setIsFadingOut(true);
        setTimeout(() => {
            setIsFadingOut(false);
            if (action === 'logoff' || action === 'switchuser' || action === 'standby' || action === 'turnoff') {
                setIsLoggedIn(false);
            }
            if (action === 'restart') {
                setIsLoggedIn(false);
                setLoading(true);
            }
        }, 3000);
    };

    // Cancel and close ShutdownScreen
    const handleShutdownCancel = () => {
        setShutdownMode(null);
    };

    /*** WINDOW RENDERING ***/

    const renderWindow = (id: WindowId) => {

        // Minesweeper window
        if (id === 'minesweeper' && isMinesweeperOpen) {
            return (
                <Game
                    key='minesweeper'
                    onClose={() => {
                        playMinimize();
                        setIsMinesweeperOpen(false);
                        removeFromOrder('minesweeper');
                    }}
                    isMinimized={minesweeper.isMinimized}
                    isFullscreen={minesweeper.isFullscreen}
                    setIsMinimized={handleMinesweeperMinimize}
                    setIsFullscreen={() => minesweeper.toggleFullscreen()}
                    onMouseDown={() => bringToFront('minesweeper')}
                    globalVolume={globalVolume}
                    globalMuted={globalMuted}
                />
            );
        }

        // Internet Explorer window
        if (id === 'ie' && isIEOpen) {
            return (
                <IEWindow
                    key='ie'
                    onClose={() => {
                        playMinimize();
                        setIsIEOpen(false);
                        removeFromOrder('ie');
                    }}
                    onOpenFM={() => openFileManager(['localdisc', 'c-windows', 'c-windows-offline'])}
                    isMinimized={ie.isMinimized}
                    setIsMinimized={handleIEMinimize}
                    isFullscreen={ie.isFullscreen}
                    toggleFullscreen={ie.toggleFullscreen}
                    onMouseDown={() => bringToFront('ie')}
                    initialUrl={ieInitialUrl}
                    globalVolume={globalVolume}
                    globalMuted={globalMuted}
                />
            );
        }

        // Paint window
        if (id === 'paint' && isPaintOpen) {
            return (
                <Paint
                    key='paint'
                    onClose={() => {
                        playMinimize();
                        setIsPaintOpen(false);
                        removeFromOrder('paint');
                    }}
                    isMinimized={paint.isMinimized}
                    setIsMinimized={handlePaintMinimize}
                    isFullscreen={paint.isFullscreen}
                    setIsFullscreen={() => paint.toggleFullscreen()}
                    onMouseDown={() => bringToFront('paint')}
                    globalVolume={globalVolume}
                    globalMuted={globalMuted}
                />
            );
        }

        // Calculator window
        if (id === 'calculator' && isCalculatorOpen) {
            return (
                <Calculator
                    key='calculator'
                    onClose={() => {
                        playMinimize();
                        setIsCalculatorOpen(false);
                        removeFromOrder('calculator');
                    }}
                    isMinimized={calculator.isMinimized}
                    setIsMinimized={handleCalculatorMinimize}
                    isFullscreen={calculator.isFullscreen}
                    toggleFullscreen={calculator.toggleFullscreen}
                    onMouseDown={() => bringToFront('calculator')}
                    globalVolume={globalVolume}
                    globalMuted={globalMuted}
                />
            );
        }

        // Terminal window
        if (id === 'terminal' && isTerminalOpen) {
            return (
                <Terminal
                    key='terminal'
                    onClose={() => {
                        playMinimize();
                        setIsTerminalOpen(false);
                        removeFromOrder('terminal');
                    }}
                    isMinimized={terminal.isMinimized}
                    setIsMinimized={handleTerminalMinimize}
                    isFullscreen={terminal.isFullscreen}
                    toggleFullscreen={terminal.toggleFullscreen}
                    onMouseDown={() => bringToFront('terminal')}
                    apps={TERMINAL_APPS}
                />
            );
        }

        // Notepad window
        if (id === 'notepad' && isNotepadOpen) {
            return (
                <Notepad
                    key='notepad'
                    onClose={() => {
                        playMinimize();
                        setIsNotepadOpen(false);
                        removeFromOrder('notepad');
                    }}
                    isMinimized={notepad.isMinimized}
                    setIsMinimized={handleNotepadMinimize}
                    isFullscreen={notepad.isFullscreen}
                    toggleFullscreen={notepad.toggleFullscreen}
                    onMouseDown={() => bringToFront('notepad')}
                    initialContent={notepadInitialContent}
                    initialFileName={notepadInitialFileName}
                    globalVolume={globalVolume}
                    globalMuted={globalMuted}
                />
            );
        }

        // File Manager window
        if (id === 'filemanager' && isFileManagerOpen) {
            return (
                <FileManager
                    key='filemanager'
                    initialPath={fileManagerInitialPath}
                    onClose={() => {
                        playMinimize();
                        setIsFileManagerOpen(false);
                        removeFromOrder('filemanager');
                    }}
                    isMinimized={filemanager.isMinimized}
                    setIsMinimized={handleFileManagerMinimize}
                    isFullscreen={filemanager.isFullscreen}
                    setIsFullscreen={() => filemanager.toggleFullscreen()}
                    onMouseDown={() => bringToFront('filemanager')}
                    onOpenApp={handleOpenApp}
                    onTitleChange={(name, icon) => {
                        setFileManagerTitle(name);
                        setFileManagerIcon(icon);
                    }}
                    pathKey={fileManagerPathKey}
                    onOpenIE={openIE}
                    onOpenNotepad={openNotepad}
                    apps={TERMINAL_APPS}
                    onOpenWMP={(tracks, startIndex) => openMediaPlayer(tracks, startIndex)}
                    globalVolume={globalVolume}
                    globalMuted={globalMuted}
                />
            );
        }

        // Media Player window
        if (id === 'mediaplayer' && isMediaPlayerOpen) {
            return (
                <MediaPlayer
                    key='mediaplayer'
                    onClose={() => {
                        playMinimize();
                        setIsMediaPlayerOpen(false);
                        removeFromOrder('mediaplayer');
                    }}
                    isMinimized={mediaplayer.isMinimized}
                    setIsMinimized={handleMediaPlayerMinimize}
                    isFullscreen={mediaplayer.isFullscreen}
                    setIsFullscreen={() => mediaplayer.toggleFullscreen()}
                    onMouseDown={() => bringToFront('mediaplayer')}
                    tracks={wmpTracks}
                    startIndex={wmpStartIndex}
                    onOpenFM={() => openFileManager(['localdisc', 'c-documents', 'c-admin', 'music'])}
                    globalVolume={globalVolume}
                    globalMuted={globalMuted}
                />
            );
        }

        // Critical error dialog
        if (id === 'error' && activeError) {
            return (
                <CriticalError
                    key='error'
                    type={activeError}
                    onClose={() => {
                        setActiveError(null);
                        removeFromOrder('error');
                    }}
                    onMouseDown={() => bringToFront('error')}
                />
            );
        }

        return null;
    };

    return !isLoggedIn ? (
        <LoginScreen onLogin={() => setIsLoggedIn(true)} />
    ) : loading ? (
        <LoadingScreen
            onFinish={() => setLoading(false)}
            globalVolume={globalVolume}
            globalMuted={globalMuted}
        />
    ) : (
        <div className={`app cursor-theme-${cursorTheme}`}>
            <div className='app-wrapper'>
                <a
                    href='#'
                    className='desktop-item'
                    onDoubleClick={() => openFileManager()}
                >
                    <img className='app-icon my-computer' src={MyComputer} alt='My Computer' />
                    <span className='desktop-item-label'>My Computer</span>
                </a>

                <div className='desktop-item' onDoubleClick={() => openIE()}>
                    <img className='app-icon ie' src={IntertExplorer} alt='Internet Explorer' />
                    <span className='desktop-item-label'>Internet Explorer</span>
                </div>

                <div className='desktop-item' onDoubleClick={openMinesweeper}>
                    <img className='app-icon paint' src={MinesweeperIcon} alt='Minesweeper' />
                    <span className='desktop-item-label'>Minesweeper</span>
                </div>

                <div className='desktop-item' onDoubleClick={() => openIE('https://alena0490.github.io/Pacman/')}>
                    <img className='app-icon' src={Pacman} alt='Pacman' />
                    <span className='desktop-item-label'>PAC-MAN</span>
                </div>
                <div className='desktop-item' onDoubleClick={() => openIE('https://alena0490.github.io/Nu-pogodi/')}>
                    <img className='app-icon' src={NuPogodi} alt='Nu Pogodi' />
                    <span className='desktop-item-label'>Nu Pogodi</span>
                </div>

                <div className='desktop-item' onDoubleClick={openPaint}>
                    <img className='app-icon paint' src={PaintIcon} alt='Paint' />
                    <span className='desktop-item-label'>Paint</span>
                </div>

                <div className='desktop-item' onDoubleClick={openCalculator}>
                    <img className='app-icon paint' src={CalculatorIcon} alt='Calculator' />
                    <span className='desktop-item-label'>Calculator</span>
                </div>

                <div className='desktop-item' onDoubleClick={openTerminal}>
                    <img className='app-icon paint' src={TerminalIcon} alt='Windows CMD' />
                    <span className='desktop-item-label'>Terminal</span>
                </div>

                <div className='desktop-item' onDoubleClick={() => openNotepad()}>
                    <img className='app-icon' src={NotepadIcon} alt='Notepad' />
                    <span className='desktop-item-label'>Notepad</span>
                </div>

                <div className='desktop-item' onDoubleClick={() => openFileManager(['localdisc'])}>
                    <img className='app-icon' src={FolderIcon} alt='File Manager' />
                    <span className='desktop-item-label'>My Files</span>
                </div>

                <div className='desktop-item' onDoubleClick={() => openFileManager(['recyclebin'])}>
                    <img className='app-icon bin' src={Bin} alt='Recycle Bin' />
                    <span className='desktop-item-label'>Recycle Bin</span>
                </div>
                <div className='desktop-item' onDoubleClick={() => openNotepad(README_CONTENT, 'About this project.md')}>
                    <img className='app-icon' src={NotepadIcon} alt='About this project' />
                    <span className='desktop-item-label'>About this project</span>
                </div>

                <div className='desktop-item' onDoubleClick={() => openMediaPlayer()}>
                    <img className='app-icon' src={MediaPlayerIcon} alt='Windows Media Player' />
                    <span className='desktop-item-label'>Media Player</span>
                </div>
            </div>

            {windowOrder.map(renderWindow)}

            {shutdownMode && (
                <ShutdownScreen
                    mode={shutdownMode}
                    onCancel={handleShutdownCancel}
                    onAction={handleShutdownAction}
                />
            )}

            <Footer
                handleFullscreen={handleFullscreen}
                onAppUnavailable={openError}
                globalVolume={globalVolume}
                onGlobalVolumeChange={setGlobalVolume}
                globalMuted={globalMuted}
                onGlobalMuteToggle={() => setGlobalMuted(prev => !prev)}
                onIEOpen={openIE}
                onPaintOpen={openPaint}
                onMinesweeperOpen={openMinesweeper}
                onTerminalOpen={openTerminal}
                onCalculatorOpen={openCalculator}
                onNotepadOpen={() => openNotepad()}
                onMediaPlayerOpen={openMediaPlayer}
                onLogOff={() => openShutdown('logoff')}
                onTurnOff={() => openShutdown('turnoff')}
                onFileManagerOpen={openFileManager}
                fileManagerTitle={fileManagerTitle}
                fileManagerIcon={fileManagerIcon}
                apps={([
                    {
                        id: 'minesweeper',
                        isOpen: isMinesweeperOpen,
                        isMinimized: minesweeper.isMinimized,
                        setMinimized: handleMinesweeperMinimize,
                        onOpen: openMinesweeper,
                        icon: MinesweeperIcon,
                        label: 'Minesweeper',
                    },
                    {
                        id: 'ie',
                        isOpen: isIEOpen,
                        isMinimized: ie.isMinimized,
                        setMinimized: handleIEMinimize,
                        onOpen: openIE,
                        icon: IntertExplorer,
                        label: 'Internet Explorer',
                    },
                    {
                        id: 'paint',
                        isOpen: isPaintOpen,
                        isMinimized: paint.isMinimized,
                        setMinimized: handlePaintMinimize,
                        onOpen: openPaint,
                        icon: PaintIcon,
                        label: 'Paint',
                    },
                    {
                        id: 'calculator',
                        isOpen: isCalculatorOpen,
                        isMinimized: calculator.isMinimized,
                        setMinimized: handleCalculatorMinimize,
                        onOpen: openCalculator,
                        icon: CalculatorIcon,
                        label: 'Calculator',
                    },
                    {
                        id: 'terminal',
                        isOpen: isTerminalOpen,
                        isMinimized: terminal.isMinimized,
                        setMinimized: handleTerminalMinimize,
                        onOpen: openTerminal,
                        icon: TerminalIcon,
                        label: 'Command Prompt',
                    },
                    {
                        id: 'notepad',
                        isOpen: isNotepadOpen,
                        isMinimized: notepad.isMinimized,
                        setMinimized: handleNotepadMinimize,
                        onOpen: () => openNotepad(),
                        icon: NotepadIcon,
                        label: 'Notepad',
                    },
                    {
                        id: 'filemanager',
                        isOpen: isFileManagerOpen,
                        isMinimized: filemanager.isMinimized,
                        setMinimized: handleFileManagerMinimize,
                        onOpen: () => openFileManager(),
                        icon: FolderIcon,
                        label: 'My Computer',
                    },
                    {
                        id: 'mediaplayer',
                        isOpen: isMediaPlayerOpen,
                        isMinimized: mediaplayer.isMinimized,
                        setMinimized: handleMediaPlayerMinimize,
                        onOpen: openMediaPlayer,
                        icon: MediaPlayerIcon,
                        label: 'Windows Media Player',
                    },
                ] satisfies AppState[])}
            />

            {/* Fade-to-black overlay shown during shutdown/logoff transition */}
            {isFadingOut && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: '#000',
                    opacity: 1,
                    zIndex: 99999,
                    animation: 'fadeToBlack 0.8s ease forwards',
                }} />
            )}
        </div>
    );
};

export default App;

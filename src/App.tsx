import { useState } from 'react';
import useSound from './hooks/useSound';
import useWindowState from './hooks/useWindowState';
import type { ErrorType } from './components/CriticalError';
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

import MyComputer from './img/MyComputer.webp';
import IntertExplorer from './img/InternetExplorer6.webp';
import Bin from './img/RecycleBinEmpty.webp';
import MinesweeperIcon from './img/Minesweeper.webp';
import PaintIcon from './img/Paint.webp';
import CalculatorIcon from './img/Calculator.webp';
import TerminalIcon from './img/CommandPrompt.webp';
import NotepadIcon from './img/Notepad.webp';
import FolderIcon from './img/FolderClosed.webp';

import README_CONTENT from '../README.md?raw';

import './App.css';

interface FullscreenHTMLElement extends HTMLElement {
    webkitRequestFullscreen?: () => Promise<void>;
    msRequestFullscreen?: () => Promise<void>;
}

type WindowId =
    | 'minesweeper'
    | 'ie'
    | 'paint'
    | 'calculator'
    | 'terminal'
    | 'notepad'
    | 'filemanager'
    | 'error';

const TERMINAL_APPS = [
    { name: 'Minesweeper', size: '22,960' },
    { name: 'Internet Explorer', size: '89,270' },
    { name: 'Paint', size: '80,060' },
    { name: 'Calculator', size: '15,690' },
    { name: 'Command Prompt', size: '5,290' },
    { name: 'Loading Screen', size: '9,850' },
    { name: 'Start Menu', size: '13,000' },
    { name: 'Taskbar', size: '4,020' },
    { name: 'Error Bubble', size: '600' },
    { name: 'Critical Error', size: '10,570' },
    { name: 'Notepad', size: '12,960' },
    { name: 'Shutdown Screen', size: '23,250' },
    { name: 'Shutdown Display', size: '1,160' },
    { name: 'File Manager', size: '47,220' },
];

const App = () => {
    const { playStart, playMinimize, playCriticalError, playShutDown, playLogOff } = useSound();

    const minesweeper = useWindowState();
    const ie = useWindowState();
    const paint = useWindowState();
    const calculator = useWindowState();
    const terminal = useWindowState();
    const notepad = useWindowState();
    const filemanager = useWindowState();

    const [isIEOpen, setIsIEOpen] = useState(false);
    const [isPaintOpen, setIsPaintOpen] = useState(false);
    const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
    const [isMinesweeperOpen, setIsMinesweeperOpen] = useState(false);
    const [isTerminalOpen, setIsTerminalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeError, setActiveError] = useState<ErrorType | null>(null);
    const [isNotepadOpen, setIsNotepadOpen] = useState(false);
    const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);
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
        }
    };

    // Open IE
    const openIE = () => {
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
                    isMinimized={ie.isMinimized}
                    setIsMinimized={handleIEMinimize}
                    isFullscreen={ie.isFullscreen}
                    toggleFullscreen={ie.toggleFullscreen}
                    onMouseDown={() => bringToFront('ie')}
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
                />
            );
        }

        // File Manager window
        if (id === 'filemanager' && isFileManagerOpen) {
            return (
                <FileManager
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
        <LoadingScreen onFinish={() => setLoading(false)} />
    ) : (
        <div className='app'>
            <div className='app-wrapper'>
                <a
                    href='#'
                    className='desktop-item'
                    onDoubleClick={() => openFileManager()}
                >
                    <img className='app-icon my-computer' src={MyComputer} alt='My Computer' />
                    <span className='desktop-item-label'>My Computer</span>
                </a>

                <div className='desktop-item' onDoubleClick={openIE}>
                    <img className='app-icon ie' src={IntertExplorer} alt='Internet Explorer' />
                    <span className='desktop-item-label'>Internet Explorer</span>
                </div>

                <div className='desktop-item' onDoubleClick={openMinesweeper}>
                    <img className='app-icon paint' src={MinesweeperIcon} alt='Minesweeper' />
                    <span className='desktop-item-label'>Minesweeper</span>
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
                onIEOpen={openIE}
                onPaintOpen={openPaint}
                onMinesweeperOpen={openMinesweeper}
                onTerminalOpen={openTerminal}
                onCalculatorOpen={openCalculator}
                onNotepadOpen={openNotepad}
                minesweeperMinimized={minesweeper.isMinimized}
                setMinesweeperMinimized={handleMinesweeperMinimize}
                ieMinimized={ie.isMinimized}
                setIeMinimized={handleIEMinimize}
                terminalMinimized={terminal.isMinimized}
                setTerminalMinimized={handleTerminalMinimize}
                paintMinimized={paint.isMinimized}
                setPaintMinimized={handlePaintMinimize}
                calculatorMinimized={calculator.isMinimized}
                setCalculatorMinimized={handleCalculatorMinimize}
                notepadMinimized={notepad.isMinimized}
                setNotepadMinimized={handleNotepadMinimize}
                isMinesweeperOpen={isMinesweeperOpen}
                isIEOpen={isIEOpen}
                isPaintOpen={isPaintOpen}
                isCalculatorOpen={isCalculatorOpen}
                isTerminalOpen={isTerminalOpen}
                isNotepadOpen={isNotepadOpen}
                onLogOff={() => openShutdown('logoff')}
                onTurnOff={() => openShutdown('turnoff')}
                onFileManagerOpen={openFileManager}
                filemanagerMinimized={filemanager.isMinimized}
                setFilemanagerMinimized={handleFileManagerMinimize}
                isFileManagerOpen={isFileManagerOpen}
                fileManagerTitle={fileManagerTitle}
                fileManagerIcon={fileManagerIcon}
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

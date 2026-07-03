import { useState, useEffect } from 'react';

import type { ErrorType } from './components/CriticalError';
import type { WMPTrack } from './components/mediaPlayer/types/WMPTrack';
import type { FMItem } from './components/files/data/types';
import type { Theme } from './hooks/usePlusTheme';
import type { AppState } from './components/taskbarAndStart/Footer';

import useSound from './hooks/useSound';
import useChannels from './components/volume-control/hooks/useChannels';
import useWindowState from './hooks/useWindowState';
import useIEInstances from './hooks/useIEInstance';
import useScreensaverTimer from './hooks/useScreensaverTimer';
import usePlusTheme from './hooks/usePlusTheme';
import useMinimizeHandlers from './hooks/useMinimizeHandlers';

import buildFooterApps from './utils/buildFooterApps';
import buildOpenAppHandler from './utils/buildOpenAppHandler';

import WindowRenderer from './components/WindowsRender';
import LoadingScreen from './components/XPLoading';
import LoginScreen from './components/LoginScreen';
import ShutdownScreen from './components/ShutdownScreen';
import Footer from './components/taskbarAndStart/Footer';
import ScreensaverOverlay from './components/ScreensaverOverlay';
import Desktop from './components/Desktop';
import FolderIcon from './img/FolderClosed.webp';

import README_CONTENT from '../README.md?raw';

import './App.css';

interface FullscreenHTMLElement extends HTMLElement {
    webkitRequestFullscreen?: () => Promise<void>;
    msRequestFullscreen?: () => Promise<void>;
}

type WindowId =
    | 'minesweeper'
    | 'solitaire'
    | 'paint'
    | 'calculator'
    | 'terminal'
    | 'notepad'
    | 'filemanager'
    | 'mediaplayer'
    | 'displayproperties'
    | 'error'
    | string;

const App = () => {
    
    const minesweeper = useWindowState();
    const solitaire = useWindowState();
    const paint = useWindowState();
    const keyboard = useWindowState();
    const volumecontrol = useWindowState();
    const calculator = useWindowState();
    const terminal = useWindowState();
    const notepad = useWindowState();
    const wordpad = useWindowState();
    const filemanager = useWindowState();
    const mediaplayer = useWindowState();
    const displayproperties = useWindowState();
    const plus = useWindowState();

    // const [isIEOpen, setIsIEOpen] = useState(false);
    const [isPaintOpen, setIsPaintOpen] = useState(false);
    const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
    const [isMinesweeperOpen, setIsMinesweeperOpen] = useState(false);
    const [isSolitaireOpen, setIsSolitaireOpen] = useState(false);
    const [isTerminalOpen, setIsTerminalOpen] = useState(false);   
    const [isNotepadOpen, setIsNotepadOpen] = useState(false);
    const [isWordpadOpen, setIsWordpadOpen] = useState(false);
    const [wordpadInitialContent, setWordpadInitialContent] = useState<string | undefined>(undefined);
    const [wordpadInitialFileName, setWordpadInitialFileName] = useState<string | undefined>(undefined);
    const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);
    const [isMediaPlayerOpen, setIsMediaPlayerOpen] = useState(false);
    const [isDisplayPropertiesOpen, setIsDisplayPropertiesOpen] = useState(false);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const [isVolumeControlOpen, setIsVolumeControlOpen] = useState(false);
    const [isPlusOpen, setIsPlusOpen] = useState(false);
    const [isRunOpen, setIsRunOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleStartMenu = () => setIsMenuOpen(prev => !prev);

    // const [windowOrder, setWindowOrder] = useState<WindowId[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [shutdownMode, setShutdownMode] = useState<'logoff' | 'turnoff' | null>(null);
    const [isFadingOut, setIsFadingOut] = useState(false);

    const [fileManagerInitialPath, setFileManagerInitialPath] = useState<string[]>([]);
    const [fileManagerTitle, setFileManagerTitle] = useState('My Computer');
    const [fileManagerPathKey, setFileManagerPathKey] = useState(0);
    const [fileManagerIcon, setFileManagerIcon] = useState(FolderIcon);
    const [fileManagerOpenSearch, setFileManagerOpenSearch] = useState(false);
    const [fileManagerPickerMode, setFileManagerPickerMode] = useState<'wallpaper' | 'object' | null>(null);
    const [pickedWallpaperUrl, setPickedWallpaperUrl] = useState('');
    const [pickedObjectFile, setPickedObjectFile] = useState<FMItem | null>(null);

    const [notepadInitialContent, setNotepadInitialContent] = useState<string | undefined>(undefined);
    const [notepadInitialFileName, setNotepadInitialFileName] = useState<string | undefined>(undefined);
    const [wmpTracks, setWmpTracks] = useState<WMPTrack[]>([]);
    const [wmpStartIndex, setWmpStartIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [activeError, setActiveError] = useState<ErrorType | null>(null);
    const [globalVolume, setGlobalVolume] = useState(1);
    const [globalMuted, setGlobalMuted] = useState(false);
 
    // IE Multi Screen View
    const [windowOrder, setWindowOrder] = useState<string[]>([]);

    // Other
    const [theme, setTheme] = useState<Theme>(() =>
        (localStorage.getItem('xp-theme') as Theme) ?? 'luna'
    );
    const [wallpaper, setWallpaper] = useState(() =>
        localStorage.getItem('xp-wallpaper') ?? `${import.meta.env.BASE_URL}WINDOWS/Web/Wallpaper/Bliss.webp`
    );
    // the user can intentionally desaturate to B&W.
    const [bgColor, setBgColor] = useState(() =>
        localStorage.getItem('xp-bg-color') ?? ''
    );
    const [bgPosition, setBgPosition] = useState(() =>
        localStorage.getItem('xp-bg-position') ?? 'Stretch'
    );
 
    // Screensaver
    const [screensaverName, setScreensaverName] = useState('');      // '' = none
    const [screensaverWait, setScreensaverWait] = useState(1);      // minutes
    const [screensaverActive, setScreensaverActive] = useState(false);

       // Sounds
    const { channels, setChannel, system, cd } = useChannels(globalVolume, globalMuted);
    const sounds = useSound(system.volume, system.muted);   

    // Color Theme
    useEffect(() => {
        document.body.dataset.theme = theme;
        localStorage.setItem('xp-theme', theme);
    }, [theme]);

    // PLus Theme
    const { plusTheme, cursorTheme, binIcon, setPlusThemeWithCursor, playStart, playMinimize, playCriticalError, playShutDown, playLogOff } =
        usePlusTheme({ sounds, onThemeChange: setTheme });
    
    
    // Wallpapers
    useEffect(() => {
        localStorage.setItem('xp-wallpaper', wallpaper);
        localStorage.setItem('xp-bg-color', bgColor);
        localStorage.setItem('xp-bg-position', bgPosition);
    }, [wallpaper, bgColor, bgPosition]);

    // Screensaver
    useScreensaverTimer({ screensaverName, screensaverWait, screensaverActive, setScreensaverActive });
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

        // IE Instance
    const { ieInstances, openIE, minimizeIE, handleIETitleChange, handleIEFaviconChange, onCloseIE } =
    useIEInstances({ playStart, playMinimize, bringToFront, removeFromOrder });

    /*** MINIMIZE HANDLERS ***/
   const {
        handleMinesweeperMinimize,
        handleSolitaireMinimize,
        handlePaintMinimize,
        handleCalculatorMinimize,
        handleTerminalMinimize,
        handleNotepadMinimize,
        handleWordpadMinimize,
        handleFileManagerMinimize,
        handleMediaPlayerMinimize,
        handleDisplayPropertiesMinimize,
        handleKeyboardMinimize,
        handleVolumeControlMinimize,
        handlePlusMinimize,
    } = useMinimizeHandlers({
        playStart, playMinimize,
        minesweeper, solitaire, paint, calculator, terminal, notepad, wordpad,
        filemanager, mediaplayer, displayproperties, keyboard, volumecontrol, plus,
    });

    /*** OPEN HANDLERS ***/
    // Handle Open
    const makeOpenHandler = (
        isOpen: boolean,
        setIsOpen: (v: boolean) => void,
        isMinimized: boolean,
        handleMinimize: (v: boolean) => void,
        windowId: WindowId
    ) => () => {
        if (!isOpen) {
            playStart();
            setIsOpen(true);
        } else if (isMinimized) {
            handleMinimize(false);
        }
        bringToFront(windowId);
    };


    // Open Minesweeper
    const openMinesweeper = makeOpenHandler(isMinesweeperOpen,
        setIsMinesweeperOpen,
        minesweeper.isMinimized,
        handleMinesweeperMinimize,
        'minesweeper'
    );

    // Open Solitaire
    const openSolitaire = makeOpenHandler(isSolitaireOpen,
        setIsSolitaireOpen,
        solitaire.isMinimized,
        handleSolitaireMinimize,
        'solitaire'
    );

    // Open Paint
    const openPaint = makeOpenHandler(isPaintOpen,
        setIsPaintOpen,
        paint.isMinimized,
        handlePaintMinimize,
        'paint'
    );

    // Open Calculator
    const openCalculator = makeOpenHandler(isCalculatorOpen,
        setIsCalculatorOpen,
        calculator.isMinimized,
        handleCalculatorMinimize,
        'calculator'
    );

    // Open Terminal
    const openTerminal = makeOpenHandler(isTerminalOpen,
        setIsTerminalOpen,
        terminal.isMinimized,
        handleTerminalMinimize,
        'terminal'
    );

    // Open Wordpad
    const openWordpad = (content?: string, fileName?: string) => {
        setWordpadInitialContent(content);
        setWordpadInitialFileName(fileName);
        if (!isWordpadOpen) {
            playStart();
            setIsWordpadOpen(true);
        } else if (wordpad.isMinimized) {
            handleWordpadMinimize(false);
        }
        bringToFront('wordpad');
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
    const openFileManager = (initialPath: string[] = [], openSearch: boolean = false) => {
        setFileManagerInitialPath(initialPath);
        setFileManagerOpenSearch(openSearch);
        setFileManagerPickerMode(null);
        setFileManagerPathKey(prev => prev + 1);
        if (!isFileManagerOpen) {
            playStart();
            setIsFileManagerOpen(true);
        } else if (filemanager.isMinimized) {
            handleFileManagerMinimize(false);
        }
        bringToFront('filemanager');
    };

    // Open File Manager as a wallpaper picker (Display Properties → Browse).
    // Starts in My Pictures, only image files can be picked, and a pick closes
    const openFileManagerForWallpaperPick = () => {
        setFileManagerInitialPath(['localdisc', 'c-documents', 'c-admin', 'pictures']);
        setFileManagerOpenSearch(false);
        setFileManagerPickerMode('wallpaper');
        setFileManagerPathKey(prev => prev + 1);
        if (!isFileManagerOpen) {
            playStart();
            setIsFileManagerOpen(true);
        } else if (filemanager.isMinimized) {
            handleFileManagerMinimize(false);
        }
        bringToFront('filemanager');
    };

    const handleWallpaperPicked = (url: string) => {
        // The desktop wallpaper itself flips when the user hits Apply or OK.
        setPickedWallpaperUrl(url);
        setFileManagerPickerMode(null);
        setIsFileManagerOpen(false);
        removeFromOrder('filemanager');
    };

    // Open File Manager as a object picker
    // Starts in users Alena
    const openFileManagerForObjectPick = () => {
        setFileManagerInitialPath(['localdisc', 'c-documents', 'c-admin']);
        setFileManagerOpenSearch(false);
        setFileManagerPickerMode('object');
        setFileManagerPathKey(prev => prev + 1);
        if (!isFileManagerOpen) {
            playStart();
            setIsFileManagerOpen(true);
        } else if (filemanager.isMinimized) {
            handleFileManagerMinimize(false);
        }
        bringToFront('filemanager');
    };

    const handleObjectPicked = (item: FMItem) => {
        setPickedObjectFile(item);
        setFileManagerPickerMode(null);
        setIsFileManagerOpen(false);
        removeFromOrder('filemanager');
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

    // Open Display Properties
    const [displayPropertiesInitialTab, setDisplayPropertiesInitialTab] = useState<'Themes' | 'Desktop' | 'Screen Saver' | 'Appearance' | 'Settings' | undefined>(undefined);
    const [displayPropertiesOpenKey, setDisplayPropertiesOpenKey] = useState(0);

    const [displayPropertiesInitialPlusTheme, setDisplayPropertiesInitialPlusTheme] = useState<'aquarium' | 'davinci' | 'nature' | 'space' | undefined>(undefined);
    const [displayPropertiesInitialScreensaver, setDisplayPropertiesInitialScreensaver] = useState<string | undefined>(undefined);

    const openDisplayProperties = (
        tab?: 'Themes' | 'Desktop' | 'Screen Saver' | 'Appearance' | 'Settings',
        options?: { plusTheme?: 'aquarium' | 'davinci' | 'nature' | 'space'; screensaver?: string }
    ) => {
        setDisplayPropertiesInitialTab(tab);
        setDisplayPropertiesInitialPlusTheme(options?.plusTheme);
        setDisplayPropertiesInitialScreensaver(options?.screensaver);
        if (tab) setDisplayPropertiesOpenKey(k => k + 1);
        else if (!isDisplayPropertiesOpen) setDisplayPropertiesOpenKey(k => k + 1);
        makeOpenHandler(isDisplayPropertiesOpen, setIsDisplayPropertiesOpen, displayproperties.isMinimized, handleDisplayPropertiesMinimize, 'displayproperties')();
    };

    // Open Keyboard
    const openKeyboard = makeOpenHandler(isKeyboardOpen,
        setIsKeyboardOpen,
        keyboard.isMinimized,
        handleKeyboardMinimize,
        'keyboard'
    );

    const openVolumeControl = makeOpenHandler(isVolumeControlOpen, setIsVolumeControlOpen, volumecontrol.isMinimized, handleVolumeControlMinimize, 'volumecontrol');
    const openPlus = makeOpenHandler(isPlusOpen, setIsPlusOpen, plus.isMinimized, handlePlusMinimize, 'plus');

    const openRun = () => { setIsRunOpen(true); bringToFront('run'); playStart(); };

    // Open app by desktop item id
    const handleOpenApp = buildOpenAppHandler({
        openMinesweeper, openIE, openPaint, openNotepad, openFileManager,
        openCalculator, openTerminal, openMediaPlayer, openSolitaire,
        openDisplayProperties, openKeyboard, readmeContent: README_CONTENT,
    });

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

    
    /*** FOOTER APPS ***/
    const footerApps: AppState[] = buildFooterApps({
        isMinesweeperOpen, minesweeperIsMinimized: minesweeper.isMinimized, handleMinesweeperMinimize, openMinesweeper,
        isSolitaireOpen, solitaireIsMinimized: solitaire.isMinimized, handleSolitaireMinimize, openSolitaire,
        ieInstances, minimizeIE,
        isPaintOpen, paintIsMinimized: paint.isMinimized, handlePaintMinimize, openPaint,
        isCalculatorOpen, calculatorIsMinimized: calculator.isMinimized, handleCalculatorMinimize, openCalculator,
        isTerminalOpen, terminalIsMinimized: terminal.isMinimized, handleTerminalMinimize, openTerminal,
        isNotepadOpen, notepadIsMinimized: notepad.isMinimized, handleNotepadMinimize, openNotepad,
        isWordpadOpen, wordpadIsMinimized: wordpad.isMinimized, handleWordpadMinimize, openWordpad,
        isFileManagerOpen, filemanagerIsMinimized: filemanager.isMinimized, handleFileManagerMinimize, bringToFront,
        isMediaPlayerOpen, mediaplayerIsMinimized: mediaplayer.isMinimized, handleMediaPlayerMinimize, openMediaPlayer,
        isDisplayPropertiesOpen, displaypropertiesIsMinimized: displayproperties.isMinimized, handleDisplayPropertiesMinimize, openDisplayProperties,
        isKeyboardOpen, keyboardIsMinimized: keyboard.isMinimized, handleKeyboardMinimize, openKeyboard,
        isVolumeControlOpen, volumecontrolIsMinimized: volumecontrol.isMinimized, handleVolumeControlMinimize, openVolumeControl,
        isPlusOpen, plusIsMinimized: plus.isMinimized, handlePlusMinimize, openPlus,
    });

    /*** WINDOW RENDERING ***/

    // Topmost id in z-order is the active window; everything else is inactive.
    const activeWindowId = windowOrder[windowOrder.length - 1];

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
            <div
                className='desktop-background'
                style={{
                    backgroundImage: wallpaper ? `url(${wallpaper})` : 'none',
                    backgroundSize:
                        bgPosition === 'Stretch' ? 'cover' :
                        bgPosition === 'Tile' ? 'auto' :
                        'auto',
                    backgroundRepeat: bgPosition === 'Tile' ? 'repeat' : 'no-repeat',
                    backgroundPosition: 'center',
                }}
            />
           
            <Desktop
                binIcon={binIcon}
                openFileManager={openFileManager}
                openIE={openIE}
                openMinesweeper={openMinesweeper}
                openSolitaire={openSolitaire}
                openPaint={openPaint}
                openCalculator={openCalculator}
                openTerminal={openTerminal}
                openPlus={openPlus}
                openNotepad={openNotepad}
                openWordpad={openWordpad}
                openMediaPlayer={openMediaPlayer}
                openDisplayProperties={openDisplayProperties}
                openKeyboard={openKeyboard}
                readmeContent={README_CONTENT}
            />

            {(() => {
                if (!bgColor) return null;
                const norm = (bgColor.replace('#', '').toLowerCase());
                const full = norm.length === 3
                    ? norm.split('').map(c => c + c).join('')
                    : norm;
                // Only render the overlay for pure black, pure white, or any
                // chromatic colour.
                const r = full.slice(0, 2);
                const g = full.slice(2, 4);
                const b = full.slice(4, 6);
                const isBlackOrWhite = full === '000000' || full === 'ffffff';
                const isMidGray = r === g && g === b && !isBlackOrWhite;
                if (isMidGray) return null;
                return (
                    <div
                        className='desktop-color-overlay'
                        style={{ backgroundColor: bgColor }}
                    />
                );
            })()}

            <WindowRenderer
                windowOrder={windowOrder}
                activeWindowId={activeWindowId}

                isMinesweeperOpen={isMinesweeperOpen}
                isSolitaireOpen={isSolitaireOpen}
                isPaintOpen={isPaintOpen}
                isCalculatorOpen={isCalculatorOpen}
                isTerminalOpen={isTerminalOpen}
                isNotepadOpen={isNotepadOpen}
                isWordpadOpen={isWordpadOpen}
                isFileManagerOpen={isFileManagerOpen}
                isMediaPlayerOpen={isMediaPlayerOpen}
                isDisplayPropertiesOpen={isDisplayPropertiesOpen}
                isKeyboardOpen={isKeyboardOpen}
                isVolumeControlOpen={isVolumeControlOpen}
                isPlusOpen={isPlusOpen}

                activeError={activeError}
                minesweeper={minesweeper}
                solitaire={solitaire}
                paint={paint}
                calculator={calculator}
                terminal={terminal}
                notepad={notepad}
                wordpad={wordpad}
                filemanager={filemanager}
                mediaplayer={mediaplayer}
                displayproperties={displayproperties}
                keyboard={keyboard}
                volumecontrol={volumecontrol}
                plus={plus}
                onPlusThemeChange={setPlusThemeWithCursor}
                displayPropertiesInitialPlusTheme={displayPropertiesInitialPlusTheme}
                displayPropertiesInitialScreensaver={displayPropertiesInitialScreensaver}

                ieInstances={ieInstances}
                pickedObjectFile={pickedObjectFile}
                onObjectFileConsumed={() => setPickedObjectFile(null)}

                handleMinesweeperMinimize={handleMinesweeperMinimize}
                handleSolitaireMinimize={handleSolitaireMinimize}
                handlePaintMinimize={handlePaintMinimize}
                handleCalculatorMinimize={handleCalculatorMinimize}
                handleTerminalMinimize={handleTerminalMinimize}
                handleNotepadMinimize={handleNotepadMinimize}
                handleWordpadMinimize={handleWordpadMinimize}
                handleFileManagerMinimize={handleFileManagerMinimize}
                handleMediaPlayerMinimize={handleMediaPlayerMinimize}
                handleDisplayPropertiesMinimize={handleDisplayPropertiesMinimize}
                handleKeyboardMinimize={handleKeyboardMinimize}
                handleVolumeControlMinimize={handleVolumeControlMinimize}
                handlePlusMinimize={handlePlusMinimize}
                minimizeIE={minimizeIE}
                onCloseIE={onCloseIE}

                onCloseMinesweeper={() => { playMinimize(); setIsMinesweeperOpen(false); removeFromOrder('minesweeper'); }}
                onCloseSolitaire={() => { playMinimize(); setIsSolitaireOpen(false); removeFromOrder('solitaire'); }}
                onClosePaint={() => { playMinimize(); setIsPaintOpen(false); removeFromOrder('paint'); }}
                onCloseCalculator={() => { playMinimize(); setIsCalculatorOpen(false); removeFromOrder('calculator'); }}
                onCloseTerminal={() => { playMinimize(); setIsTerminalOpen(false); removeFromOrder('terminal'); }}
                onCloseNotepad={() => { playMinimize(); setIsNotepadOpen(false); removeFromOrder('notepad'); }}
                onCloseWordpad={() => { playMinimize(); setIsWordpadOpen(false); removeFromOrder('wordpad'); }}
                onCloseFileManager={() => { playMinimize(); setIsFileManagerOpen(false); removeFromOrder('filemanager'); }}
                onCloseMediaPlayer={() => { playMinimize(); setIsMediaPlayerOpen(false); removeFromOrder('mediaplayer'); }}
                onCloseDisplayProperties={() => { playMinimize(); setIsDisplayPropertiesOpen(false); removeFromOrder('displayproperties'); }}
                onCloseKeyboard={() => { playMinimize(); setIsKeyboardOpen(false); removeFromOrder('keyboard'); }}
                onCloseVolumeControl={() => { playMinimize(); setIsVolumeControlOpen(false); removeFromOrder('volumecontrol'); }}
                onClosePlus={() => { playMinimize(); setIsPlusOpen(false); removeFromOrder('plus'); }}
                openStartMenu={toggleStartMenu}
                isRunOpen={isRunOpen}
                onCloseRun={() => { setIsRunOpen(false); removeFromOrder('run'); }}
                openCalculator={openCalculator}
                openKeyboard={openKeyboard}
                openDisplayProperties={openDisplayProperties}
                openVolumeControl={openVolumeControl}
                displayPropertiesInitialTab={displayPropertiesInitialTab}
                displayPropertiesOpenKey={displayPropertiesOpenKey}
                openFileManager={openFileManager}
                openFileManagerForObjectPick={openFileManagerForObjectPick}
                openIE={openIE}
                openMediaPlayer={openMediaPlayer}
                openMinesweeper={openMinesweeper}
                openNotepad={openNotepad}
                openPaint={openPaint}
                openSolitaire={openSolitaire}
                openTerminal={openTerminal}
                onCloseError={() => { setActiveError(null); removeFromOrder('error'); }}
                onError={openError}
              
                bringToFront={bringToFront}
                notepadInitialContent={notepadInitialContent}
                notepadInitialFileName={notepadInitialFileName}
                wordpadInitialContent={wordpadInitialContent}
                wordpadInitialFileName={wordpadInitialFileName}

                fileManagerInitialPath={fileManagerInitialPath}
                fileManagerPathKey={fileManagerPathKey}
                fileManagerOpenSearch={fileManagerOpenSearch}
                fileManagerPickerMode={fileManagerPickerMode}
                onFileManagerTitleChange={(name, icon) => { setFileManagerTitle(name); setFileManagerIcon(icon); }}
                onFilePicked={handleWallpaperPicked}
                onObjectPicked={handleObjectPicked}

                wmpTracks={wmpTracks}
                wmpStartIndex={wmpStartIndex}

                bgPosition={bgPosition}
                bgColor={bgColor}
                pendingWallpaperUrl={pickedWallpaperUrl}
                screensaverName={screensaverName}
                screensaverWait={screensaverWait}
                theme={theme}
                onWallpaperChange={setWallpaper}
                onPositionChange={setBgPosition}
                onColorChange={setBgColor}
                onPendingWallpaperConsumed={() => setPickedWallpaperUrl('')}
                onScreensaverChange={setScreensaverName}
                onScreensaverWaitChange={setScreensaverWait}
                onScreensaverPreview={() => setScreensaverActive(true)}
                onThemeChange={setTheme}
                plusTheme={plusTheme}
                
                onBrowse={openFileManagerForWallpaperPick}
                wallpaper={wallpaper}

                openFileManagerForWallpaperPick={openFileManagerForWallpaperPick}

                globalVolume={globalVolume}
                globalMuted={globalMuted}
                onGlobalVolumeChange={setGlobalVolume}
                onGlobalMuteToggle={() => setGlobalMuted(prev => !prev)}
                onOpenApp={handleOpenApp}
                onIETitleChange={handleIETitleChange}
                onIEFaviconChange={handleIEFaviconChange}
                playMinimize={playMinimize}
                playStart={playStart}
                channels={channels}
                setChannel={setChannel}
                cd={cd}
            />

            {shutdownMode && (
                <ShutdownScreen
                    mode={shutdownMode}
                    onCancel={handleShutdownCancel}
                    onAction={handleShutdownAction}
                />
            )}

            <Footer
                activeWindowId={activeWindowId}
                bringToFront={bringToFront}
                handleFullscreen={handleFullscreen}
                onAppUnavailable={openError}
                globalVolume={globalVolume}
                onGlobalVolumeChange={setGlobalVolume}
                globalMuted={globalMuted}
                onGlobalMuteToggle={() => setGlobalMuted(prev => !prev)}
                onIEOpen={openIE}
                onPaintOpen={openPaint}
                onMinesweeperOpen={openMinesweeper}
                onSolitaireOpen={openSolitaire}
                onTerminalOpen={openTerminal}
                onCalculatorOpen={openCalculator}
                onNotepadOpen={() => openNotepad()}
                onWordpadOpen={() => openWordpad()}
                onMediaPlayerOpen={openMediaPlayer}
                onDisplayPropertiesOpen={openDisplayProperties}
                onKeyboardOpen={openKeyboard}
                onVolumeControlOpen={openVolumeControl}
                onPlusOpen={openPlus}
                onRunOpen={openRun}
                onLogOff={() => openShutdown('logoff')}
                onTurnOff={() => openShutdown('turnoff')}
                onFileManagerOpen={openFileManager}
                fileManagerTitle={fileManagerTitle}
                fileManagerIcon={fileManagerIcon}
                apps={footerApps}
                onOpenRecentDoc={(doc) => {
                    if (doc.type === 'txt') openNotepad(doc.content ?? '', doc.name);
                    else if (doc.type === 'mp3') openFileManager(['localdisc', 'c-documents', 'c-admin', 'music']);
                    else if (doc.type === 'image') openFileManager(['localdisc', 'c-documents', 'c-admin', 'pictures']);
                }}
                plusTheme={plusTheme}
                binIcon={binIcon}
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
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

            {/* Screensaver */}
            {screensaverActive && screensaverName && (
                <ScreensaverOverlay
                    screensaverName={screensaverName}
                    onDismiss={() => setScreensaverActive(false)}
                    globalVolume={globalVolume}
                    globalMuted={globalMuted}
                />
            )}
        </div>
    );
};

export default App;

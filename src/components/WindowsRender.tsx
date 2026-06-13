import Game from './minesweeper/Game';
import Solitaire from './solitaire/Solitaire';
import Paint from './Paint/Paint';
import IEWindow from './IE/IEWindow';
import Calculator from './Calculator/Calculator';
import Terminal from './Terminal/Terminal';
import Notepad from './notepad/Notepad';
import FileManager from './files/FileManager';
import MediaPlayer from './mediaPlayer/MediaPlayer';
import DisplayProperties from './display-properties/DisplayProperties';
import CriticalError from './CriticalError';
import Run from './runDialog/Run';

import type { ErrorType } from './CriticalError';
import type { WMPTrack } from './mediaPlayer/types/WMPTrack';
import { TERMINAL_APPS } from '../data/appData';

type Theme = 'luna' | 'homestead' | 'silver';

type IEInstance = {
    id: string;
    url?: string;
    isMinimized: boolean;
    isFullscreen: boolean;
    title: string;
    favicon: string;
};

type WindowState = {
    isMinimized: boolean;
    isFullscreen: boolean;
    setIsMinimized: (v: boolean) => void;
    toggleFullscreen: () => void;
};

interface WindowRendererProps {
    windowOrder: string[];
    activeWindowId: string | undefined;

    // Per-window open flags
    isMinesweeperOpen: boolean;
    isSolitaireOpen: boolean;
    isPaintOpen: boolean;
    isCalculatorOpen: boolean;
    isTerminalOpen: boolean;
    isNotepadOpen: boolean;
    isFileManagerOpen: boolean;
    isMediaPlayerOpen: boolean;
    isDisplayPropertiesOpen: boolean;
    isRunOpen: boolean;
    activeError: ErrorType | null;

    // Window states
    minesweeper: WindowState;
    solitaire: WindowState;
    paint: WindowState;
    calculator: WindowState;
    terminal: WindowState;
    notepad: WindowState;
    filemanager: WindowState;
    mediaplayer: WindowState;
    displayproperties: WindowState;

    // IE
    ieInstances: IEInstance[];

    // Minimize handlers
    handleMinesweeperMinimize: (v: boolean | ((p: boolean) => boolean)) => void;
    handleSolitaireMinimize: (v: boolean | ((p: boolean) => boolean)) => void;
    handlePaintMinimize: (v: boolean | ((p: boolean) => boolean)) => void;
    handleCalculatorMinimize: (v: boolean | ((p: boolean) => boolean)) => void;
    handleTerminalMinimize: (v: boolean | ((p: boolean) => boolean)) => void;
    handleNotepadMinimize: (v: boolean | ((p: boolean) => boolean)) => void;
    handleFileManagerMinimize: (v: boolean | ((p: boolean) => boolean)) => void;
    handleMediaPlayerMinimize: (v: boolean | ((p: boolean) => boolean)) => void;
    handleDisplayPropertiesMinimize: (v: boolean | ((p: boolean) => boolean)) => void;
    minimizeIE: (id: string, v: boolean | ((p: boolean) => boolean)) => void;

    // Close handlers
    onCloseMinesweeper: () => void;
    onCloseSolitaire: () => void;
    onClosePaint: () => void;
    onCloseCalculator: () => void;
    onCloseTerminal: () => void;
    onCloseNotepad: () => void;
    onCloseFileManager: () => void;
    onCloseMediaPlayer: () => void;
    onCloseDisplayProperties: () => void;
    onCloseRun: () => void;
    openCalculator: () => void;
    openDisplayProperties: (tab?: 'Themes' | 'Desktop' | 'Screen Saver' | 'Appearance' | 'Settings') => void;
    displayPropertiesInitialTab?: 'Themes' | 'Desktop' | 'Screen Saver' | 'Appearance' | 'Settings';
    openMinesweeper: () => void;
    openPaint: () => void;
    openSolitaire: () => void;
    openTerminal: () => void;
    onCloseIE: (id: string) => void;
    onCloseError: () => void;

    // bringToFront
    bringToFront: (id: string) => void;

    // Notepad
    notepadInitialContent: string | undefined;
    notepadInitialFileName: string | undefined;

    // FileManager
    fileManagerInitialPath: string[];
    fileManagerPathKey: number;
    fileManagerOpenSearch: boolean;
    fileManagerPickerMode: 'wallpaper' | null;
    onFileManagerTitleChange: (name: string, icon: string) => void;
    onFilePicked: (url: string) => void;

    // MediaPlayer
    wmpTracks: WMPTrack[];
    wmpStartIndex: number;

    // DisplayProperties
    wallpaper: string;
    bgPosition: string;
    bgColor: string;
    pendingWallpaperUrl: string;
    screensaverName: string;
    screensaverWait: number;
    theme: Theme;
    onWallpaperChange: (v: string) => void;
    onPositionChange: (v: string) => void;
    onColorChange: (v: string) => void;
    onPendingWallpaperConsumed: () => void;
    onScreensaverChange: (v: string) => void;
    onScreensaverWaitChange: (v: number) => void;
    onThemeChange: (v: Theme) => void;
    onBrowse: () => void;

    // Callbacks that open other windows
    openIE: (url?: string) => void;
    openNotepad: (content?: string, fileName?: string) => void;
    openFileManager: (path?: string[], openSearch?: boolean) => void;
    openMediaPlayer: (tracks?: WMPTrack[], startIndex?: number) => void;
    openFileManagerForWallpaperPick: () => void;

    // Sound
    playMinimize: () => void;
    playStart: () => void;

    // Global audio
    globalVolume: number;
    globalMuted: boolean;

    // Open handlers (needed for taskbar restore from FileManager/IE)
    onOpenApp: (id: string) => void;

    // IE title/favicon callbacks
    onIETitleChange: (id: string, title: string) => void;
    onIEFaviconChange: (id: string, favicon: string) => void;
}

const WindowRenderer = ({
    windowOrder,
    activeWindowId,
    isMinesweeperOpen,
    isSolitaireOpen,
    isPaintOpen,
    isCalculatorOpen,
    isTerminalOpen,
    isNotepadOpen,
    isFileManagerOpen,
    isMediaPlayerOpen,
    isDisplayPropertiesOpen,
    isRunOpen,
    activeError,
    minesweeper,
    solitaire,
    paint,
    calculator,
    terminal,
    notepad,
    filemanager,
    mediaplayer,
    displayproperties,
    ieInstances,
    handleMinesweeperMinimize,
    handleSolitaireMinimize,
    handlePaintMinimize,
    handleCalculatorMinimize,
    handleTerminalMinimize,
    handleNotepadMinimize,
    handleFileManagerMinimize,
    handleMediaPlayerMinimize,
    handleDisplayPropertiesMinimize,
    minimizeIE,
    onCloseMinesweeper,
    onCloseSolitaire,
    onClosePaint,
    onCloseCalculator,
    onCloseTerminal,
    onCloseNotepad,
    onCloseFileManager,
    onCloseMediaPlayer,
    onCloseDisplayProperties,
    onCloseRun,
    openCalculator,
    openDisplayProperties,
    displayPropertiesInitialTab,
    openFileManager,
    openIE,
    openMediaPlayer,
    openMinesweeper,
    openNotepad,
    openPaint,
    openSolitaire,
    openTerminal,
    onCloseIE,
    onCloseError,
    bringToFront,
    notepadInitialContent,
    notepadInitialFileName,
    fileManagerInitialPath,
    fileManagerPathKey,
    fileManagerOpenSearch,
    fileManagerPickerMode,
    onFileManagerTitleChange,
    onFilePicked,
    wmpTracks,
    wmpStartIndex,
    bgPosition,
    bgColor,
    pendingWallpaperUrl,
    screensaverName,
    screensaverWait,
    theme,
    onWallpaperChange,
    onPositionChange,
    onColorChange,
    onPendingWallpaperConsumed,
    onScreensaverChange,
    onScreensaverWaitChange,
    onThemeChange,
    onBrowse,
    globalVolume,
    globalMuted,
    onOpenApp,
    onIETitleChange,
    onIEFaviconChange,
}: WindowRendererProps) => {

    const renderWindow = (id: string) => {
        const isActive = id === activeWindowId;

        if (id === 'minesweeper' && isMinesweeperOpen) return (
            <Game
                key='minesweeper'
                onClose={onCloseMinesweeper}
                isMinimized={minesweeper.isMinimized}
                isFullscreen={minesweeper.isFullscreen}
                setIsMinimized={handleMinesweeperMinimize}
                setIsFullscreen={minesweeper.toggleFullscreen}
                onMouseDown={() => bringToFront('minesweeper')}
                isActive={isActive}
                globalVolume={globalVolume}
                globalMuted={globalMuted}
            />
        );

        if (id === 'solitaire' && isSolitaireOpen) return (
            <Solitaire
                key='solitaire'
                onClose={onCloseSolitaire}
                isMinimized={solitaire.isMinimized}
                isFullscreen={solitaire.isFullscreen}
                setIsMinimized={handleSolitaireMinimize}
                setIsFullscreen={solitaire.toggleFullscreen}
                onMouseDown={() => bringToFront('solitaire')}
                isActive={isActive}
                globalVolume={globalVolume}
                globalMuted={globalMuted}
            />
        );

        if (id.startsWith('ie-')) {
            const instance = ieInstances.find(w => w.id === id);
            if (!instance) return null;
            return (
                <IEWindow
                    key={id}
                    onClose={() => onCloseIE(id)}
                    onOpenFM={() => openFileManager(['localdisc', 'c-windows', 'c-windows-offline'])}
                    isMinimized={instance.isMinimized}
                    setIsMinimized={(value) => minimizeIE(id, value)}
                    isFullscreen={instance.isFullscreen}
                    toggleFullscreen={() => {}}
                    onMouseDown={() => bringToFront(id)}
                    isActive={isActive}
                    initialUrl={instance.url}
                    globalVolume={globalVolume}
                    globalMuted={globalMuted}
                    onOpenNotepad={openNotepad}
                    onNewWindow={openIE}
                    onTitleChange={(title) => onIETitleChange(id, title)}
                    onFaviconChange={(favicon) => onIEFaviconChange(id, favicon)}
                />
            );
        }

        if (id === 'paint' && isPaintOpen) return (
            <Paint
                key='paint'
                onClose={onClosePaint}
                isMinimized={paint.isMinimized}
                setIsMinimized={handlePaintMinimize}
                isFullscreen={paint.isFullscreen}
                setIsFullscreen={paint.toggleFullscreen}
                onMouseDown={() => bringToFront('paint')}
                isActive={isActive}
                globalVolume={globalVolume}
                globalMuted={globalMuted}
            />
        );

        if (id === 'calculator' && isCalculatorOpen) return (
            <Calculator
                key='calculator'
                onClose={onCloseCalculator}
                isMinimized={calculator.isMinimized}
                setIsMinimized={handleCalculatorMinimize}
                isFullscreen={calculator.isFullscreen}
                toggleFullscreen={calculator.toggleFullscreen}
                onMouseDown={() => bringToFront('calculator')}
                isActive={isActive}
                globalVolume={globalVolume}
                globalMuted={globalMuted}
            />
        );

        if (id === 'terminal' && isTerminalOpen) return (
            <Terminal
                key='terminal'
                onClose={onCloseTerminal}
                isMinimized={terminal.isMinimized}
                setIsMinimized={handleTerminalMinimize}
                isFullscreen={terminal.isFullscreen}
                toggleFullscreen={terminal.toggleFullscreen}
                onMouseDown={() => bringToFront('terminal')}
                isActive={isActive}
                apps={TERMINAL_APPS}
            />
        );

        if (id === 'notepad' && isNotepadOpen) return (
            <Notepad
                key='notepad'
                onClose={onCloseNotepad}
                isMinimized={notepad.isMinimized}
                setIsMinimized={handleNotepadMinimize}
                isFullscreen={notepad.isFullscreen}
                toggleFullscreen={notepad.toggleFullscreen}
                onMouseDown={() => bringToFront('notepad')}
                isActive={isActive}
                initialContent={notepadInitialContent}
                initialFileName={notepadInitialFileName}
                globalVolume={globalVolume}
                globalMuted={globalMuted}
                onOpenFM={() => openFileManager()}
            />
        );

        if (id === 'filemanager' && isFileManagerOpen) return (
            <FileManager
                key='filemanager'
                initialPath={fileManagerInitialPath}
                onClose={onCloseFileManager}
                isMinimized={filemanager.isMinimized}
                setIsMinimized={handleFileManagerMinimize}
                isFullscreen={filemanager.isFullscreen}
                setIsFullscreen={filemanager.toggleFullscreen}
                onMouseDown={() => bringToFront('filemanager')}
                isActive={isActive}
                onOpenApp={onOpenApp}
                onTitleChange={onFileManagerTitleChange}
                pathKey={fileManagerPathKey}
                onOpenIE={openIE}
                onOpenNotepad={openNotepad}
                apps={TERMINAL_APPS}
                onOpenWMP={(tracks, startIndex) => openMediaPlayer(tracks, startIndex)}
                globalVolume={globalVolume}
                globalMuted={globalMuted}
                openSearch={fileManagerOpenSearch}
                pickerMode={fileManagerPickerMode}
                onFilePicked={onFilePicked}
                onOpenDisplayProperties={openDisplayProperties}
            />
        );

        if (id === 'mediaplayer' && isMediaPlayerOpen) return (
            <MediaPlayer
                key='mediaplayer'
                onClose={onCloseMediaPlayer}
                isMinimized={mediaplayer.isMinimized}
                setIsMinimized={handleMediaPlayerMinimize}
                isFullscreen={mediaplayer.isFullscreen}
                setIsFullscreen={mediaplayer.toggleFullscreen}
                onMouseDown={() => bringToFront('mediaplayer')}
                isActive={isActive}
                tracks={wmpTracks}
                startIndex={wmpStartIndex}
                onOpenFM={() => openFileManager(['localdisc', 'c-documents', 'c-admin', 'music'])}
                globalVolume={globalVolume}
                globalMuted={globalMuted}
            />
        );

        if (id === 'displayproperties' && isDisplayPropertiesOpen) return (
            <DisplayProperties
                key={`displayproperties-${displayPropertiesInitialTab ?? 'Themes'}`}
                onClose={onCloseDisplayProperties}
                isMinimized={displayproperties.isMinimized}
                setIsMinimized={handleDisplayPropertiesMinimize}
                onMouseDown={() => bringToFront('displayproperties')}
                isActive={isActive}
                onWallpaperChange={onWallpaperChange}
                onPositionChange={onPositionChange}
                onColorChange={onColorChange}
                currentPosition={bgPosition}
                currentColor={bgColor}
                onBrowse={onBrowse}
                pendingWallpaperUrl={pendingWallpaperUrl}
                onPendingWallpaperConsumed={onPendingWallpaperConsumed}
                screensaverSetting={screensaverName}
                screensaverWait={screensaverWait}
                onScreensaverChange={onScreensaverChange}
                onScreensaverWaitChange={onScreensaverWaitChange}
                currentTheme={theme}
                onThemeChange={onThemeChange}
                initialTab={displayPropertiesInitialTab}
            />
        );

        if (id === 'run' && isRunOpen) return (
            <Run
                key='run'
                onClose={onCloseRun}
                isMinimized={false}
                onMouseDown={() => bringToFront('run')}
                isActive={isActive}
                onOpenCalculator={openCalculator}
                onOpenDisplayProperties={openDisplayProperties}
                onOpenFileManager={() => openFileManager()}
                onOpenIE={() => openIE()}
                onOpenMediaPlayer={() => openMediaPlayer()}
                onOpenMinesweeper={openMinesweeper}
                onOpenNotepad={() => openNotepad()}
                onOpenPaint={openPaint}
                onOpenSolitaire={openSolitaire}
                onOpenTerminal={openTerminal}
            />
        );

        if (id === 'error' && activeError) return (
            <CriticalError
                key='error'
                type={activeError}
                onClose={onCloseError}
                onMouseDown={() => bringToFront('error')}
                isActive={isActive}
            />
        );

        return null;
    };

    return <>{windowOrder.map(renderWindow)}</>;
};

export default WindowRenderer;
import Game from './minesweeper/Game';
import Keyboard from './keyboard/Keyboard';
import VolumeControl from './volume-control/VolumeControl';
import Solitaire from './solitaire/Solitaire';
import Paint from './Paint/Paint';
import IEWindow from './IE/IEWindow';
import Calculator from './Calculator/Calculator';
import Terminal from './Terminal/Terminal';
import Notepad from './notepad/Notepad';
import Wordpad from './wordpad/Wordpad';
import FileManager from './files/FileManager';
import MediaPlayer from './mediaPlayer/MediaPlayer';
import DisplayProperties from './display-properties/DisplayProperties';
import CriticalError from './CriticalError';
import Run from './runDialog/Run';
import PlusMain from './plus/PlusMain';
import CharacterMap from './character-map/CharacterMap';
import OutlookExpress from './outlook-express/OutlookExpress';

import type { ErrorType } from './CriticalError';
import type { WMPTrack } from './mediaPlayer/types/WMPTrack';
import { TERMINAL_APPS } from '../data/appData';
import type { ChannelId, Channel } from './volume-control/hooks/useChannels';
import type { FMItem } from './files/data/types';

type Theme = 'luna' | 'homestead' | 'silver';
type PlusTheme = 'none' | 'aquarium' | 'davinci' | 'nature' | 'space';

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

    // Windows Plus
    plusTheme: PlusTheme;
    onPlusThemeChange: (theme: PlusTheme) => void;
    openDisplayProperties: (
        tab?: 'Themes' | 'Desktop' | 'Screen Saver' | 'Appearance' | 'Settings',
        options?: { plusTheme?: 'aquarium' | 'davinci' | 'nature' | 'space'; screensaver?: string }
    ) => void;
    displayPropertiesInitialPlusTheme?: 'aquarium' | 'davinci' | 'nature' | 'space';
    displayPropertiesInitialScreensaver?: string;


    // Per-window open flags
    isMinesweeperOpen: boolean;
    isSolitaireOpen: boolean;
    isPaintOpen: boolean;
    isCalculatorOpen: boolean;
    isTerminalOpen: boolean;
    isNotepadOpen: boolean;
    isWordpadOpen: boolean;
    isFileManagerOpen: boolean;
    isMediaPlayerOpen: boolean;
    isDisplayPropertiesOpen: boolean;
    isKeyboardOpen: boolean;
    isVolumeControlOpen: boolean;
    isPlusOpen: boolean;
    isCharacterMapOpen: boolean;
    isOutlookOpen: boolean;
    isRunOpen: boolean;
    activeError: ErrorType | null;

    // Window states
    minesweeper: WindowState;
    solitaire: WindowState;
    paint: WindowState;
    calculator: WindowState;
    terminal: WindowState;
    notepad: WindowState;
    wordpad: WindowState;
    filemanager: WindowState;
    mediaplayer: WindowState;
    displayproperties: WindowState;
    keyboard: WindowState;
    volumecontrol: WindowState;
    plus: WindowState;
    charactermap: WindowState;
    outlook: WindowState;

    // IE
    ieInstances: IEInstance[];
    onError: (type: ErrorType) => void;

    // Minimize handlers
    handleMinesweeperMinimize: (v: boolean | ((p: boolean) => boolean)) => void;
    handleSolitaireMinimize: (v: boolean | ((p: boolean) => boolean)) => void;
    handlePaintMinimize: (v: boolean | ((p: boolean) => boolean)) => void;
    handleCalculatorMinimize: (v: boolean | ((p: boolean) => boolean)) => void;
    handleTerminalMinimize: (v: boolean | ((p: boolean) => boolean)) => void;
    handleNotepadMinimize: (v: boolean | ((p: boolean) => boolean)) => void;
    handleWordpadMinimize: (v: boolean | ((p: boolean) => boolean)) => void;
    handleFileManagerMinimize: (v: boolean | ((p: boolean) => boolean)) => void;
    handleMediaPlayerMinimize: (v: boolean | ((p: boolean) => boolean)) => void;
    handleDisplayPropertiesMinimize: (v: boolean | ((p: boolean) => boolean)) => void;
    handleKeyboardMinimize: (v: boolean | ((p: boolean) => boolean)) => void;
    handleVolumeControlMinimize: (v: boolean | ((p: boolean) => boolean)) => void;
    handlePlusMinimize: (v: boolean | ((p: boolean) => boolean)) => void;
    handleCharacterMapMinimize: (v: boolean | ((p: boolean) => boolean)) => void;
    handleOutlookMinimize: (v: boolean | ((p: boolean) => boolean)) => void;
    minimizeIE: (id: string, v: boolean | ((p: boolean) => boolean)) => void;

    // Close handlers
    onCloseMinesweeper: () => void;
    onCloseSolitaire: () => void;
    onClosePaint: () => void;
    onCloseCalculator: () => void;
    onCloseTerminal: () => void;
    onCloseNotepad: () => void;
    onCloseWordpad: () => void;
    onCloseFileManager: () => void;
    onCloseMediaPlayer: () => void;
    onCloseDisplayProperties: () => void;
    onCloseKeyboard: () => void;
    onCloseVolumeControl: () => void;
    onClosePlus: () => void;
    onCloseCharacterMap: () => void;
    onCloseOutlook: () => void;
    onCloseRun: () => void;
    openCalculator: () => void;
    openKeyboard: () => void;
    displayPropertiesInitialTab?: 'Themes' | 'Desktop' | 'Screen Saver' | 'Appearance' | 'Settings';
    displayPropertiesOpenKey?: number;
    openMinesweeper: () => void;
    openPaint: () => void;
    openSolitaire: () => void;
    openTerminal: () => void;
    openOutlook: () => void;
    onCloseIE: (id: string) => void;
    onCloseError: () => void;
    openStartMenu: () => void;

    // bringToFront
    bringToFront: (id: string) => void;

    // Notepad
    notepadInitialContent: string | undefined;
    notepadInitialFileName: string | undefined;

    // Wordpad
    wordpadInitialContent: string | undefined;
    wordpadInitialFileName: string | undefined;
    onObjectPicked?: (item: FMItem) => void;
    openFileManagerForObjectPick: () => void;
    pickedObjectFile: FMItem | null;
    onObjectFileConsumed: () => void;

    // FileManager
    fileManagerInitialPath: string[];
    fileManagerPathKey: number;
    fileManagerOpenSearch: boolean;
    fileManagerPickerMode: 'wallpaper' | 'object' | null;
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
    onScreensaverPreview: () => void;
    onThemeChange: (v: Theme) => void;
    onBrowse: () => void;

    // Callbacks that open other windows
    openIE: (url?: string) => void;
    openNotepad: (content?: string, fileName?: string) => void;
    openFileManager: (path?: string[], openSearch?: boolean) => void;
    openMediaPlayer: (tracks?: WMPTrack[], startIndex?: number) => void;
    openFileManagerForWallpaperPick: () => void;
    openVolumeControl: () => void;

    // Sound
    playMinimize: () => void;
    playStart: () => void;

    // Global audio
    globalVolume: number;
    globalMuted: boolean;
    onGlobalVolumeChange: (v: number) => void;
    onGlobalMuteToggle: () => void;

    // Volume channels (mixer)
    channels: Record<ChannelId, Channel>;
    setChannel: (id: ChannelId, patch: Partial<Channel>) => void;
    cd: { volume: number; muted: boolean };

    // Open handlers (needed for taskbar restore from FileManager/IE)
    onOpenApp: (id: string) => void;

    // IE title/favicon callbacks
    onIETitleChange: (id: string, title: string) => void;
    onIEFaviconChange: (id: string, favicon: string) => void;

    // Paint embed mode — used when WordPad requests a Paintbrush picture object
    paintEmbedMode?: boolean;
    onRegisterPaintCanvasGetter?: (getter: (() => string | null) | null) => void;

    // WordPad-side of embed handoff
    wordpadEmbeddedPaintDataUrl?: string | null;
    onWordpadEmbeddedPaintConsumed?: () => void;
    onWordpadEmbedPaintbrush?: () => void;
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
    isWordpadOpen,
    isFileManagerOpen,
    isMediaPlayerOpen,
    isDisplayPropertiesOpen,
    isKeyboardOpen,
    isVolumeControlOpen,
    isPlusOpen,
    isCharacterMapOpen,
    isOutlookOpen,
    isRunOpen,
    activeError,
    minesweeper,
    solitaire,
    paint,
    calculator,
    terminal,
    notepad,
    wordpad,
    filemanager,
    mediaplayer,
    displayproperties,
    keyboard,
    volumecontrol,
    plus,
    charactermap,
    outlook,
    ieInstances,
    onError,
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
    handleCharacterMapMinimize,
    handleOutlookMinimize,
    minimizeIE,
    onCloseMinesweeper,
    onCloseSolitaire,
    onClosePaint,
    onCloseCalculator,
    onCloseTerminal,
    onCloseNotepad,
    onCloseWordpad,
    onCloseFileManager,
    onCloseMediaPlayer,
    onCloseDisplayProperties,
    onCloseKeyboard,
    onCloseVolumeControl,
    onClosePlus,
    onCloseCharacterMap,
    onCloseOutlook,
    onObjectPicked,
    openFileManagerForObjectPick,
    onCloseRun,
    openCalculator,
    openKeyboard,
    openDisplayProperties,
    displayPropertiesInitialTab,
    displayPropertiesOpenKey,
    displayPropertiesInitialPlusTheme,
    displayPropertiesInitialScreensaver,
    openFileManager,
    openIE,
    openMediaPlayer,
    openVolumeControl,
    openMinesweeper,
    openNotepad,
    openPaint,
    openSolitaire,
    openTerminal,
    openOutlook,
    openStartMenu,
    onCloseIE,
    onCloseError,
    bringToFront,
    notepadInitialContent,
    notepadInitialFileName,
    wordpadInitialContent,
    wordpadInitialFileName,
    fileManagerInitialPath,
    fileManagerPathKey,
    fileManagerOpenSearch,
    fileManagerPickerMode,
    onFileManagerTitleChange,
    onFilePicked,
    pickedObjectFile,
    onObjectFileConsumed,
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
    onScreensaverPreview,
    onThemeChange,
    onBrowse,
    globalVolume,
    globalMuted,
    onGlobalVolumeChange,
    onGlobalMuteToggle,
    channels,
    setChannel,
    cd,
    onOpenApp,
    onIETitleChange,
    onIEFaviconChange,
    plusTheme,
    onPlusThemeChange,
    wallpaper,
    paintEmbedMode,
    onRegisterPaintCanvasGetter,
    wordpadEmbeddedPaintDataUrl,
    onWordpadEmbeddedPaintConsumed,
    onWordpadEmbedPaintbrush,
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
                plusTheme={plusTheme}
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
                plusTheme={plusTheme}
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
                    plusTheme={plusTheme}
                    onError={onError}
                    onOpenNotepad={openNotepad}
                    onNewWindow={openIE}
                    onOpenOutlook={openOutlook}
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
                plusTheme={plusTheme}
                onError={onError}
                embedMode={paintEmbedMode}
                onRegisterCanvasGetter={onRegisterPaintCanvasGetter}
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
                plusTheme={plusTheme}
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
                plusTheme={plusTheme}
                onError={onError}
                onOpenFM={() => openFileManager()}
            />
        );

        if (id === 'wordpad' && isWordpadOpen) return (
            <Wordpad
                key='wordpad'
                onClose={onCloseWordpad}
                isMinimized={wordpad.isMinimized}
                setIsMinimized={handleWordpadMinimize}
                isFullscreen={wordpad.isFullscreen}
                toggleFullscreen={wordpad.toggleFullscreen}
                onMouseDown={() => bringToFront('wordpad')}
                isActive={isActive}
                initialContent={wordpadInitialContent}
                initialFileName={wordpadInitialFileName}
                globalVolume={globalVolume}
                globalMuted={globalMuted}
                plusTheme={plusTheme}
                onOpenFM={() => openFileManager()}
                onError={onError}
                onBrowseObject={openFileManagerForObjectPick}
                pickedObjectFile={pickedObjectFile}
                onObjectFileConsumed={onObjectFileConsumed}
                onEmbedPaintbrush={onWordpadEmbedPaintbrush}
                embeddedPaintDataUrl={wordpadEmbeddedPaintDataUrl}
                onEmbeddedPaintConsumed={onWordpadEmbeddedPaintConsumed}
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
                onOpenWMP={(tracks: WMPTrack[], startIndex: number) => openMediaPlayer(tracks, startIndex)}
                globalVolume={globalVolume}
                globalMuted={globalMuted}
                plusTheme={plusTheme}
                onError={onError}
                openSearch={fileManagerOpenSearch}
                pickerMode={fileManagerPickerMode} 
                onObjectPicked={onObjectPicked}               
                onFilePicked={onFilePicked}
                onOpenDisplayProperties={openDisplayProperties}
                onOpenVolumeControl={openVolumeControl}
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
                cdVolume={cd.volume}
                cdMuted={cd.muted}
                plusTheme={plusTheme}
            />
        );

        if (id === 'displayproperties' && isDisplayPropertiesOpen) return (
            <DisplayProperties
                key={`displayproperties-${displayPropertiesOpenKey ?? 0}`}
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
                onScreensaverPreview={onScreensaverPreview}
                currentTheme={theme}
                onThemeChange={onThemeChange}
                initialTab={displayPropertiesInitialTab}
                plusTheme={plusTheme}
                onPlusThemeChange={onPlusThemeChange}
                wallpaper={wallpaper}
                initialPlusThemePick={displayPropertiesInitialPlusTheme}
                initialScreensaverPick={displayPropertiesInitialScreensaver}
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
                onOpenKeyboard={openKeyboard}
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

        if (id === 'keyboard' && isKeyboardOpen) return (
            <Keyboard
                key='keyboard'
                onClose={onCloseKeyboard}
                isMinimized={keyboard.isMinimized}
                setIsMinimized={handleKeyboardMinimize}
                isFullscreen={keyboard.isFullscreen}
                toggleFullscreen={keyboard.toggleFullscreen}
                onMouseDown={() => {
                    const prev = [...windowOrder].reverse().find(w => w !== 'keyboard');
                    if (prev) bringToFront(prev as Parameters<typeof bringToFront>[0]);
                }}
                isActive={isActive}
                globalVolume={globalVolume}
                globalMuted={globalMuted}
                plusTheme={plusTheme}
                onCalculatorOpen={openCalculator}
                onStartMenuOpen={openStartMenu}
            />
        );

        if (id === 'volumecontrol' && isVolumeControlOpen) return (
            <VolumeControl
                key='volumecontrol'
                onClose={onCloseVolumeControl}
                isMinimized={volumecontrol.isMinimized}
                setIsMinimized={handleVolumeControlMinimize}
                isFullscreen={volumecontrol.isFullscreen}
                toggleFullscreen={volumecontrol.toggleFullscreen}
                onMouseDown={() => bringToFront('volumecontrol')}
                isActive={isActive}
                globalVolume={globalVolume}
                globalMuted={globalMuted}
                onGlobalVolumeChange={onGlobalVolumeChange}
                onGlobalMuteToggle={onGlobalMuteToggle}
                channels={channels} 
                setChannel={setChannel}
                plusTheme={plusTheme}
            />
        );

        if (id === 'plus' && isPlusOpen) return (
            <PlusMain
                key='plus'
                onClose={onClosePlus}
                isMinimized={plus.isMinimized}
                setIsMinimized={handlePlusMinimize}
                isFullscreen={plus.isFullscreen}
                toggleFullscreen={plus.toggleFullscreen}
                onMouseDown={() => bringToFront('plus')}
                isActive={isActive}
                globalVolume={globalVolume}
                globalMuted={globalMuted}
                plusTheme={plusTheme}
                onScreensaverChange={onScreensaverChange}
                onScreensaverPreview={onScreensaverPreview}
                onOpenDisplayProperties={openDisplayProperties}
                openIE={openIE}
            />
        );

        if (id === 'charactermap' && isCharacterMapOpen) return (
            <CharacterMap
                key='charactermap'
                onClose={onCloseCharacterMap}
                isMinimized={charactermap.isMinimized}
                setIsMinimized={handleCharacterMapMinimize}
                isFullscreen={charactermap.isFullscreen}
                onMouseDown={() => bringToFront('charactermap')}
                isActive={isActive}
            />
        );

        if (id === 'outlook' && isOutlookOpen) return (
            <OutlookExpress
                key='outlook'
                onClose={onCloseOutlook}
                isMinimized={outlook.isMinimized}
                setIsMinimized={handleOutlookMinimize}
                isFullscreen={outlook.isFullscreen}
                toggleFullscreen={outlook.toggleFullscreen}
                onMouseDown={() => bringToFront('outlook')}
                isActive={isActive}
                globalVolume={globalVolume}
                globalMuted={globalMuted}
                plusTheme={plusTheme}
                onOpenIE={openIE}
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
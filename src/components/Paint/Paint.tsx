import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import useDraggable from '../../hooks/useDraggable';
import useSound from '../../hooks/useSound';
import { addRecentDoc } from '../../utils/recentDocs';

import PaintIcon from '../../img/Paint.webp';
import '../../App.css';
import './Paint.css';

import PaintMenu from './PaintMenu';
import WindowSystemMenu from '../WindowsSystemMenu';
import PaintApp from './PaintApp';
import CriticalError from '../CriticalError';
import OpenModal from '../files/open-modal/OpenModal';
import type { FMItem } from '../files/data/types';

interface PaintProps {
    isFullscreen: boolean;
    setIsFullscreen: (value: boolean | ((prev: boolean) => boolean)) => void;
    isMinimized: boolean;
    setIsMinimized: (value: boolean | ((prev: boolean) => boolean)) => void;
    onClose: () => void;
    onMouseDown?: () => void;
    isActive?: boolean;
    globalVolume: number;
    globalMuted: boolean;
    plusTheme?: 'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
    onError?: (type: import('../CriticalError').ErrorType) => void;
    embedMode?: boolean;
    onRegisterCanvasGetter?: (getter: (() => string | null) | null) => void;
    initialImageUrl?: string;
    onInitialImageConsumed?: () => void;
}

const Paint = ({
    isFullscreen,
    setIsFullscreen,
    isMinimized,
    setIsMinimized,
    onClose,
    onMouseDown,
    isActive,
    globalVolume,
    globalMuted,
    plusTheme,
    onError,
    embedMode,
    onRegisterCanvasGetter,
    initialImageUrl,
    onInitialImageConsumed,
}: PaintProps) => {
    const [tool, setTool] = useState('pencil');
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [saveAsOpen, setSaveAsOpen] = useState(false);
    const [statusTool, setStatusTool] = useState('For Help, click Help Topics on the Help Menu.');
    const [statusCoords, setStatusCoords] = useState('');
    const [showToolbox, setShowToolbox] = useState(true);
    const [showStatusBar, setShowStatusBar] = useState(true);
    const [showColorBox, setShowColorBox] = useState(true);
    const [flipRotateAction, setFlipRotateAction] = useState<{ action: 'flipH' | 'flipV' | 'rotate'; angle?: number } | null>(null);
    const [stretchSkewAction, setStretchSkewAction] = useState<{ stretchH: number; stretchV: number; skewH: number; skewV: number } | null>(null);
    const [selectedBgPreset, setSelectedBgPreset] = useState(0);
    const [canvasSize, setCanvasSize] = useState({ w: 700, h: 400 });
    const [showGrid, setShowGrid] = useState(false);
    const [showThumbnail, setShowThumbnail] = useState(false);
    const [openModal, setOpenModal] = useState<'about' | 'fliprotate' | 'stretchskew' | 'attributes' | 'customzoom' | null>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [pendingAction, setPendingAction] = useState<'new' | 'open' | 'exit' | null>(null);
    const [systemMenuOpen, setSystemMenuOpen] = useState(false);

    // OpenModal (replaces the native file input for File → Open)
    const [openPickerOpen, setOpenPickerOpen] = useState(false);
    const [localImageUrl, setLocalImageUrl] = useState<string | undefined>(undefined);
    const effectiveImageUrl = initialImageUrl ?? localImageUrl;

    const { position, handleMouseDown } = useDraggable(400, 150);
    const sounds = useSound(globalVolume, globalMuted);
    const themeSound = plusTheme === 'aquarium' ? sounds.aquarium
        : plusTheme === 'davinci' ? sounds.daVinci
        : plusTheme === 'nature' ? sounds.nature
        : plusTheme === 'space' ? sounds.space
        : null;
    const playExclamation = () => themeSound ? themeSound.playExclamation() : sounds.playExclamation();

    const onDownloadRef = useRef<() => void>(() => {});
    const onOpendRef = useRef<() => void>(() => {});
    const onClearRef = useRef<() => void>(() => {});
    const actionAfterSaveRef = useRef<'new' | 'open' | 'exit' | null>(null);
    const prevSaveAsOpen = useRef(false);
    const paintIconRef = useRef<HTMLImageElement>(null);

    const runAction = (action: 'new' | 'open' | 'exit' | null) => {
        if (action === 'exit') onClose();
        else if (action === 'new') { setTool('clear'); setHasChanges(false); }
        else if (action === 'open') setOpenPickerOpen(true);
    };

    // Feed a picked image's URL through Paint's existing initialImageUrl pipe
    const handleOpenPicked = (item: FMItem) => {
        const url = item.thumbnailUrl ?? item.imageUrl ?? item.url;
        if (!url) return;
        setLocalImageUrl(url);
        setHasChanges(false);
        setOpenPickerOpen(false);
    };

    const handleNew = () => {
        if (hasChanges) { setPendingAction('new'); return; }
        runAction('new');
    };

    const handleOpen = () => {
        if (hasChanges) { setPendingAction('open'); return; }
        runAction('open');
    };

    const handleExit = () => {
        if (hasChanges) { setPendingAction('exit'); return; }
        onClose();
    };

    const handleUnsavedYes = () => {
        actionAfterSaveRef.current = pendingAction;
        setPendingAction(null);
        setSaveAsOpen(true);
    };

    const handleUnsavedNo = () => {
        const action = pendingAction;
        setPendingAction(null);
        setHasChanges(false);
        runAction(action);
    };

    const handleSaved = (name?: string) => {
        if (name) {
            addRecentDoc({ name, path: name, type: 'image' });
        }
        const action = actionAfterSaveRef.current;
        actionAfterSaveRef.current = null;
        setHasChanges(false);
        runAction(action);
    };

    // Clear deferred action if Save As is closed without saving
    useEffect(() => {
        if (prevSaveAsOpen.current && !saveAsOpen) {
            actionAfterSaveRef.current = null;
        }
        prevSaveAsOpen.current = saveAsOpen;
    }, [saveAsOpen]);

    // Play exclamation sound when the unsaved-changes dialog opens
    useEffect(() => {
        if (pendingAction) playExclamation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pendingAction]);

    const setZoomLevel = useCallback((value: number) => {
        setZoom(value);
        setPan({ x: 0, y: 0 });
    }, [setZoom, setPan]);

    const zoomReset = useCallback(() => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
    }, [setZoom, setPan]);

    // Global keyboard shortcuts
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'l' && e.ctrlKey) {
                e.preventDefault();
                setShowColorBox(prev => !prev);
            }
            if (e.key === 'Escape' && isFullscreen) {
                setIsFullscreen(false);
                setShowToolbox(true);
                setShowColorBox(true);
                setShowStatusBar(true);
            }
            if (e.key === 'g' && e.ctrlKey) {
                e.preventDefault();
                setShowGrid(prev => !prev);
            }
            if (e.key === 'f' && e.ctrlKey) {
                e.preventDefault();
                setIsFullscreen(true);
                setShowToolbox(false);
                setShowColorBox(false);
                setShowStatusBar(false);
            }
            if (e.ctrlKey && !e.altKey && e.key === 'e') { e.preventDefault(); setOpenModal('attributes'); }
            if (e.ctrlKey && e.altKey && e.key === 'r') { e.preventDefault(); setOpenModal('fliprotate'); }
            if (e.ctrlKey && e.shiftKey && e.code === 'KeyK') { e.preventDefault(); setOpenModal('stretchskew'); }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isFullscreen, setIsFullscreen]);

    return (
        <div
            className={[
                'app-window',
                'paint-window',
                isActive && !openModal && !saveAsOpen && !pendingAction && 'app-window--active',
                isMinimized && 'paint--minimized',
                isMinimized && 'app-window--minimized',
                isFullscreen && 'paint--fullscreen',
                isFullscreen && 'app-window--fullscreen',
            ].filter(Boolean).join(' ')}
            style={isFullscreen ? {} : { left: position.x, top: position.y }}
            onMouseDown={onMouseDown}
        >
            <div className='title-bar' onMouseDown={handleMouseDown}>
                <span className='title-bar-text'>
                    <img 
                        className='paint-icon' 
                        src={PaintIcon} 
                        alt='MS Paint Icon'
                        ref={paintIconRef}
                        onClick={() => setSystemMenuOpen(prev => !prev)}  
                    />
                    {systemMenuOpen && (
                        <WindowSystemMenu
                            open={systemMenuOpen}
                            onRequestClose={() => setSystemMenuOpen(false)}
                            triggerRef={paintIconRef}
                            isFullscreen={isFullscreen}
                            onRestore={() => setIsFullscreen(false)}
                            onMove={() => {}}
                            onSize={() => {}}
                            onMinimize={() => setIsMinimized(true)}
                            onMaximize={() => { setIsMinimized(false); setIsFullscreen(prev => !prev); }}
                            onClose={handleExit}
                        />
                    )}
                    {embedMode ? 'Paintbrush Picture in Document' : 'untitled - Paint'}
                </span>
                <div className='title-bar-buttons xp-title-controls'>
                    <button
                        type='button'
                        className='xp-title-control btn-minimize'
                        onClick={() => setIsMinimized(true)}
                        aria-label='Minimize'
                    >
                        _
                    </button>
                    <button
                        type='button'
                        className={`xp-title-control ${isFullscreen ? 'btn-restore' : 'btn-maximize'}`}
                        onClick={() => {
                            setIsMinimized(false);
                            setIsFullscreen(prev => !prev);
                        }}
                        aria-label={isFullscreen ? 'Restore' : 'Maximize'}
                    >
                        {isFullscreen ? '❐' : '□'}
                    </button>
                    <button
                        type='button'
                        className='xp-title-control btn-close'
                        onClick={handleExit}
                        aria-label='Close'
                    >
                        ✕
                    </button>
                </div>
            </div>

            <PaintMenu
                setTool={setTool}
                onNew={handleNew}
                onOpen={handleOpen}
                onSaveAs={() => setSaveAsOpen(true)}
                onClose={handleExit}
                windowPosition={position}
                openModal={openModal}
                setOpenModal={setOpenModal}
                onCut={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'x', ctrlKey: true, bubbles: true }))}
                onCopy={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'c', ctrlKey: true, bubbles: true }))}
                onPaste={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'v', ctrlKey: true, bubbles: true }))}
                showToolbox={showToolbox}
                onToggleToolbox={() => setShowToolbox(prev => !prev)}
                showStatusBar={showStatusBar}
                onToggleStatusBar={() => setShowStatusBar(prev => !prev)}
                showColorBox={showColorBox}
                onToggleColorBox={() => setShowColorBox(prev => !prev)}
                showGrid={showGrid}
                onToggleGrid={() => setShowGrid(prev => !prev)}
                showThumbnail={showThumbnail}
                onToggleThumbnail={() => setShowThumbnail(prev => !prev)}
                onZoomLevel={setZoomLevel}
                currentZoom={zoom}
                onZoomToWindow={() => {
                    const area = document.querySelector('.draw-area');
                    if (!area) return;
                    const rect = area.getBoundingClientRect();
                    setZoomLevel(Math.min(rect.width / canvasSize.w, rect.height / canvasSize.h));
                }}
                onFullscreen={() => setIsFullscreen(prev => !prev)}
                onViewBitmap={() => {
                    setIsFullscreen(true);
                    setShowToolbox(false);
                    setShowColorBox(false);
                    setShowStatusBar(false);
                }}
                onFlipRotate={(action, angle) => setFlipRotateAction({ action, angle })}
                onStretchSkew={(stretchH, stretchV, skewH, skewV) => setStretchSkewAction({ stretchH, stretchV, skewH, skewV })}
                onInvertColors={() => setTool('invert')}
                onAttributes={(w, h) => setCanvasSize({ w, h })}
                canvasWidth={700}
                canvasHeight={400}
                isDrawOpaque={selectedBgPreset === 0}
                onDrawOpaque={() => setSelectedBgPreset(prev => prev === 0 ? 1 : 0)}
                globalVolume={globalVolume}
                globalMuted={globalMuted}
                plusTheme={plusTheme}
                onError={onError}
            />

            <div className='paint-canvas-area'>
                <PaintApp
                    onDownloadRef={onDownloadRef}
                    onOpenRef={onOpendRef}
                    onClearRef={onClearRef}
                    tool={tool}
                    setTool={setTool}
                    zoom={zoom}
                    setZoom={setZoom}
                    setZoomLevel={setZoomLevel}
                    pan={pan}
                    setPan={setPan}
                    zoomReset={zoomReset}
                    onStatusChange={(msg) => {
                        if (msg === '__clear_coords__') setStatusCoords('');
                        else if (msg.includes(',')) setStatusCoords(msg);
                        else setStatusTool(msg);
                    }}
                    saveAsOpen={saveAsOpen}
                    setSaveAsOpen={setSaveAsOpen}
                    showColorBox={showColorBox}
                    showToolbox={showToolbox}
                    showGrid={showGrid}
                    showThumbnail={showThumbnail}
                    setShowThumbnail={setShowThumbnail}
                    flipRotateAction={flipRotateAction}
                    setFlipRotateAction={setFlipRotateAction}
                    stretchSkewAction={stretchSkewAction}
                    setStretchSkewAction={setStretchSkewAction}
                    selectedBgPreset={selectedBgPreset}
                    setSelectedBgPreset={setSelectedBgPreset}
                    canvasWidth={canvasSize.w}
                    canvasHeight={canvasSize.h}
                    globalVolume={globalVolume}
                    globalMuted={globalMuted}
                    plusTheme={plusTheme}
                    setHasChanges={setHasChanges}
                    onSaved={handleSaved}
                    onRegisterCanvasGetter={onRegisterCanvasGetter}
                    initialImageUrl={effectiveImageUrl}
                    onInitialImageConsumed={() => {
                        if (initialImageUrl) onInitialImageConsumed?.();
                        else setLocalImageUrl(undefined);
                    }}
                />
            </div>

            {showStatusBar && (
                <div className='helper'>
                    <span className='help helper__tool'>{statusTool}</span>
                    <span className='help helper__coords'>{statusCoords}</span>
                    <span className='help helper__info'></span>
                </div>
            )}

            {pendingAction && createPortal(
                <CriticalError
                    type='unsavedChanges'
                    onClose={() => setPendingAction(null)}
                    onYes={handleUnsavedYes}
                    onNo={handleUnsavedNo}
                    onCancel={() => setPendingAction(null)}
                />,
                document.body
            )}

            {/* Open Modal (replaces the native file input for File → Open) */}
            {openPickerOpen && createPortal(
                <OpenModal
                    title='Open'
                    initialPath={['localdisc', 'c-documents', 'c-admin', 'pictures']}
                    fileTypes={[
                        { label: 'All Picture Files', extensions: ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.gif'] },
                        { label: 'JPEG (*.jpg, *.jpeg)', extensions: ['.jpg', '.jpeg'] },
                        { label: 'Bitmap (*.bmp)', extensions: ['.bmp'] },
                        { label: 'GIF (*.gif)', extensions: ['.gif'] },
                        { label: 'All Files', extensions: [] },
                    ]}
                    onOpen={handleOpenPicked}
                    onClose={() => setOpenPickerOpen(false)}
                />,
                document.body
            )}
        </div>
    );
};

export default Paint;
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import useDraggable from '../../hooks/useDraggable';
import useSound from '../../hooks/useSound';
import { addRecentDoc } from '../../utils/recentDocs';
import WordpadMenu from './WordpadMenu';
import WordpadApp from './WordpadApp';
import CriticalError from '../CriticalError';
import WindowSystemMenu from '../WindowsSystemMenu';

import type { FMItem } from '../files/data/types';

import WordpadIcon from './img/WordpadHeading.webp';
import './Wordpad.css';
import '../../App.css';

interface WordpadProps {
    onClose: () => void;
    isMinimized: boolean;
    setIsMinimized: (value: boolean | ((prev: boolean) => boolean)) => void;
    isFullscreen: boolean;
    toggleFullscreen: () => void;
    onMouseDown?: () => void;
    isActive?: boolean;
    initialContent?: string;
    initialFileName?: string;
    globalVolume: number;
    globalMuted: boolean;
    plusTheme?: 'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
    onOpenFM: () => void;
    onError?: (type: import('../CriticalError').ErrorType) => void;
    onBrowseObject: () => void;
    pickedObjectFile: FMItem | null;
    onObjectFileConsumed: () => void;
    onEmbedPaintbrush?: () => void;
    embeddedPaintDataUrl?: string | null;
    onEmbeddedPaintConsumed?: () => void;
}

const Wordpad = ({
    onClose,
    isMinimized,
    setIsMinimized,
    isFullscreen,
    toggleFullscreen,
    onMouseDown,
    isActive,
    initialContent,
    initialFileName,
    globalVolume,
    globalMuted,
    plusTheme,
    onOpenFM,
    onError,
    onBrowseObject,
    pickedObjectFile,
    onObjectFileConsumed,
    onEmbedPaintbrush,
    embeddedPaintDataUrl,
    onEmbeddedPaintConsumed,
}: WordpadProps) => {
    const { position, handleMouseDown } = useDraggable(400, 150);

    // ── Sound ──────────────────────────────────────────────────────────────────
    const sounds = useSound(globalVolume, globalMuted);
    const themeSound = plusTheme === 'aquarium' ? sounds.aquarium
        : plusTheme === 'davinci' ? sounds.daVinci
        : plusTheme === 'nature' ? sounds.nature
        : plusTheme === 'space' ? sounds.space
        : null;
    const playExclamation = () => themeSound ? themeSound.playExclamation() : sounds.playExclamation();

    // ── Toolbar visibility ─────────────────────────────────────────────────────
    const [showStatusBar, setShowStatusBar] = useState(true);
    const [showToolbar, setShowToolbar] = useState(true);
    const [showFormatBar, setShowFormatBar] = useState(true);
    const [showRuler, setShowRuler] = useState(true);

    // ── File / save state ──────────────────────────────────────────────────────
    const [saveAsOpen, setSaveAsOpen] = useState(false);
    const [fileName, setFileName] = useState('Untitled.rtf');
    const [savedName, setSavedName] = useState<string | null>(null);
    const [hasChanges, setHasChanges] = useState(false);

    // ── Undo / redo ────────────────────────────────────────────────────────────
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    // ── Modal / dialog state ───────────────────────────────────────────────────
    const [pendingAction, setPendingAction] = useState<'new' | 'open' | 'exit' | null>(null);
    const [openModal, setOpenModal] = useState<'about' | 'find' | 'replace' | 'dateTime' | 'font' | 'object' | 'paragraph' | 'tabs' | null>(null);

    // ── Format bar state (lifted so menu and app stay in sync) ─────────────────
    const [selectedFont, setSelectedFont] = useState('Arial');
    const [selectedSize, setSelectedSize] = useState('10');
    const [tabStops, setTabStops] = useState<number[]>([]);
    const [bulletActive, setBulletActive] = useState(false);
    const [systemMenuOpen, setSystemMenuOpen] = useState(false);

    // ── Imperative refs for editor actions ────────────────────────────────────
    const insertDateTimeRef = useRef<() => void>(() => {});
    const editorRef = useRef<HTMLDivElement>(null);
    const newRef = useRef<() => void>(() => {});
    const undoRef = useRef<() => void>(() => {});
    const redoRef = useRef<() => void>(() => {});
    const bulletRef = useRef<() => void>(() => {});
    const actionAfterSaveRef = useRef<'new' | 'open' | 'exit' | null>(null);
    const prevSaveAsOpen = useRef(false);
    const wordpadIconRef = useRef<HTMLImageElement>(null);

    // Insert an embedded Paintbrush picture at the caret when Paint sends one back.
    useEffect(() => {
        if (!embeddedPaintDataUrl || !editorRef.current) return;
        const editor = editorRef.current;
        const img = document.createElement('img');
        img.src = embeddedPaintDataUrl;
        img.alt = 'Paintbrush Picture';
        // Inline-block so the caret can sit before/after the image, capped so
        // it fits in a typical WordPad column and doesn't push text off-screen.
        img.style.cssText = 'display:inline-block;max-width:100%;vertical-align:top;margin:2px';

        // A trailing space keeps the caret landable *after* the image on the same line.
        const trailing = document.createTextNode(' ');

        const sel = window.getSelection();
        const hasSelectionInEditor =
            sel && sel.rangeCount > 0 && editor.contains(sel.anchorNode);

        if (hasSelectionInEditor) {
            const range = sel!.getRangeAt(0);
            // Collapse instead of deleteContents so an existing image/text isn't wiped.
            range.collapse(false);
            range.insertNode(trailing);
            range.insertNode(img);
            range.setStartAfter(trailing);
            range.collapse(true);
            sel!.removeAllRanges();
            sel!.addRange(range);
        } else {
            editor.appendChild(img);
            editor.appendChild(trailing);
        }
        onEmbeddedPaintConsumed?.();
    }, [embeddedPaintDataUrl, onEmbeddedPaintConsumed]);

    // ── Helpers ────────────────────────────────────────────────────────────────

    const runAction = (action: 'new' | 'open' | 'exit' | null) => {
        if (action === 'exit') onClose();
        else if (action === 'new') newRef.current();
        else if (action === 'open') onOpenFM();
    };

    const handleSaveFromMenu = () => {
        if (savedName) {
            const html = editorRef.current?.innerHTML ?? '';
            const blob = new Blob([html], { type: 'text/html' });
            const a = document.createElement('a');
            a.download = savedName;
            a.href = URL.createObjectURL(blob);
            a.click();
            URL.revokeObjectURL(a.href);
            const action = actionAfterSaveRef.current;
            actionAfterSaveRef.current = null;
            setHasChanges(false);
            runAction(action);
        } else {
            setSaveAsOpen(true);
        }
    };

    // ── Effects ────────────────────────────────────────────────────────────────

    // If the user cancels Save As without saving, drop the deferred action
    useEffect(() => {
        if (prevSaveAsOpen.current && !saveAsOpen) {
            actionAfterSaveRef.current = null;
        }
        prevSaveAsOpen.current = saveAsOpen;
    }, [saveAsOpen]);

    // Play exclamation when the unsaved-changes dialog opens
    useEffect(() => {
        if (pendingAction) playExclamation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pendingAction]);

    // Ctrl+P → printer-not-connected error
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === 'p') {
                e.preventDefault();
                onError?.('printerConnect');
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onError]);

    // ── Unsaved-changes dialog handlers ───────────────────────────────────────

    const handleNew = () => {
        if (hasChanges) { setPendingAction('new'); return; }
        newRef.current();
    };

    const handleOpen = () => {
        if (hasChanges) { setPendingAction('open'); return; }
        onOpenFM();
    };

    const handleExit = () => {
        if (hasChanges) { setPendingAction('exit'); return; }
        onClose();
    };

    const handleUnsavedYes = () => {
        actionAfterSaveRef.current = pendingAction;
        setPendingAction(null);
        handleSaveFromMenu();
    };

    const handleUnsavedNo = () => {
        const action = pendingAction;
        setPendingAction(null);
        setHasChanges(false);
        runAction(action);
    };

    // ── Render ─────────────────────────────────────────────────────────────────

    return (
        <div
            className={[
                'app-window',
                'wordpad-window',
                isActive && !openModal && !saveAsOpen && !pendingAction && 'app-window--active',
                isMinimized && 'wordpad--minimized',
                isMinimized && 'app-window--minimized',
                isFullscreen && 'wordpad--fullscreen',
                isFullscreen && 'app-window--fullscreen',
            ].filter(Boolean).join(' ')}
            style={isFullscreen ? {} : { left: position.x, top: position.y }}
            onMouseDown={onMouseDown}
        >
            {/* Title bar */}
            <div className='title-bar' onMouseDown={handleMouseDown}>
                <span className='title-bar-text'>
                    <img
                        ref={wordpadIconRef}
                        className='wordpad-icon'
                        src={WordpadIcon}
                        alt='MS Wordpad Icon'
                        onClick={() => setSystemMenuOpen(prev => !prev)}
                    />
                    {systemMenuOpen && (
                        <WindowSystemMenu
                            open={systemMenuOpen}
                            onRequestClose={() => setSystemMenuOpen(false)}
                            triggerRef={wordpadIconRef}
                            isFullscreen={isFullscreen}
                            onRestore={() => toggleFullscreen()}
                            onMove={() => {}}
                            onSize={() => {}}
                            onMinimize={() => setIsMinimized(true)}
                            onMaximize={() => { setIsMinimized(false); toggleFullscreen(); }}
                            onClose={handleExit}
                        />
                    )}
                    {fileName.replace('.rtf', '')} - WordPad
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
                        onClick={() => { setIsMinimized(false); toggleFullscreen(); }}
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

            {/* Menu bar + modals */}
            <WordpadMenu
                windowPosition={position}
                showStatusBar={showStatusBar}
                onToggleStatusBar={() => setShowStatusBar(prev => !prev)}
                editorRef={editorRef}
                onSave={handleSaveFromMenu}
                onSaveAs={() => setSaveAsOpen(true)}
                onUndo={() => undoRef.current()}
                onRedo={() => redoRef.current()}
                canUndo={canUndo}
                canRedo={canRedo}
                globalVolume={globalVolume}
                globalMuted={globalMuted}
                plusTheme={plusTheme}
                onError={onError}
                onNew={handleNew}
                onOpen={handleOpen}
                onClose={handleExit}
                onInsertDateTime={() => setOpenModal('dateTime')}
                openModal={openModal}
                setOpenModal={setOpenModal}
                showToolbar={showToolbar}
                onToggleToolbar={() => setShowToolbar(p => !p)}
                showFormatBar={showFormatBar}
                onToggleFormatBar={() => setShowFormatBar(p => !p)}
                showRuler={showRuler}
                onToggleRuler={() => setShowRuler(p => !p)}
                selectedFont={selectedFont}
                setSelectedFont={setSelectedFont}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
                onBullet={() => bulletRef.current()}
                bulletActive={bulletActive}
                onBrowseObject={onBrowseObject}
                pickedObjectFile={pickedObjectFile}
                onObjectFileConsumed={onObjectFileConsumed}
                onEmbedPaintbrush={onEmbedPaintbrush}
                tabStops={tabStops}
                setTabStops={setTabStops}
            />

            {/* Editor area (toolbar + ruler + content + status bar) */}
            <WordpadApp
                showStatusBar={showStatusBar}
                editorRef={editorRef}
                newRef={newRef}
                saveAsOpen={saveAsOpen}
                setSaveAsOpen={setSaveAsOpen}
                fileName={fileName}
                setFileName={setFileName}
                onSaved={(name) => {
                    setFileName(name);
                    setSavedName(name);
                    const action = actionAfterSaveRef.current;
                    actionAfterSaveRef.current = null;
                    setHasChanges(false);
                    runAction(action);
                    addRecentDoc({
                        name,
                        path: name,
                        type: 'rtf',
                        content: editorRef.current?.innerHTML ?? '',
                    });
                }}
                undoRef={undoRef}
                redoRef={redoRef}
                onHistoryChange={(canUndo, canRedo) => {
                    setCanUndo(canUndo);
                    setCanRedo(canRedo);
                }}
                initialContent={initialContent}
                initialFileName={initialFileName}
                onChanges={() => setHasChanges(true)}
                insertDateTimeRef={insertDateTimeRef}
                onInsertDateTime={() => setOpenModal('dateTime')}
                onNew={handleNew}
                onOpen={handleOpen}
                onSave={handleSaveFromMenu}
                onError={onError}
                setOpenModal={setOpenModal}
                showToolbar={showToolbar}
                showFormatBar={showFormatBar}
                showRuler={showRuler}
                selectedFont={selectedFont}
                setSelectedFont={setSelectedFont}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
                bulletRef={bulletRef}
                onBulletActiveChange={setBulletActive}
                tabStops={tabStops}
            />

            {/* Unsaved-changes confirmation dialog */}
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
        </div>
    );
};

export default Wordpad;

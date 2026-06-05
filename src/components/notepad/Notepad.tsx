import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import useDraggable from '../../hooks/useDraggable';
import useSound from '../../hooks/useSound';
import NotepadMenu from './NotepadMenu';
import NotepadApp from './NotepadApp';
import CriticalError from '../CriticalError';


import NotepadIcon from '../../img/Notepad.webp';
import './Notepad.css';
import '../../App.css';

interface NotepadProps {
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
    onOpenFM: () => void;
}

const Notepad = ({
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
    onOpenFM,
}: NotepadProps) => {
    const { position, handleMouseDown } = useDraggable(400, 150);
    const { playExclamation } = useSound(globalVolume, globalMuted);
    const [showStatusBar, setShowStatusBar] = useState(true);
    const [wordWrap, setWordWrap] = useState(false);
    const [saveAsOpen, setSaveAsOpen] = useState(false);
    const [fileName, setFileName] = useState('Untitled.txt');
    const [savedName, setSavedName] = useState<string | null>(null);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [pendingAction, setPendingAction] = useState<'new' | 'open' | 'exit' | null>(null);
    const [hasChanges, setHasChanges] = useState(false);

    const insertDateTimeRef = useRef<() => void>(() => {});

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const newRef = useRef<() => void>(() => {});
    const undoRef = useRef<() => void>(() => {});
    const redoRef = useRef<() => void>(() => {});
    const actionAfterSaveRef = useRef<'new' | 'open' | 'exit' | null>(null);
    const prevSaveAsOpen = useRef(false);

    const runAction = (action: 'new' | 'open' | 'exit' | null) => {
        if (action === 'exit') onClose();
        else if (action === 'new') newRef.current();
        else if (action === 'open') onOpenFM();
    };

    const handleSaveFromMenu = () => {
        if (savedName) {
            const text = textareaRef.current?.value ?? '';
            const blob = new Blob([text], { type: 'text/plain' });
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

    // Clear deferred action if user cancels Save As without saving
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

    //Unsaved changes dialog handlers:
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

    return (
        <div
            className={[
                'app-window',
                'notepad-window',
                isActive && 'app-window--active',
                isMinimized && 'notepad--minimized',
                isMinimized && 'app-window--minimized',
                isFullscreen && 'notepad--fullscreen',
                isFullscreen && 'app-window--fullscreen',
            ].filter(Boolean).join(' ')}
            style={isFullscreen ? {} : { left: position.x, top: position.y }}
            onMouseDown={onMouseDown}
        >
            <div className='title-bar' onMouseDown={handleMouseDown}>
                <span className='title-bar-text'>
                    <img className='notepad-icon' src={NotepadIcon} alt='MS Notepad Icon' />
                    {fileName.replace('.txt', '')} - Notepad
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
                            toggleFullscreen();
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

            <NotepadMenu
                windowPosition={position}
                showStatusBar={showStatusBar}
                onToggleStatusBar={() => setShowStatusBar(prev => !prev)}
                wordWrap={wordWrap}
                onToggleWordWrap={() => setWordWrap(prev => !prev)}
                textareaRef={textareaRef}
                onSave={handleSaveFromMenu}
                onSaveAs={() => setSaveAsOpen(true)}
                onUndo={() => undoRef.current()}
                onRedo={() => redoRef.current()}
                canUndo={canUndo}
                canRedo={canRedo}
                globalVolume={globalVolume}
                globalMuted={globalMuted}
                onNew={handleNew}
                onOpen={handleOpen}
                onClose={handleExit}
                onInsertDateTime={() => insertDateTimeRef.current()}
            />

            <NotepadApp
                showStatusBar={showStatusBar}
                wordWrap={wordWrap}
                textareaRef={textareaRef}
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
            />

            {/* ERROR MODAL */}
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

export default Notepad;
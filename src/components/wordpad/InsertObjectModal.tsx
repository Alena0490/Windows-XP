import { useState, useEffect, useRef } from 'react';
import useDraggable from '../../hooks/useDraggable';
import { OBJECT_TYPES } from './data/wordpadData';
import type { FMItem } from '../files/data/types';
import ObjectIcon from './img/object2.webp';
import './InsertObjectModal.css';
import '../../App.css';

// ── Props ──────────────────────────────────────────────────────────────────────

interface InsertObjectModalProps {
    onClose:            () => void;
    style?:             React.CSSProperties;
    editorRef:          React.RefObject<HTMLDivElement | null>;
    globalVolume:       number;
    globalMuted:        boolean;
    plusTheme?:         'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
    onBrowseObject:     () => void;
    pickedFile:         FMItem | null;
    onFileConsumed:     () => void;
    onEmbedPaintbrush?: () => void;
}

// ── Component ──────────────────────────────────────────────────────────────────

const InsertObjectModal = ({
    onClose,
    style,
    editorRef,
    pickedFile,
    onFileConsumed,
    onBrowseObject,
    onEmbedPaintbrush,
}: InsertObjectModalProps) => {
    const initialX = typeof style?.left === 'number' ? style.left : Math.round(window.innerWidth  / 2 + 80);
    const initialY = typeof style?.top  === 'number' ? style.top  : Math.round(window.innerHeight / 2 - 70);
    const { position, handleMouseDown } = useDraggable(initialX, initialY);

    // ── State ──────────────────────────────────────────────────────────────────
    const [selectedType, setSelectedType] = useState(0);
    const [createMode,   setCreateMode]   = useState<'new' | 'file'>('new');
    const [displayAsIcon, setDisplayAsIcon] = useState(false);
    const [filePath,     setFilePath]     = useState('');

    // Keep a ref so the OK handler still sees the file even after onFileConsumed clears the prop
    const pickedFileRef = useRef<FMItem | null>(null);

    // ── Effects ────────────────────────────────────────────────────────────────

    // When the File Manager resolves a file, store it and acknowledge consumption
    useEffect(() => {
        if (!pickedFile) return;
        setFilePath(pickedFile.name);
        pickedFileRef.current = pickedFile;
        onFileConsumed();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pickedFile]);

    // ── Helpers ────────────────────────────────────────────────────────────────

    const handleOk = () => {
        if (createMode === 'new' && OBJECT_TYPES[selectedType].name === 'Paintbrush Picture') {
            onEmbedPaintbrush?.();
            onClose();
            return;
        }
        if (createMode === 'file' && filePath && editorRef.current) {
            const editor = editorRef.current;
            const file   = pickedFileRef.current;
            let node: HTMLElement;

            if (!displayAsIcon && file?.thumbnailUrl) {
                const img = document.createElement('img');
                img.src = file.thumbnailUrl;
                img.alt = filePath;
                img.style.cssText = 'max-width:300px;max-height:200px;display:block;margin:4px 0';
                node = img;
            } else {
                const span = document.createElement('span');
                span.style.cssText = 'border:1px solid #999;padding:2px 6px;font-size:11px;font-family:Tahoma,sans-serif';
                span.textContent = `📄 ${filePath}`;
                node = span;
            }

            editor.focus();
            const sel = window.getSelection();
            if (sel && sel.rangeCount > 0 && editor.contains(sel.anchorNode)) {
                const range = sel.getRangeAt(0);
                range.deleteContents();
                range.insertNode(node);
                range.setStartAfter(node);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            } else {
                editor.appendChild(node);
            }
        }
        onClose();
    };

    // ── Render ─────────────────────────────────────────────────────────────────

    return (
        <div
            className='app-window insert-object-dialog'
            style={{ left: position.x, top: position.y }}
            tabIndex={-1}
            onMouseDown={e => e.stopPropagation()}
        >
            {/* Title bar */}
            <div
                className='title-bar'
                onMouseDown={(e) => {
                    // Don't start dragging when the user clicks a title-bar button —
                    // otherwise the drag captures the mouse and the click is lost.
                    if ((e.target as HTMLElement).closest('.xp-title-control')) return;
                    handleMouseDown(e);
                }}
            >
                <span className='title-bar-text'>Insert Object</span>
                <div className='title-bar-buttons xp-title-controls'>
                    <button
                        type='button'
                        className='xp-title-control btn-help'
                        aria-label='Help'
                        onMouseDown={(e) => e.stopPropagation()}
                    >?</button>
                    <button
                        type='button'
                        className='xp-title-control btn-close'
                        aria-label='Close'
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={onClose}
                    >✕</button>
                </div>
            </div>

            {/* Body */}
            <div className='modal-body'>
                <div className='main-area'>

                    {/* Create New / Create from File radio */}
                    <div className='radios'>
                        <label>
                            <input type='radio' name='create-mode' checked={createMode === 'new'}  onChange={() => setCreateMode('new')}  />
                            Create New
                        </label>
                        <label>
                            <input type='radio' name='create-mode' checked={createMode === 'file'} onChange={() => setCreateMode('file')} />
                            Create from File
                        </label>
                    </div>

                    {/* Right panel: object type list or file path */}
                    <div className='object-types'>
                        {createMode === 'new' ? (
                            <>
                                <span>Object Type:</span>
                                <div className='fm-list-wrap'>
                                    <ul className='fm-list'>
                                        {OBJECT_TYPES.map((t, i) => (
                                            <li
                                                key={t.name}
                                                className={`fm-item ${t.disabled ? 'is-disabled' : ''} ${i === selectedType ? 'fm-selected' : ''}`}
                                                onClick={t.disabled ? undefined : () => setSelectedType(i)}
                                            >
                                                {t.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        ) : (
                            <>
                                <span>File:</span>
                                <input className='fm-input object-url' type='text' value={filePath} readOnly />
                                <div className='insert-object-file-row'>
                                    <button type='button' className='luna-btn inline-item' onClick={onBrowseObject}>Browse...</button>
                                    <label className='insert-object-checkbox inline-item'>
                                        <input type='checkbox' disabled />
                                        <span>Link</span>
                                    </label>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Result preview */}
                    <fieldset className='result fm-sample-frame'>
                        <legend className='fm-sample-legend'>Result</legend>
                        <img src={ObjectIcon} alt='' />
                        <span>{OBJECT_TYPES[selectedType].desc}</span>
                    </fieldset>
                </div>

                {/* Aside: OK / Cancel / Display As Icon */}
                <aside>
                    <button className='luna-btn'           onClick={handleOk}>OK</button>
                    <button className='luna-btn secondary' onClick={onClose}>Cancel</button>
                    <label className='insert-object-checkbox' htmlFor='object-case'>
                        <input
                            id='object-case'
                            type='checkbox'
                            disabled
                            checked={displayAsIcon}
                            onChange={e => setDisplayAsIcon(e.target.checked)}
                        />
                        <span>Display As Icon</span>
                    </label>
                </aside>
            </div>
        </div>
    );
};

export default InsertObjectModal;

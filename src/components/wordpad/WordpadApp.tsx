import { useState, useRef, useEffect } from 'react'
import type {FontType } from './data/wordpadData'
import{ FONTS, COLORS, SIZES} from './data/wordpadData'
import { useWordpadEditor } from './hooks/useWordpadEditor'
import WordpadRuler from './WordpadRuler'

import Document  from './img/file.webp'
import Folder    from './img/folder.webp'
import Save      from './img/save.webp'
import Print     from './img/print.webp'
import Search    from './img/search.webp'
import Binocular from './img/binocular.webp'
import Redo      from './img/redo.webp'
import Calendar  from './img/calendar.webp'
import Cut       from './img/Cut.webp'
import Copy      from './img/Copy.webp'
import Paste     from './img/Paste.webp'
import Bold      from './img/bold.webp'
import Italic    from './img/italic.webp'
import Underline from './img/underline.webp'
import Color     from './img/imgText.webp'
import textLeft  from './img/left.webp'
import textRight from './img/right.webp'
import TextCenter from './img/center.webp'
import ListView  from './img/list.webp'

import RulerTop    from './img/ruler-top.webp'
import RulerBottom from './img/ruler-bottom.webp'
import RulerUnder  from './img/ruler-under.webp'

import TrueTypeIcon  from './img/TrueType.webp'
import OpenTypeIcon  from './img/OpenType.webp'
import BitmapFontIcon from './img/Font.webp'

import './Wordpad.css'

// ─── Props ───────────────────────────────────────────────────────────────────
interface WordpadAppProps {
    showStatusBar: boolean;
    showToolbar: boolean;
    showFormatBar: boolean;
    showRuler: boolean;
    // wordWrap: boolean;
    editorRef: React.RefObject<HTMLDivElement | null>;
    newRef: React.RefObject<() => void>;
    onSaved: (name: string) => void;
    saveAsOpen: boolean;
    setSaveAsOpen: (value: boolean) => void;
    fileName: string;
    setFileName: (value: string) => void;
    undoRef: React.RefObject<() => void>;
    redoRef: React.RefObject<() => void>;
    onHistoryChange: (canUndo: boolean, canRedo: boolean) => void;
    initialContent?: string;
    initialFileName?: string;
    onChanges: () => void;
    insertDateTimeRef: React.RefObject<() => void>;
    onNew: () => void;
    onOpen: () => void;
    onSave: () => void;
    onError?: (type: import('../CriticalError').ErrorType) => void;
    setOpenModal: React.Dispatch<React.SetStateAction<'about' | 'find' | 'replace' | 'dateTime' | 'font' | null>>;
    selectedFont: string;
    setSelectedFont: (value: string) => void;
    selectedSize: string;
    setSelectedSize: (value: string) => void;
    bulletRef: React.RefObject<() => void>;
    onBulletActiveChange: (active: boolean) => void;
    onInsertDateTime: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

const WordpadApp = ({ 
    showStatusBar, 
    editorRef, 
    initialContent, 
    onChanges, 
    onNew, 
    onOpen, 
    onSave, 
    onError, 
    setOpenModal,
    showFormatBar,
    showToolbar,
    showRuler,
    undoRef, 
    redoRef,
    onHistoryChange,
    newRef,  
    selectedFont,
    setSelectedFont,
    selectedSize,
    setSelectedSize,
    bulletRef,
    onBulletActiveChange,
    onInsertDateTime    
}: WordpadAppProps) => {
    void Document; void Folder; void Save; void Print; void Search;
    void Binocular; void Redo; void Calendar; void Cut; void Copy;
    void Paste; void RulerTop; void RulerBottom; void RulerUnder;

    // ── State ──────────────────────────────────────────────────────────────
    const [fontOpen, setFontOpen]           = useState(false);
    const [colorOpen, setColorOpen]         = useState(false);
    const [sizeOpen, setSizeOpen] = useState(false);
    const [selectedScript, setSelectedScript] = useState('Western');

    const fontRef  = useRef<HTMLDivElement>(null);
    const colorRef = useRef<HTMLDivElement>(null);
    const sizeRef = useRef<HTMLDivElement>(null);

    const selectedFontEntry = FONTS.find(f => f.name === selectedFont);
    const historyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── Effects ────────────────────────────────────────────────────────────

    // load initial content
    useEffect(() => {
        if (editorRef.current && initialContent) {
            editorRef.current.innerHTML = initialContent;
        }
    }, [initialContent, editorRef]);

    // default paragraph separator
    useEffect(() => {
        document.execCommand('defaultParagraphSeparator', false, 'p');
    }, []);

    // Keyboard shortcuts for undo/redo
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!editorRef.current?.contains(document.activeElement)) return;
            if (e.ctrlKey && e.key === 'z') {
                e.preventDefault();
                undoRef.current();
            } else if (e.ctrlKey && e.key === 'y') {
                e.preventDefault();
                redoRef.current();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

      // ── Helpers ────────────────────────────────────────────────────────────

    const { activeFormats, exec, saveSelection, restoreSelection, pushHistory } = useWordpadEditor(
        editorRef, onChanges, undoRef, redoRef, onHistoryChange, newRef
    );

    useEffect(() => {
        bulletRef.current = () => exec('insertUnorderedList');
    });
    useEffect(() => {
        onBulletActiveChange(activeFormats.insertUnorderedList);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeFormats.insertUnorderedList]);

    // close font picker on outside click
    useEffect(() => {
        if (!fontOpen) return;
        const handler = (e: MouseEvent) => {
            if (fontRef.current && !fontRef.current.contains(e.target as Node))
                setFontOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [fontOpen]);

    // close color picker on outside click
    useEffect(() => {
        if (!colorOpen) return;
        const handler = (e: MouseEvent) => {
            if (colorRef.current && !colorRef.current.contains(e.target as Node))
                setColorOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [colorOpen]);

    // Font size
    useEffect(() => {
        if (!sizeOpen) return;
        const handler = (e: MouseEvent) => {
            if (sizeRef.current && !sizeRef.current.contains(e.target as Node))
                setSizeOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [sizeOpen]);

    const fontIcon = (type: FontType) =>
        type === 'opentype' ? OpenTypeIcon : type === 'other' ? BitmapFontIcon : TrueTypeIcon;

    // ── Render ─────────────────────────────────────────────────────────────

    return (
        <div className='wordpad-app'>
            <div className="wordpad-tools">

                {/* Toolbar */}
                {showToolbar && (
                    <div className="toolbar">
                        <button 
                            aria-label='New'           
                            data-tooltip='New'
                            onClick={onNew}
                        >          
                            <img src={Document}  alt="" />
                        </button>

                        <button 
                            aria-label='Open'          
                            data-tooltip='Open'
                            onClick={onOpen}
                        >         
                            <img src={Folder}    alt="" />
                        </button>

                        <button 
                        aria-label='Save'          
                        data-tooltip='Save'
                        onClick={onSave}
                        >         
                            <img src={Save}      alt="" />
                        </button>

                        <button 
                            aria-label='Print'         
                            data-tooltip='Print'
                            onClick={() => onError?.('printerConnect')}
                        >        
                                <img src={Print}     alt="" />
                        </button>

                        <button 
                            aria-label='Print Preview' 
                            data-tooltip='Print Preview'
                            className='is-disabled'
                        >
                            <img src={Search}    alt="" />
                        </button>

                        <button 
                            aria-label='Find'          
                            data-tooltip='Find'
                            onClick={() => setOpenModal('find')}
                        >         
                            <img src={Binocular} alt="" />
                        </button>
                        <button aria-label='Cut'           data-tooltip='Cut'  className='is-disabled'><img src={Cut}   alt="" /></button>
                        <button aria-label='Copy'          data-tooltip='Copy' className='is-disabled'>         <img src={Copy}      alt="" /></button>
                        <button aria-label='Paste'         data-tooltip='Paste' className='is-disabled'>        <img src={Paste}     alt="" /></button>
                        <button 
                            aria-label='Insert Date/Time' 
                            data-tooltip='Insert Date/Time'
                            onClick={onInsertDateTime}
                            >
                                <img src={Calendar} alt="" />
                            </button>
                    </div>
                )}

                {/* Format bar */}
                {showFormatBar && (
                    <div className="format-bar">
                        <div className="texttool-buttons">

                            {/* Font picker */}
                            <div className="font-picker format-bar__font" ref={fontRef}>
                                <div
                                    className="font-picker__trigger"
                                    onMouseDown={(e) => { e.preventDefault(); saveSelection(); }}
                                    onClick={() => setFontOpen(o => !o)}
                                    aria-label="Font"
                                >
                                    <img src={fontIcon(selectedFontEntry?.type ?? 'truetype')} alt="" className="font-picker__type-icon" />
                                    <span className="font-picker__name">{selectedFont}</span>
                                    <span className="xp-select-arrow font-picker__arrow" aria-hidden="true" />
                                </div>
                                {fontOpen && (
                                    <ul className="font-picker__list">
                                        {FONTS.map(f => (
                                            <li
                                                key={f.name}
                                                className={`font-picker__item${f.name === selectedFont ? ' font-picker__item--selected' : ''}`}
                                                onClick={() => {
                                                    setSelectedFont(f.name);
                                                    setFontOpen(false);
                                                    editorRef.current?.focus();
                                                    restoreSelection();
                                                    document.execCommand('fontName', false, f.name);
                                                    onChanges();
                                                }}
                                            >
                                                <img src={fontIcon(f.type)} alt={f.type} className="font-picker__type-icon" />
                                                <span style={{ fontFamily: f.name }}>{f.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Size */}
                            <div className="font-picker format-bar__size" ref={sizeRef}>
                                <div
                                    className="font-picker__trigger"
                                    onMouseDown={(e) => { e.preventDefault(); saveSelection(); }}
                                    onClick={() => setSizeOpen(o => !o)}
                                    aria-label="Font size"
                                >
                                    <span className="font-picker__name">{selectedSize}</span>
                                    <span className="xp-select-arrow font-picker__arrow" aria-hidden="true" />
                                </div>
                                {sizeOpen && (
                                    <ul className="font-picker__list">
                                        {SIZES.map(s => (
                                            <li
                                                key={s}
                                                className={`font-picker__item${s === selectedSize ? ' font-picker__item--selected' : ''}`}
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    setSelectedSize(s);
                                                    setSizeOpen(false);
                                                    editorRef.current?.focus();
                                                    restoreSelection();
                                                    document.execCommand('fontSize', false, '7');
                                                    editorRef.current?.querySelectorAll('font[size="7"]').forEach(el => {
                                                        el.removeAttribute('size');
                                                        (el as HTMLElement).style.fontSize = s + 'px';
                                                    });
                                                    onChanges();
                                                }}
                                            >
                                                {s}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Script */}
                            <div className="xp-select-wrapper format-bar__script">
                                <select
                                    value={selectedScript}
                                    aria-label="Script"
                                    onChange={(e) => setSelectedScript(e.target.value)}
                                >
                                    <option>Western</option>
                                    <option>Central European</option>
                                    <option>Baltic</option>
                                    <option>Greek</option>
                                    <option>Turkish</option>
                                    <option>Cyrillic</option>
                                </select>
                                <span className="xp-select-arrow" aria-hidden="true" />
                            </div>

                            {/* Text style */}
                            <button className={activeFormats.bold      ? 'is-active' : ''} data-tooltip='Bold'      aria-label='Bold'      onMouseDown={(e) => { e.preventDefault(); exec('bold');      }}><img src={Bold}      alt="" /></button>
                            <button className={activeFormats.italic    ? 'is-active' : ''} data-tooltip='Italic'    aria-label='Italic'    onMouseDown={(e) => { e.preventDefault(); exec('italic');    }}><img src={Italic}    alt="" /></button>
                            <button className={activeFormats.underline ? 'is-active' : ''} data-tooltip='Underline' aria-label='Underline' onMouseDown={(e) => { e.preventDefault(); exec('underline'); }}><img src={Underline} alt="" /></button>

                            {/* Color picker */}
                            <div style={{ position: 'relative' }} ref={colorRef}>
                                <button
                                    data-tooltip='Color'
                                    aria-label='Color'
                                    onMouseDown={(e) => { e.preventDefault(); saveSelection(); setColorOpen(o => !o); }}
                                >
                                    <img src={Color} alt="" />
                                </button>
                                {colorOpen && (
                                    <ul className="color-picker__list">
                                        {COLORS.map(c => (
                                            <li
                                                key={c.name}
                                                className="color-picker__item"
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    setColorOpen(false);
                                                    editorRef.current?.focus();
                                                    restoreSelection();
                                                    document.execCommand('foreColor', false, c.value);
                                                    onChanges();
                                                }}
                                            >
                                                <span className="color-picker__swatch" style={{ backgroundColor: c.value }} />
                                                {c.name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Alignment */}
                            <button className={activeFormats.justifyLeft         ? 'is-active' : ''} data-tooltip='Align Left'   aria-label='Align Left'   onMouseDown={(e) => { e.preventDefault(); exec('justifyLeft');         }}><img src={textLeft}   alt="" /></button>
                            <button className={activeFormats.justifyCenter       ? 'is-active' : ''} data-tooltip='Align Center' aria-label='Align Center' onMouseDown={(e) => { e.preventDefault(); exec('justifyCenter');       }}><img src={TextCenter} alt="" /></button>
                            <button className={activeFormats.justifyRight        ? 'is-active' : ''} data-tooltip='Align Right'  aria-label='Align Right'  onMouseDown={(e) => { e.preventDefault(); exec('justifyRight');        }}><img src={textRight}  alt="" /></button>
                            <button className={activeFormats.insertUnorderedList ? 'is-active' : ''} data-tooltip='Bullet'       aria-label='Bullet List'  onMouseDown={(e) => { e.preventDefault(); exec('insertUnorderedList'); }}><img src={ListView}   alt="" /></button>

                        </div>
                    </div>
                )}
            </div>

            {/* Rulers */}
            {showRuler && <WordpadRuler editorRef={editorRef} onChanges={onChanges} />}

            {/* Editor */}
            <div className="text-window-wrap">
                <div
                    className="text-window"
                    contentEditable
                    suppressContentEditableWarning
                    ref={editorRef}
                    onInput={() => {
                        onChanges();
                        if (historyTimeoutRef.current) clearTimeout(historyTimeoutRef.current);
                        historyTimeoutRef.current = setTimeout(() => {
                            pushHistory();
                        }, 300);
                    }}
                />
            </div>

            {/* Status bar */}
            {showStatusBar && (
                <div className='wordpad-statusbar'>
                    <div className='status'>For Help, press F1</div>
                    <div className="status second"></div>
                </div>
            )}
        </div>
    );
};

export default WordpadApp;

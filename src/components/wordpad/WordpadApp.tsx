import React, { useState, useRef, useEffect } from 'react'

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

// ─── Types ───────────────────────────────────────────────────────────────────

type FontType  = 'truetype' | 'opentype' | 'other';
type FontEntry = { name: string; type: FontType };

// ─── Data ────────────────────────────────────────────────────────────────────

const FONTS: FontEntry[] = [
    { name: 'Abadi MT Condensed',          type: 'truetype' },
    { name: 'Abadi MT Condensed Light',    type: 'truetype' },
    { name: 'Algerian',                    type: 'truetype' },
    { name: 'Arial',                       type: 'truetype' },
    { name: 'Arial Black',                 type: 'truetype' },
    { name: 'Arial Narrow',                type: 'truetype' },
    { name: 'Baskerville Old Face',        type: 'truetype' },
    { name: 'Bauhaus 93',                  type: 'truetype' },
    { name: 'Book Antiqua',                type: 'truetype' },
    { name: 'Bookman Old Style',           type: 'truetype' },
    { name: 'Bradley Hand ITC',            type: 'truetype' },
    { name: 'Brush Script MT Italic',      type: 'truetype' },
    { name: 'Castella',                    type: 'truetype' },
    { name: 'Century Gothic',              type: 'truetype' },
    { name: 'Century Schoolbook',          type: 'truetype' },
    { name: 'Chiller',                     type: 'truetype' },
    { name: 'Comic Sans Graffiti',         type: 'truetype' },
    { name: 'Comic Sans MS',               type: 'truetype' },
    { name: 'Copperplate Gothic Bold',     type: 'truetype' },
    { name: 'Copperplate Gothic Light',    type: 'truetype' },
    { name: 'Courier New',                 type: 'truetype' },
    { name: 'Digital Numbers',             type: 'truetype' },
    { name: 'Digital Numbers WOFF',        type: 'other'    },
    { name: 'Digital-7',                   type: 'truetype' },
    { name: 'Engravers MT',                type: 'truetype' },
    { name: 'Estrangelo Edessa',           type: 'truetype' },
    { name: 'Fixedsys',                    type: 'other'    },
    { name: 'Franklin Gothic Medium',      type: 'opentype' },
    { name: 'Garamond',                    type: 'truetype' },
    { name: 'Gautami',                     type: 'truetype' },
    { name: 'Georgia',                     type: 'truetype' },
    { name: 'Haettenschweiler',            type: 'truetype' },
    { name: 'Helvetica',                   type: 'truetype' },
    { name: 'Helvetica Neue',              type: 'truetype' },
    { name: 'Helvetica Neue Ultra Light',  type: 'opentype' },
    { name: 'Impact',                      type: 'truetype' },
    { name: 'Informal Roman',              type: 'truetype' },
    { name: 'Jokerman',                    type: 'truetype' },
    { name: 'Juice ITC',                   type: 'truetype' },
    { name: 'Latha',                       type: 'truetype' },
    { name: 'Levi',                        type: 'truetype' },
    { name: 'Lucida Console',              type: 'truetype' },
    { name: 'Lucida Sans Unicode',         type: 'truetype' },
    { name: 'Mangal',                      type: 'truetype' },
    { name: 'Marlett',                     type: 'truetype' },
    { name: 'Modern No. 20',               type: 'truetype' },
    { name: 'Monotype Corsiva',            type: 'truetype' },
    { name: 'MS Sans Serif',               type: 'truetype' },
    { name: 'MV Boli',                     type: 'truetype' },
    { name: 'OCR A Extended',              type: 'truetype' },
    { name: 'OPTI Franklin Gothic Medium', type: 'opentype' },
    { name: 'Palatino Linotype',           type: 'truetype' },
    { name: 'Papyrus',                     type: 'truetype' },
    { name: 'Parchment',                   type: 'truetype' },
    { name: 'Raavi',                       type: 'truetype' },
    { name: 'Script MT Bold',              type: 'truetype' },
    { name: 'Shruti',                      type: 'truetype' },
    { name: 'Stencil',                     type: 'truetype' },
    { name: 'Symbol',                      type: 'truetype' },
    { name: 'Sylfaen',                     type: 'truetype' },
    { name: 'Tahoma',                      type: 'truetype' },
    { name: 'Terminal Greek',              type: 'other'    },
    { name: 'Terminal Italic',             type: 'other'    },
    { name: 'Terminal Regular',            type: 'other'    },
    { name: 'Ticking Timebomb BB',         type: 'truetype' },
    { name: 'Times New Roman',             type: 'truetype' },
    { name: 'Trebuchet MS',                type: 'truetype' },
    { name: 'Tunga',                       type: 'truetype' },
    { name: 'Verdana',                     type: 'truetype' },
    { name: 'Webdings',                    type: 'truetype' },
    { name: 'Wide Latin',                  type: 'truetype' },
    { name: 'Wingdings',                   type: 'truetype' },
    { name: 'WST Czech',                   type: 'other'    },
    { name: 'WST English',                 type: 'other'    },
    { name: 'WST French',                  type: 'other'    },
    { name: 'WST German',                  type: 'other'    },
    { name: 'WST Italian',                 type: 'other'    },
    { name: 'WST Spanish',                 type: 'other'    },
    { name: 'WST Swedish',                 type: 'other'    },
];

const COLORS: { name: string; value: string }[] = [
    { name: 'Black',     value: '#000000' },
    { name: 'Maroon',    value: '#800000' },
    { name: 'Green',     value: '#008000' },
    { name: 'Olive',     value: '#808000' },
    { name: 'Navy',      value: '#000080' },
    { name: 'Purple',    value: '#800080' },
    { name: 'Teal',      value: '#008080' },
    { name: 'Gray',      value: '#808080' },
    { name: 'Silver',    value: '#C0C0C0' },
    { name: 'Red',       value: '#FF0000' },
    { name: 'Lime',      value: '#00FF00' },
    { name: 'Yellow',    value: '#FFFF00' },
    { name: 'Blue',      value: '#0000FF' },
    { name: 'Fuchsia',   value: '#FF00FF' },
    { name: 'Aqua',      value: '#00FFFF' },
    { name: 'White',     value: '#FFFFFF' },
    { name: 'Automatic', value: '#000000' },
];

const SIZES = ['8','9','10','11','12','14','16','18','20','24','28','36','48','72'];

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
    setOpenModal: React.Dispatch<React.SetStateAction<'about' | 'find' | 'replace' | null>>;
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
    showRuler 
}: WordpadAppProps) => {
    void Document; void Folder; void Save; void Print; void Search;
    void Binocular; void Redo; void Calendar; void Cut; void Copy;
    void Paste; void RulerTop; void RulerBottom; void RulerUnder;

    // ── State ──────────────────────────────────────────────────────────────
    const [selectedFont, setSelectedFont]   = useState('Arial');
    const [fontOpen, setFontOpen]           = useState(false);
    const [colorOpen, setColorOpen]         = useState(false);
    const [activeFormats, setActiveFormats] = useState<Record<string, boolean>>({});
    const [sizeOpen, setSizeOpen] = useState(false);
    const [selectedSize, setSelectedSize] = useState('10');
    const [selectedScript, setSelectedScript] = useState('Western');

    const fontRef  = useRef<HTMLDivElement>(null);
    const colorRef = useRef<HTMLDivElement>(null);
    const savedRange = useRef<Range | null>(null);
    const sizeRef = useRef<HTMLDivElement>(null);

    const selectedFontEntry = FONTS.find(f => f.name === selectedFont);

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

    // track active formats on selection change
    useEffect(() => {
        const update = () => {
            if (!editorRef.current?.contains(document.getSelection()?.anchorNode ?? null)) return;
            setActiveFormats({
                bold:                document.queryCommandState('bold'),
                italic:              document.queryCommandState('italic'),
                underline:           document.queryCommandState('underline'),
                justifyLeft:         document.queryCommandState('justifyLeft'),
                justifyCenter:       document.queryCommandState('justifyCenter'),
                justifyRight:        document.queryCommandState('justifyRight'),
                insertUnorderedList: document.queryCommandState('insertUnorderedList'),
            });
        };
        document.addEventListener('selectionchange', update);
        return () => document.removeEventListener('selectionchange', update);
    }, [editorRef]);

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

    // ── Helpers ────────────────────────────────────────────────────────────

    const exec = (command: string, value?: string) => {
        editorRef.current?.focus();
        document.execCommand(command, false, value);
        onChanges();
    };

    // preserve selection before the picker steals focus
    const saveSelection = () => {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0)
            savedRange.current = sel.getRangeAt(0).cloneRange();
    };

    const restoreSelection = () => {
        const sel = window.getSelection();
        if (sel && savedRange.current) {
            sel.removeAllRanges();
            sel.addRange(savedRange.current);
        }
    };

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
                        <button aria-label='Copy'          data-tooltip='Copy'>         <img src={Copy}      alt="" /></button>
                        <button aria-label='Paste'         data-tooltip='Paste'>        <img src={Paste}     alt="" /></button>
                        <button aria-label='Insert Date/Time' data-tooltip='Insert Date/Time'><img src={Calendar} alt="" /></button>
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
                                                onClick={() => {
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

                {/* Rulers */}
                {showRuler && (
                    <div className="rulers">
                        <div className="ruler">
                            <div className="ruler-slider ruler-slider--left">
                                <div className="top"></div>
                                <div className="bottom"></div>
                                <div className="under"></div>
                            </div>
                            <div className="ruler-slider ruler-slider--right">
                                <div className="bottom"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
              
            {/* Editor */}
            <div className="text-window-wrap">
                <div
                    className="text-window"
                    contentEditable
                    suppressContentEditableWarning
                    ref={editorRef}
                    onInput={() => onChanges()}
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

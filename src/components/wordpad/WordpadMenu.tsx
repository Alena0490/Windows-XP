import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import useSound from '../../hooks/useSound';
import AboutDialog from '../AboutDialog';
import WordpadFindReplaceModal from './WordpadFindReplaceModal';
import DateAndTimeModal from './DateAndTimeModal';
import WordpadFontModal from './WordpadFontModal';
import ObjectModal from './InsertObjectModal';
import ParagraphModal from './ParagraphModal';
import type { FMItem } from '../files/data/types';

import '../AppMenu.css';
import './Wordpad.css';

// ── Props ──────────────────────────────────────────────────────────────────────

interface WordpadMenuProps {
    windowPosition: { x: number; y: number };
    onNew: () => void;
    onClose: () => void;
    showStatusBar: boolean;
    onToggleStatusBar: () => void;
    editorRef: React.RefObject<HTMLDivElement | null>;
    onOpen: () => void;
    onSave: () => void;
    onSaveAs: () => void;
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    globalVolume: number;
    globalMuted: boolean;
    plusTheme?: 'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
    onError?: (type: import('../CriticalError').ErrorType) => void;
    onInsertDateTime: () => void;
    showToolbar: boolean;
    onToggleToolbar: () => void;
    showFormatBar: boolean;
    onToggleFormatBar: () => void;
    showRuler: boolean;
    onToggleRuler: () => void;
    selectedFont: string;
    setSelectedFont: (value: string) => void;
    selectedSize: string;
    setSelectedSize: (value: string) => void;
    onBullet: () => void;
    bulletActive: boolean;
    onBrowseObject: () => void;
    pickedObjectFile: FMItem | null;
    onObjectFileConsumed: () => void;
    onEmbedPaintbrush?: () => void;
    openModal: 'about' | 'find' | 'replace' | 'dateTime' | 'font' | 'object' | 'paragraph' | null;
    setOpenModal: React.Dispatch<React.SetStateAction<'about' | 'find' | 'replace' | 'dateTime' | 'font' | 'object' | 'paragraph' | null>>;
}

// ── Component ──────────────────────────────────────────────────────────────────

const WordpadMenu = ({
    windowPosition,
    onNew,
    onClose,
    showStatusBar,
    onToggleStatusBar,
    editorRef,
    onOpen,
    onSave,
    onSaveAs,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
    globalVolume,
    globalMuted,
    plusTheme,
    onError,
    onInsertDateTime,
    openModal,
    setOpenModal,
    showFormatBar,
    showToolbar,
    showRuler,
    onToggleFormatBar,
    onToggleRuler,
    onToggleToolbar,
    selectedFont,
    setSelectedFont,
    selectedSize,
    setSelectedSize,
    onBullet,
    bulletActive,
    onBrowseObject,
    onObjectFileConsumed,
    pickedObjectFile,
    onEmbedPaintbrush,
}: WordpadMenuProps) => {
    // ── State ──────────────────────────────────────────────────────────────────
    const [openMenu, setOpenMenu] = useState<'file' | 'edit' | 'view' | 'insert' | 'format' | 'help' | null>(null);

    // Font dialog reads these from the current selection when opened
    const [fontStrikeout, setFontStrikeout] = useState(false);
    const [fontUnderline, setFontUnderline] = useState(false);
    const [fontColor,     setFontColor]     = useState('#000000');
    const [paragraphValues, setParagraphValues] = useState({
        left: '0"', right: '0"', firstLine: '0"', alignment: 'Left',
    });

    // Saved before the menu steals focus so the Font modal can restore it
    const savedFontSelection = useRef<Range | null>(null);

    const menuRef = useRef<HTMLMenuElement>(null);

    // ── Sound ──────────────────────────────────────────────────────────────────
    const sounds = useSound(globalVolume, globalMuted);
    const themeSound = plusTheme === 'aquarium' ? sounds.aquarium
        : plusTheme === 'davinci' ? sounds.daVinci
        : plusTheme === 'nature' ? sounds.nature
        : plusTheme === 'space' ? sounds.space
        : null;
    const playStartMenu = () => themeSound ? themeSound.playMenuCmd() : sounds.playStartMenu();

    // ── Effects ────────────────────────────────────────────────────────────────

    // Close menu on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node))
                setOpenMenu(null);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // ── Helpers ────────────────────────────────────────────────────────────────

    // Modals are positioned relative to the window so they don't jump on drag
    const modalStyle = {
        position: 'fixed' as const,
        top:  windowPosition.y + 145,
        left: windowPosition.x + 90,
    };

    // ── Render ─────────────────────────────────────────────────────────────────

    return (
        <menu
            ref={menuRef}
            className='app-menu is-white wordpad-menu'
            onMouseDown={(e) => {
                // prevent menu clicks from stealing focus and losing the editor selection
                e.preventDefault();
                const sel = window.getSelection();
                if (sel && sel.rangeCount > 0)
                    savedFontSelection.current = sel.getRangeAt(0).cloneRange();
            }}
        >
            <ul>
                {/* FILE */}
                <li
                    onClick={() => setOpenMenu(openMenu === 'file' ? null : 'file')}
                    onMouseEnter={() => openMenu !== null && setOpenMenu('file')}
                >
                    <span className='mnemonic'>F</span>ile
                    <ul className={`submenu ${openMenu === 'file' ? 'open' : ''}`}>
                        <li onClick={() => { playStartMenu(); onNew();    setOpenMenu(null); }}><span className='mnemonic'>N</span>ew <span>Ctrl+N</span></li>
                        <li onClick={() => { playStartMenu(); onOpen();   setOpenMenu(null); }}><span className='mnemonic'>O</span>pen... <span>Ctrl+O</span></li>
                        <li onClick={() => { playStartMenu(); onSave();   setOpenMenu(null); }}><span className='mnemonic'>S</span>ave <span>Ctrl+S</span></li>
                        <li onClick={() => { playStartMenu(); onSaveAs(); setOpenMenu(null); }}>Save <span className='mnemonic'>A</span>s...</li>
                        <li className='separator' aria-hidden='true' />
                        <li className='is-disabled'>Page Set<span className='mnemonic'>u</span>p...</li>
                        <li onClick={() => { playStartMenu(); onError?.('printerConnect'); setOpenMenu(null); }}>
                            <span className='mnemonic'>P</span>rint... <span>Ctrl+P</span>
                        </li>
                        <li className='separator' aria-hidden='true' />
                        <li onClick={() => { playStartMenu(); onClose(); }}>E<span className='mnemonic'>x</span>it</li>
                    </ul>
                </li>

                {/* EDIT */}
                <li
                    onClick={() => setOpenMenu(openMenu === 'edit' ? null : 'edit')}
                    onMouseEnter={() => openMenu !== null && setOpenMenu('edit')}
                >
                    <span className='mnemonic'>E</span>dit
                    <ul className={`submenu ${openMenu === 'edit' ? 'open' : ''}`}>
                        <li
                            className={!canUndo ? 'is-disabled' : ''}
                            onClick={canUndo ? () => { playStartMenu(); onUndo(); setOpenMenu(null); } : undefined}
                        >
                            <span className='mnemonic'>U</span>ndo <span>Ctrl+Z</span>
                        </li>
                        <li
                            className={!canRedo ? 'is-disabled' : ''}
                            onClick={canRedo ? () => { playStartMenu(); onRedo(); setOpenMenu(null); } : undefined}
                        >
                            <span className='mnemonic'>R</span>edo <span>Ctrl+Y</span>
                        </li>
                        <li className='separator' aria-hidden='true' />
                        <li className='is-disabled'>Cu<span className='mnemonic'>t</span> <span>Ctrl+X</span></li>
                        <li className='is-disabled'><span className='mnemonic'>C</span>opy <span>Ctrl+C</span></li>
                        <li className='is-disabled'><span className='mnemonic'>P</span>aste <span>Ctrl+V</span></li>
                        <li className='is-disabled'>Paste <span className='mnemonic'>S</span>pecial...</li>
                        <li className='is-disabled'>Cle<span className='mnemonic'>a</span>r <span>Del</span></li>
                        <li className='is-disabled'>Select A<span className='mnemonic'>l</span>l <span>Ctrl+A</span></li>
                        <li className='separator' aria-hidden='true' />
                        <li onClick={() => { playStartMenu(); setOpenModal('find');    setOpenMenu(null); }}><span className='mnemonic'>F</span>ind... <span>Ctrl+F</span></li>
                        <li onClick={() => { playStartMenu(); setOpenModal('find');    setOpenMenu(null); }}>Find <span className='mnemonic'>N</span>ext <span>F3</span></li>
                        <li onClick={() => { playStartMenu(); setOpenModal('replace'); setOpenMenu(null); }}>R<span className='mnemonic'>e</span>place... <span>Ctrl+H</span></li>
                        <li className='separator' aria-hidden='true' />
                        <li className='is-disabled'>Lin<span className='mnemonic'>k</span>s...</li>
                        <li className='is-disabled'>Object Propert<span className='mnemonic'>i</span>es <span>Alt+Enter</span></li>
                        <li className='is-disabled'><span className='mnemonic'>O</span>bject</li>
                    </ul>
                </li>

                {/* VIEW */}
                <li
                    onClick={() => setOpenMenu(openMenu === 'view' ? null : 'view')}
                    onMouseEnter={() => openMenu !== null && setOpenMenu('view')}
                >
                    <span className='mnemonic'>V</span>iew
                    <ul className={`submenu ${openMenu === 'view' ? 'open' : ''}`}>
                        <li className={showToolbar   ? 'checked' : ''} onClick={() => { playStartMenu(); onToggleToolbar();   setOpenMenu(null); }}><span className='mnemonic'>T</span>oolbar</li>
                        <li className={showFormatBar ? 'checked' : ''} onClick={() => { playStartMenu(); onToggleFormatBar(); setOpenMenu(null); }}><span className='mnemonic'>F</span>ormat Bar</li>
                        <li className={showRuler     ? 'checked' : ''} onClick={() => { playStartMenu(); onToggleRuler();     setOpenMenu(null); }}><span className='mnemonic'>R</span>uler</li>
                        <li className={showStatusBar ? 'checked' : ''} onClick={() => { playStartMenu(); onToggleStatusBar(); setOpenMenu(null); }}><span className='mnemonic'>S</span>tatus Bar</li>
                        <li className='separator' aria-hidden='true' />
                        <li className='is-disabled'><span className='mnemonic'>O</span>ptions...</li>
                    </ul>
                </li>

                {/* INSERT */}
                <li
                    onClick={() => setOpenMenu(openMenu === 'insert' ? null : 'insert')}
                    onMouseEnter={() => openMenu !== null && setOpenMenu('insert')}
                >
                    <span className='mnemonic'>I</span>nsert
                    <ul className={`submenu ${openMenu === 'insert' ? 'open' : ''}`}>
                        <li onClick={() => { playStartMenu(); onInsertDateTime();      setOpenMenu(null); }}><span className='mnemonic'>D</span>ate and Time...</li>
                        <li onClick={() => { playStartMenu(); setOpenModal('object'); setOpenMenu(null); }}><span className='mnemonic'>O</span>bject...</li>
                    </ul>
                </li>

                {/* FORMAT */}
                <li
                    onClick={() => setOpenMenu(openMenu === 'format' ? null : 'format')}
                    onMouseEnter={() => openMenu !== null && setOpenMenu('format')}
                >
                    F<span className='mnemonic'>o</span>rmat
                    <ul className={`submenu ${openMenu === 'format' ? 'open' : ''}`}>
                        <li onClick={() => {
                            playStartMenu();
                            // restore selection before querying format state so readings are accurate
                            if (savedFontSelection.current) {
                                const sel = window.getSelection();
                                sel?.removeAllRanges();
                                sel?.addRange(savedFontSelection.current);
                            }
                            setFontStrikeout(document.queryCommandState('strikeThrough'));
                            setFontUnderline(document.queryCommandState('underline'));
                            const color = document.queryCommandValue('foreColor');
                            if (color) {
                                const m = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
                                if (m) setFontColor('#' + [m[1], m[2], m[3]].map(n => parseInt(n).toString(16).padStart(2, '0')).join(''));
                            }
                            setOpenModal('font');
                            setOpenMenu(null);
                        }}>
                            <span className='mnemonic'>F</span>ont...
                        </li>
                        <li
                            className={bulletActive ? 'checked' : ''}
                            onClick={() => { playStartMenu(); onBullet(); setOpenMenu(null); }}
                        >
                            <span className='mnemonic'>B</span>ullet Style
                        </li>
                        <li 
                            onClick={() => { playStartMenu(); setOpenModal('paragraph'); setOpenMenu(null); }}><span 
                            className='mnemonic'
                        >P</span>aragraph...</li>
                        <li className='is-disabled'><span className='mnemonic'>T</span>abs...</li>
                    </ul>
                </li>

                {/* HELP */}
                <li
                    onClick={() => setOpenMenu(openMenu === 'help' ? null : 'help')}
                    onMouseEnter={() => openMenu !== null && setOpenMenu('help')}
                >
                    <span className='mnemonic'>H</span>elp
                    <ul className={`submenu ${openMenu === 'help' ? 'open' : ''}`}>
                        <li className='is-disabled'><span className='mnemonic'>H</span>elp Topics</li>
                        <li onClick={() => { playStartMenu(); setOpenModal('about'); setOpenMenu(null); }}><span className='mnemonic'>A</span>bout WordPad</li>
                    </ul>
                </li>
            </ul>

            {/* Modals — portalled to body so they appear above the window chrome */}

            {openModal === 'about' && createPortal(
                <AboutDialog
                    title='WordPad'
                    onClose={() => setOpenModal(null)}
                    style={modalStyle}
                />,
                document.body
            )}

            {openModal === 'find' && createPortal(
                <WordpadFindReplaceModal
                    onClose={() => setOpenModal(null)}
                    editorRef={editorRef}
                    mode='find'
                    style={modalStyle}
                    globalVolume={globalVolume}
                    globalMuted={globalMuted}
                    plusTheme={plusTheme}
                />,
                document.body
            )}

            {openModal === 'replace' && createPortal(
                <WordpadFindReplaceModal
                    onClose={() => setOpenModal(null)}
                    editorRef={editorRef}
                    mode='replace'
                    style={modalStyle}
                    globalVolume={globalVolume}
                    globalMuted={globalMuted}
                    plusTheme={plusTheme}
                />,
                document.body
            )}

            {openModal === 'dateTime' && createPortal(
                <DateAndTimeModal
                    onClose={() => setOpenModal(null)}
                    editorRef={editorRef}
                    style={modalStyle}
                    globalVolume={globalVolume}
                    globalMuted={globalMuted}
                    plusTheme={plusTheme}
                />,
                document.body
            )}

            {openModal === 'font' && createPortal(
                <WordpadFontModal
                    current={{
                        family:    selectedFont,
                        style:     'Regular',
                        size:      Number(selectedSize),
                        fontUrl:   '',
                        strikeout: fontStrikeout,
                        underline: fontUnderline,
                        color:     fontColor,
                    }}
                    onApply={(s) => {
                        setSelectedFont(s.family);
                        setSelectedSize(String(s.size));
                        setFontStrikeout(s.strikeout);
                        setFontUnderline(s.underline);
                        setFontColor(s.color);

                        editorRef.current?.focus();
                        if (savedFontSelection.current) {
                            const sel = window.getSelection();
                            sel?.removeAllRanges();
                            sel?.addRange(savedFontSelection.current);
                        }

                        const sel = window.getSelection();
                        const hasSelection = sel && sel.rangeCount > 0 && !sel.isCollapsed;

                        if (hasSelection) {
                            document.execCommand('fontName', false, s.family);
                            // fontSize only accepts 1–7; use 7 as marker then replace with px
                            document.execCommand('fontSize', false, '7');
                            editorRef.current?.querySelectorAll('font[size="7"]').forEach(el => {
                                el.removeAttribute('size');
                                (el as HTMLElement).style.fontSize = s.size + 'px';
                            });
                            document.execCommand('foreColor', false, s.color);

                            // force-toggle underline / strikethrough to the desired state
                            if (s.underline !== document.queryCommandState('underline'))   document.execCommand('underline',      false);
                            if (s.strikeout !== document.queryCommandState('strikeThrough')) document.execCommand('strikeThrough', false);
                        }
                    }}
                    onClose={() => setOpenModal(null)}
                    style={modalStyle}
                />,
                document.body
            )}

            {openModal === 'object' && createPortal(
                <ObjectModal
                    onClose={() => setOpenModal(null)}
                    editorRef={editorRef}
                    style={modalStyle}
                    globalVolume={globalVolume}
                    globalMuted={globalMuted}
                    plusTheme={plusTheme}
                    onBrowseObject={onBrowseObject}
                    pickedFile={pickedObjectFile}
                    onFileConsumed={onObjectFileConsumed}
                    onEmbedPaintbrush={onEmbedPaintbrush}
                />,
                document.body
            )}

            {openModal === 'paragraph' && createPortal(
                <ParagraphModal
                    onClose={() => setOpenModal(null)}
                    style={modalStyle}
                    globalVolume={globalVolume}
                    globalMuted={globalMuted}
                    plusTheme={plusTheme}
                    initialValues={paragraphValues}
                    onApply={(values) => {
                        setParagraphValues(values);

                        if (!editorRef.current) return;

                        const toPx = (v: string) => {
                            const num = parseFloat(v.replace('"', '').trim());
                            return isNaN(num) ? 0 : num * 96;
                        };

                        editorRef.current.style.paddingLeft  = (16 + toPx(values.left))  + 'px';
                        editorRef.current.style.paddingRight = (16 + toPx(values.right)) + 'px';
                        editorRef.current.style.textIndent   = toPx(values.firstLine) + 'px';
                        editorRef.current.style.textAlign    = values.alignment.toLowerCase();
                    }}
                />,
                document.body
            )}
        </menu>
    );
};

export default WordpadMenu;

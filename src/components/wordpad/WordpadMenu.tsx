import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import useSound from '../../hooks/useSound';
import AboutDialog from '../AboutDialog';
import WordpadFindReplaceModal from './WordpadFindReplaceModal';
import DateAndTimeModal from './DateAndTimeModal';
import WordpadFontModal from './WordpadFontModal';
import ObjectModal from './InsertObjectModal';
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
    openModal: 'about' | 'find' | 'replace' | 'dateTime' | 'font' | 'object' | null;
    setOpenModal: React.Dispatch<React.SetStateAction<'about' | 'find' | 'replace' | 'dateTime' | 'font' | 'object' | null>>;
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
                    File
                    <ul className={`submenu ${openMenu === 'file' ? 'open' : ''}`}>
                        <li onClick={() => { playStartMenu(); onNew();    setOpenMenu(null); }}>New <span>Ctrl+N</span></li>
                        <li onClick={() => { playStartMenu(); onOpen();   setOpenMenu(null); }}>Open... <span>Ctrl+O</span></li>
                        <li onClick={() => { playStartMenu(); onSave();   setOpenMenu(null); }}>Save <span>Ctrl+S</span></li>
                        <li onClick={() => { playStartMenu(); onSaveAs(); setOpenMenu(null); }}>Save As...</li>
                        <li className='separator' aria-hidden='true' />
                        <li className='is-disabled'>Page Setup...</li>
                        <li onClick={() => { playStartMenu(); onError?.('printerConnect'); setOpenMenu(null); }}>
                            Print... <span>Ctrl+P</span>
                        </li>
                        <li className='separator' aria-hidden='true' />
                        <li onClick={() => { playStartMenu(); onClose(); }}>Exit</li>
                    </ul>
                </li>

                {/* EDIT */}
                <li
                    onClick={() => setOpenMenu(openMenu === 'edit' ? null : 'edit')}
                    onMouseEnter={() => openMenu !== null && setOpenMenu('edit')}
                >
                    Edit
                    <ul className={`submenu ${openMenu === 'edit' ? 'open' : ''}`}>
                        <li
                            className={!canUndo ? 'is-disabled' : ''}
                            onClick={canUndo ? () => { playStartMenu(); onUndo(); setOpenMenu(null); } : undefined}
                        >
                            Undo <span>Ctrl+Z</span>
                        </li>
                        <li
                            className={!canRedo ? 'is-disabled' : ''}
                            onClick={canRedo ? () => { playStartMenu(); onRedo(); setOpenMenu(null); } : undefined}
                        >
                            Redo <span>Ctrl+Y</span>
                        </li>
                        <li className='separator' aria-hidden='true' />
                        <li className='is-disabled'>Cut <span>Ctrl+X</span></li>
                        <li className='is-disabled'>Copy <span>Ctrl+C</span></li>
                        <li className='is-disabled'>Paste <span>Ctrl+V</span></li>
                        <li className='is-disabled'>Paste Special...</li>
                        <li className='is-disabled'>Clear <span>Del</span></li>
                        <li className='is-disabled'>Select All <span>Ctrl+A</span></li>
                        <li className='separator' aria-hidden='true' />
                        <li onClick={() => { playStartMenu(); setOpenModal('find');    setOpenMenu(null); }}>Find... <span>Ctrl+F</span></li>
                        <li onClick={() => { playStartMenu(); setOpenModal('find');    setOpenMenu(null); }}>Find Next <span>F3</span></li>
                        <li onClick={() => { playStartMenu(); setOpenModal('replace'); setOpenMenu(null); }}>Replace... <span>Ctrl+H</span></li>
                        <li className='separator' aria-hidden='true' />
                        <li className='is-disabled'>Links...</li>
                        <li className='is-disabled'>Object Properties <span>Alt+Enter</span></li>
                        <li className='is-disabled'>Object</li>
                    </ul>
                </li>

                {/* VIEW */}
                <li
                    onClick={() => setOpenMenu(openMenu === 'view' ? null : 'view')}
                    onMouseEnter={() => openMenu !== null && setOpenMenu('view')}
                >
                    View
                    <ul className={`submenu ${openMenu === 'view' ? 'open' : ''}`}>
                        <li className={showToolbar   ? 'checked' : ''} onClick={() => { playStartMenu(); onToggleToolbar();   setOpenMenu(null); }}>Toolbar</li>
                        <li className={showFormatBar ? 'checked' : ''} onClick={() => { playStartMenu(); onToggleFormatBar(); setOpenMenu(null); }}>Format Bar</li>
                        <li className={showRuler     ? 'checked' : ''} onClick={() => { playStartMenu(); onToggleRuler();     setOpenMenu(null); }}>Ruler</li>
                        <li className={showStatusBar ? 'checked' : ''} onClick={() => { playStartMenu(); onToggleStatusBar(); setOpenMenu(null); }}>Status Bar</li>
                        <li className='separator' aria-hidden='true' />
                        <li className='is-disabled'>Options...</li>
                    </ul>
                </li>

                {/* INSERT */}
                <li
                    onClick={() => setOpenMenu(openMenu === 'insert' ? null : 'insert')}
                    onMouseEnter={() => openMenu !== null && setOpenMenu('insert')}
                >
                    Insert
                    <ul className={`submenu ${openMenu === 'insert' ? 'open' : ''}`}>
                        <li onClick={() => { playStartMenu(); onInsertDateTime();      setOpenMenu(null); }}>Date and Time...</li>
                        <li onClick={() => { playStartMenu(); setOpenModal('object'); setOpenMenu(null); }}>Object...</li>
                    </ul>
                </li>

                {/* FORMAT */}
                <li
                    onClick={() => setOpenMenu(openMenu === 'format' ? null : 'format')}
                    onMouseEnter={() => openMenu !== null && setOpenMenu('format')}
                >
                    Format
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
                            Font...
                        </li>
                        <li
                            className={bulletActive ? 'checked' : ''}
                            onClick={() => { playStartMenu(); onBullet(); setOpenMenu(null); }}
                        >
                            Bullet Style
                        </li>
                        <li className='is-disabled'>Paragraph...</li>
                        <li className='is-disabled'>Tabs...</li>
                    </ul>
                </li>

                {/* HELP */}
                <li
                    onClick={() => setOpenMenu(openMenu === 'help' ? null : 'help')}
                    onMouseEnter={() => openMenu !== null && setOpenMenu('help')}
                >
                    Help
                    <ul className={`submenu ${openMenu === 'help' ? 'open' : ''}`}>
                        <li className='is-disabled'>Help Topics</li>
                        <li onClick={() => { playStartMenu(); setOpenModal('about'); setOpenMenu(null); }}>About WordPad</li>
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
        </menu>
    );
};

export default WordpadMenu;

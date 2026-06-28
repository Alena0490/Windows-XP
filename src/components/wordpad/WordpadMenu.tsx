import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import useSound from '../../hooks/useSound';
import AboutDialog from '../AboutDialog';
import WordpadFindReplaceModal from './WordpadFindReplaceModal';
import DateAndTimeModal from './DateAndTimeModal';
import '../AppMenu.css';
import './Wordpad.css'

interface WordpadMenuProps {
    windowPosition: { x: number; y: number };
    onNew: () => void;
    onClose: () => void;
    showStatusBar: boolean;
    onToggleStatusBar: () => void;
    // wordWrap: boolean;
    // onToggleWordWrap: () => void;
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
    openModal: 'about' | 'find' | 'replace' | 'dateTime' | null;
    setOpenModal: React.Dispatch<React.SetStateAction<'about' | 'find' | 'replace' | 'dateTime' | null>>;
    showToolbar: boolean;
    onToggleToolbar: () => void;
    showFormatBar: boolean;
    onToggleFormatBar: () => void;
    showRuler: boolean;
    onToggleRuler: () => void;
}

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
    onToggleToolbar
}: WordpadMenuProps) => {
    const [openMenu, setOpenMenu] = useState<'file' | 'edit' | 'view' | 'insert' | 'format' | 'help' | null>(null);

    const sounds = useSound(globalVolume, globalMuted);
    const themeSound = plusTheme === 'aquarium' ? sounds.aquarium
        : plusTheme === 'davinci' ? sounds.daVinci
        : plusTheme === 'nature' ? sounds.nature
        : plusTheme === 'space' ? sounds.space
        : null;
    const playStartMenu = () => themeSound ? themeSound.playMenuCmd() : sounds.playStartMenu();
    const menuRef = useRef<HTMLMenuElement>(null);

     useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpenMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const modalStyle = {
        position: 'fixed' as const,
        top: windowPosition.y + 145,
        left: windowPosition.x + 90,
    };

  return (
    <menu ref={menuRef}  className='app-menu is-white wordpad-menu'>
        <ul>
            {/* FILE */}
            <li onClick={() => setOpenMenu(openMenu === 'file' ? null : 'file')} onMouseEnter={() => openMenu !== null && setOpenMenu('file')}>
                File
                <ul className={`submenu ${openMenu === 'file' ? 'open' : ''}`}>
                    <li onClick={() => { playStartMenu(); onNew(); setOpenMenu(null); }}>
                        New <span>Ctrl+N</span>
                    </li>
                    <li onClick={() => { playStartMenu(); onOpen(); setOpenMenu(null); }}>
                        Open... <span>Ctrl+O</span>
                    </li>
                    <li onClick={() => { playStartMenu(); onSave(); setOpenMenu(null); }}>
                        Save <span>Ctrl+S</span>
                    </li>
                    <li onClick={() => { playStartMenu(); onSaveAs(); setOpenMenu(null); }}>
                        Save As...
                    </li>
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
             <li onClick={() => setOpenMenu(openMenu === 'edit' ? null : 'edit')} onMouseEnter={() => openMenu !== null && setOpenMenu('edit')}>
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
                    {/* Cut/Copy/Paste přes execCommand — napojíš později */}
                    <li className='is-disabled'>Cut <span>Ctrl+X</span></li>
                    <li className='is-disabled'>Copy <span>Ctrl+C</span></li>
                    <li className='is-disabled'>Paste <span>Ctrl+V</span></li>
                    <li className='is-disabled'>Paste Special...</li>
                    <li className='is-disabled'>Clear <span>Del</span></li>
                    <li className='is-disabled'>Select All <span>Ctrl+A</span></li>
                    <li className='separator' aria-hidden='true' />
                    <li onClick={() => { playStartMenu(); setOpenModal('find'); setOpenMenu(null); }}>
                        Find... <span>Ctrl+F</span>
                    </li>
                    <li onClick={() => { playStartMenu(); setOpenModal('find'); setOpenMenu(null); }}>
                        Find Next <span>F3</span>
                    </li>
                    <li onClick={() => { playStartMenu(); setOpenModal('replace'); setOpenMenu(null); }}>
                        Replace... <span>Ctrl+H</span>
                    </li>
                    <li className='separator' aria-hidden='true' />
                    <li className='is-disabled'>Links...</li>
                    <li className='is-disabled'>Object Properties <span>Alt+Enter</span></li>
                    <li className='is-disabled'>Object</li>
                </ul>
            </li>
        
            {/* VIEW */}
            <li onClick={() => setOpenMenu(openMenu === 'view' ? null : 'view')} onMouseEnter={() => openMenu !== null && setOpenMenu('view')}>
                View
                <ul className={`submenu ${openMenu === 'view' ? 'open' : ''}`}>
                    <li 
                        className={showToolbar ? 'checked' : ''}
                        onClick={() => { playStartMenu(); onToggleToolbar(); setOpenMenu(null); }}
                        >Toolbar</li>
                    <li 
                        className={showFormatBar ? 'checked' : ''}
                        onClick={() => { playStartMenu(); onToggleFormatBar(); setOpenMenu(null); }}
                    >Format Bar</li>
                    <li 
                        className={showRuler ? 'checked' : ''}
                        onClick={() => { playStartMenu(); onToggleRuler(); setOpenMenu(null); }}
                    >Ruler</li>
                    <li
                        className={showStatusBar ? 'checked' : ''}
                        onClick={() => { playStartMenu(); onToggleStatusBar(); setOpenMenu(null); }}
                    >
                        Status Bar
                    </li>
                    <li className='separator' aria-hidden='true' />
                    <li className='is-disabled'>Options...</li>
                </ul>
            </li>

            {/* INSERT */}
            <li onClick={() => setOpenMenu(openMenu === 'insert' ? null : 'insert')} onMouseEnter={() => openMenu !== null && setOpenMenu('insert')}>
                Insert
                <ul className={`submenu ${openMenu === 'insert' ? 'open' : ''}`}>
                    <li onClick={() => { playStartMenu(); onInsertDateTime(); setOpenMenu(null); }}>
                        Date and Time...
                    </li>
                    <li className='is-disabled'>Object...</li>
                </ul>
            </li>

            {/* FORMAT */}
            <li onClick={() => setOpenMenu(openMenu === 'format' ? null : 'format')} onMouseEnter={() => openMenu !== null && setOpenMenu('format')}>
                Format
                <ul className={`submenu ${openMenu === 'format' ? 'open' : ''}`}>
                    <li className='is-disabled'>Font...</li>
                    <li className='is-disabled'>Bullet Style</li>
                    <li className='is-disabled'>Paragraph...</li>
                    <li className='is-disabled'>Tabs...</li>
                </ul>
            </li>

            {/* HELP */}
            <li onClick={() => setOpenMenu(openMenu === 'help' ? null : 'help')} onMouseEnter={() => openMenu !== null && setOpenMenu('help')}>
                Help
                <ul className={`submenu ${openMenu === 'help' ? 'open' : ''}`}>
                    <li className='is-disabled'>Help Topics</li>
                    <li onClick={() => { playStartMenu(); setOpenModal('about'); setOpenMenu(null); }}>
                        About WordPad
                    </li>
                </ul>
            </li>
        </ul>
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
    </menu>
  )
}

export default WordpadMenu

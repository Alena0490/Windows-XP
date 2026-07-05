import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import useSound from '../../hooks/useSound';
import AboutDialog from '../AboutDialog';
import FindReplaceModal from './FindReplaceModal';
import '../AppMenu.css';

interface NotepadMenuProps {
    windowPosition: { x: number; y: number };
    onNew: () => void;
    onClose: () => void;
    showStatusBar: boolean;
    onToggleStatusBar: () => void;
    wordWrap: boolean;
    onToggleWordWrap: () => void;
    textareaRef: React.RefObject<HTMLTextAreaElement | null>;
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
    openModal: 'about' | 'find' | 'replace' | null;
    setOpenModal: React.Dispatch<React.SetStateAction<'about' | 'find' | 'replace' | null>>;
}

const NotepadMenu = ({
    windowPosition,
    onClose,
    onNew,
    showStatusBar,
    onToggleStatusBar,
    wordWrap,
    onToggleWordWrap,
    textareaRef,
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
}: NotepadMenuProps) => {
    const [openMenu, setOpenMenu] = useState<'file' | 'edit' | 'format' | 'view' | 'help' | null>(null);

    const sounds = useSound(globalVolume, globalMuted);
    const themeSound = plusTheme === 'aquarium' ? sounds.aquarium
        : plusTheme === 'davinci' ? sounds.daVinci
        : plusTheme === 'nature' ? sounds.nature
        : plusTheme === 'space' ? sounds.space
        : null;
    const playStartMenu = () => themeSound ? themeSound.playMenuCmd() : sounds.playStartMenu();
    const menuRef = useRef<HTMLMenuElement>(null);

    // Close menu on outside click
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
        <menu ref={menuRef} className='app-menu is-white notepad-menu'>
            <ul>
                <li onClick={() => setOpenMenu(openMenu === 'file' ? null : 'file')} onMouseEnter={() => openMenu !== null && setOpenMenu('file')}>
                    <span className='mnemonic'>F</span>ile
                    <ul className={`submenu ${openMenu === 'file' ? 'open' : ''}`}>
                        <li onClick={() => { playStartMenu(); onNew(); setOpenMenu(null); }}>
                            <span className='mnemonic'>N</span>ew <span>Ctrl+N</span>
                        </li>
                        <li onClick={() => { playStartMenu(); onOpen(); setOpenMenu(null); }}>
                            <span className='mnemonic'>O</span>pen... <span>Ctrl+O</span>
                        </li>
                        <li onClick={() => { playStartMenu(); onSave(); setOpenMenu(null); }}>
                            <span className='mnemonic'>S</span>ave <span>Ctrl+S</span>
                        </li>
                        <li onClick={() => { playStartMenu(); onSaveAs(); setOpenMenu(null); }}>
                            Save <span className='mnemonic'>A</span>s...
                        </li>
                        <li className='separator' aria-hidden='true' />
                        <li className='is-disabled'>
                            Page Set<span className='mnemonic'>u</span>p...
                        </li>
                        <li onClick={() => { playStartMenu(); onError?.('printerConnect'); setOpenMenu(null); }}>
                            <span className='mnemonic'>P</span>rint... <span>Ctrl+P</span>
                        </li>
                        <li className='separator' aria-hidden='true' />
                        <li onClick={() => { playStartMenu(); onClose(); }}>
                            E<span className='mnemonic'>x</span>it
                        </li>
                    </ul>
                </li>

                <li onClick={() => setOpenMenu(openMenu === 'edit' ? null : 'edit')} onMouseEnter={() => openMenu !== null && setOpenMenu('edit')}>
                    <span className='mnemonic'>E</span>dit
                    <ul className={`submenu ${openMenu === 'edit' ? 'open' : ''}`}>
                        <li
                            className={!canUndo ? 'is-disabled' : ''}
                            onClick={canUndo ? () => { playStartMenu(); onUndo(); } : undefined}
                        >
                            <span className='mnemonic'>U</span>ndo <span>Ctrl+Z</span>
                        </li>
                        <li
                            className={!canRedo ? 'is-disabled' : ''}
                            onClick={canRedo ? () => { playStartMenu(); onRedo(); } : undefined}
                        >
                            <span className='mnemonic'>R</span>edo <span>Ctrl+Y</span>
                        </li>
                        <li className='separator' aria-hidden='true' />
                        <li className='is-disabled'>
                            Cu<span className='mnemonic'>t</span> <span>Ctrl+X</span>
                        </li>
                         <li className='is-disabled'>
                            <span className='mnemonic'>C</span>opy <span>Ctrl+C</span>
                        </li>
                         <li className='is-disabled'>
                            <span className='mnemonic'>P</span>aste <span>Ctrl+V</span>
                        </li>
                         <li className='is-disabled'>
                            De<span className='mnemonic'>l</span>ete <span>Del</span>
                        </li>
                        <li className='separator' aria-hidden='true' />
                        <li onClick={() => { playStartMenu(); setOpenModal('find'); setOpenMenu(null); }}>
                            <span className='mnemonic'>F</span>ind... <span>Ctrl+F</span>
                        </li>
                        <li onClick={() => { playStartMenu(); setOpenModal('find'); setOpenMenu(null); }}>
                            Find <span className='mnemonic'>N</span>ext <span>F3</span>
                        </li>
                        <li onClick={() => { playStartMenu(); setOpenModal('replace'); setOpenMenu(null); }}>
                            <span className='mnemonic'>R</span>eplace... <span>Ctrl+H</span>
                        </li>
                        <li onClick={() => { playStartMenu(); setOpenModal('replace'); setOpenMenu(null); }}>
                            <span className='mnemonic'>G</span>o To... <span>Ctrl+H</span>
                        </li>
                        <li className='separator' aria-hidden='true' />
                         <li onClick={() => { playStartMenu(); setOpenModal('replace'); setOpenMenu(null); }}>
                            Select A<span className='mnemonic'>l</span>l <span>Ctrl+A</span>
                        </li>
                        <li onClick={() => { playStartMenu(); onInsertDateTime(); setOpenMenu(null); }}>
                            Time/<span className='mnemonic'>D</span>ate <span>F5</span>
                        </li>
                    </ul>
                </li>

                <li onClick={() => setOpenMenu(openMenu === 'format' ? null : 'format')} onMouseEnter={() => openMenu !== null && setOpenMenu('format')}>
                    F<span className='mnemonic'>o</span>rmat
                    <ul className={`submenu ${openMenu === 'format' ? 'open' : ''}`}>
                        <li
                            className={wordWrap ? 'checked' : ''}
                            onClick={() => { playStartMenu(); onToggleWordWrap(); setOpenMenu(null); }}
                        >
                            <span className='mnemonic'>W</span>ord Wrap
                        </li>
                        <li className='is-disabled'>
                            <span className='mnemonic'>F</span>ont...
                        </li>
                    </ul>
                </li>

                <li onClick={() => setOpenMenu(openMenu === 'view' ? null : 'view')} onMouseEnter={() => openMenu !== null && setOpenMenu('view')}>
                    <span className='mnemonic'>V</span>iew
                    <ul className={`submenu ${openMenu === 'view' ? 'open' : ''}`}>
                        <li
                            className={showStatusBar ? 'checked' : ''}
                            onClick={() => { playStartMenu(); onToggleStatusBar(); setOpenMenu(null); }}
                        >
                            <span className='mnemonic'>S</span>tatus Bar
                        </li>
                    </ul>
                </li>

                <li onClick={() => setOpenMenu(openMenu === 'help' ? null : 'help')} onMouseEnter={() => openMenu !== null && setOpenMenu('help')}>
                    <span className='mnemonic'>H</span>elp
                    <ul className={`submenu ${openMenu === 'help' ? 'open' : ''}`}>
                        <li className='is-disabled'><span className='mnemonic'>H</span>elp Topics</li>
                        <li onClick={() => { playStartMenu(); setOpenModal('about'); setOpenMenu(null); }}>
                            <span className='mnemonic'>A</span>bout Notepad
                        </li>
                    </ul>
                </li>
            </ul>

            {openModal === 'about' && createPortal(
                <AboutDialog
                    title='Notepad'
                    onClose={() => setOpenModal(null)}
                    style={modalStyle}
                />,
                document.body
            )}

            {openModal === 'find' && createPortal(
                <FindReplaceModal
                    onClose={() => setOpenModal(null)}
                    textareaRef={textareaRef}
                    mode='find'
                    style={modalStyle}
                    globalVolume={globalVolume}
                    globalMuted={globalMuted}
                    plusTheme={plusTheme}
                />,
                document.body
            )}

            {openModal === 'replace' && createPortal(
                <FindReplaceModal
                    onClose={() => setOpenModal(null)}
                    textareaRef={textareaRef}
                    mode='replace'
                    style={modalStyle}
                    globalVolume={globalVolume}
                    globalMuted={globalMuted}
                    plusTheme={plusTheme}
                />,
                document.body
            )}
        </menu>
    );
};

export default NotepadMenu;
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
                <li onClick={() => setOpenMenu(openMenu === 'file' ? null : 'file')}>
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
                        <li className='is-disabled'>
                            Page Setup...
                        </li>
                        <li onClick={() => { playStartMenu(); onError?.('printerConnect'); setOpenMenu(null); }}>
                            Print... <span>Ctrl+P</span>
                        </li>
                        <li className='separator' aria-hidden='true' />
                        <li onClick={() => { playStartMenu(); onClose(); }}>
                            Exit
                        </li>
                    </ul>
                </li>

                <li onClick={() => setOpenMenu(openMenu === 'edit' ? null : 'edit')}>
                    Edit
                    <ul className={`submenu ${openMenu === 'edit' ? 'open' : ''}`}>
                        <li
                            className={!canUndo ? 'is-disabled' : ''}
                            onClick={canUndo ? () => { playStartMenu(); onUndo(); } : undefined}
                        >
                            Undo <span>Ctrl+Z</span>
                        </li>
                        <li
                            className={!canRedo ? 'is-disabled' : ''}
                            onClick={canRedo ? () => { playStartMenu(); onRedo(); } : undefined}
                        >
                            Redo <span>Ctrl+Y</span>
                        </li>
                        <li className='separator' aria-hidden='true' />
                        <li className='is-disabled'>
                            Cut <span>Ctrl+X</span>
                        </li>
                         <li className='is-disabled'>
                            Copy <span>Ctrl+C</span>
                        </li>
                         <li className='is-disabled'>
                            Paste <span>Ctrl+V</span>
                        </li>
                         <li className='is-disabled'>
                            Delete <span>Del</span>
                        </li>
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
                        <li onClick={() => { playStartMenu(); setOpenModal('replace'); setOpenMenu(null); }}>
                            Go To... <span>Ctrl+H</span>
                        </li>
                        <li className='separator' aria-hidden='true' />
                         <li onClick={() => { playStartMenu(); setOpenModal('replace'); setOpenMenu(null); }}>
                            Select All <span>Ctrl+A</span>
                        </li>
                        <li onClick={() => { playStartMenu(); onInsertDateTime(); setOpenMenu(null); }}>
                            Time/Date <span>F5</span>
                        </li>
                    </ul>
                </li>

                <li onClick={() => setOpenMenu(openMenu === 'format' ? null : 'format')}>
                    Format
                    <ul className={`submenu ${openMenu === 'format' ? 'open' : ''}`}>
                        <li
                            className={wordWrap ? 'checked' : ''}
                            onClick={() => { playStartMenu(); onToggleWordWrap(); setOpenMenu(null); }}
                        >
                            Word Wrap
                        </li>
                        <li className='is-disabled'>
                            Font...
                        </li>
                    </ul>
                </li>

                <li onClick={() => setOpenMenu(openMenu === 'view' ? null : 'view')}>
                    View
                    <ul className={`submenu ${openMenu === 'view' ? 'open' : ''}`}>
                        <li
                            className={showStatusBar ? 'checked' : ''}
                            onClick={() => { playStartMenu(); onToggleStatusBar(); setOpenMenu(null); }}
                        >
                            Status Bar
                        </li>
                    </ul>
                </li>

                <li onClick={() => setOpenMenu(openMenu === 'help' ? null : 'help')}>
                    Help
                    <ul className={`submenu ${openMenu === 'help' ? 'open' : ''}`}>
                        <li className='is-disabled'>Help Topics</li>
                        <li onClick={() => { playStartMenu(); setOpenModal('about'); setOpenMenu(null); }}>
                            About Notepad
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
                />,
                document.body
            )}

            {openModal === 'replace' && createPortal(
                <FindReplaceModal
                    onClose={() => setOpenModal(null)}
                    textareaRef={textareaRef}
                    mode='replace'
                    style={modalStyle}
                />,
                document.body
            )}
        </menu>
    );
};

export default NotepadMenu;
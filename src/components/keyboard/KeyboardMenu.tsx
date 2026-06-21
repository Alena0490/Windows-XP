import { useRef, useEffect, useState } from "react";
import { createPortal } from 'react-dom';
import AboutDialog from '../AboutDialog';
import KeyboardWelcome from './KeyboardWelcome';
import useSound from '../../hooks/useSound';

interface KeyboardMenuProps {
    openModal: 'about' | 'welcome' | null;
    setOpenModal: React.Dispatch<React.SetStateAction<'about' | 'welcome' | null>>;
    onClose: () => void;
    globalVolume: number;
    globalMuted: boolean;
    plusTheme?: 'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
    view: 'enhanced' | 'standard';
    setView: (v: 'enhanced' | 'standard') => void;
    clickSound: boolean;
    setClickSound: (v: boolean) => void;
    keys: 101 | 102;
    setKeys: (v: 101 | 102) => void;
}

const KeyboardMenu = ({ 
    openModal, 
    setOpenModal, 
    onClose, 
    globalVolume, 
    globalMuted, 
    plusTheme,
    view,
    setView,
    clickSound,
    setClickSound,
    keys,
    setKeys 
}: KeyboardMenuProps) => {
    const sounds = useSound(globalVolume, globalMuted);
    const themeSound = plusTheme === 'aquarium' ? sounds.aquarium
        : plusTheme === 'davinci' ? sounds.daVinci
        : plusTheme === 'nature' ? sounds.nature
        : plusTheme === 'space' ? sounds.space
        : null;
    const playStartMenu = () => themeSound ? themeSound.playMenuCmd() : sounds.playStartMenu();
    const menuRef = useRef<HTMLElement>(null);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    const modalStyle = {
        position: 'fixed' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    };

    const closeMenu = () => setActiveMenu(null);
    const toggle = (name: string) => setActiveMenu(prev => prev === name ? null : name);

    // Close menu by clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setActiveMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <menu className='keyboard-menu app-menu is-white' ref={menuRef} onMouseDown={e => e.stopPropagation()}>
            <ul>
                <li onClick={() => toggle('file')} onMouseEnter={() => activeMenu !== null && setActiveMenu('file')}>
                    <span className="mnemonic">F</span>ile
                    <ul className={`submenu ${activeMenu === 'file' ? 'open' : ''}`}>
                        <li onClick={() => { playStartMenu(); closeMenu(); onClose(); }}>
                            E<span className="mnemonic">x</span>it
                        </li>
                    </ul>
                </li>

                <li onClick={() => toggle('keyboard')} onMouseEnter={() => activeMenu !== null && setActiveMenu('keyboard')}>
                    <span className="mnemonic">K</span>eyboard
                    <ul className={`submenu ${activeMenu === 'keyboard' ? 'open' : ''}`}>
                        <li className={view === 'enhanced' ? 'is-bullet' : ''} onClick={() => { playStartMenu(); closeMenu(); setView('enhanced'); }}><span className="mnemonic">E</span>nhanced Keyboard</li>
                        <li className={view === 'standard' ? 'is-bullet' : ''} onClick={() => { playStartMenu(); closeMenu(); setView('standard'); }}><span className="mnemonic">S</span>tandard Keyboard</li>
                        <li className="separator" />
                        <li className="is-bullet is-disabled"><span className="mnemonic">R</span>egular Layout</li>
                        <li className="is-disabled"><span className="mnemonic">B</span>lock Layout</li>
                        <li className="separator" />
                        <li
                            className={keys === 101 ? 'is-bullet' : ''}
                            onClick={() => { closeMenu(); setKeys(101); }}
                        >101 keys</li>
                        <li
                            className={keys === 102 ? 'is-bullet' : ''}
                            onClick={() => { closeMenu(); setKeys(102); }}
                        >102 keys</li>
                        <li className="is-disabled">106 keys</li>
                    </ul>
                </li>

                <li onClick={() => toggle('settings')} onMouseEnter={() => activeMenu !== null && setActiveMenu('settings')}>
                    <span className="mnemonic">S</span>ettings
                    <ul className={`submenu ${activeMenu === 'settings' ? 'open' : ''}`}>
                        <li className="checked is-disabled"><span className="mnemonic">A</span>lways on Top</li>
                        <li className={clickSound ? 'checked' : ''} onClick={() => { playStartMenu(); closeMenu(); setClickSound(!clickSound); }}><span className="mnemonic">U</span>se Click Sound</li>
                        <li className="separator" />
                        <li className="is-disabled"><span className="mnemonic">T</span>yping Mode ...</li>
                        <li className="is-disabled"><span className="mnemonic">F</span>ont ...</li>
                    </ul>
                </li>

                <li onClick={() => toggle('help')} onMouseEnter={() => activeMenu !== null && setActiveMenu('help')}>
                    <span className="mnemonic">H</span>elp
                    <ul className={`submenu ${activeMenu === 'help' ? 'open' : ''}`}>
                        <li className="is-disabled"><span className="mnemonic">C</span>ontents</li>
                        <li onClick={() => { playStartMenu(); closeMenu(); setOpenModal('about'); }}>
                            <span className="mnemonic">A</span>bout On-Screen Keyboard...
                        </li>
                    </ul>
                </li>
            </ul>

            {openModal === 'about' && createPortal(
                <AboutDialog
                    title='On-Screen Keyboard'
                    onClose={() => setOpenModal(null)}
                    style={modalStyle}
                />,
                document.body
            )}

            {openModal === 'welcome' && createPortal(
                <KeyboardWelcome
                    style={modalStyle}
                    onClose={(dontShowAgain: boolean) => {
                        if (dontShowAgain) localStorage.setItem('osk-hide-welcome', 'true');
                        setOpenModal(null);
                    }}
                />,
                document.body
            )}
        </menu>
    );
};

export default KeyboardMenu;
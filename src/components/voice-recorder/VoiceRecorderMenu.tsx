import { useState, useEffect, useRef } from 'react';
import '../AppMenu.css';

type OpenMenu = 'file' | 'edit' | 'effects' | 'help' | null;

interface VoiceRecorderMenuProps {
    onClose: () => void;
    onMenuCommand?: () => void;
    onOpenAbout?: () => void;
}

const VoiceRecorderMenu = ({onClose, onMenuCommand, onOpenAbout }:VoiceRecorderMenuProps) => {
        const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
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
    
        const toggle = (menu: OpenMenu) => {
            onMenuCommand?.();
            setOpenMenu(openMenu === menu ? null : menu);
        };

        const hover = (menu: OpenMenu) => { if (openMenu !== null) setOpenMenu(menu); };

    return (
        <menu className='app-menu recorder-menu is-white' role='menu'>
            <ul>
                <li onClick={() => toggle('file')} onMouseEnter={() => hover('file')}>
                    <span className='mnemonics'>F</span>ile
                    <ul className={`submenu ${openMenu === 'file' ? 'open' : ''}`}>
                        <li>New</li>
                        <li>Open...</li>
                        <li>Save</li>
                        <li>Save As...</li>
                        <li>Revert...</li>
                        <li>Properties</li>
                        <li className='separator' aria-hidden tabIndex={-1}></li>
                        <li onClick={onClose}>Exit</li>
                    </ul>
                </li>

                <li onClick={() => toggle('edit')} onMouseEnter={() => hover('edit')}>
                    <span className='mnemonics'>E</span>dit
                    <ul className={`submenu ${openMenu === 'edit' ? 'open' : ''}`}>
                        <li>Copy <span>Ctrl+C</span></li>
                        <li>Paste Insert <span>Ctrl+V</span></li>
                        <li>Paste Mix</li>
                        <li className='separator' aria-hidden tabIndex={-1}></li>
                        <li>Insert File...</li>
                        <li>Mix With File...</li>
                        <li className='separator' aria-hidden tabIndex={-1}></li>
                        <li>Delete Before Current Position</li>
                        <li>Delete After Current Position</li>
                        <li className='separator' aria-hidden tabIndex={-1}></li>
                        <li>Audio Properties</li>
                    </ul>
                </li>

                <li onClick={() => toggle('effects')} onMouseEnter={() => hover('effects')}>
                    Eff<span className='mnemonics'>c</span>ts
                    <ul className={`submenu ${openMenu === 'effects' ? 'open' : ''}`}>
                        <li>Increase Volume (by 25%)</li>
                        <li>Decrease Volume</li>
                        <li className='separator' aria-hidden tabIndex={-1}></li>
                        <li>Increase Speed (by 100%)</li>
                        <li>Decrease Speed</li>
                        <li className='separator' aria-hidden tabIndex={-1}></li>
                        <li>Add Echo</li>
                        <li>Reverse</li>
                    </ul>
                </li>

                <li onClick={() => toggle('help')} onMouseEnter={() => hover('help')}>
                    <span className='mnemonics'>H</span>elp
                    <ul className={`submenu ${openMenu === 'help' ? 'open' : ''}`}>
                        <li>Help Topics</li>
                        <li className='separator' aria-hidden tabIndex={-1}></li>
                        <li onClick={() => onOpenAbout?.()}>About Sound Recorder</li>
                    </ul>
                </li>
            </ul>
        </menu>
    )
}

export default VoiceRecorderMenu

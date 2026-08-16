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
                        <li className='is-disabled'>New</li>
                        <li className='is-disabled'>Open...</li>
                        <li className='is-disabled'>Save</li>
                        <li className='is-disabled'>Save As...</li>
                        <li className='is-disabled'>Revert...</li>
                        <li className='is-disabled'>Properties</li>
                        <li className='separator' aria-hidden tabIndex={-1}></li>
                        <li onClick={onClose}>Exit</li>
                    </ul>
                </li>

                <li onClick={() => toggle('edit')} onMouseEnter={() => hover('edit')}>
                    <span className='mnemonics'>E</span>dit
                    <ul className={`submenu ${openMenu === 'edit' ? 'open' : ''}`}>
                        <li className='is-disabled'>Copy <span>Ctrl+C</span></li>
                        <li className='is-disabled'>Paste Insert <span>Ctrl+V</span></li>
                        <li className='is-disabled'>Paste Mix</li>
                        <li className='separator' aria-hidden tabIndex={-1}></li>
                        <li className='is-disabled'>Insert File...</li>
                        <li className='is-disabled'>Mix With File...</li>
                        <li className='separator' aria-hidden tabIndex={-1}></li>
                        <li className='is-disabled'>Delete Before Current Position</li>
                        <li className='is-disabled'>Delete After Current Position</li>
                        <li className='separator' aria-hidden tabIndex={-1}></li>
                        <li className='is-disabled'>Audio Properties</li>
                    </ul>
                </li>

                <li onClick={() => toggle('effects')} onMouseEnter={() => hover('effects')}>
                    Eff<span className='mnemonics'>c</span>ts
                    <ul className={`submenu ${openMenu === 'effects' ? 'open' : ''}`}>
                        <li className='is-disabled'>Increase Volume (by 25%)</li>
                        <li className='is-disabled'>Decrease Volume</li>
                        <li className='separator' aria-hidden tabIndex={-1}></li>
                        <li className='is-disabled'>Increase Speed (by 100%)</li>
                        <li className='is-disabled'>Decrease Speed</li>
                        <li className='separator' aria-hidden tabIndex={-1}></li>
                        <li className='is-disabled'>Add Echo</li>
                        <li className='is-disabled'>Reverse</li>
                    </ul>
                </li>

                <li onClick={() => toggle('help')} onMouseEnter={() => hover('help')}>
                    <span className='mnemonics'>H</span>elp
                    <ul className={`submenu ${openMenu === 'help' ? 'open' : ''}`}>
                        <li className='is-disabled'>Help Topics</li>
                        <li className='separator' aria-hidden tabIndex={-1}></li>
                        <li onClick={() => onOpenAbout?.()}>About Sound Recorder</li>
                    </ul>
                </li>
            </ul>
        </menu>
    )
}

export default VoiceRecorderMenu

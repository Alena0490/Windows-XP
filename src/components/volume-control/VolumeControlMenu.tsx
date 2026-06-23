import { useState, useEffect, useRef } from "react"
import useSound from '../../hooks/useSound';

interface VolumeControlMenuProps {
    onClose: () => void;
    globalVolume: number;
    globalMuted: boolean;
    plusTheme?: 'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
    onAbout: () => void;
}

const VolumeControlMenu = ({
    onClose, 
    globalVolume, 
    globalMuted, 
    plusTheme, 
    onAbout
}:VolumeControlMenuProps) => {
    const sounds = useSound(globalVolume, globalMuted);
    const themeSound = plusTheme === 'aquarium' ? sounds.aquarium
        : plusTheme === 'davinci' ? sounds.daVinci
        : plusTheme === 'nature' ? sounds.nature
        : plusTheme === 'space' ? sounds.space
        : null;
    const playStartMenu = () => themeSound ? themeSound.playMenuCmd() : sounds.playStartMenu();
    const menuRef = useRef<HTMLElement>(null);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    
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
    <menu ref={menuRef} className='app-menu is-white volume-control-menu'>
        <ul>
            <li onClick={() => toggle('options')} onMouseEnter={() => activeMenu !== null && setActiveMenu('options')}>
                <span className="mnemonic">O</span>ptions
                <ul className={`submenu ${activeMenu === 'options' ? 'open' : ''}`}>
                    <li className="is-disabled"><span className="mnemonic">P</span>roperties</li>
                    <li className="is-disabled"><span className="mnemonic">A</span>dvanced Controls</li>
                    <li className='separator' aria-hidden='true' />
                    <li onClick={() => { playStartMenu(); onClose(); }}>E<span className="mnemonic">x</span>it</li>
                </ul>
            </li>
            <li onClick={() => toggle('help')} onMouseEnter={() => activeMenu !== null && setActiveMenu('help')}>
                <span className="mnemonic">H</span>elp
                <ul className={`submenu ${activeMenu === 'help' ? 'open' : ''}`}>
                    <li className="is-disabled"><span className="mnemonic">H</span>elp Topics</li>
                    <li className='separator' aria-hidden='true' />
                    <li onClick={() => { playStartMenu(); closeMenu(); onAbout(); }}>
                        <span className="mnemonic">A</span>bout Volume Control
                    </li>
                </ul>
            </li>
        </ul>
    </menu>
  )
}

export default VolumeControlMenu
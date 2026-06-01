import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import useSound from '../../hooks/useSound';
import AboutDialog from '../AboutDialog';
import './Solitaire.css'

interface SolitaireMenuProps {
    onClose: () => void;
    windowPosition: { x: number; y: number };
    openModal: 'about' | null;
    setOpenModal: React.Dispatch<React.SetStateAction<'about' | null>>;
    globalVolume: number;
    globalMuted: boolean;
}

const SolitaireMenu = ({
    onClose, 
    windowPosition, 
    globalVolume, 
    globalMuted,
    openModal,
    setOpenModal
}:SolitaireMenuProps) => {

    const [openMenu, setOpenMenu] = useState<'game' | 'help' | null>(null);

    const { playStartMenu } = useSound(globalVolume, globalMuted);
    const menuRef = useRef<HTMLElement>(null);

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

    const handleAction = (action: () => void) => {
        playStartMenu();
        action();
        setOpenMenu(null);
    };

    const modalStyle = {
        position: 'fixed' as const,
        top: windowPosition.y + 145,
        left: windowPosition.x + 90,
    };

  return (
    <menu className='solitaire-menu' ref={menuRef}>
        <ul>
            <li onClick={() => setOpenMenu(openMenu === 'game' ? null : 'game')}>
                Game
                <ul className={`submenu ${openMenu === 'game' ? 'open' : ''}`}>
                    <li>Deal <span>F2</span></li>
                    <li className='separator' aria-hidden='true' />
                    <li>Undo</li>
                    <li>Deck...</li>
                    <li>Options...</li>
                    <li className='separator' aria-hidden='true' />
                    <li onClick={() => handleAction(onClose)}>Exit</li>
                </ul>
                </li>
            <li onClick={() => setOpenMenu(openMenu === 'help' ? null : 'help')}>
                Help
                <ul className={`submenu ${openMenu === 'help' ? 'open' : ''}`}>
                    <li>Contents <span>F1</span></li>
                    <li>Search for Help on...</li>
                    <li>How to Use Help</li>
                    <li className='separator' aria-hidden='true' /> 
                    <li onClick={() => handleAction(() => setOpenModal('about'))}>About Solitaire</li>
                </ul>
                </li>
        </ul>
        {openModal === 'about' && createPortal(
            <AboutDialog
                title='Solitaire'
                onClose={() => setOpenModal(null)}
                style={modalStyle}
            />,
            document.body
        )}
    </menu>
  )
}

export default SolitaireMenu

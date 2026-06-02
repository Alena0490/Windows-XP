import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import useSound from '../../hooks/useSound';
import AboutDialog from '../AboutDialog';
import '../AppMenu.css';
import './Solitaire.css'
import CardBackModal from './CardBackModal';

interface SolitaireMenuProps {
    onClose: () => void;
    windowPosition: { x: number; y: number };
    openModal: 'about' | 'deck' | null;
    setOpenModal: React.Dispatch<React.SetStateAction<'about' | 'deck' | null>>;
    globalVolume: number;
    globalMuted: boolean;
    cardBack: string;
    setCardBack: (back: string) => void;
    onDeal: () => void;
}

const SolitaireMenu = ({
    onClose, 
    windowPosition, 
    globalVolume, 
    globalMuted,
    openModal,
    setOpenModal,
    cardBack,
    setCardBack,
    onDeal,
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
    <menu className='app-menu is-white solitaire-menu' ref={menuRef}>
        <ul>
            <li onClick={() => setOpenMenu(openMenu === 'game' ? null : 'game')}>
                Game
                <ul className={`submenu ${openMenu === 'game' ? 'open' : ''}`}>
                    <li onClick={() => handleAction(onDeal)}>Deal <span>F2</span></li>
                    <li className='separator' aria-hidden='true' />
                    <li className='is-disabled'>Undo</li>
                    <li onClick={() => setOpenModal('deck')}>Deck...</li>
                    <li className='is-disabled'>Options...</li>
                    <li className='separator' aria-hidden='true' />
                    <li onClick={() => handleAction(onClose)}>Exit</li>
                </ul>
                </li>
            <li onClick={() => setOpenMenu(openMenu === 'help' ? null : 'help')}>
                Help
                <ul className={`submenu ${openMenu === 'help' ? 'open' : ''}`}>
                    <li className='is-disabled'>Contents <span>F1</span></li>
                    <li className='is-disabled'>Search for Help on...</li>
                    <li className='is-disabled'>How to Use Help</li>
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

        {openModal === 'deck' && createPortal(
            <CardBackModal
                onClose={() => setOpenModal(null)}
                style={modalStyle}
                cardBack={cardBack}
                setCardBack={setCardBack}
            />,
            document.body
        )}
    </menu>
  )
}

export default SolitaireMenu

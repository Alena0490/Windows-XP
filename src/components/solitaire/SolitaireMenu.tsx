import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import useSound from '../../hooks/useSound';
import AboutDialog from '../AboutDialog';
import '../AppMenu.css';
import './Solitaire.css'
import CardBackModal from './CardBackModal';
import OptionsModal from './OptionsModal';

interface SolitaireMenuProps {
    onClose: () => void;
    windowPosition: { x: number; y: number };
    openModal: 'about' | 'deck'| 'options' | null;
    setOpenModal: React.Dispatch<React.SetStateAction<'about' | 'deck' | 'options' | null>>;
    globalVolume: number;
    globalMuted: boolean;
    plusTheme?: 'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
    cardBack: string;
    setCardBack: (back: string) => void;
    onDeal: () => void;
    // onShuffle: () => void;
    onUndo: () => void;
    canUndo: boolean;
    draw: 'one' | 'three';
    setDraw: (d: 'one' | 'three') => void;
    timedGame: boolean;
    setTimedGame: (value: boolean) => void;
    showStatusBar: boolean;
    setShowStatusBar: (value: boolean) => void;
    outlineDragging: boolean;
    setOutlineDragging: (value: boolean) => void;
    scoring: 'standard' | 'vegas' | 'none';
    setScoring: (value: 'standard' | 'vegas' | 'none') => void;
    cumulativeScore: boolean;
    setCumulativeScore: (value: boolean) => void;
}

const SolitaireMenu = ({
    onClose,
    windowPosition,
    globalVolume,
    globalMuted,
    plusTheme,
    openModal,
    setOpenModal,
    cardBack,
    setCardBack,
    onDeal,
    onUndo,
    canUndo,
    draw,
    setDraw,
    timedGame,
    setTimedGame,
    showStatusBar,
    setShowStatusBar,
    outlineDragging,
    setOutlineDragging,
    scoring,
    setScoring,
    cumulativeScore,
    setCumulativeScore,
}:SolitaireMenuProps) => {

    const [openMenu, setOpenMenu] = useState<'game' | 'help' | null>(null);

    const sounds = useSound(globalVolume, globalMuted);
    const themeSound = plusTheme === 'aquarium' ? sounds.aquarium
        : plusTheme === 'davinci' ? sounds.daVinci
        : plusTheme === 'nature' ? sounds.nature
        : plusTheme === 'space' ? sounds.space
        : null;
    const playStartMenu = () => themeSound ? themeSound.playMenuCmd() : sounds.playStartMenu();
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
            <li onClick={() => setOpenMenu(openMenu === 'game' ? null : 'game')} onMouseEnter={() => openMenu !== null && setOpenMenu('game')}>
                <span className='mnemonic'>G</span>ame
                <ul className={`submenu ${openMenu === 'game' ? 'open' : ''}`}>
                    <li onClick={() => { handleAction(onDeal); }}><span className='mnemonic'>D</span>eal <span>F2</span></li>
                    <li className='separator' aria-hidden='true' />
                    <li onClick={canUndo ? onUndo : undefined} className={!canUndo ? 'is-disabled' : ''}>
                        <span className='mnemonic'>U</span>ndo
                    </li>
                    <li onClick={() => setOpenModal('deck')}>D<span className='mnemonic'>e</span>ck...</li>
                    <li onClick={() => setOpenModal('options')}><span className='mnemonic'>O</span>ptions...</li>
                    <li className='separator' aria-hidden='true' />
                    <li onClick={() => handleAction(onClose)}>E<span className='mnemonic'>x</span>it</li>
                </ul>
            </li>
            <li onClick={() => setOpenMenu(openMenu === 'help' ? null : 'help')} onMouseEnter={() => openMenu !== null && setOpenMenu('help')}>
                <span className='mnemonic'>H</span>elp
                <ul className={`submenu ${openMenu === 'help' ? 'open' : ''}`}>
                    <li className='is-disabled'><span className='mnemonic'>C</span>ontents <span>F1</span></li>
                    <li className='is-disabled'><span className='mnemonic'>S</span>earch for Help on...</li>
                    <li className='is-disabled'>How to <span className='mnemonic'>U</span>se Help</li>
                    <li className='separator' aria-hidden='true' />
                    <li onClick={() => handleAction(() => setOpenModal('about'))}><span className='mnemonic'>A</span>bout Solitaire</li>
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

          {openModal === 'options' && createPortal(
            <OptionsModal
                onClose={() => setOpenModal(null)}
                style={modalStyle}
                draw={draw}
                setDraw={setDraw}
                timedGame={timedGame}
                setTimedGame={setTimedGame}
                showStatusBar={showStatusBar}
                setShowStatusBar={setShowStatusBar}
                outlineDragging={outlineDragging}
                setOutlineDragging={setOutlineDragging}
                scoring={scoring}
                setScoring={setScoring}
                cumulativeScore={cumulativeScore}
                setCumulativeScore={setCumulativeScore}
            />,
            document.body
        )}
    </menu>
  )
}

export default SolitaireMenu

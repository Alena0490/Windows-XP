import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import useSound from '../../hooks/useSound';
import type { BoardConfig } from './data/game';
import { beginnerConfig, intermediateConfig, expertConfig } from './data/game';
import AboutDialog from '../AboutDialog';
import BestTimes from './BestTimes';
import Custom from './Custom';
import '../AppMenu.css';
import './GameMenu.css';

interface GameMenuProps {
    onReset: (newLevel?: BoardConfig) => void;
    onMarksChange: (value: boolean) => void;
    level: BoardConfig;
    setLevel: (level: BoardConfig) => void;
    setIsMinimized: (value: boolean | ((prev: boolean) => boolean)) => void;
    windowPosition: { x: number; y: number };
    soundEnabled: boolean;
    onSoundToggle: () => void;
    globalVolume: number;
    globalMuted: boolean;
    plusTheme?: 'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
    openModal: 'about' | 'times' | 'custom' | null;
    setOpenModal: React.Dispatch<React.SetStateAction<'about' | 'times' | 'custom' | null>>;
}

const GameMenu = ({
    onReset,
    onMarksChange,
    level,
    setLevel,
    setIsMinimized,
    windowPosition,
    soundEnabled,
    onSoundToggle,
    globalVolume,
    globalMuted,
    plusTheme,
    openModal,
    setOpenModal,
}: GameMenuProps) => {
    const [openMenu, setOpenMenu] = useState<'game' | 'help' | null>(null);
    const [marks, setMarks] = useState(true);

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

    const toggleMarks = () => {
        setMarks(prev => {
            onMarksChange(!prev);
            return !prev;
        });
        setOpenMenu(null);
    };

    const modalStyle = {
        position: 'fixed' as const,
        top: windowPosition.y + 145,
        left: windowPosition.x + 90,
    };

    return (
        <menu
            className='app-menu game-menu'
            ref={menuRef}
        >
            <ul>
                <li onClick={() => setOpenMenu(openMenu === 'game' ? null : 'game')} onMouseEnter={() => openMenu !== null && setOpenMenu('game')}>
                    <span className='mnemonic'>G</span>ame
                    <ul className={`submenu game ${openMenu === 'game' ? 'open' : ''}`}>
                        <li onClick={() => { playStartMenu(); onReset(); }}>
                            <span className='mnemonic'>N</span>ew <span>F2</span>
                        </li>
                        <li className='separator' aria-hidden='true'></li>
                        <li
                            className={level === beginnerConfig ? 'checked' : ''}
                            onClick={() => { playStartMenu(); setLevel(beginnerConfig); onReset(beginnerConfig); setOpenMenu(null); }}
                        >
                            <span className='mnemonic'>B</span>eginner
                        </li>
                        <li
                            className={level === intermediateConfig ? 'checked' : ''}
                            onClick={() => { playStartMenu(); setLevel(intermediateConfig); onReset(intermediateConfig); setOpenMenu(null); }}
                        >
                            <span className='mnemonic'>I</span>ntermediate
                        </li>
                        <li
                            className={level === expertConfig ? 'checked' : ''}
                            onClick={() => { playStartMenu(); setLevel(expertConfig); onReset(expertConfig); setOpenMenu(null); }}
                        >
                            <span className='mnemonic'>E</span>xpert
                        </li>
                        <li onClick={() => { playStartMenu(); setOpenModal('custom'); setOpenMenu(null); }}>
                            <span className='mnemonic'>C</span>ustom
                        </li>
                        <li className='separator' aria-hidden='true'></li>
                        <li
                            className={marks ? 'checked' : ''}
                            onClick={() => { playStartMenu(); toggleMarks(); }}
                        >
                            <span className='mnemonic'>M</span>arks (?)
                        </li>
                        <li
                            className={soundEnabled ? 'checked' : ''}
                            onClick={() => { playStartMenu(); onSoundToggle(); setOpenMenu(null); }}
                        >
                            <span className='mnemonic'>S</span>ound
                        </li>
                        <li className='separator' aria-hidden='true'></li>
                        <li onClick={() => { playStartMenu(); setOpenModal('times'); setOpenMenu(null); }}>
                            Best <span className='mnemonic'>T</span>imes
                        </li>
                        <li className='separator' aria-hidden='true'></li>
                        <li onClick={() => { playStartMenu(); setIsMinimized(true); setOpenMenu(null); }}>
                            E<span className='mnemonic'>x</span>it
                        </li>
                    </ul>
                </li>

                <li onClick={() => setOpenMenu(openMenu === 'help' ? null : 'help')} onMouseEnter={() => openMenu !== null && setOpenMenu('help')}>
                    <span className='mnemonic'>H</span>elp
                    <ul className={`submenu help ${openMenu === 'help' ? 'open' : ''}`}>
                        <li className='is-disabled' aria-disabled='true'>
                            <span className='mnemonic'>C</span>ontents <span>F1</span>
                        </li>
                        <li className='is-disabled' aria-disabled='true'>
                            <span className='mnemonic'>S</span>earch for Help On...
                        </li>
                        <li className='is-disabled' aria-disabled='true'>
                            <span className='mnemonic'>U</span>sing Help
                        </li>
                        <li className='separator' aria-hidden='true'></li>
                        <li onClick={() => { playStartMenu(); setOpenModal('about'); setOpenMenu(null); }}>
                            <span className='mnemonic'>A</span>bout Minesweeper...
                        </li>
                    </ul>
                </li>
            </ul>

            {openModal === 'about' && createPortal(
                <AboutDialog
                    title='Minesweeper'
                    onClose={() => setOpenModal(null)}
                    style={modalStyle}
                />,
                document.body
            )}

            {openModal === 'times' && createPortal(
                <BestTimes onClose={() => setOpenModal(null)} style={modalStyle} />,
                document.body
            )}

            {openModal === 'custom' && createPortal(
                <Custom
                    onClose={() => setOpenModal(null)}
                    onReset={onReset}
                    setLevel={setLevel}
                    style={{ ...modalStyle, top: windowPosition.y + 150 }}
                />,
                document.body
            )}
        </menu>
    );
};

export default GameMenu;
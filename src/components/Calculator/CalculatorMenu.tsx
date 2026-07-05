import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import useSound from '../../hooks/useSound';
import AboutDialog from '../AboutDialog';
import './Calculator.css';

interface CalculatorMenuProps {
    windowPosition: { x: number; y: number };
    display: string;
    onPaste: (value: string) => void;
    digitGrouping: boolean;
    onToggleDigitGrouping: () => void;
    isScientific: boolean;
    onToggleScientific: () => void;
    openModal: 'about' | null;
    setOpenModal: React.Dispatch<React.SetStateAction<'about' | null>>;
    globalVolume: number;
    globalMuted: boolean;
    plusTheme?: 'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
}

const CalculatorMenu = ({
    windowPosition,
    display,
    onPaste,
    digitGrouping,
    onToggleDigitGrouping,
    isScientific,
    onToggleScientific,
    openModal,
    setOpenModal,
    globalVolume,
    globalMuted,
    plusTheme,
}: CalculatorMenuProps) => {
    const [openMenu, setOpenMenu] = useState<'edit' | 'view' | 'help' | null>(null);

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

    return (
        <menu className='calculator-menu' ref={menuRef}>
            <ul>
                <li onClick={() => setOpenMenu(openMenu === 'edit' ? null : 'edit')} onMouseEnter={() => openMenu !== null && setOpenMenu('edit')}>
                    <span className='mnemonic'>E</span>dit
                    <ul className={`submenu ${openMenu === 'edit' ? 'open' : ''}`}>
                        <li onClick={() => { playStartMenu(); navigator.clipboard.writeText(display); setOpenMenu(null); }}>
                            <span className='mnemonic'>C</span>opy <span>Ctrl+C</span>
                        </li>
                        <li onClick={() => {
                            playStartMenu();
                            navigator.clipboard.readText().then(text => {
                                const num = parseFloat(text);
                                if (!isNaN(num)) onPaste(String(num));
                            });
                            setOpenMenu(null);
                        }}>
                            <span className='mnemonic'>P</span>aste <span>Ctrl+V</span>
                        </li>
                    </ul>
                </li>

                <li onClick={() => setOpenMenu(openMenu === 'view' ? null : 'view')} onMouseEnter={() => openMenu !== null && setOpenMenu('view')}>
                    <span className='mnemonic'>V</span>iew
                    <ul className={`submenu ${openMenu === 'view' ? 'open' : ''}`}>
                        <li
                            className={isScientific ? 'checked' : ''}
                            onClick={() => { playStartMenu(); onToggleScientific(); setOpenMenu(null); }}
                        >
                            <span className='mnemonic'>S</span>cientific
                        </li>
                        <li
                            className={!isScientific ? 'checked' : ''}
                            onClick={() => { playStartMenu(); onToggleScientific(); setOpenMenu(null); }}
                        >
                            S<span className='mnemonic'>t</span>andard
                        </li>
                        <li className='separator' />
                        <li
                            className={digitGrouping ? 'checked' : ''}
                            onClick={() => { playStartMenu(); onToggleDigitGrouping(); setOpenMenu(null); }}
                        >
                            <span className='mnemonic'>D</span>igit grouping
                        </li>
                    </ul>
                </li>

                <li onClick={() => setOpenMenu(openMenu === 'help' ? null : 'help')} onMouseEnter={() => openMenu !== null && setOpenMenu('help')}>
                    <span className='mnemonic'>H</span>elp
                    <ul className={`submenu ${openMenu === 'help' ? 'open' : ''}`}>
                        <li className='is-disabled'><span className='mnemonic'>H</span>elp Topics</li>
                        <li className='separator' />
                        <li onClick={() => { playStartMenu(); setOpenModal('about'); setOpenMenu(null); }}>
                            <span className='mnemonic'>A</span>bout Calculator
                        </li>
                    </ul>
                </li>
            </ul>

            {openModal === 'about' && createPortal(
                <AboutDialog
                    title='Calculator'
                    onClose={() => setOpenModal(null)}
                    style={{
                        position: 'fixed',
                        top: windowPosition.y + 145,
                        left: windowPosition.x + 90,
                    }}
                />,
                document.body
            )}
        </menu>
    );
};

export default CalculatorMenu;
import { useState, useRef, useEffect } from 'react';
// import { createPortal } from 'react-dom';
import useDraggable from '../../hooks/useDraggable';
import KeyboardMenu from './KeyboardMenu';
import KeyboardApp from './KeyboardApp';
import KeyboardIcon from '../../img/keyboard/Keyboard2.webp'
import './Keyboard.css'
import '../../App.css'

interface KeyboardProps {
    onClose: () => void;
    isMinimized: boolean;
    setIsMinimized: (value: boolean | ((prev: boolean) => boolean)) => void;
    isFullscreen: boolean;
    toggleFullscreen: () => void;
    onMouseDown?: () => void;
    isActive?: boolean;
    globalVolume: number;
    globalMuted: boolean;
    plusTheme?: 'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
    onCalculatorOpen: () => void;
    onStartMenuOpen: () => void;
}

const Keyboard = ({
    onClose,
    isMinimized,
    setIsMinimized,
    isFullscreen,
    toggleFullscreen,
    onMouseDown,
    isActive,
    globalVolume,
    globalMuted,
    plusTheme,
    onCalculatorOpen,
    onStartMenuOpen,
}:KeyboardProps) => {
    const { position, setPosition, handleMouseDown } = useDraggable(0, 0);
    const windowRef = useRef<HTMLDivElement>(null);
    const [openModal, setOpenModal] = useState<'about' | 'welcome' | null>(
        localStorage.getItem('osk-hide-welcome') === 'true' ? null : 'welcome'
    );
    const [view, setView] = useState<'enhanced' | 'standard'>('enhanced');
    const [clickSound, setClickSound] = useState(false);
    const [keys, setKeys] = useState<101 | 102>(101);

    useEffect(() => {
        if (windowRef.current) {
            const { offsetWidth, offsetHeight } = windowRef.current;
            setPosition({
                x: Math.max(0, (window.innerWidth - offsetWidth) / 2),
                y: Math.max(0, window.innerHeight - offsetHeight - 36),
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
  return (
    <div
         ref={windowRef}
         className={[
                'app-window',
                'keyboard-window',
                view === 'standard' && 'keyboard-window--standard',
                isActive && !openModal && 'app-window--active',
                isMinimized && 'keyboard--minimized',
                isMinimized && 'app-window--minimized',
                isFullscreen && 'keyboard--fullscreen',
                isFullscreen && 'app-window--fullscreen',
            ].filter(Boolean).join(' ')}
            style={isFullscreen ? {} : { left: position.x, top: position.y + 5 }}
            onMouseDown={e => { e.preventDefault(); onMouseDown?.(); }}
        >
            <div className='title-bar' onMouseDown={handleMouseDown}>
                <span className='title-bar-text'>
                    <img className='notepad-icon' src={KeyboardIcon} alt='MS on-Screen Keexboard Icon' />
                    On-Sreen Keyboard
                </span>
                <div className='title-bar-buttons xp-title-controls'>
                    <button
                        type='button'
                        className='xp-title-control btn-minimize'
                        onClick={() => setIsMinimized(true)}
                        aria-label='Minimize'
                    >
                        _
                    </button>
                    <button
                        type='button'
                        className={`xp-title-control ${isFullscreen ? 'btn-restore' : 'btn-maximize'}`}
                        onClick={() => {
                            setIsMinimized(false);
                            toggleFullscreen();
                        }}
                        aria-label={isFullscreen ? 'Restore' : 'Maximize'}
                    >
                        {isFullscreen ? '❐' : '□'}
                    </button>
                    <button
                        type='button'
                        className='xp-title-control btn-close'
                        onClick={onClose}
                        aria-label='Close'
                    >
                        ✕
                    </button>
                </div>
            </div>
            <KeyboardMenu
                openModal={openModal}
                setOpenModal={setOpenModal}
                onClose={onClose}
                globalVolume={globalVolume}
                globalMuted={globalMuted}
                plusTheme={plusTheme}
                view={view}
                setView={setView}
                clickSound={clickSound} 
                setClickSound={setClickSound}
                keys={keys} 
                setKeys={setKeys}
            />
            <KeyboardApp
                openStartMenu={onStartMenuOpen}
                openCalculator={onCalculatorOpen}
                view={view}
                globalVolume={globalVolume}
                globalMuted={globalMuted}
                clickSound={clickSound} 
                keys={keys}
            ></KeyboardApp>
      
    </div>
  )
}

export default Keyboard

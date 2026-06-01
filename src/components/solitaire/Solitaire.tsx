import { useState } from 'react'
import SolitaireMenu from './SolitaireMenu'
import SolitaireApp from './SolitaireApp'
import useDraggable from '../../hooks/useDraggable';
// import useSound from '../../hooks/useSound';

import SolitaireIcon from '../../img/Solitaire.webp'
import '../../App.css'
import './Solitaire.css'

interface SolitaireProps {
    isFullscreen: boolean;
    setIsFullscreen: (value: boolean | ((prev: boolean) => boolean)) => void;
    isMinimized: boolean;
    setIsMinimized: (value: boolean | ((prev: boolean) => boolean)) => void;
    onClose: () => void;
    onMouseDown?: () => void;
    globalVolume: number;
    globalMuted: boolean;
}

const Solitaire = ({
    isFullscreen, 
    setIsFullscreen, 
    isMinimized, 
    setIsMinimized, 
    onClose, 
    onMouseDown, 
    globalVolume, 
    globalMuted
}:SolitaireProps) => {

    const { position, handleMouseDown } = useDraggable(400, 150);
     const [openModal, setOpenModal] = useState<'about' | null>(null);
    const handleExit = () => onClose();

  return (
    <div
        className={[
            'app-window',
            'solitaire-window',
            isMinimized && 'solitaire--minimized',
            isMinimized && 'app-window--minimized',
            isFullscreen && 'solitaire--fullscreen',
            isFullscreen && 'app-window--fullscreen',
        ].filter(Boolean).join(' ')}
        style={isFullscreen ? {} : { left: position.x, top: position.y }}
        onMouseDown={onMouseDown}
    >
        <div className='title-bar' onMouseDown={handleMouseDown}>
            <span className='title-bar-text'>
                <img className='game-icon' src={SolitaireIcon} alt='Solitaire Icon' />
                Solitaire
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
                        setIsFullscreen(prev => !prev);
                    }}
                    aria-label={isFullscreen ? 'Restore' : 'Maximize'}
                >
                    {isFullscreen ? '❐' : '□'}
                </button>
                <button
                    type='button'
                    className='xp-title-control btn-close'
                    onClick={handleExit}
                    aria-label='Close'
                >
                    ✕
                </button>
            </div>
        </div>
        <SolitaireMenu
            onClose={handleExit}
            windowPosition={position}
            openModal={openModal}
            setOpenModal={setOpenModal}
            globalVolume={globalVolume}
            globalMuted={globalMuted}
        />
        <SolitaireApp/>
        <div className='solitaire-statusbar'>
            <div className="helper"></div>
            <div className="score">Score:</div>
            <div className="time">Time:</div>
        </div>           
    </div>
  )
}

export default Solitaire
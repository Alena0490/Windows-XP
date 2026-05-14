import { useState } from 'react';
import useDraggable from '../../hooks/useDraggable';
import MadiaPlayerApp from './MediaPlayerApp'
import MediaPlayerMenu from './MediaPlayerMenu';

import MediaPlayerIcon from '../../img/WindowsMediaPlayer 9.webp'

import './MediaPlayer.css'
import '../../App.css'

interface MediaPlayerProps {
    isFullscreen: boolean;
    setIsFullscreen: (value: boolean | ((prev: boolean) => boolean)) => void;
    isMinimized: boolean;
    setIsMinimized: (value: boolean | ((prev: boolean) => boolean)) => void;
    onClose: () => void;
    onMouseDown?: () => void;
}

const MediaPlayer = ({
    isFullscreen,
    setIsFullscreen,
    isMinimized,
    setIsMinimized,
    onClose,
    onMouseDown,
}: MediaPlayerProps) => {

    const [openModal, setOpenModal] = useState<'about' |  null>(null);
    const { position, handleMouseDown } = useDraggable(400, 150);

  return (
     <div
        className={[
            'app-window',
            // 'skin-mode',
            'player-window',
            isMinimized && 'player--minimized',
            isMinimized && 'app-window--minimized',
            isFullscreen && 'player--fullscreen',
            isFullscreen && 'app-window--fullscreen',
        ].filter(Boolean).join(' ')}
        style={isFullscreen ? {} : { left: position.x, top: position.y }}
        onMouseDown={onMouseDown}
    >
        <div className='title-bar' onMouseDown={handleMouseDown}>
            <span className='title-bar-text'>
                <img className='paint-icon' src={MediaPlayerIcon} alt='Windows Media Player Icon' />
                untitled - Windows Media Player
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
                    onClick={onClose}
                    aria-label='Close'
                >
                    ✕
                </button>
            </div>
        </div>
        <MediaPlayerMenu
            onClose={onClose}
            onFullscreen={() => setIsFullscreen(prev => !prev)}
            windowPosition={position}
            openModal={openModal}
            setOpenModal={setOpenModal}
        />
        <MadiaPlayerApp />
    </div>
  )
}

export default MediaPlayer
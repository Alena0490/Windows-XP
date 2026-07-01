import useDraggable from '../../hooks/useDraggable';
import PlusIcon from '../../img/Plus.webp'
import './Plus.css'

interface PlusMainProps {
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
}

const PlusMain = ({
    onClose, 
    isMinimized, 
    isFullscreen, 
    isActive, 
    setIsMinimized, 
    toggleFullscreen,
    onMouseDown
}:PlusMainProps) => {
      const { position, handleMouseDown } = useDraggable(400, 150);

  return (
     <div
        className={[
            'app-window',
            'plus-window',
            isActive  && 'app-window--active',
            isMinimized && 'plus--minimized',
            isMinimized && 'app-window--minimized',
            isFullscreen && 'plus--fullscreen',
            isFullscreen && 'app-window--fullscreen',
        ].filter(Boolean).join(' ')}
        style={isFullscreen ? {} : { left: position.x, top: position.y }}
        onMouseDown={onMouseDown}
    >
        <div className='title-bar' onMouseDown={handleMouseDown}>
            <span className='title-bar-text'>
                <img className='paint-icon' src={PlusIcon} alt='MS Calculator Icon' />
                Microsoft Plus!
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
        {/* MAIN CONTENT */}
        <div className="main-page">
            <main className='plus-page'>
                <aside>
                    <span>Plus!</span>
                    <menu className='plus-menu'>
                        <ul>
                            <li>Digital Media</li>
                            <li>Games</li>
                            <li>Themes</li>
                            <li>Screen Savers</li>
                            <li className='plus-separator'></li>
                            <li className='plus-more'>More Plus!</li>
                        </ul>
                    </menu>
                </aside>
                <div className="plus-content">
                    <div className="introduction">
                        <h2>Welcome</h2>
                        <h3>to Microsoft Plus! for Windows XP</h3>
                        <p>
                            The ultimate companion to Windows XP delivers exciting new features for
                            digital music, gaming, new desktop graphics, photos, and much more, letting
                            you personalize your computer experience like never before.
                        </p>
                        <p>
                            Click any of the links on the left and discover a new and exciting multimedia experience on your computer.
                        </p>
                    </div>
                    <div className="right-panel">
                        <p>Release Notes</p>
                        <p>Registration</p>
                        <p>About Plus!</p>
                    </div>
                </div>
            </main>
            <div className='plus-footer'>
                <p>Copyright (C) Microsoft Corporation. All Rights Reserverd.</p>
                <p>This program is protected by U.S. and international copyright laws as described in About Plus!</p>
                <a className='link-right' href="#">Privacy Information</a>
            </div>
        </div>
    </div>
  )
}

export default PlusMain
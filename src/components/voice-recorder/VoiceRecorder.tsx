import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import useDraggable from '../../hooks/useDraggable';
import useSound from '../../hooks/useSound';

import WindowSystemMenu from '../WindowsSystemMenu'
import VoiceRecorderMenu from './VoiceRecorderMenu'
import AboutDialog from '../AboutDialog'

import Next from './img/Next.webp'
import Play from './img/Play.webp'
import Prev from './img/Prev.webp'
import Record from './img/Record.webp'
import RecorderIcon from '../../img/VolumeAlt.webp'
import Stop from './img/Stop.webp'


import '../../App.css'
import './VoiceRecorder.css'

interface VoiceRecorderProps {
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

const VoiceRecorder = ({
    onClose,
    isMinimized,
    setIsMinimized,
    isFullscreen,
    toggleFullscreen,
    onMouseDown,
    isActive,
    globalVolume,
    globalMuted,
    plusTheme
}:VoiceRecorderProps) => {
    const { position, handleMouseDown } = useDraggable(400, 150);
    const sounds = useSound(globalVolume, globalMuted);
    const themeSound = plusTheme === 'aquarium' ? sounds.aquarium
    : plusTheme === 'davinci' ? sounds.daVinci
    : plusTheme === 'nature' ? sounds.nature
    : plusTheme === 'space' ? sounds.space
    : null;

    const [openModal, setOpenModal] = useState<'about' | 'properties' | null>(null);
    const [systemMenuOpen, setSystemMenuOpen] = useState(false);
    const [sliderPosition, setSliderPosition] = useState(0);

    const recorderIconRef = useRef<HTMLImageElement>(null);

  return (
         <div
            className={[
                'app-window',
                'recorder-window',
                isActive && (!openModal || openModal === 'about') && 'app-window--active',
                isMinimized && 'recorder--minimized',
                isMinimized && 'app-window--minimized',
                isFullscreen && 'recorder--fullscreen',
                isFullscreen && 'app-window--fullscreen',
            ].filter(Boolean).join(' ')}
            style={isFullscreen ? {} : { left: position.x, top: position.y }}
            onMouseDown={onMouseDown}
        >
             <div className='title-bar' onMouseDown={handleMouseDown}>
                <span className='title-bar-text'>
                    <img 
                        className='recorder-icon' 
                        src={RecorderIcon} 
                        alt='Outlook Express'
                        ref={recorderIconRef}
                        onClick={() => setSystemMenuOpen(prev => !prev)} 
                    />
                    {systemMenuOpen && (
                        <WindowSystemMenu
                            open={systemMenuOpen}
                            onRequestClose={() => setSystemMenuOpen(false)}
                            triggerRef={recorderIconRef}
                            isFullscreen={isFullscreen}
                            onRestore={() => toggleFullscreen()}
                            onMove={() => {}}
                            onSize={() => {}}
                            onMinimize={() => setIsMinimized(true)}
                            onMaximize={() => { setIsMinimized(false); toggleFullscreen(); }}
                            onClose={onClose}
                        />
                    )}
                    Sound - Sound Recorder
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
                        disabled
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
            <VoiceRecorderMenu
                onClose={onClose}
                onOpenAbout={() => setOpenModal('about')}
            />
        
        <div className="recorder-body">
            <div className="top-bar">
                <div className="inner-box">
                    <p>Position:</p>
                    <p>0.00 sec.</p>
                </div>
                <div className="inner-box middle"></div>
                <div className="inner-box">
                    <p>Length:</p>
                    <p>0.00 sec.</p>
                </div>
            </div>

            <div className="recorder-slider">
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPosition}
                    onChange={(e) => setSliderPosition(Number(e.target.value))}
                />
            </div>
      
            <div className="recorder-buttons">
                <button aria-label='Prev' disabled><img src={Prev} alt="" /></button>
                <button aria-label='Next' disabled><img src={Next} alt="" /></button>
                <button aria-label='Play' disabled><img src={Play} alt="" /></button>
                <button aria-label='Stop'><img src={Stop} alt="" /></button>
                <button aria-label='Record'><img src={Record} alt="" /></button>
            </div>
        </div>
        {openModal === 'about' && createPortal(
            <AboutDialog
                title='Sound Recorder'
                onClose={() => setOpenModal(null)}
                style={{
                    position: 'fixed',
                    top: position.y + 120,
                    left: position.x + 150,
                }}
            />,
            document.body
        )}
    </div>
  )
}

export default VoiceRecorder
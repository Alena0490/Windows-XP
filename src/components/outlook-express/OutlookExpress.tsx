import { useState, useEffect, useRef } from 'react';
import useDraggable from '../../hooks/useDraggable';
import useSound from '../../hooks/useSound';

import OutlookMenu from './OutlookMenu';
import OutlookToolbar from './OutlookToolbar';
import OutlookLoading from './OutlookLoading';
import OutlookApp from './OutlookApp';

import WindowSystemMenu from '../WindowsSystemMenu'
import OutlookIcon from '../../img/OutlookExpress.webp'
import '../../App.css'
import './OutlookExpress.css'

interface OutlookProps {
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
    onOpenIE?: (url?: string) => void;
}

const OutlookExpress = ({
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
    onOpenIE,
}:OutlookProps) => {

    const { position, handleMouseDown } = useDraggable(400, 150);
    const sounds = useSound(globalVolume, globalMuted);
    const themeSound = plusTheme === 'aquarium' ? sounds.aquarium
        : plusTheme === 'davinci' ? sounds.daVinci
        : plusTheme === 'nature' ? sounds.nature
        : plusTheme === 'space' ? sounds.space
        : null;

    const [isLoading, setIsLoading] = useState(true);
    const [openModal, setOpenModal] = useState<'about' | 'send' | null>(null);
    const [systemMenuOpen, setSystemMenuOpen] = useState(false);
    
    const outlookIconRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    return isLoading ? (
        <OutlookLoading style={{ left: position.x, top: position.y }} />
    ) : ( 
        <div
            className={[
                'app-window',
                'outlook-window',
                isActive && !openModal && 'app-window--active',
                isMinimized && 'outlook--minimized',
                isMinimized && 'app-window--minimized',
                isFullscreen && 'outlook--fullscreen',
                isFullscreen && 'app-window--fullscreen',
            ].filter(Boolean).join(' ')}
            style={isFullscreen ? {} : { left: position.x, top: position.y }}
            onMouseDown={onMouseDown}
        >
            <div className='title-bar' onMouseDown={handleMouseDown}>
                <span className='title-bar-text'>
                    <img 
                        className='outlook-icon' 
                        src={OutlookIcon} 
                        alt='Outlook Express'
                        ref={outlookIconRef}
                        onClick={() => setSystemMenuOpen(prev => !prev)} 
                    />
                    {systemMenuOpen && (
                        <WindowSystemMenu
                            open={systemMenuOpen}
                            onRequestClose={() => setSystemMenuOpen(false)}
                            triggerRef={outlookIconRef}
                            isFullscreen={isFullscreen}
                            onRestore={() => toggleFullscreen()}
                            onMove={() => {}}
                            onSize={() => {}}
                            onMinimize={() => setIsMinimized(true)}
                            onMaximize={() => { setIsMinimized(false); toggleFullscreen(); }}
                            onClose={onClose}
                        />
                    )}
                    Outlook Express
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
            <OutlookMenu/>
            <OutlookToolbar
                onCreateMail={() => setOpenModal('send')}
                onAddresses={() => {}}
                onFind={() => {}}
            />
            <OutlookApp onOpenIE={onOpenIE}/>
        </div>
    )
}

export default OutlookExpress

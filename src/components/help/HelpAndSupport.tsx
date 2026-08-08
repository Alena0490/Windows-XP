import { useState } from 'react';
import useDraggable from '../../hooks/useDraggable';

import HelpHomepage from './HelpHomepage';
import WhatsNew from './WhatsNew';

import Back from '../../img/Back.webp'
import Favourites from '../../img/Favourites.webp'
import Forward from '../../img/Forward.webp'
import GetSupport from '../../img/GetSupport.webp'
import Go from '../../img/Go.webp'
import HelpIcon from '../../img/HelpAndSupport.webp'
import HelpIndex from '../../img/HelpAndSupportIndex.webp'
import History from '../../img/IEHistory.webp'
import Home from '../../img/IEHome.webp'
import Properties from '../../img/Properties.webp'

import './HelpAnsSupport.css'
import '../../App.css'

type HelpView = 'home' | 'whatsnew';

interface HelpAndSupportProps {
    onClose: () => void;
    isMinimized: boolean;
    setIsMinimized: (value: boolean | ((prev: boolean) => boolean)) => void;
    isFullscreen: boolean;
    toggleFullscreen?: () => void;
    onMouseDown?: () => void;
    isActive?: boolean;
    globalVolume?: number;
    globalMuted?: boolean;
    plusTheme?: 'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
}

const HelpAndSupport = ({
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
}: HelpAndSupportProps) => {
    const { position, handleMouseDown } = useDraggable(200, 100);

    const [history, setHistory] = useState<HelpView[]>(['home']);
    const [historyIndex, setHistoryIndex] = useState(0);
    const currentView = history[historyIndex];
    const canGoBack = historyIndex > 0;
    const canGoForward = historyIndex < history.length - 1;

    const navigateTo = (view: HelpView) => {
        if (view === currentView) return;
        const next = history.slice(0, historyIndex + 1);
        next.push(view);
        setHistory(next);
        setHistoryIndex(next.length - 1);
    };

    const goBack = () => { if (canGoBack) setHistoryIndex(i => i - 1); };
    const goForward = () => { if (canGoForward) setHistoryIndex(i => i + 1); };
    const goHome = () => navigateTo('home');

    return (
        <div className={[
            'app-window',
            'help-window',
            isActive  && 'app-window--active',
            isMinimized && 'help-window--minimized',
            isMinimized && 'app-window--minimized',
            isFullscreen && 'help-window--fullscreen',
            isFullscreen && 'app-window--fullscreen',
        ].filter(Boolean).join(' ')}
        style={isFullscreen ? {} : { left: position.x, top: position.y }}
        onMouseDown={onMouseDown}
        >
            <div className='title-bar' onMouseDown={handleMouseDown}>
            <div className='title'>
                <img
                    className='help-icon'
                    alt='Help Icon'
                    src={HelpIcon}
                />

                <span className='title-bar-text'>Help and Support Center</span>
            </div>

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
                    aria-label={isFullscreen ? 'Restore' : 'Maximize'}
                    onClick={toggleFullscreen}
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

        <div className='help-body'>
            <div className="help-toolbar">
                <button onClick={goBack} disabled={!canGoBack}>
                    <img src={Back} alt="Back" />
                    Back
                    <span className="history-arrow" aria-hidden="true"></span>
                </button>

                <button onClick={goForward} disabled={!canGoForward}>
                    <img src={Forward} alt="Forward" />
                    <span className="history-arrow" aria-hidden="true"></span>
                </button>

                <button onClick={goHome}>
                    <img src={Home} alt="Home" />
                </button>

                <div className="button-separator"></div>

                <button>
                    <img src={HelpIndex} alt="Help Index" />
                   <span>I<span className='mnemonic'>n</span>dex</span> 
                </button>

                 <button>
                    <img src={Favourites} alt="Favourites" />
                    <span>F<span className='mnemonic'>a</span>vorites</span>
                </button>

                <button>
                    <img src={History} alt="History" />
                    <span>Histor<span className='mnemonic'>y</span></span>
                </button>
              
               <div className="button-separator"></div>

                <button>
                    <img src={GetSupport} alt="Get Support" />
                    <span>S<span className='mnemonic'>u</span>pport</span>
                </button>

                <button>
                    <img src={Properties} alt="Properties" />
                    <span><span className='mnemonic'>O</span>ptions</span>
                </button>
            </div>

            <div className="help-search">
                <div>
                    <div className="search">
                        <span>Search</span>
                        <input type="text" />
                        <button><img src={Go} alt="Go" /></button>
                    </div>
                    <p>Set search options</p>
                </div>
                <div className='second'>
                    <div className="search-title">
                        <h2><img src={HelpIcon} alt="" /> Help and Support Center</h2>
                        <p>Windows XP Professional</p>
                    </div>
                </div>
            </div>
              {currentView === 'home' && (
                <HelpHomepage onNavigate={navigateTo} />
            )}
            {currentView === 'whatsnew' && (
                <WhatsNew
                    globalVolume={globalVolume}
                    globalMuted={globalMuted}
                    plusTheme={plusTheme}
                    isFullscreen={isFullscreen}
                    onToggleFullscreen={toggleFullscreen}
                />
            )}
        </div>
    </div>
  )
}

export default HelpAndSupport

import useDraggable from '../../hooks/useDraggable';

import HelpHomepage from './HelpHomepage';

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

interface HelpAndSupportProps {
    onClose: () => void;
    isMinimized: boolean;
    setIsMinimized: (value: boolean | ((prev: boolean) => boolean)) => void;
    isFullscreen: boolean;
    onMouseDown?: () => void;
    isActive?: boolean;
}

const HelpAndSupport = ({ 
    onClose, 
    isMinimized, 
    setIsMinimized, 
    isFullscreen, 
    onMouseDown, 
    isActive 
}: HelpAndSupportProps) => {
    const { position, handleMouseDown } = useDraggable(200, 100);

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
                <button>
                    <img src={Back} alt="Back" />
                    Back
                </button>

                <button>
                    <img src={Forward} alt="Forward" />
                </button>

                <button>
                    <img src={Home} alt="Home" />
                </button>

                <div className="button-separator"></div>

                <button>
                    <img src={HelpIndex} alt="Help Index" />
                    Index
                </button>

                 <button>
                    <img src={Favourites} alt="Favourites" />
                    Favorites
                </button>

                <button>
                    <img src={History} alt="History" />
                    History
                </button>
              
               <div className="button-separator"></div>

                <button>
                    <img src={GetSupport} alt="Get Support" />
                    Support
                </button>

                <button>
                    <img src={Properties} alt="Properties" />
                    Options
                </button>
            </div>

            <div className="help-search">
                <div>
                    <div className="search">
                        Search
                        <input type="text" />
                        <button><img src={Go} alt="Go" /></button>
                    </div>
                    <p>Set search options</p>
                </div>
                <div>
                    <div className="search-title">
                        <h2><img src={HelpIcon} alt="" /> Help and SupportCenter</h2>
                        <p>Windows XP Professional</p>
                    </div>
                </div>
            </div>
            <HelpHomepage />
        </div>
    </div>
  )
}

export default HelpAndSupport
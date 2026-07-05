import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import useDraggable from '../../hooks/useDraggable';
import AboutDialog from './AboutPlus';
import useSound from '../../hooks/useSound';
import CriticalError from '../CriticalError';
import WindowSystemMenu from '../WindowsSystemMenu';
import type { ErrorType } from '../CriticalError';

import PlusIcon from '../../img/Plus.webp'

import VoiceCommand from './img/VoiceCommandIcon.webp'
import MP3 from './img/MP3Icon.webp'
import CDLabelMaker from './img/CDlbIcon.webp'
import SpeakerEnhancement from './img/SpeakerEnhancementIcon.webp'
import PersonalDJ from './img/PDJIcon.webp'
import WMP from './img/WMPIcon.webp'
import Visualizations from './img/3DvidIcon.webp'

import aquariumIcon from './img/aquariumIcon.webp'
import natureIcon from './img/natureIcon.webp'
import davinciIcon from './img/daVinciIcon.webp'
import spaceIcon from './img/spaceIcon.webp'

import myPicturesIcon from './img/myPicturesIcon.webp'
import robotCircusIcon from './img/robotCircusIcon.webp'
import sandPendulumIcon from './img/sandPendIcon.webp'
import mercuryPoolIcon from './img/mercuryPoolIcon.webp'

import RussianSquare from './img/RussianSquare.webp'
import Labyrinth from './img/Labyrinth.webp'
import HyperBowl from './img/HyperBowl.webp'

import AquariumScreensaver from './img/aquariumSS.webp'
import NatureScreensaver from './img/natureSS.webp'
import DaVinciScreensaver from './img/daVinciSS.webp'
import SpaceScreensaver from './img/spaceSS.webp'
import MyPicturesScreensaver from './img/myPicsSS.webp'
import RobotCircusScreensaver from './img/robotCircusSS.webp'
import SandPendulumScreensaver from './img/sandPendSS.webp'
import MercuryPoolScreensaver from './img/mercuryPoolSS.webp'

import './Plus.css'

type PlusPageId =
    | 'welcome'
    | 'digital-media'
    | 'games'
    | 'themes'
    | 'screen-savers'
    | 'more-plus';

type PlusTheme =
    | 'aquarium'
    | 'nature'
    | 'davinci'
    | 'space';
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
    onScreensaverChange?: (value: string) => void;
    onScreensaverPreview?: () => void;
    onOpenDisplayProperties?: (
        tab: 'Themes' | 'Screen Saver',
        options?: { plusTheme?: PlusTheme; screensaver?: string }
    ) => void;
    openIE?: (url?: string) => void;
}

const PlusMain = ({
    onClose, 
    isMinimized, 
    isFullscreen, 
    isActive, 
    setIsMinimized, 
    toggleFullscreen,
    onMouseDown,
    globalVolume,
    globalMuted,
    plusTheme,
    onScreensaverChange,
    onScreensaverPreview,
    onOpenDisplayProperties,
    openIE,
}: PlusMainProps) => {
    const { position, handleMouseDown } = useDraggable(400, 150);

    const [activePage, setActivePage] = useState<PlusPageId>('welcome');
    const [selectedTheme, setSelectedTheme] = useState<PlusTheme>(
        plusTheme && plusTheme !== 'none' ? plusTheme : 'aquarium'
    );
    const [selectedSaver, setSelectedSaver] = useState('aquarium');
    const [openModal, setOpenModal] = useState<'about' | null>(null);
    const [errorType, setErrorType] = useState<ErrorType | null>(null);
    const [openTool, setOpenTool] = useState<number | null>(null);
    const [systemMenuOpen, setSystemMenuOpen] = useState(false);

    const plusIconRef = useRef<HTMLImageElement>(null);

    const sounds = useSound(globalVolume, globalMuted);
    const themeSound = plusTheme === 'aquarium' ? sounds.aquarium
        : plusTheme === 'davinci' ? sounds.daVinci
        : plusTheme === 'nature' ? sounds.nature
        : plusTheme === 'space' ? sounds.space
        : null;
    const playStartMenu = () => themeSound ? themeSound.playMenuCmd() : sounds.playStartMenu();
    const playExclamation = () => themeSound ? themeSound.playExclamation() : sounds.playExclamation();

    const PLUS_MENU = [
        { id: 'digital-media', label: 'Digital Media' },
        { id: 'games', label: 'Games' },
        { id: 'themes', label: 'Themes' },
        { id: 'screen-savers', label: 'Screen Savers' },
        { id: 'more-plus', label: 'More Plus!', more: true },
    ] as const;

    const mainPageClass = [
            'main-page',
            `main-page--${activePage}`,
            activePage === 'themes' && `main-page--theme-${selectedTheme}`,
        ]
        .filter(Boolean)
        .join(' ');

    const SAVER_PREVIEWS: Record<string, string> = {
        aquarium: AquariumScreensaver,
        'my-pictures': MyPicturesScreensaver,
        space: SpaceScreensaver,
        nature: NatureScreensaver,
        davinci: DaVinciScreensaver,
        'robot-circus': RobotCircusScreensaver,
        'sand-pendulum': SandPendulumScreensaver,
        'mercury-pool': MercuryPoolScreensaver,
    };

// Maps PlusMain's saver ids to the screensaver names ScreensaverOverlay/DisplayProperties expect.
const SAVER_ID_TO_SCREENSAVER_NAME: Record<string, string> = {
    aquarium: 'aquarium',
    space: 'space',
    nature: 'nature',
    davinci: 'daVinci',
    'robot-circus': 'theRobotCircus',
    'sand-pendulum': 'theSandPendulum',
    'mercury-pool': 'mercuryPool',
};

const handleSelectSaver = () => {
    const screensaverName = SAVER_ID_TO_SCREENSAVER_NAME[selectedSaver];
    if (!screensaverName) return;
    onOpenDisplayProperties?.('Screen Saver', { screensaver: screensaverName });
};

const handleOpenThemeInDisplayProperties = () => {
    onOpenDisplayProperties?.('Themes', { plusTheme: selectedTheme });
};

const handlePreviewSaver = () => {
    const screensaverName = SAVER_ID_TO_SCREENSAVER_NAME[selectedSaver];
    if (!screensaverName) return;
    onScreensaverChange?.(screensaverName);
    onScreensaverPreview?.();
};

    const renderPageContent = () => {
        switch (activePage) {
            case 'digital-media':
                return (
                    <>
                        <div className="introduction media">
                            <h2>Plus! Digital Media</h2>
                            <p className='mint'>Enhance your audio and video exprerience with advanced digital media tools.</p>
                        </div>

                        <ul className='media-tools'>
                            <li>
                                <img src={VoiceCommand} alt="" />
                                <div className='product-info'>
                                    <h3 
                                        onClick={() => setOpenTool(openTool === 0 ? null : 0)}
                                    >
                                        Plus! Voice Command for Windows Media Player
                                    </h3>
                                        {openTool === 0 && <p className='tool-desc'>Enables you to control Windows Media Player by simply speaking commands. Just sit back, relax, and tell the Player what to do.</p>}
                                    <span className='more-info'>More Information</span>
                                </div>
                            </li>

                            <li>
                                <img src={MP3} alt="" />      
                                <div className='product-info'>
                                    <h3
                                        onClick={() => setOpenTool(openTool === 1 ? null : 1)}
                                    >Plus! MP3 Audio Conventor</h3>
                                     {openTool === 1 && <p className='tool-desc'>Converts MP3 files quickly and easily to Windows Media audio files, which take up less than half the space on your computer and deliver the same audio quality.</p>}
                                    <span className='more-info'>More Information</span>  
                                </div>
                            </li>

                             <li>
                                <img src={CDLabelMaker} alt="" />      
                                <div className='product-info'>
                                    <h3
                                        onClick={() => setOpenTool(openTool === 2 ? null : 2)}
                                    >Plus! CD Label Maker</h3>
                                    {openTool === 2 && <p className='tool-desc'>Creates and prints colorful, customized CD labels, inserts, and booklets. Automatically adds your track listings and artwork to enhance your creations.</p>}
                                    <span className='more-info'>More Information</span>  
                                </div>
                            </li>

                             <li>
                                <img src={SpeakerEnhancement} alt="" />      
                                <div className='product-info'>
                                    <h3
                                        onClick={() => setOpenTool(openTool === 3 ? null : 3)}
                                    >Plus! Speaker Enhancement</h3>
                                    {openTool === 3 && <p className='tool-desc'>Instantly boosts the clarity and richness of many computer speakers to make your music and videos more vibrant than ever.</p>}
                                    <span className='more-info'>More Information</span>  
                                </div>
                            </li>

                              <li>
                                <img src={PersonalDJ} alt="" />      
                                <div className='product-info'>
                                    <h3
                                        onClick={() => setOpenTool(openTool === 4 ? null : 4)}
                                    >Plus! Personal DJ</h3>
                                    {openTool === 4 && <p className='tool-desc'>Makes it easier to create custom playlists with your favorite songs in Windows Media Player. Hear the music you want when you want it.</p>}
                                    <span className='more-info'>More Information</span>  
                                </div>
                            </li>

                            <li>
                                <img src={WMP} alt="" />      
                                <div className='product-info'>
                                    <h3
                                        onClick={() => setOpenTool(openTool === 5 ? null : 5)}
                                    >Microsoft Windows Media Player Skins</h3>
                                    {openTool === 5 && <p className='tool-desc'>Personalizes Windows Media Player with unique graphical skins.</p>}
                                    <span className='more-info'>More Information</span>  
                                </div>
                            </li>

                            <li>
                                <img src={Visualizations} alt="" />      
                                <div className='product-info'>
                                    <h3
                                        onClick={() => setOpenTool(openTool === 6 ? null : 6)}
                                    >Plus! 3-D Visualizations</h3>
                                    {openTool === 6 && <p className='tool-desc'>Adds stunning new 3-D visual effects that change and move in response to your music in Windows Media Player.</p>}
                                    <span className='more-info'>More Information</span>  
                                </div>
                            </li>
                            
                        </ul>
                    </>
                );

            case 'games':
                return (
                    <>
                        <div className="introduction games">
                            <h2>Plus! Games</h2>
                            <p className='mint'>Experience the fun and excitement of three new games that incorporate the latest in computer technology, 3-D graphics, and big screen sights and sounds.</p>
                        </div>
                        <div className="plus-games">
                            <div className="one-plus-game">
                                <div className="game-intro">
                                    <h3>Russian Square Plus! Edition</h3>
                                    <p className='green'>
                                        Tests your thinking and strategy skills in an addictive new game for fans of Tetris. The action will keep you coming back for more!
                                    </p>
                                </div>
                                <div className="game-picture">
                                    <img src={RussianSquare} alt="" />
                                    <span className='more-info'>More Info</span> 
                                </div>
                            </div>

                            <div className="one-plus-game">
                                <div className="game-intro">
                                    <h3>The Labyrinth Plus! Edition</h3>
                                    <p className='green'>
                                        Rolls the classic tabletop labyrinth game into an "a-maze-ing" 3-D world filled with vibrant visuals and sounds. Test your skills with more than 40 unique and challenging levels. You'll never get bored!
                                    </p>
                                </div>
                                <div className="game-picture">
                                    <img src={Labyrinth} alt="" />
                                    <span className='more-info'>More Info</span> 
                                </div>
                            </div>

                            <div className="one-plus-game">
                                <div className="game-intro">
                                    <h3>HyperBowl Plus! Edition</h3>
                                    <p className='green'>
                                        Takes the fun and excitement of classic bowling out of the alley and onto the streets of Ancient Rome. HyperBowl delivers arcade-style action using the latest in computer technology, 3-D graphics, and sound.
                                    </p>
                                </div>
                                <div className="game-picture">
                                    <img src={HyperBowl} alt="" />
                                    <span className='more-info'>More Info</span> 
                                </div>
                            </div>                           
                        </div>
                    </>
                );

            case 'themes':
                return (
                    <>
                        <div className="introduction themes">
                            <h2>Plus! Themes</h2>
                            <p className='mint'>
                                Persinalize your computer with enhanced themes that include, screen savers, wallpapers, icons, sounds, pointers, skins for Microsoft Windows Media Player, and much more.
                            </p>

                            <ul className="theme-list">
                                <li className={selectedTheme === 'aquarium' ? 'is-active' : ''} onClick={ () =>{ playStartMenu(); setSelectedTheme('aquarium')}}>
                                    <img src={aquariumIcon} alt="Aquarium" />
                                    Plus! Aquarium
                                </li>

                                <li className={selectedTheme === 'space' ? 'is-active' : ''} onClick={ () =>{ playStartMenu(); setSelectedTheme('space')}}>
                                    <img src={spaceIcon} alt="Space" />
                                    Plus! Space
                                </li>

                                <li className={selectedTheme === 'nature' ? 'is-active' : ''} onClick={ () =>{ playStartMenu(); setSelectedTheme('nature')}}>
                                    <img src={natureIcon} alt="Nature" />
                                    Plus! Nature
                                </li>
                                
                                <li className={selectedTheme === 'davinci' ? 'is-active' : ''} onClick={ () =>{ playStartMenu(); setSelectedTheme('davinci')}}>
                                    <img src={davinciIcon} alt="Da Vinci" />
                                    Plus! Da Vinci
                                </li>
                            </ul>
                        </div>
                        <span className='more-info theme-info' onClick={handleOpenThemeInDisplayProperties}>Select the theme</span>
                    </>
                );

            case 'screen-savers':
                return (
                    <>
                        <div className="introduction screen-savers">
                            <h2>Plus! Screen Savers</h2>
                            <p className='mint'>Enjoy astounding, lifelike, 3-D screen savers. Experience a virtual aquarium, personalize your computer with your own photos and music, explore a space station, and more!</p>
                        </div>
                        <div className="screensaver-content">
                            <ul className="theme-list screensaver-list">
                                <li
                                    className={selectedSaver === 'aquarium' ? 'is-active' : ''}
                                    onClick={() => { playStartMenu(); setSelectedSaver('aquarium'); }}
                                >
                                    <img src={aquariumIcon} alt="Aquarium" />
                                    Plus!<br />Aquarium

                                </li>

                                <li     
                                    className={selectedSaver === 'my-pictures' ? 'is-active' : ''}
                                    onClick={() => { playStartMenu(); setSelectedSaver('my-pictures'); }}
                                >
                                    <img src={myPicturesIcon} alt="My Pictures" />  
                                    Plus!<br />My Pictures
                                </li>

                                <li     
                                    className={selectedSaver === 'space' ? 'is-active' : ''}
                                    onClick={() => { playStartMenu(); setSelectedSaver('space'); }}
                                >
                                    <img src={spaceIcon} alt="Space" />
                                    Plus!<br />Space
                                </li>

                                <li     
                                    className={selectedSaver === 'nature' ? 'is-active' : ''}
                                    onClick={() => { playStartMenu(); setSelectedSaver('nature'); }}
                                >
                                    <img src={natureIcon} alt="Nature" />
                                    Plus!<br />Nature
                                </li>

                                <li     
                                    className={selectedSaver === 'davinci' ? 'is-active' : ''}
                                    onClick={() => { playStartMenu(); setSelectedSaver('davinci'); }}
                                >
                                    <img src={davinciIcon} alt="Da Vinci" />
                                    Plus!<br />da Vinci
                                </li>

                                <li     
                                    className={selectedSaver === 'robot-circus' ? 'is-active' : ''}
                                    onClick={() => { playStartMenu(); setSelectedSaver('robot-circus'); }}
                                >
                                    <img src={robotCircusIcon} alt="Robot Circus" />
                                    Plus!<br />Robot Circus
                                </li>

                                <li     
                                    className={selectedSaver === 'sand-pendulum' ? 'is-active' : ''}
                                    onClick={() => { playStartMenu(); setSelectedSaver('sand-pendulum'); }}
                                >
                                    <img src={sandPendulumIcon} alt="Sand Pendulum" />
                                    Plus!<br />Sand Pendulum
                                </li>

                                <li     
                                    className={selectedSaver === 'mercury-pool' ? 'is-active' : ''}
                                    onClick={() => { playStartMenu(); setSelectedSaver('mercury-pool'); }}
                                >
                                    <img src={mercuryPoolIcon} alt="Mercury Pool" />
                                    Plus!<br />Mercury Pool
                                </li>
                            </ul>

                            <div className="screensaver-previews">
                                <img src={SAVER_PREVIEWS[selectedSaver]} alt="" />
                                <div>
                                    <span
                                        className={`more-info screensaver-info${!SAVER_ID_TO_SCREENSAVER_NAME[selectedSaver] ? ' is-disabled' : ''}`}
                                        onClick={handlePreviewSaver}
                                    >
                                        <p>Preview</p>
                                    </span>
                                    <span
                                        className={`more-info screensaver-info${!SAVER_ID_TO_SCREENSAVER_NAME[selectedSaver] ? ' is-disabled' : ''}`}
                                        onClick={handleSelectSaver}
                                    >
                                        <p>Select this screen saver</p>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </>
                );

            case 'more-plus':
                return (
                    <>
                        <div className="introduction more-plus">
                            <h2>More Plus!</h2>
                            <p className='mint'>Thank you for purchasing Microsoft Plus! for Windows XP.</p>
                            <p className='mint'>
                                Now that you've seen and experienced Microsoft Plus!, our <a href="#" onClick={(e) => { e.preventDefault(); openIE?.('https://alena-pumprova.cz/'); }}>Web site</a> makes it easy for you to keep up with the latest technology and make the most of your experience on Microsoft Windows XP. <a href="#" onClick={(e) => { e.preventDefault(); openIE?.('https://github.com/Alena0490/Windows-XP'); }}>Visit us online</a> for the latest Plus! developments and special offers exclusively for Plus! owners.
                            </p>
                            <p className='mint'>Enjoy!</p>
                            <label htmlFor='info'>
                                <input id='info' type="checkbox" />
                                Tell me when new versions of Microsoft Plus! are available.
                            </label>
                        </div>
                    </>
                );

            case 'welcome':
            default:
                return (
                    <>
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
                            <p 
                                onClick={() => { playExclamation(); setErrorType('registration'); }}
                            >Registration</p>
                            <p 
                                onClick={() => { playStartMenu(); setOpenModal('about'); }}
                            >About Plus!                               
                            </p>
                        </div>
                    </>
                );
        }
    };

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
            <div
                className='title-bar'
                onMouseDown={(e) => {
                    // Don't start dragging when the user clicks a title-bar button —
                    // otherwise the drag captures the mouse and the click is lost.
                    if ((e.target as HTMLElement).closest('.xp-title-control')) return;
                    if (isFullscreen) return;
                    handleMouseDown(e);
                }}
            >
                <span className='title-bar-text'>
                    <img 
                        className='paint-icon' 
                        src={PlusIcon} 
                        alt='MS Plus Icon' 
                        ref={plusIconRef}
                        onClick={() => setSystemMenuOpen(prev => !prev)}
                    />
                        {systemMenuOpen && (
                            <WindowSystemMenu
                                open={systemMenuOpen}
                                onRequestClose={() => setSystemMenuOpen(false)}
                                triggerRef={plusIconRef}
                                isFullscreen={isFullscreen}
                                onRestore={toggleFullscreen}
                                onMove={() => {}}
                                onSize={() => {}}
                                onMinimize={() => setIsMinimized(true)}
                                onMaximize={toggleFullscreen}
                                onClose={onClose}
                            />
                        )}
                    Microsoft Plus!
                </span>
                <div className='title-bar-buttons xp-title-controls'>
                    <button
                        type='button'
                        className='xp-title-control btn-minimize'
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={() => setIsMinimized(true)}
                        aria-label='Minimize'
                    >
                        _
                    </button>
                    <button
                        type='button'
                        className={`xp-title-control ${isFullscreen ? 'btn-restore' : 'btn-maximize'}`}
                        onMouseDown={(e) => e.stopPropagation()}
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
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={onClose}
                        aria-label='Close'
                    >
                        ✕
                    </button>
                </div>
            </div>
            {/* MAIN CONTENT */}
            <div className={mainPageClass}>
                <main className='plus-page'>
                    <aside>
                        <span>Plus!</span>
                        <menu className='plus-menu'>
                            <ul>
                                {PLUS_MENU.slice(0, 4).map((item) => (
                                    <li
                                        key={item.id}
                                        className={activePage === item.id ? 'is-active' : undefined}
                                        onClick={() => { playStartMenu(); setActivePage(item.id); }}
                                    >
                                        {item.label}
                                    </li>
                                ))}

                                <li className='plus-separator'></li>

                                <li
                                    className={[
                                        'plus-more',
                                        activePage === 'more-plus' && 'is-active',
                                    ].filter(Boolean).join(' ')}
                                    onClick={() => { playStartMenu(); setActivePage('more-plus'); }}
                                >
                                    More Plus!
                                </li>
                            </ul>
                        </menu>
                    </aside>
                    <div
                        className="plus-home-hotspot"
                        onClick={() => { playStartMenu(); setActivePage('welcome'); }}
                    />
                    <div className="plus-content">
                        {renderPageContent()}
                    </div>
                </main>
                <div className='plus-footer'>
                    <p>Copyright (C) Microsoft Corporation. All Rights Reserverd.</p>
                    <p>This program is protected by U.S. and international copyright laws as described in About Plus!</p>
                    <a className='link-right' href="#">Privacy Information</a>
                </div>
            </div>

            {openModal === 'about' && createPortal(
                <AboutDialog
                    onClose={() => setOpenModal(null)}
                    style={{ position: 'fixed', top: position.y + 145, left: position.x + 90 }}
                />,
                document.body
            )}

            {errorType && createPortal(
                <CriticalError type={errorType} onClose={() => setErrorType(null)} />,
                document.body
            )}
        </div>
    )
}

export default PlusMain
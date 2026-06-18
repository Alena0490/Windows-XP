
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import useSound from '../../hooks/useSound';
import AboutDialog from '../AboutDialog';
import type { VisualizationPreset } from './types/VisualizationPreset';
import '../AppMenu.css';
import './MediaPlayerMenu.css';

interface MediaPlayerMenuProps {
    onClose: () => void;
    onFullscreen: () => void;
    windowPosition: { x: number; y: number };
    openModal: 'about' | null;
    setOpenModal: React.Dispatch<React.SetStateAction<'about' | null>>;
    onMinimize: () => void;
    onPlayPause: () => void;
    onStop: () => void;
    onNext: () => void;
    onPrev: () => void;
    onVolumeUp: () => void;
    onVolumeDown: () => void;
    onMute: () => void;
    isMuted: boolean;
    shuffle: boolean;
    onShuffle: () => void;
    repeat: boolean;
    onRepeat: () => void;
    onOpen: () => void;
    onSpeedChange: (rate: number) => void;
    playbackRate: number;
    skinMode: boolean;
    onSkinMode: () => void;
    visualization: VisualizationPreset;
    onVisualizationChange: (v: VisualizationPreset) => void;
    globalVolume: number;
    globalMuted: boolean;
    plusTheme?: 'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
}

const MediaPlayerMenu = ({
    onClose,
    windowPosition,
    openModal,
    setOpenModal,
    onPlayPause,
    onStop,
    onPrev,
    onNext,
    onVolumeUp,
    onVolumeDown,
    onMute,
    isMuted,
    onMinimize,
    onFullscreen,
    shuffle,
    onShuffle,
    repeat,
    onRepeat,
    onOpen,
    onSpeedChange,
    playbackRate,
    skinMode,
    onSkinMode,
    visualization,
    onVisualizationChange,
    globalVolume,
    globalMuted,
    plusTheme,
}: MediaPlayerMenuProps) => {

    const [openMenu, setOpenMenu] = useState<'file' |  'view' | 'play' | 'tools' | 'help' | null>(null);

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

     const handleAction = (action: () => void) => {
        playStartMenu();
        action();
        setOpenMenu(null);
    };

    const modalStyle = {
        position: 'fixed' as const,
        top: windowPosition.y + 145,
        left: windowPosition.x + 90,
    };

    const AMBIENCE_RANDOM_FILES = [
        'Ambience Water.mp4',
        'Ambience Falloff.mp4',
        'Ambience Swirl.mp4',
    ];

    const setVis = (file: string, label: string) => {
        handleAction(() => onVisualizationChange({ type: 'video', file, label }));
    };

    const isActive = (file: string) => visualization.file === file;
    const isAmbienceRandom = visualization.label === 'Ambience:Random';
    
    return (
        <menu className='app-menu player-menu' ref={menuRef}>
            <ul>
                <li 
                    className='player-menu-menu-item:'
                    onClick={() => setOpenMenu(openMenu === 'file' ? null : 'file')}
                    onMouseEnter={() => openMenu !== null && setOpenMenu('file')}
                >
                    File
                    <ul className={`submenu ${openMenu === 'file' ? 'open' : ''}`}>
                        <li onClick={onOpen}>Open...</li>
                        <li className='is-disabled' aria-disabled='true'>Open URL...</li>
                        <li onClick={() => handleAction(onMinimize)}>Close</li>
                        <li className='separator' aria-hidden='true' />
                        <li className='is-disabled' aria-disabled='true'>New Playlist...</li>
                        <li className='is-disabled' aria-disabled='true'>Edit Current Playlist...</li>
                        <li className='is-disabled' aria-disabled='true'>Add to Media Library</li>
                        <li className='is-disabled' aria-disabled='true'>Save Media As...</li>
                        <li className='is-disabled' aria-disabled='true'>Save Playlist</li>
                        <li className='is-disabled' aria-disabled='true'>Save Playlist As...</li>
                        <li className='separator' aria-hidden='true' />
                        <li className='is-disabled' aria-disabled='true'>Copy</li>
                        <li className='separator' aria-hidden='true' />
                        <li className='is-disabled' aria-disabled='true'>Properties</li>
                        <li className='is-disabled' aria-disabled='true'>Work Offline</li>
                        <li className='separator' aria-hidden='true' />
                        <li onClick={onClose}>Exit</li>
                    </ul>
                </li>

                <li 
                    className='player-menu-menu-item:'
                    onClick={() => setOpenMenu(openMenu === 'view' ? null : 'view')}
                    onMouseEnter={() => openMenu !== null && setOpenMenu('view')}
                >             
                    View
                    <ul className={`submenu ${openMenu === 'view' ? 'open' : ''}`}>
                        <li className={!skinMode ? 'checked' : ''} onClick={() => handleAction(() => onSkinMode())}>Full Mode <span>Ctrl+1</span></li>
                        <li className={skinMode ? 'checked' : ''} onClick={() => handleAction(() => onSkinMode())}>Skin Mode <span>Ctrl+2</span></li>
                        <li className='separator' aria-hidden='true' />
                        <li className='has-submenu'>
                            Full Mode Options
                            <ul className='submenu'>
                                <li>Show Menu Bar</li>
                                <li className='separator' aria-hidden='true' />
                                <li className='checked'>Now Playing</li>
                                <li className='checked'>Media Guide</li>
                                <li className='checked'>Copy from CD</li>
                                <li className='checked'>Media Library</li>
                                <li className='checked'>Radio Tuner</li>
                                <li className='checked'>Copy to CD or Device</li>
                                <li className='checked'>Skin Chooser</li>
                            </ul>
                        </li>
                        <li className='has-submenu'>
                            Now Playing Tools
                            <ul className='submenu'>
                                <li className='checked'>Show Equalizer and Settings</li>
                                <li className='checked'>Show Video and Visualization</li>
                                <li className='checked'>Show Media Information</li>
                                <li className='checked'>Show Playlist</li>
                                <li className='checked'>Show Captions</li>
                            </ul>
                            </li>
                        <li className='has-submenu'>
                            Taskbar
                            <ul className='submenu'>
                                <li className='is-disabled' aria-disabled='true'>Windows Taskbar</li>
                                <li className='is-disabled' aria-disabled='true'>Windows Media Player in Taskbar</li>
                            </ul>
                            </li>
                        <li className='separator' aria-hidden='true' />
                        <li className='has-submenu'>
                            Visualizations
                             <ul className='submenu'>
                                <li
                                    className={visualization.type === 'albumart' ? 'checked' : ''}
                                    onClick={() => handleAction(() => onVisualizationChange({ type: 'albumart', file: null, label: 'Album Art' }))}
                                >Album Art</li>

                                <li className='has-submenu'>
                                    Ambience
                                    <ul className='submenu'>
                                        <li
                                            className={isAmbienceRandom ? 'checked' : ''}
                                            onClick={() => {
                                                const randomFile = AMBIENCE_RANDOM_FILES[Math.floor(Math.random() * AMBIENCE_RANDOM_FILES.length)];
                                                handleAction(() => onVisualizationChange({ type: 'video', file: randomFile, label: 'Ambience:Random' }));
                                            }}
                                        >Random</li>
                                        <li className={!isAmbienceRandom && isActive('Ambience Water.mp4') ? 'checked' : ''} onClick={() => setVis('Ambience Water.mp4', 'Ambience:Water')}>Water</li>
                                        <li className={!isAmbienceRandom && isActive('Ambience Falloff.mp4') ? 'checked' : ''} onClick={() => setVis('Ambience Falloff.mp4', 'Ambience:Falloff')}>Falloff</li>
                                        <li className={!isAmbienceRandom && isActive('Ambience Swirl.mp4') ? 'checked' : ''} onClick={() => setVis('Ambience Swirl.mp4', 'Ambience:Swirl')}>Swirl</li>
                                    </ul>
                                </li>

                                <li className='has-submenu'>
                                    Bars and Waves
                                    <ul className='submenu'>
                                        <li className={isActive('Bars and Waves - Bars.mp4') ? 'checked' : ''} onClick={() => setVis('Bars and Waves - Bars.mp4', 'Bars and Waves:Bars')}>Bars</li>
                                        <li className={isActive('Bars and Waves Oceam Mist.mp4') ? 'checked' : ''} onClick={() => setVis('Bars and Waves Oceam Mist.mp4', 'Bars and Waves:Ocean Mist')}>Ocean Mist</li>
                                        <li className={isActive('Bars and Waves Firestorm.mp4') ? 'checked' : ''} onClick={() => setVis('Bars and Waves Firestorm.mp4', 'Bars and Waves:Fire Storm')}>Fire Storm</li>
                                        <li className={isActive('Bars and Waves Osciloscop.mp4') ? 'checked' : ''} onClick={() => setVis('Bars and Waves Osciloscop.mp4', 'Bars and Waves:Scope')}>Scope</li>
                                    </ul>
                                </li>

                                <li className='has-submenu'>
                                    Battery
                                    <ul className='submenu'>
                                        <li className={isActive('Battery Randomization.mp4') ? 'checked' : ''} onClick={() => setVis('Battery Randomization.mp4', 'Battery:Randomization')}>Randomization</li>
                                        <li className={isActive('Battery - Lotos.mp4') ? 'checked' : ''} onClick={() => setVis('Battery - Lotos.mp4', 'Battery:Lotus')}>Lotus</li>
                                        <li className={isActive('Battery Event Horizon.mp4') ? 'checked' : ''} onClick={() => setVis('Battery Event Horizon.mp4', 'Battery:Event Horizon')}>Event Horizon</li>
                                        <li className={isActive('Battery - Smoke or Water.mp4') ? 'checked' : ''} onClick={() => setVis('Battery - Smoke or Water.mp4', 'Battery:Smoke or Water?')}>Smoke or Water?</li>
                                    </ul>
                                </li>

                                <li className='has-submenu'>
                                    Particle
                                    <ul className='submenu'>
                                        <li className={isActive('Particle.mp4') ? 'checked' : ''} onClick={() => setVis('Particle.mp4', 'Particle:Particle')}>Particle</li>
                                        <li className={isActive('RotatingParticle.mp4') ? 'checked' : ''} onClick={() => setVis('RotatingParticle.mp4', 'Particle:Rotating Particle')}>Rotating Particle</li>
                                    </ul>
                                </li>

                                <li className='has-submenu'>
                                    Plenoptics
                                    <ul className='submenu'>
                                        <li className={visualization.label?.startsWith('Plenoptic') ? 'checked' : ''} onClick={() => setVis(['Penoptic Smokey CirclesSM.mp4', 'PlenopticsSmokeyLines.mp4', 'PlenopticVox.mp4'][Math.floor(Math.random() * 3)], 'Plenoptic')}>Plenoptic</li>
                                        <li className={isActive('Penoptic Smokey CirclesSM.mp4') ? 'checked' : ''} onClick={() => setVis('Penoptic Smokey CirclesSM.mp4', 'Plenoptics:Smokey Circles')}>Smokey Circles</li>
                                        <li className={isActive('PlenopticsSmokeyLines.mp4') ? 'checked' : ''} onClick={() => setVis('PlenopticsSmokeyLines.mp4', 'Plenoptics:Smokey Lines')}>Smokey Lines</li>
                                        <li className={isActive('PlenopticVox.mp4') ? 'checked' : ''} onClick={() => setVis('PlenopticVox.mp4', 'Plenoptics:Vox')}>Vox</li>
                                    </ul>
                                </li>

                                <li className='has-submenu'>
                                    Spikes
                                    <ul className='submenu'>
                                        <li className={isActive('Spikes.mp4') ? 'checked' : ''} onClick={() => setVis('Spikes.mp4', 'Spikes:Spike')}>Spike</li>
                                        <li className='is-disabled' aria-disabled='true'>Amoeba</li>
                                    </ul>
                                </li>

                                <li className='has-submenu'>
                                    Musical Colors
                                    <ul className='submenu'>
                                        <li className={isActive('MusicalColors.mp4') ? 'checked' : ''} onClick={() => setVis('MusicalColors.mp4', 'Musical Colors:Colors in Motion')}>Colors in Motion</li>
                                        <li className='is-disabled' aria-disabled='true'>Ice Crystals</li>
                                    </ul>
                                </li>
                            </ul>
                            </li>
                        <li className='separator' aria-hidden='true' />
                        <li className='has-submenu'>
                            File Markers
                             <ul className='submenu'>
                                <li className='is-disabled' aria-disabled='true'>Previous Marker <span>Ctrl+Shift+B</span></li>
                                <li className='is-disabled' aria-disabled='true'>Next Marker <span>Ctrl+Shift+F</span></li>
                            </ul>
                        </li>
                        <li className='is-disabled' aria-disabled='true'>Statistics</li>
                        <li className='separator' aria-hidden='true' />
                        <li onClick={onFullscreen}>Full Screen <span>Alt+Enter</span></li>
                        <li className='is-disabled' aria-disabled='true'>Refresh</li>
                        <li className='has-submenu'>
                            Zoom
                            <ul className='submenu'>
                                <li className='is-disabled' aria-disabled='true'>50% <span>Alt+1</span></li>
                                <li className='is-disabled' aria-disabled='true'>100% <span>Alt+2</span></li>
                                <li className='is-disabled' aria-disabled='true'>200% <span>Alt+3</span></li>
                                <li className='separator' aria-hidden='true' />
                                <li className='is-disabled' aria-disabled='true'>Fit Video to Player on Resize</li>
                            </ul>
                        </li>
                    </ul>
                </li>

                <li
                    className='player-menu-menu-item:' 
                    onClick={() => setOpenMenu(openMenu === 'play' ? null : 'play')}
                    onMouseEnter={() => openMenu !== null && setOpenMenu('play')}>
                    Play
                    <ul className={`submenu ${openMenu === 'play' ? 'open' : ''}`}>
                        <li onClick={onPlayPause}>Play/Pause <span>Ctrl+P</span></li>
                        <li onClick={onStop}>Stop <span>Ctrl+S</span></li>
                        <li className='separator' aria-hidden='true' />
                        <li onClick={onPrev}>Previous <span>Ctrl+B</span></li>
                        <li onClick={onNext}>Next <span>Ctrl+F</span></li>
                        <li className='separator' aria-hidden='true' />
                        <li className='has-submenu'>
                            Shuffle/Repeat
                            <ul className='submenu'>
                                <li 
                                    className={shuffle ? 'checked' : ''}
                                    onClick={() => { handleAction(onShuffle); }}

                                >Shuffle <span>Ctrl+H</span></li>
                                <li 
                                    className={repeat? 'checked' : ''}
                                    onClick={onRepeat}
                                >Repeat <span>Ctrl+T</span></li>
                            </ul>
                        </li>
                        <li className='separator' aria-hidden='true' />
                        <li onClick={onVolumeUp}>Volume Up <span>F10</span></li>
                        <li onClick={onVolumeDown}>Volume Down <span>F9</span></li>
                        <li onClick={onMute}>{isMuted ? 'Unmute' : 'Mute'} <span>F8</span></li>
                        <li className='separator' aria-hidden='true' />
                        <li className='has-submenu'>
                            Play Speed
                            <ul className='submenu'>
                                <li className={playbackRate === 0.5 ? 'checked' : ''} onClick={() => handleAction(() => onSpeedChange(0.5))}>Slow <span>Ctrl+Shift+G</span></li>
                                <li className={playbackRate === 1 ? 'checked' : ''} onClick={() => handleAction(() => onSpeedChange(1))}>Normal <span>Ctrl+Shift+N</span></li>
                                <li className={playbackRate === 2 ? 'checked' : ''} onClick={() => handleAction(() => onSpeedChange(2))}>Fast <span>Ctrl+Shift+F</span></li>
                            </ul>
                        </li>
                    </ul>
                </li>

                <li 
                    className='player-menu-menu-item:'
                    onClick={() => setOpenMenu(openMenu === 'tools' ? null : 'tools')}
                    onMouseEnter={() => openMenu !== null && setOpenMenu('tools')}
                >
                    Tools
                    <ul className={`submenu ${openMenu === 'tools' ? 'open' : ''}`}>
                        <li className='is-disabled' aria-disabled='true'>Download Visualizations</li>
                        <li className='is-disabled' aria-disabled='true'>Search for Media Files ... <span>F3</span></li>
                        <li className='separator' aria-hidden='true' />
                        <li className='is-disabled' aria-disabled='true'>License Management</li>
                        <li className='separator' aria-hidden='true' />
                        <li className='is-disabled' aria-disabled='true'>Options...</li>
                    </ul>
                </li>

                <li  
                    className='player-menu-menu-item:'
                    onClick={() => setOpenMenu(openMenu === 'help' ? null : 'help')}
                    onMouseEnter={() => openMenu !== null && setOpenMenu('help')}
                >
                    Help
                    <ul className={`submenu ${openMenu === 'help' ? 'open' : ''}`}>
                        <li className='is-disabled' aria-disabled='true'>Help Tools <span>F1</span></li>
                        <li className='separator' aria-hidden='true' />
                        <li className='is-disabled' aria-disabled='true'>Check for Player Updates...</li>
                        <li className='is-disabled' aria-disabled='true'>Privacy Statement</li>
                        <li onClick={() => {
                            playStartMenu();
                            setOpenModal('about');
                            setOpenMenu(null);
                        }}>About Windows Media Player</li>
                    </ul>
                </li>
            </ul>

               {openModal === 'about' && createPortal(
                <AboutDialog
                    title='About Windows Media Player'
                    onClose={() => setOpenModal(null)}
                    style={modalStyle}
                />,
                document.body
            )}
        </menu>
  )
}

export default MediaPlayerMenu
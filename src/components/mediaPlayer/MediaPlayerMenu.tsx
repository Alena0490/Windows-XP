
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import useSound from '../../hooks/useSound';
import AboutDialog from '../AboutDialog';
import './MediaPlayerMenu.css'

interface MediaPlayerMenuProps {
    onClose: () => void;
    onFullscreen: () => void;
    windowPosition: { x: number; y: number };
    openModal: 'about' | null;
    setOpenModal: React.Dispatch<React.SetStateAction<'about' | null>>;
}

const MediaPlayerMenu = ({ onClose, windowPosition, openModal, setOpenModal }: MediaPlayerMenuProps) => {

    const [openMenu, setOpenMenu] = useState<'file' |  'view' | 'tools' | 'help' | null>(null);

    const { playStartMenu } = useSound();
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
    
    return (
        <menu className='player-menu' ref={menuRef}>
            <ul>
                <li onClick={() => setOpenMenu(openMenu === 'file' ? null : 'file')}>
                    File
                    <ul className={`submenu ${openMenu === 'file' ? 'open' : ''}`}>
                        <li>Open...</li>
                        <li>Open URL...</li>
                        <li onClick={() => handleAction(onClose)}>Close</li>
                        <li className='separator' aria-hidden='true' />
                        <li>New Playlist...</li>
                        <li>Edit Current Playlist...</li>
                        <li>Add to Media Library</li>
                        <li>Save Media As...</li>
                        <li>Save Playlist</li>
                        <li>Save Playlist As...</li>
                        <li className='separator' aria-hidden='true' />
                        <li>Copy</li>
                        <li className='separator' aria-hidden='true' />
                        <li>Properties</li>
                        <li>Work Offline</li>
                        <li className='separator' aria-hidden='true' />
                        <li>Exit</li>
                    </ul>
                </li>

                <li 
                    className='has-submenu'
                    onClick={() => setOpenMenu(openMenu === 'view' ? null : 'view')}>
                    View
                    <ul className={`submenu ${openMenu === 'view' ? 'open' : ''}`}>
                        <li>Full Mode <span>Ctrl+1</span></li>
                        <li>Skin Mode <span>Ctrl+2</span></li>
                        <li className='separator' aria-hidden='true' />
                        <li className='has-submenu'>
                            Full Mode Options
                             <ul className='submenu'>
                                <li></li>
                            </ul>
                        </li>
                        <li className='has-submenu'>
                            Now Playing Tools
                             <ul className='submenu'>
                                <li></li>
                            </ul>
                            </li>
                        <li className='has-submenu'>
                            Taskbar
                            <ul className='submenu'>
                                <li></li>
                            </ul>
                            </li>
                        <li className='separator' aria-hidden='true' />
                        <li className='has-submenu'>
                            Visualizations
                             <ul className='submenu'>
                                <li>Album Art</li>
                                <li className='has-submenu'>Ambience</li>
                                <li className='has-submenu'>
                                    Bars and Waves
                                    <ul className='submenu'>
                                        <li>Bars</li>
                                        <li>Green Mist</li>
                                        <li>Fire Storm</li>
                                        <li>Scope</li>
                                    </ul>
                                </li>
                                <li className='has-submenu'>Battery</li>
                                <li className='has-submenu'>Particle</li>
                                <li className='has-submenu'>Plenoptics</li>
                                <li className='has-submenu'>Spikes</li>
                                <li className='has-submenu'>Musical Colors</li>
                            </ul>
                            </li>
                        <li className='separator' aria-hidden='true' />
                        <li className='has-submenu'>
                            File Markers
                             <ul className='submenu'>
                                <li></li>
                            </ul>
                        </li>
                        <li>Statistics</li>
                        <li className='separator' aria-hidden='true' />
                        <li>Full Screen <span>Alt+Enter</span></li>
                        <li>Refresh</li>
                        <li className='has-submenu'>
                            Zoom
                            <ul className='submenu'>
                                <li></li>
                            </ul>
                        </li>
                    </ul>
                </li>

                <li onClick={() => setOpenMenu(openMenu === 'tools' ? null : 'tools')}>
                    Tools
                    <ul className={`submenu ${openMenu === 'tools' ? 'open' : ''}`}></ul>
                </li>

                <li  
                    className='has-submenu'
                    onClick={() => setOpenMenu(openMenu === 'help' ? null : 'help')}>Help
                    <ul className={`submenu ${openMenu === 'help' ? 'open' : ''}`}>
                        <li onClick={() => {
                            playStartMenu();
                            setOpenModal('about');
                            setOpenMenu(null);
                        }}>About</li>
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
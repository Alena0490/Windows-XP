import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import useSound from '../../hooks/useSound';
import AboutDialog from '../AboutDialog';
import FlipRotate from './FlipRotate';
import StretchSkew from './StretchSkew';
import Attributes from './Attributes';
import CustomZoom from './CustomZoom';
import '../AppMenu.css';
import './PaintMenu.css';

interface PaintMenuProps {
    setTool: React.Dispatch<React.SetStateAction<string>>;
    onNew: () => void;
    onOpen: () => void;
    onSaveAs: () => void;
    onClose: () => void;
    windowPosition: { x: number; y: number };
    onCut: () => void;
    onCopy: () => void;
    onPaste: () => void;
    onFullscreen: () => void;
    onInvertColors: () => void;
    showToolbox: boolean;
    onToggleToolbox: () => void;
    showStatusBar: boolean;
    onToggleStatusBar: () => void;
    showColorBox: boolean;
    onToggleColorBox: () => void;
    onFlipRotate: (action: 'flipH' | 'flipV' | 'rotate', angle?: number) => void;
    onStretchSkew: (stretchH: number, stretchV: number, skewH: number, skewV: number) => void;
    onDrawOpaque: () => void;
    isDrawOpaque: boolean;
    onAttributes: (width: number, height: number) => void;
    canvasWidth: number;
    canvasHeight: number;
    onViewBitmap: () => void;
    onZoomLevel: (value: number) => void;
    currentZoom: number;
    onZoomToWindow: () => void;
    showGrid: boolean;
    onToggleGrid: () => void;
    showThumbnail: boolean;
    onToggleThumbnail: () => void;
    openModal: 'about' | 'fliprotate' | 'stretchskew' | 'attributes' | 'customzoom' | null;
    setOpenModal: React.Dispatch<React.SetStateAction<'about' | 'fliprotate' | 'stretchskew' | 'attributes' | 'customzoom' | null>>;
    globalVolume: number;
    globalMuted: boolean;
    plusTheme?: 'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
    onError?: (type: import('../CriticalError').ErrorType) => void;
}

const PaintMenu = ({
    setTool,
    onNew,
    onOpen,
    onZoomLevel,
    currentZoom,
    onZoomToWindow,
    onSaveAs,
    onClose,
    windowPosition,
    onCut,
    onCopy,
    onPaste,
    onFullscreen,
    onInvertColors,
    showColorBox,
    showStatusBar,
    showToolbox,
    onToggleColorBox,
    onToggleStatusBar,
    onToggleToolbox,
    onFlipRotate,
    onStretchSkew,
    onDrawOpaque,
    isDrawOpaque,
    onAttributes,
    canvasHeight,
    canvasWidth,
    onViewBitmap,
    showGrid,
    onToggleGrid,
    showThumbnail,
    onToggleThumbnail,
    openModal,
    setOpenModal,
    globalVolume,
    globalMuted,
    plusTheme,
    onError,
}: PaintMenuProps) => {
    const [openMenu, setOpenMenu] = useState<'file' | 'edit' | 'view' | 'image' | 'colors' | 'help' | null>(null);

    const sounds = useSound(globalVolume, globalMuted);
    const themeSound = plusTheme === 'aquarium' ? sounds.aquarium
        : plusTheme === 'davinci' ? sounds.daVinci
        : plusTheme === 'nature' ? sounds.nature
        : plusTheme === 'space' ? sounds.space
        : null;
    const playStartMenu = () => themeSound ? themeSound.playMenuCmd() : sounds.playStartMenu();
    const menuRef = useRef<HTMLElement>(null);

    const itemClass = (disabled = false, extra = '') =>
        `${disabled ? 'is-disabled' : ''}${extra ? ` ${extra}` : ''}`.trim();

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
        <menu className='app-menu paint-menu' ref={menuRef}>
            <ul>
                <li onClick={() => setOpenMenu(openMenu === 'file' ? null : 'file')} onMouseEnter={() => openMenu !== null && setOpenMenu('file')}>
                    <span className='mnemonic'>F</span>ile
                    <ul className={`submenu ${openMenu === 'file' ? 'open' : ''}`}>
                        <li onClick={() => handleAction(onNew)}><span className='mnemonic'>N</span>ew <span>Ctrl+N</span></li>
                        <li onClick={() => handleAction(onOpen)}><span className='mnemonic'>O</span>pen... <span>Ctrl+O</span></li>
                        <li onClick={() => handleAction(() => setTool('download'))}><span className='mnemonic'>S</span>ave <span>Ctrl+S</span></li>
                        <li onClick={() => handleAction(onSaveAs)}>Save&nbsp;<span className='mnemonic'>A</span>s...</li>
                        <li className='separator' aria-hidden='true' />
                        <li className={itemClass(true)} aria-disabled='true'>Print Pre<span className='mnemonic'>v</span>iew</li>
                        <li onClick={() => handleAction(() => onError?.('printerConnect'))}><span className='mnemonic'>P</span>rint... <span>Ctrl+P</span></li>
                        <li className='separator' aria-hidden='true' />
                        <li onClick={() => handleAction(onClose)}>E<span className='mnemonic'>x</span>it</li>
                    </ul>
                </li>

                <li onClick={() => setOpenMenu(openMenu === 'edit' ? null : 'edit')} onMouseEnter={() => openMenu !== null && setOpenMenu('edit')}>
                    <span className='mnemonic'>E</span>dit
                    <ul className={`submenu ${openMenu === 'edit' ? 'open' : ''}`}>
                        <li onClick={() => handleAction(() => setTool('undo'))}><span className='mnemonic'>U</span>ndo <span>Ctrl+Z</span></li>
                        <li className={itemClass(true)} aria-disabled='true'><span className='mnemonic'>R</span>epeat <span>F4</span></li>
                        <li className={itemClass(true)} aria-disabled='true'><span className='mnemonic'>H</span>istory <span>Ctrl+Shift+Y</span></li>
                        <li className='separator' aria-hidden='true' />
                        <li onClick={() => handleAction(onCut)}>Cu<span className='mnemonic'>t</span> <span>Ctrl+X</span></li>
                        <li onClick={() => handleAction(onCopy)}><span className='mnemonic'>C</span>opy <span>Ctrl+C</span></li>
                        <li onClick={() => handleAction(onPaste)}><span className='mnemonic'>P</span>aste <span>Ctrl+V</span></li>
                        <li onClick={() => handleAction(() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true })))}>
                            Clear&nbsp;<span className='mnemonic'>S</span>election <span>Del</span>
                        </li>
                        <li onClick={() => handleAction(() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', ctrlKey: true, bubbles: true })))}>
                            Select&nbsp;<span className='mnemonic'>A</span>ll <span>Ctrl+A</span>
                        </li>
                        <li className='separator' aria-hidden='true' />
                        <li className={itemClass(true)} aria-disabled='true'>C<span className='mnemonic'>o</span>py To...</li>
                        <li className={itemClass(true)} aria-disabled='true'>Paste&nbsp;<span className='mnemonic'>F</span>rom...</li>
                    </ul>
                </li>

                <li onClick={() => setOpenMenu(openMenu === 'view' ? null : 'view')} onMouseEnter={() => openMenu !== null && setOpenMenu('view')}>
                    <span className='mnemonic'>V</span>iew
                    <ul className={`submenu ${openMenu === 'view' ? 'open' : ''}`}>
                        <li className={showToolbox ? 'checked' : ''} onClick={() => handleAction(onToggleToolbox)}><span className='mnemonic'>T</span>ool Box</li>
                        <li className={showColorBox ? 'checked' : ''} onClick={() => handleAction(onToggleColorBox)}><span className='mnemonic'>C</span>olor Box <span>Ctrl+L</span></li>
                        <li className={showStatusBar ? 'checked' : ''} onClick={() => handleAction(onToggleStatusBar)}><span className='mnemonic'>S</span>tatus Bar</li>
                        <li className='is-disabled' aria-disabled='true'>Te<span className='mnemonic'>x</span>t Toolbar</li>
                        <li className='separator' aria-hidden='true' />
                        <li className='has-submenu'>
                            <span className='mnemonic'>Z</span>oom
                            <ul className='submenu'>
                                <li onClick={() => handleAction(() => onZoomLevel(1))}><span className='mnemonic'>N</span>ormal Size</li>
                                <li onClick={() => handleAction(() => onZoomLevel(2))}><span className='mnemonic'>L</span>arge Size</li>
                                <li onClick={() => handleAction(onZoomToWindow)}>Zoom To <span className='mnemonic'>W</span>indow</li>
                                <li onClick={() => handleAction(() => setOpenModal('customzoom'))}><span className='mnemonic'>C</span>ustom...</li>
                                <li className='separator' aria-hidden='true' />
                                <li className={showGrid ? 'checked' : ''} onClick={() => handleAction(onToggleGrid)}>Show <span className='mnemonic'>G</span>rid <span>Ctrl+G</span></li>
                                <li className={showThumbnail ? 'checked' : ''} onClick={() => handleAction(onToggleThumbnail)}>Show <span className='mnemonic'>T</span>humbnail</li>
                            </ul>
                        </li>
                        <li onClick={() => handleAction(onViewBitmap)}>View&nbsp;<span className='mnemonic'>B</span>itmap <span>Ctrl+F</span></li>
                        <li className='separator' aria-hidden='true' />
                        <li onClick={() => handleAction(onFullscreen)}><span className='mnemonic'>F</span>ullscreen <span>F11</span></li>
                    </ul>
                </li>

                <li onClick={() => setOpenMenu(openMenu === 'image' ? null : 'image')} onMouseEnter={() => openMenu !== null && setOpenMenu('image')}>
                    <span className='mnemonic'>I</span>mage
                    <ul className={`submenu ${openMenu === 'image' ? 'open' : ''}`}>
                        <li onClick={() => handleAction(() => setOpenModal('fliprotate'))}><span className='mnemonic'>F</span>lip/Rotate <span>Ctrl+Alt+R</span></li>
                        <li onClick={() => handleAction(() => setOpenModal('stretchskew'))}><span className='mnemonic'>S</span>tretch/Skew <span>Ctrl+Shift+K</span></li>
                        <li onClick={() => handleAction(onInvertColors)}><span className='mnemonic'>I</span>nvert Colors <span>Ctrl+I</span></li>
                        <li onClick={() => handleAction(() => setOpenModal('attributes'))}><span className='mnemonic'>A</span>ttributes... <span>Ctrl+E</span></li>
                        <li onClick={() => handleAction(() => setTool('clear'))}><span className='mnemonic'>C</span>lear Image</li>
                        <li className={isDrawOpaque ? 'checked' : ''} onClick={() => handleAction(onDrawOpaque)}><span className='mnemonic'>D</span>raw Opaque</li>
                    </ul>
                </li>

                <li onClick={() => setOpenMenu(openMenu === 'colors' ? null : 'colors')} onMouseEnter={() => openMenu !== null && setOpenMenu('colors')}>
                    <span className='mnemonic'>C</span>olors
                    <ul className={`submenu ${openMenu === 'colors' ? 'open' : ''}`}>
                        <li className={itemClass(true)} aria-disabled='true'><span className='mnemonic'>E</span>dit Colors...</li>
                        <li className={itemClass(true)} aria-disabled='true'><span className='mnemonic'>G</span>et Colors</li>
                        <li className={itemClass(true)} aria-disabled='true'><span className='mnemonic'>S</span>ave Colors</li>
                    </ul>
                </li>

                <li onClick={() => setOpenMenu(openMenu === 'help' ? null : 'help')} onMouseEnter={() => openMenu !== null && setOpenMenu('help')}>
                    <span className='mnemonic'>H</span>elp
                    <ul className={`submenu ${openMenu === 'help' ? 'open' : ''}`}>
                        <li className={itemClass(true)} aria-disabled='true'><span className='mnemonic'>H</span>elp Topics</li>
                        <li className='separator' aria-hidden='true' />
                        <li onClick={() => handleAction(() => setOpenModal('about'))}><span className='mnemonic'>A</span>bout Paint</li>
                    </ul>
                </li>
            </ul>

            {openModal === 'about' && createPortal(
                <AboutDialog
                    title='Paint'
                    onClose={() => setOpenModal(null)}
                    style={modalStyle}
                />,
                document.body
            )}

            {openModal === 'fliprotate' && createPortal(
                <FlipRotate
                    onClose={() => setOpenModal(null)}
                    onConfirm={(action, angle) => { onFlipRotate(action, angle); setOpenModal(null); }}
                    style={modalStyle}
                />,
                document.body
            )}

            {openModal === 'stretchskew' && createPortal(
                <StretchSkew
                    onClose={() => setOpenModal(null)}
                    onConfirm={(stretchH, stretchV, skewH, skewV) => { onStretchSkew(stretchH, stretchV, skewH, skewV); setOpenModal(null); }}
                    style={modalStyle}
                />,
                document.body
            )}

            {openModal === 'attributes' && createPortal(
                <Attributes
                    onClose={() => setOpenModal(null)}
                    onConfirm={(w, h) => { onAttributes(w, h); setOpenModal(null); }}
                    currentWidth={canvasWidth}
                    currentHeight={canvasHeight}
                    style={modalStyle}
                />,
                document.body
            )}

            {openModal === 'customzoom' && createPortal(
                <CustomZoom
                    onClose={() => setOpenModal(null)}
                    onConfirm={(zoom) => { onZoomLevel(zoom); setOpenModal(null); }}
                    currentZoom={currentZoom}
                    style={modalStyle}
                />,
                document.body
            )}
        </menu>
    );
};

export default PaintMenu;
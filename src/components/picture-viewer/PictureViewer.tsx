import { useState, useEffect, useRef } from 'react';

import useDraggable from '../../hooks/useDraggable'
import WindowSystemMenu from '../WindowsSystemMenu';
import type { FMItem } from '../files/data/types';

import Delete from '../../img/Delete.webp'
import Edit from '../../img/Edit.webp'
import Help from '../../img/HelpAndSupport.webp'
import Large from '../../img/Large.webp'
import Next from '../../img/Next.webp'
import Prev from '../../img/Prev.webp'
import Printer from '../../img/Printer.webp'
import RotateLeft from '../../img/RotateLeft.webp'
import RotateRight from '../../img/RotateRight.webp'
import Save from '../../img/Save.webp'
import Slideshow from '../../img/Slideshow.webp'
import Small from '../../img/Small.webp'
import ZoomIn from '../../img/ZoomIn.webp'
import ZoomOut from '../../img/ZoomOut.webp'
import WindowsPictureAndFax from '../../img/WindowsPictureAndFaxViewer.webp'

import './PictureViewer.css'
import '../../App.css'

interface WindowsFaxViewerProps {
    item: FMItem;
    onClose: () => void;
    isMinimized: boolean;
    setIsMinimized: (value: boolean | ((prev: boolean) => boolean)) => void;
    isFullscreen: boolean;
    setIsFullscreen: (value: boolean | ((prev: boolean) => boolean)) => void;
    onMouseDown?: () => void;
    isActive?: boolean;
    onTitleChange: (name: string, icon: string) => void;
}

const WindowsFaxViewer = ({
    item,
    onClose,
    onMouseDown,
    isMinimized,
    setIsMinimized,
    isFullscreen,
    setIsFullscreen,
    isActive,
    onTitleChange,
}: WindowsFaxViewerProps) => {

    const { position, handleMouseDown } = useDraggable(200, 100);
    const displayTitle = item.name;
    const fileIconRef = useRef<HTMLImageElement>(null);
    const [systemMenuOpen, setSystemMenuOpen] = useState(false);

    useEffect(() => {
        onTitleChange(displayTitle, WindowsPictureAndFax);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [displayTitle]);

  return (
    <div className={[
        'app-window',
        'picturev-window',
        isActive  && 'app-window--active',
        isMinimized && 'picturev-window--minimized',
        isMinimized && 'app-window--minimized',
        isFullscreen && 'picturev-window--fullscreen',
        isFullscreen && 'app-window--fullscreen',
    ].filter(Boolean).join(' ')}
    style={isFullscreen ? {} : { left: position.x, top: position.y }}
    onMouseDown={onMouseDown}
    >
        <div className='title-bar' onMouseDown={handleMouseDown}>
            <div className='title'>
                <img
                    className='viewer-icon'
                    alt='Image and Fax Viewer Icon'
                    src={WindowsPictureAndFax}
                />
                {systemMenuOpen && (
                    <WindowSystemMenu
                        open={systemMenuOpen}
                        onRequestClose={() => setSystemMenuOpen(false)}
                        triggerRef={fileIconRef}
                        isFullscreen={isFullscreen}
                        onRestore={() => setIsFullscreen(false)}
                        onMove={() => {}}
                        onSize={() => {}}
                        onMinimize={() => setIsMinimized(true)}
                        onMaximize={() => { setIsMinimized(false); setIsFullscreen(prev => !prev); }}
                        onClose={onClose}
                    />
                )}

                <span className='title-bar-text'>{displayTitle} - Windows Picture and Fax Viewer</span>
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

        <div className='picture-viewer-body'>
            <div className="picture">
                <img src={item.imageUrl ?? item.thumbnailUrl} alt={item.name} />
            </div>

            <div className="viewer-buttons">
                <button 
                    className='viewer-btn' 
                    aria-label='Previous image'
                    data-tooltip='Preious Image (Left Arrow)'
                >
                    <img src={Prev} alt="" />
                </button>

                <button 
                    className='viewer-btn' 
                    aria-label='Next image'
                    data-tooltip='Next Image (Right Arrow)'
                >
                    <img src={Next} alt="" />
                </button>

                <div className="button-separator" tabIndex={-1} aria-disabled></div>

                <button 
                    className='viewer-btn' 
                    aria-label='Show at a full size'
                    data-tooltip='Actual Size (Ctrl+A)'
                >
                    <img src={Large} alt="" />
                </button>

                <button 
                    className='viewer-btn' 
                    aria-label='Fit the window'
                    data-tooltip='Best Fit (Ctrl+B)'
                >
                    <img src={Small} alt="" />
                </button>

                <button 
                    className='viewer-btn' 
                    aria-label='Slideshow'
                    data-tooltip='Start Slideshow (F11)'
                >
                    <img src={Slideshow} alt="" />
                </button>

                <div className="button-separator" tabIndex={-1} aria-disabled></div>

                <button 
                    className='viewer-btn' 
                    aria-label='Zoom in'
                    data-tooltip='Zoom In (+)'
                >
                    <img src={ZoomIn} alt="" />
                </button>

                <button 
                    className='viewer-btn' 
                    aria-label='Zoom out'
                    data-tooltip='Zoom Out (-)'
                >
                    <img src={ZoomOut} alt="" />
                </button>

                <div className="button-separator" tabIndex={-1} aria-disabled></div>

                <button 
                    className='viewer-btn' 
                    aria-label='Rotate right'
                    data-tooltip='Rotate Clockwise (Ctrl+K)'
                >
                    <img src={RotateRight} alt="" />
                </button>

                <button 
                className='viewer-btn' 
                aria-label='Rotate left'
                 data-tooltip='Rotate Conter Clockwise (Ctrl+L)'
                >
                    <img src={RotateLeft} alt="" />
                </button>

                <div className="button-separator" tabIndex={-1} aria-disabled></div>

                <button 
                className='viewer-btn'
                aria-label='Delete'
                 data-tooltip='Delete (Delete)'
                >
                    <img src={Delete} alt="" />
                </button>

                <button 
                    className='viewer-btn' 
                    aria-label='Print'
                    data-tooltip='Print (Ctrl+P)'
                >
                    <img src={Printer} alt="" />
                </button>

                <button 
                className='viewer-btn' 
                aria-label='Save'
                data-tooltip='Copy To (Ctrl+S)'
                >
                    <img src={Save} alt="" />
                </button>

                <button 
                className='viewer-btn' 
                aria-label='Set as a background'
                data-tooltip='Closes this program and opens the image for editing (Ctrl+E)'
                >
                    <img src={Edit} alt="" />
                </button>

                <div className="button-separator" tabIndex={-1} aria-disabled></div>

                <button 
                    className='viewer-btn' 
                    aria-label='Help'
                    data-tooltip='Help (F1)'
                >
                    <img src={Help} alt="" />
                </button>
            </div>
        </div>

    </div>
  )
}

export default WindowsFaxViewer 
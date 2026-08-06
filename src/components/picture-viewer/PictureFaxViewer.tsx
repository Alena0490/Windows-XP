import { useState, useEffect, useRef } from 'react';

import { createPortal } from 'react-dom';
import useDraggable from '../../hooks/useDraggable'
import useSound from '../../hooks/useSound';

import WindowSystemMenu from '../WindowsSystemMenu';
import CriticalError from '../CriticalError';
import type { FMItem } from '../files/data/types';

import Delete from '../../img/Delete.webp'
import Edit from '../../img/Edit.webp'
import Help from '../../img/HelpAndSupport.webp'
import Large from '../../img/Large.webp'
import Next from '../../img/Next.webp'
import Pause from '../../img/Pause.webp'
import Play from '../../img/Play.webp'
import Prev from '../../img/Prev.webp'
import Printer from '../../img/Printer.webp'
import RotateLeft from '../../img/RotateLeft.webp'
import RotateRight from '../../img/RotateRight.webp'
import Save from '../../img/Save.webp'
import Slideshow from '../../img/Slideshow.webp'
import Small from '../../img/Small.webp'
import Stop from '../../img/Stop.png'
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
    images: FMItem[];
    onChange: (id: string) => void;
    globalVolume: number;
    globalMuted: boolean;
    plusTheme?: 'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
    onOpenInPaint: (imageUrl: string) => void;
    startInSlideshow?: boolean;
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
    onChange,
    images,
    globalVolume,
    globalMuted,
    plusTheme,
    onOpenInPaint,
    startInSlideshow,
}: WindowsFaxViewerProps) => {

    const { position, handleMouseDown } = useDraggable(200, 100);
    const sounds = useSound(globalVolume, globalMuted);
    const themeSound = plusTheme === 'aquarium' ? sounds.aquarium
        : plusTheme === 'davinci' ? sounds.daVinci
        : plusTheme === 'nature' ? sounds.nature
        : plusTheme === 'space' ? sounds.space
        : null;
    const playExclamation = () => themeSound ? themeSound.playExclamation() : sounds.playExclamation();

    const displayTitle = item.name;
    const fileIconRef = useRef<HTMLImageElement>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    const [systemMenuOpen, setSystemMenuOpen] = useState(false);
    const [rotations, setRotations] = useState<Record<string, number>>({});
    const rotation = rotations[item.id] ?? 0;
    const currentIndex = images.findIndex(img => img.id === item.id);
    // const isSideways = Math.abs(rotation % 180) === 90;
    const [fitMode, setFitMode] = useState<'actual' | 'fit'>('fit');
    const [zoom, setZoom] = useState(1);
    const [isSlideshow, setIsSlideshow] = useState(!!startInSlideshow);
    useEffect(() => {
        if (startInSlideshow) setIsSlideshow(true);
    }, [startInSlideshow]);
    const [isSlideshowPaused, setIsSlideshowPaused] = useState(false);
    const [showSlideshowControls, setShowSlideshowControls] = useState(true);
    const slideshowIdleTimerRef = useRef<number | null>(null);
    const [errorType, setErrorType] = useState<import('../CriticalError').ErrorType | null>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const pictureRef = useRef<HTMLDivElement>(null);
    const [imageBox, setImageBox] = useState<{ top: number; right: number } | null>(null);

    const measureImage = () => {
        const img = imageRef.current;
        const pic = pictureRef.current;
        if (!img || !pic) return;
        const imgRect = img.getBoundingClientRect();
        const picRect = pic.getBoundingClientRect();
        setImageBox({
            top: imgRect.top - picRect.top,
            right: picRect.right - imgRect.right,
        });
    };

    useEffect(() => {
        if (!isSlideshow) return;
        measureImage();
        const onResize = () => measureImage();
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [isSlideshow, item.id, rotation, zoom, fitMode]);

    const rotateRight = () => setRotations(r => ({ ...r, [item.id]: (r[item.id] ?? 0) + 90 }));
    const rotateLeft = () => setRotations(r => ({ ...r, [item.id]: (r[item.id] ?? 0) - 90 }));

    const goPrev = () => {
        if (currentIndex > 0) onChange(images[currentIndex - 1].id);
    };

    const goNext = () => {
        if (currentIndex < images.length - 1) onChange(images[currentIndex + 1].id);
    };

    const zoomIn = () => setZoom(z => Math.min(z + 0.25, 3));
    const zoomOut = () => setZoom(z => Math.max(z - 0.25, 0.25));
    
    useEffect(() => {
        onTitleChange(displayTitle, WindowsPictureAndFax);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [displayTitle]);

    useEffect(() => {
        setZoom(1);
        setFitMode('fit');
    }, [item.id]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore when typing in an editable field
            const target = e.target as HTMLElement | null;
            if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;

            // Only fire when this viewer is the active window
            if (!isActive) return;

            if (isSlideshow) bumpSlideshowControls();

            if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); return; }
            if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); return; }
            if (e.key === 'F11') { e.preventDefault(); toggleSlideshow(); return; }
            if (e.key === 'Escape' && isSlideshow) { e.preventDefault(); stopSlideshow(); return; }
            if (e.key === '+' || e.key === '=') { e.preventDefault(); setFitMode('actual'); zoomIn(); return; }
            if (e.key === '-') { e.preventDefault(); setFitMode('actual'); zoomOut(); return; }

            if (e.ctrlKey) {
                const k = e.key.toLowerCase();
                if (k === 'a') { e.preventDefault(); setFitMode('actual'); setZoom(1); return; }
                if (k === 'b') { e.preventDefault(); setFitMode('fit'); setZoom(1); return; }
                if (k === 'k') { e.preventDefault(); rotateRight(); return; }
                if (k === 'l') { e.preventDefault(); rotateLeft(); return; }
                if (k === 'p') { e.preventDefault(); playExclamation(); setErrorType('printerConnect'); return; }
                if (k === 's') { e.preventDefault(); playExclamation(); setErrorType('accessDenied'); return; }
                if (k === 'e') {
                    e.preventDefault();
                    const url = item.imageUrl ?? item.thumbnailUrl;
                    if (url) { onOpenInPaint(url); onClose(); }
                    return;
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex, images, isActive, isSlideshow, item.id]);

    useEffect(() => {
        if (!isSlideshow || isSlideshowPaused || images.length === 0) return;
        const interval = setInterval(() => {
            const idx = images.findIndex(i => i.id === item.id);
            const next = idx < images.length - 1 ? images[idx + 1] : images[0];
            onChange(next.id);
        }, 3000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSlideshow, isSlideshowPaused, item.id, images]);

    const toggleSlideshow = () => {
        setIsSlideshow(prev => !prev);
        setIsSlideshowPaused(false);
        setShowSlideshowControls(true);
    };

    const stopSlideshow = () => {
        if (startInSlideshow) {
            onClose();
            return;
        }
        setIsSlideshow(false);
        setIsSlideshowPaused(false);
    };

    // Bump the controls back into view and schedule a hide 3s later
    const bumpSlideshowControls = () => {
        setShowSlideshowControls(true);
        if (slideshowIdleTimerRef.current !== null) {
            window.clearTimeout(slideshowIdleTimerRef.current);
        }
        slideshowIdleTimerRef.current = window.setTimeout(() => {
            setShowSlideshowControls(false);
        }, 3000);
    };

    // Start the auto-hide timer when slideshow begins; clear when it ends
    useEffect(() => {
        if (isSlideshow) {
            bumpSlideshowControls();
        } else {
            if (slideshowIdleTimerRef.current !== null) {
                window.clearTimeout(slideshowIdleTimerRef.current);
                slideshowIdleTimerRef.current = null;
            }
            setShowSlideshowControls(true);
        }
        return () => {
            if (slideshowIdleTimerRef.current !== null) {
                window.clearTimeout(slideshowIdleTimerRef.current);
                slideshowIdleTimerRef.current = null;
            }
        };

    }, [isSlideshow]);

  return (
    <div className={[
        'app-window',
        'picturev-window',
        isActive  && 'app-window--active',
        isMinimized && 'picturev-window--minimized',
        isMinimized && 'app-window--minimized',
        isFullscreen && 'picturev-window--fullscreen',
        isFullscreen && 'app-window--fullscreen',
        isSlideshow && 'picturev-window--slideshow',
    ].filter(Boolean).join(' ')}
    ref={rootRef}
    style={isFullscreen || isSlideshow ? {} : { left: position.x, top: position.y }}
    onMouseDown={onMouseDown}
    onMouseMove={isSlideshow ? bumpSlideshowControls : undefined}
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
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    onMouseDown={(e) => e.stopPropagation()}
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
            <div className="picture" ref={pictureRef}>
                {isSlideshow && (
                    <div
                        className={`slideshow-buttons${showSlideshowControls ? '' : ' slideshow-buttons--hidden'}`}
                        style={imageBox ? { top: imageBox.top, right: imageBox.right } : undefined}
                    >

                        <button
                            className={`viewer-btn${!isSlideshowPaused ? ' is-active' : ''}`}
                            aria-label='Start Slideshow'
                            data-tooltip='Start Slideshow'
                            onClick={() => { bumpSlideshowControls(); setIsSlideshowPaused(false); }}
                            disabled={!isSlideshowPaused}
                        >
                            <img src={Play} alt="" />
                        </button>

                        <button
                            className={`viewer-btn${isSlideshowPaused ? ' is-active' : ''}`}
                            aria-label='Pause Slideshow'
                            data-tooltip='Pause Slideshow'
                            onClick={() => { bumpSlideshowControls(); setIsSlideshowPaused(true); }}
                            disabled={isSlideshowPaused}
                        >
                            <img src={Pause} alt="" />
                        </button>

                        <div className="button-separator" tabIndex={-1} aria-disabled></div>

                        <button
                            className='viewer-btn'
                            aria-label='Previous image'
                            data-tooltip='Preious Picture'
                            onClick={() => { bumpSlideshowControls(); goPrev(); }}
                            disabled={currentIndex <= 0}
                        >
                            <img src={Prev} alt="" />
                        </button>

                        <button
                            className='viewer-btn'
                            aria-label='Next image'
                            data-tooltip='Next Picture'
                            onClick={() => { bumpSlideshowControls(); goNext(); }}
                            disabled={currentIndex === -1 || currentIndex >= images.length - 1}
                        >
                            <img src={Next} alt="" />
                        </button>

                        <div className="button-separator" tabIndex={-1} aria-disabled></div>

                        <button
                            className='viewer-btn'
                            aria-label='Close presentation'
                            data-tooltip='Close the Window'
                            onClick={stopSlideshow}
                        >
                            <img src={Stop} alt="" />
                        </button>
                    </div>
                )}

                <img
                    ref={imageRef}
                    src={item.imageUrl ?? item.thumbnailUrl}
                    alt={item.name}
                    onLoad={measureImage}
                    className={[
                        fitMode === 'actual' ? 'actual-size' : '',
                        isSlideshow ? 'slideshow-image' : '',
                    ].filter(Boolean).join(' ')}
                    style={{
                        transform: `rotate(${rotation}deg) scale(${zoom})`,
                    }}
                />
            </div>

            <div className="viewer-buttons">
                <button 
                    className='viewer-btn' 
                    aria-label='Previous image'
                    data-tooltip='Preious Image (Left Arrow)'
                    onClick={goPrev}
                    disabled={currentIndex <= 0}
                >
                    <img src={Prev} alt="" />
                </button>

                <button 
                    className='viewer-btn' 
                    aria-label='Next image'
                    data-tooltip='Next Image (Right Arrow)'
                    onClick={goNext}
                    disabled={currentIndex === -1 || currentIndex >= images.length - 1}
                >
                    <img src={Next} alt="" />
                </button>

                <div className="button-separator" tabIndex={-1} aria-disabled></div>

                <button
                    className={`viewer-btn${fitMode === 'actual' ? ' is-active' : ''}`}
                    aria-label='Show at a full size'
                    data-tooltip='Actual Size (Ctrl+A)'
                    onClick={() => { setFitMode('actual'); setZoom(1); }}
                >
                    <img src={Large} alt="" />
                </button>

                <button
                    className={`viewer-btn${fitMode === 'fit' ? ' is-active' : ''}`}
                    aria-label='Fit the window'
                    data-tooltip='Best Fit (Ctrl+B)'
                    onClick={() => { setFitMode('fit'); setZoom(1); }}
                >
                    <img src={Small} alt="" />
                </button>

                <button
                    className={`viewer-btn${isSlideshow ? ' is-active' : ''}`}
                    aria-label='Slideshow'
                    data-tooltip={isSlideshow ? 'Stop Slideshow (F11)' : 'Start Slideshow (F11)'}
                    onClick={toggleSlideshow}
                >
                    <img src={Slideshow} alt="" />
                </button>

                <div className="button-separator" tabIndex={-1} aria-disabled></div>

                <button
                    className='viewer-btn'
                    aria-label='Zoom in'
                    data-tooltip='Zoom In (+)'
                    onClick={() => { setFitMode('actual'); zoomIn(); }}
                    disabled={zoom >= 3}
                >
                    <img src={ZoomIn} alt="" />
                </button>

                <button
                    className='viewer-btn'
                    aria-label='Zoom out'
                    data-tooltip='Zoom Out (-)'
                    onClick={() => { setFitMode('actual'); zoomOut(); }}
                    disabled={zoom <= 0.25}
                >
                    <img src={ZoomOut} alt="" />
                </button>

                <div className="button-separator" tabIndex={-1} aria-disabled></div>

               <button 
                    className='viewer-btn' 
                    aria-label='Rotate right'
                    data-tooltip='Rotate Clockwise (Ctrl+K)'
                    onClick={rotateRight}
                >
                    <img src={RotateRight} alt="" />
                </button>

                <button 
                    className='viewer-btn' 
                    aria-label='Rotate left'
                    data-tooltip='Rotate Conter Clockwise (Ctrl+L)'
                    onClick={rotateLeft}
                >
                    <img src={RotateLeft} alt="" />
                </button>

                <div className="button-separator" tabIndex={-1} aria-disabled></div>

                <button
                    className='viewer-btn'
                    aria-label='Delete'
                    data-tooltip='Delete (Delete)'
                    onClick={() => { playExclamation(); setErrorType('accessDenied'); }}
                >
                    <img src={Delete} alt="" />
                </button>

                <button 
                    className='viewer-btn' 
                    aria-label='Print'
                    data-tooltip='Print (Ctrl+P)'
                    onClick={() => { playExclamation(); setErrorType('printerConnect'); }}
                >
                    <img src={Printer} alt="" />
                </button>

                <button
                    className='viewer-btn'
                    aria-label='Save'
                    data-tooltip='Copy To (Ctrl+S)'
                    onClick={() => { playExclamation(); setErrorType('accessDenied'); }}
                >
                    <img src={Save} alt="" />
                </button>

                <button
                    className='viewer-btn'
                    aria-label='Open for editing'
                    data-tooltip='Closes this program and opens the image for editing (Ctrl+E)'
                    onClick={() => {
                        const url = item.imageUrl ?? item.thumbnailUrl;
                        if (!url) return;
                        onOpenInPaint(url);
                        onClose();
                    }}
                >
                    <img src={Edit} alt="" />
                </button>

                <div className="button-separator" tabIndex={-1} aria-disabled></div>

                <button
                    className='viewer-btn'
                    aria-label='Help'
                    data-tooltip='Help (F1)'
                    onClick={() => { playExclamation(); setErrorType('accessDenied'); }}
                >
                    <img src={Help} alt="" />
                </button>
            </div>
        </div>

        {errorType && createPortal(
            <CriticalError
                type={errorType}
                onClose={() => setErrorType(null)}
            />,
            document.body
        )}
    </div>
  )
}

export default WindowsFaxViewer 
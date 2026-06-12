import { useState, useEffect, useRef } from 'react';
import type { FMItem } from './data/FileManagerData';
import Prev from '../../img/Prev.webp';
import Next from '../../img/Next.webp';
import RotateRight from '../../img/RotateRight.webp';
import RotateLeft from '../../img/RotateLeft.webp';
import './PictureViewer.css';

interface PictureViewerProps {
    images: FMItem[];
    activeId: string;
    onChange: (id: string) => void;
}

const PictureViewer = ({ images, activeId, onChange }: PictureViewerProps) => {
    const [rotations, setRotations] = useState<Record<string, number>>({});
    const rotation = rotations[activeId] ?? 0;
    const currentIndex = images.findIndex(img => img.id === activeId);
    const currentImage = images[currentIndex];
    const filmstripRef = useRef<HTMLDivElement | null>(null);

    // Reset rotation when image changes
    const rotateRight = () => setRotations(r => ({ ...r, [activeId]: (r[activeId] ?? 0) + 90 }));
    const rotateLeft = () => setRotations(r => ({ ...r, [activeId]: (r[activeId] ?? 0) - 90 }));
    const isSideways = Math.abs(rotation % 180) === 90;
   

    const goPrev = () => {
        if (currentIndex > 0) onChange(images[currentIndex - 1].id);
    };

    const goNext = () => {
        if (currentIndex < images.length - 1) onChange(images[currentIndex + 1].id);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') goPrev();
            if (e.key === 'ArrowRight') goNext();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [currentIndex, images]);

    // Keep the active thumbnail in view as the user navigates.
    useEffect(() => {
        const strip = filmstripRef.current;
        if (!strip) return;
        const el = strip.querySelector<HTMLElement>(`[data-filmstrip-id="${activeId}"]`);
        if (!el) return;
        const stripWidth = strip.clientWidth;
        const elLeft = el.offsetLeft;
        const elWidth = el.offsetWidth;
        strip.scrollLeft = elLeft + elWidth / 2 - stripWidth / 2;
    }, [activeId]);

  return (
    <div className='picture-viewer'>
        <div className='picture-viewer-main'>
            <div className='picture-preview-frame'>
                <img
                    className={`picture-viewer-img${isSideways ? ' is-sideways' : ''}`}
                    src={currentImage?.thumbnailUrl ?? currentImage?.imageUrl}
                    alt={currentImage?.name}
                    style={
                        rotation === 0
                            ? {}
                            : isSideways
                                ? { transform: `rotate(${rotation}deg)`, maxWidth: '200px', maxHeight: '200px', marginBottom: '50px' }
                                : { transform: `rotate(${rotation}deg)` }
                    }
                />

                <div className='picture-viewer-toolbar'>
                    <button type='button' onClick={goPrev} disabled={currentIndex === 0}>
                        <img src={Prev} alt='Previous' />
                    </button>
                    <button type='button' onClick={goNext} disabled={currentIndex === images.length - 1}>
                        <img src={Next} alt='Next' />
                    </button>
                    <div className='toolbar-separator' />
                    <button type='button' onClick={rotateRight}>
                        <img src={RotateRight} alt='Rotate Right' />
                    </button>
                    <button type='button' onClick={rotateLeft}>
                        <img src={RotateLeft} alt='Rotate Left' />
                    </button>
                </div>
            </div>
        </div>

        <div className='picture-viewer-filmstrip' ref={filmstripRef}>
            {images.map(img => (
                <button
                    key={img.id}
                    type='button'
                    data-filmstrip-id={img.id}
                    className={`filmstrip-item${img.id === activeId ? ' active' : ''}`}
                    onClick={() => onChange(img.id)}
                >
                    <img src={img.thumbnailUrl ?? img.imageUrl} alt={img.name} />
                    <span>{img.name}</span>
                </button>
            ))}
        </div>
    </div>
  )
}

export default PictureViewer
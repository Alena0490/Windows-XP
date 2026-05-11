import type { FMItem } from '../../data/FileManagerData'
import Prev from '../../img/Prev.webp'
import Next from '../../img/Next.webp'
import RotateRight from '../../img/RotateRight.webp'
import RotateLeft from '../../img/RotateLeft.webp'
import './PictureViewer.css'

interface PictureViewerProps {
    images: FMItem[];
    activeId: string;
    onChange: (id: string) => void;
}

const PictureViewer = ({ images, activeId, onChange }: PictureViewerProps) => {
    const currentIndex = images.findIndex(img => img.id === activeId);
    const currentImage = images[currentIndex];

    const goPrev = () => {
        if (currentIndex > 0) onChange(images[currentIndex - 1].id);
    };

    const goNext = () => {
        if (currentIndex < images.length - 1) onChange(images[currentIndex + 1].id);
    };

  return (
    <div className='picture-viewer'>
        <div className='picture-viewer-main'>
            <div className='picture-preview-frame'>
                <img
                    className='picture-viewer-img'
                    src={currentImage?.thumbnailUrl}
                    alt={currentImage?.name}
                />

                <div className='picture-viewer-toolbar'>
                    <button type='button' onClick={goPrev} disabled={currentIndex === 0}>
                        <img src={Prev} alt='Previous' />
                    </button>
                    <button type='button' onClick={goNext} disabled={currentIndex === images.length - 1}>
                        <img src={Next} alt='Next' />
                    </button>
                    <button type='button'>
                        <img src={RotateRight} alt='Rotate Right' />
                    </button>
                        <button type='button'>
                        <img src={RotateLeft} alt='Rotate Left' />
                    </button>
                </div>
            </div>
        </div>

    </div>
  )
}

export default PictureViewer
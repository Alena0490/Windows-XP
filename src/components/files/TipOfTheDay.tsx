import { useState } from 'react';
import TipImage from '../../img/Tipoftheday.webp';
import Close from '../../img/tileClose.png';
import './TipOfTheDay.css';

interface TipProps {
    onClose: () => void;
}

const TIPS = [
    'You can add folders to your Favorites list by clicking the Favorites menu and then clicking Organize Favorites.',
    'You can customize your toolbar by right-clicking on it and selecting Customize.',
    'You can use the Address bar to navigate directly to a folder by typing its path.',
    'To rename a file or folder quickly, simply click it and press the **F2** key.',
    'To select multiple files that are next to each other, hold down **SHIFT** and click the first and last file.',
    'To select multiple files that are not next to each other, hold down **CTRL** and click each file.',
    'You can quickly see the properties of any file or folder by holding **ALT** and pressing **ENTER**.',
];

const TipOfTheDay = ({ onClose }: TipProps) => {
    const [tipIndex, setTipIndex] = useState(0);

     const nextTip = () => {
        setTipIndex(prev => (prev + 1) % TIPS.length);
    };
    return (
        <div className='tip-body'>
            <button
                type='button'
                className='tip-close'
                aria-label='Close tip'
                onClick={onClose}
            >
                <img src={Close} alt='' />
            </button>
            <img src={TipImage} alt='' className='tip-icon' />
            <div className='tip-texts'>
                <p className='tip-bold'>Did you know...</p>
                <p className='tip-text'>{TIPS[tipIndex]}</p>
            </div>
            <button
                type='button'
                className='tip-next'
                onClick={nextTip}
            >
                Next tip
            </button>
        </div>
    );
};

export default TipOfTheDay;
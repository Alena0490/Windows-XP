import styles from './IESearchCompanion.module.css';

import MyMusicIcon from '../../img/MyMusic.webp'
import MoreMediaIcon from '../../img/IE Media.webp'


import Close from '../../img/tileClose.png';
import './Media.css'

interface MediaProps {
    onClose: () => void;
    onOpenFM: () => void;
    onNavigate: (url: string) => void;
    globalMuted: boolean;
    globalVolume: number;
}

const Media = ({ onClose, onOpenFM, onNavigate }: MediaProps) => {
    return (
        <div className={styles['ie-search-wrap']}>
            <div className={styles['ie-search-header']}>
                <span>Media</span>
                <button onClick={onClose} aria-label='Close'>
                    <img src={Close} alt='' />
                </button>
            </div>

            <div className={styles['ie-search-window']}>
                <div className="media-list">
                    <div className="media-places">
                        <h3>Media Places</h3>
                    </div>
                    <div className="places-list">
                        <ul>
                            <li onClick={onOpenFM}>
                                <img src={MyMusicIcon} alt="" /><span>My Music</span>
                            </li>
                            <li onClick={onOpenFM}>
                                <img src={MyVideosIcon} alt="" /><span>My Videos</span>
                            </li>
                            <li onClick={() => onNavigate('https://www.microsoft.com/isapi/redir.dll?prd=media')}>
                                <img src={MoreMediaIcon} alt="" /><span>More Media</span>
                            </li>
                            <li onClick={() => onNavigate('https://www.microsoft.com/isapi/redir.dll?prd=radio')}>
                                <img src={RadioGuideIcon} alt="" /><span>Radio Guide</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="media-options">
                {/* play button, progress bar, mute, volume — potřebuju znát, jak řešíš přehrávání v projektu */}
            </div>
        </div>
    );
};

export default Media
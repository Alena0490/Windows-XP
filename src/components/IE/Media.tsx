import { useState } from 'react';
import styles from './IESearchCompanion.module.css';

import MyMusicIcon from '../../img/MyMusic.webp'
import MoreMediaIcon from '../../img/IE Media.webp'
import MyVideosIcon from '../../img/MyVideo.webp'
import RadioGuideIcon from '../../img/MyRadio.webp'


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
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    const togglePlay = () => {
        setIsPlaying(prev => !prev);
    };

    const stopPlayback = () => {
        setIsPlaying(false);
    };

      const toggleMuted = () => {
        setIsMuted(prev => !prev);
    };

    return (
        <div className={styles['ie-search-wrap']}>
            <div className={styles['ie-search-header']}>
                <span>Media</span>
                <button onClick={onClose} aria-label='Close'>
                    <img src={Close} alt='' />
                </button>
            </div>

            <div className='media-window'>
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
                            <li onClick={() => onNavigate('http://web.archive.org/web/20020908100803/http://www.windowsmedia.com/mg/home.asp')}>
                                <img src={MoreMediaIcon} alt="" /><span>More Media</span>
                            </li>
                            <li onClick={() => onNavigate('http://web.archive.org/web/20020925050913/http://www.windowsmedia.com/mg/Radio.asp')}>
                                <img src={RadioGuideIcon} alt="" /><span>Radio Guide</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="media-options">
                <div className="media-options-inner">
                    <div className="media-title">
                          <h3>Media Options</h3>
                        <button 
                            className='options'
                            aria-label='show media options'
                        ></button>
                    </div>
                    <button 
                        className='maximize'
                        aria-label='maximize'
                        disabled
                    ></button>
                    <div className="media-buttons">
                        <div className="track-time"></div>
                        <button
                            type='button'
                            className={`play-pause${isPlaying ? ' playing' : ''}`}
                            onClick={togglePlay}
                            aria-label={isPlaying ? 'Pause' : 'Play'}
                            data-tooltip={isPlaying ? 'Pause' : 'Play'}
                        />
                        <button
                            type='button'
                            className='stop'
                            onClick={stopPlayback}
                            aria-label='Stop'
                            data-tooltip='Stop'
                        />
                        <div className="switch-btns">
                            <button
                                type='button' 
                                className='prev'
                                aria-label='Previous song'
                                data-tooltip='Previous Song'
                            ></button>
                            <button
                                type='button' 
                                className='prev'
                                aria-label='Next Song'
                                data-tooltip='Next Song'
                            ></button>
                        </div>
                        <div className="sounds">
                            <button
                                type='button'  
                                className={`sound-button${isMuted ? ' muted' : ''}`}
                                aria-label={isMuted ? 'Unmute' : 'Mute'}
                                data-tooltip={isPlaying ? 'Unmute' : 'Mute'}
                                onClick={toggleMuted}
                            >

                            </button>
                            <div className="volume-track">
                                <div className="volume-fill-wrap">
                                    <div 
                                        className="volume-fill"
                                        // style='--volume: 80%'
                                    ></div>
                                </div>
                                <div className="volume-thumb"></div>
                                 <input 
                                    className='volume-input'
                                    type="range" 
                                    min='0'
                                    max='1'
                                    step='0.01'
                                    value='0.8'
                                />
                            </div>
                           
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Media
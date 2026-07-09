import { useState, useRef, useEffect } from 'react';
import styles from './IESearchCompanion.module.css';

import MyMusicIcon from '../../img/MyMusic.webp';
import MoreMediaIcon from '../../img/IE Media.webp';
import MyVideosIcon from '../../img/MyVideo.webp';
import RadioGuideIcon from '../../img/MyRadio.webp';

import Close from '../../img/tileClose.png';
import './Media.css';

interface MediaProps {
    onClose: () => void;
    onOpenFM: () => void;
    onNavigate: (url: string) => void;
    globalMuted: boolean;
    globalVolume: number;
}

const base = import.meta.env.BASE_URL;

const TRACKS = [
    { name: 'Beethoven No. 9 Scherzo', url: `${base}music/Sample Music/BeethovenNo9Scherzo.mp3` },
    { name: 'Like Humans Do', url: `${base}music/Sample Music/david-byrne-like-humans-do.mp3` },
    { name: 'Highway Blues', url: `${base}music/Sample Music/Highway Blues - New Stories.mp3` },
];

const Media = ({ onClose, onOpenFM, onNavigate, globalMuted, globalVolume }: MediaProps) => {

    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(0.8);
    const [progress, setProgress] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Render-time reset: when track changes, clear progress without an effect
    const [prevIndex, setPrevIndex] = useState(currentIndex);
    if (prevIndex !== currentIndex) {
        setPrevIndex(currentIndex);
        setProgress(0);
    }

    const audioRef = useRef<HTMLAudioElement>(null);

    /*** PLAYBACK CONTROLS ***/

    // Sync play/pause state and reset currentTime when the track changes
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.currentTime = 0;
        if (isPlaying) {
            audio.play().catch(() => setIsPlaying(false));
        } else {
            audio.pause();
        }
    }, [isPlaying, currentIndex]);

    const togglePlay = () => {
        setIsPlaying(prev => !prev);
    };

    const stopPlayback = () => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
        setProgress(0);
    };

    const nextTrack = () => {
        setCurrentIndex(prev => (prev + 1) % TRACKS.length);
    };

    const prevTrack = () => {
        setCurrentIndex(prev => (prev - 1 + TRACKS.length) % TRACKS.length);
    };

    const handleTimeUpdate = () => {
        const audio = audioRef.current;
        if (!audio || !audio.duration) return;
        setProgress(audio.currentTime / audio.duration);
    };

    /*** VOLUME CONTROLS ***/

    // Apply volume and mute — combine local, per-app, and global controls
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.muted = isMuted || globalMuted;
        audio.volume = volume * globalVolume;
    }, [volume, isMuted, globalVolume, globalMuted]);

    const toggleMuted = () => {
        setIsMuted(prev => !prev);
    };

    const currentTrack = TRACKS[currentIndex];

    return (
        <div className={styles['ie-search-wrap']}>
            {/* ── Header ── */}
            <div className={styles['ie-search-header']}>
                <span>Media</span>
                <button onClick={onClose} aria-label='Close'>
                    <img src={Close} alt='' />
                </button>
            </div>

            {/* ── Media Places ── */}
            <div className='media-window'>
                <div className='media-list'>
                    <div className='media-places'>
                        <h3>Media Places</h3>
                    </div>
                    <div className='places-list'>
                        <ul>
                            <li onClick={onOpenFM}>
                                <img src={MyMusicIcon} alt='' />
                                <span>My Music</span>
                            </li>
                            <li onClick={onOpenFM}>
                                <img src={MyVideosIcon} alt='' />
                                <span>My Videos</span>
                            </li>
                            <li onClick={() => onNavigate('http://web.archive.org/web/20020908100803/http://www.windowsmedia.com/mg/home.asp')}>
                                <img src={MoreMediaIcon} alt='' />
                                <span>More Media</span>
                            </li>
                            <li onClick={() => onNavigate('http://web.archive.org/web/20020925050913/http://www.windowsmedia.com/mg/Radio.asp')}>
                                <img src={RadioGuideIcon} alt='' />
                                <span>Radio Guide</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* ── Bottom Panel ── */}
            <div className='media-options'>
                <audio
                    ref={audioRef}
                    src={currentTrack.url}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={nextTrack}
                />
                <div className='media-options-inner'>
                    <div className='media-title'>
                        <h3>Media Options</h3>
                        <button
                            type='button'
                            className='options'
                            aria-label='Show media options'
                            data-tooltip='Media Options'
                        />
                    </div>
                    <button
                        type='button'
                        className='maximize'
                        aria-label='Maximize'
                        data-tooltip='Maximize'
                        disabled
                    />
                    <div className='media-buttons'>
                        <div
                            className='track-time'
                            style={{ '--progress': progress } as React.CSSProperties}
                        >
                            <div className='track-time-fill-wrap'>
                                <div className='track-time-fill' />
                            </div>
                        </div>
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
                            disabled={!isPlaying && progress === 0}
                            aria-label='Stop'
                            data-tooltip='Stop'
                        />
                        <div className='switch-btns'>
                            <button
                                type='button'
                                className='prev'
                                onClick={prevTrack}
                                aria-label='Previous song'
                                data-tooltip='Previous Song'
                            />
                            <button
                                type='button'
                                className='next'
                                onClick={nextTrack}
                                aria-label='Next Song'
                                data-tooltip='Next Song'
                            />
                        </div>
                        <div className='sounds'>
                            <button
                                type='button'
                                className={`sound-button${isMuted ? ' muted' : ''}`}
                                onClick={toggleMuted}
                                aria-label={isMuted ? 'Unmute' : 'Mute'}
                                data-tooltip={isMuted ? 'Unmute' : 'Mute'}
                            />
                            <div
                                className='volume-track'
                                style={{ '--volume': volume } as React.CSSProperties}
                            >
                                <div className='volume-fill-wrap'>
                                    <div className='volume-fill' />
                                </div>
                                <div className='volume-thumb' />
                                <input
                                    className='volume-input'
                                    type='range'
                                    min='0'
                                    max='1'
                                    step='0.01'
                                    value={volume}
                                    onChange={(e) => setVolume(Number(e.target.value))}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Media;

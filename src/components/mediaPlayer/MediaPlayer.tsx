import { useState, useEffect, useRef } from 'react';
import useDraggable from '../../hooks/useDraggable';
import MadiaPlayerApp from './MediaPlayerApp';
import MediaPlayerMenu from './MediaPlayerMenu';
import type { WMPTrack } from '../../types/WMPTrack';

import MediaPlayerIcon from '../../img/WindowsMediaPlayer 9.webp';

import './MediaPlayer.css';
import '../../App.css';

interface MediaPlayerProps {
    isFullscreen: boolean;
    setIsFullscreen: (value: boolean | ((prev: boolean) => boolean)) => void;
    isMinimized: boolean;
    setIsMinimized: (value: boolean | ((prev: boolean) => boolean)) => void;
    onClose: () => void;
    onMouseDown?: () => void;
    tracks: WMPTrack[];
    startIndex: number;
}

const MediaPlayer = ({
    isFullscreen,
    setIsFullscreen,
    isMinimized,
    setIsMinimized,
    onClose,
    onMouseDown,
    tracks,
    startIndex,
}: MediaPlayerProps) => {

    const [openModal, setOpenModal] = useState<'about' | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(startIndex);
    const [volume, setVolume] = useState(0.8);
    const [isMuted, setIsMuted] = useState(false);

    const audioRef = useRef<HTMLAudioElement>(null);
    const { position, handleMouseDown } = useDraggable(400, 150);

    /*** PLAYBACK CONTROLS ***/
    // Reset currentTime when track changes
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.currentTime = 0;
    }, [currentIndex]);

    // Auto-advance to next track when ended
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        const handleEnded = () => nextTrack();
        audio.addEventListener('ended', handleEnded);
        return () => audio.removeEventListener('ended', handleEnded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex, tracks.length]);

    // Audio keeps playing when skipped
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !isPlaying) return;
        audio.play();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex]);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(prev => !prev);
    };

    const stopTrack = () => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
    };

    const nextTrack = () => {
        setCurrentIndex(prev => Math.min(prev + 1, tracks.length - 1));
    };

    const prevTrack = () => {
        setCurrentIndex(prev => Math.max(prev - 1, 0));
    };

    const selectTrack = (index: number) => {
        setCurrentIndex(index);
    };

    /*** VOLUME CONTROLS ***/

    const volumeUp = () => {
        const audio = audioRef.current;
        if (!audio) return;
        const newVolume = Math.min(1, volume + 0.1);
        audio.volume = newVolume;
        setVolume(newVolume);
    };

    const volumeDown = () => {
        const audio = audioRef.current;
        if (!audio) return;
        const newVolume = Math.max(0, volume - 0.1);
        audio.volume = newVolume;
        setVolume(newVolume);
    };

    const toggleMute = () => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.muted = !isMuted;
        setIsMuted(prev => !prev);
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (true) {
                case e.ctrlKey && e.key === 'p': e.preventDefault(); togglePlay(); break;
                case e.ctrlKey && e.key === 's': e.preventDefault(); stopTrack(); break;
                case e.ctrlKey && e.key === 'b': e.preventDefault(); prevTrack(); break;
                case e.ctrlKey && e.key === 'f': e.preventDefault(); nextTrack(); break;
                case e.key === 'F8': e.preventDefault(); toggleMute(); break;
                case e.key === 'F9': e.preventDefault(); volumeDown(); break;
                case e.key === 'F10': e.preventDefault(); volumeUp(); break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPlaying, volume, isMuted]);

    return (
        <div
            className={[
                'app-window',
                'player-window',
                isMinimized && 'player--minimized',
                isMinimized && 'app-window--minimized',
                isFullscreen && 'player--fullscreen',
                isFullscreen && 'app-window--fullscreen',
            ].filter(Boolean).join(' ')}
            style={isFullscreen ? {} : { left: position.x, top: position.y }}
            onMouseDown={onMouseDown}
        >
            {/* ── Title Bar ── */}
            <div className='title-bar' onMouseDown={handleMouseDown}>
                <span className='title-bar-text'>
                    <img className='paint-icon' src={MediaPlayerIcon} alt='Windows Media Player Icon' />
                    untitled - Windows Media Player
                </span>
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
                        onClick={() => {
                            setIsMinimized(false);
                            setIsFullscreen(prev => !prev);
                        }}
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

            {/* ── Menu ── */}
            <MediaPlayerMenu
                onClose={onClose}
                onFullscreen={() => setIsFullscreen(prev => !prev)}
                windowPosition={position}
                openModal={openModal}
                setOpenModal={setOpenModal}
                onPlayPause={togglePlay}
                onStop={stopTrack}
                onNext={nextTrack}
                onPrev={prevTrack}
                onVolumeUp={volumeUp}
                onVolumeDown={volumeDown}
                onMute={toggleMute}
                isMuted={isMuted}
                onMinimize={() => setIsMinimized(true)}
            />

            {/* ── App ── */}
            <MadiaPlayerApp
                tracks={tracks}
                startIndex={currentIndex}
                isPlaying={isPlaying}
                audioRef={audioRef}
                onPlayPause={togglePlay}
                onStop={stopTrack}
                onNext={nextTrack}
                onPrev={prevTrack}
                volume={volume}
                onVolumeChange={setVolume}
                isMuted={isMuted}
                onSelectTrack={selectTrack}
            />
        </div>
    );
};

export default MediaPlayer;
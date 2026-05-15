import { useState, useEffect } from 'react';
import type { WMPTrack } from '../../types/WMPTrack';
import './MediaPlayer.css';

interface MediaPlayerAppProps {
    tracks: WMPTrack[];
    startIndex: number;
    isPlaying: boolean;
    audioRef: React.RefObject<HTMLAudioElement | null>;
    onPlayPause: () => void;
    onStop: () => void;
    onNext: () => void;
    onPrev: () => void;
    volume: number;
    onVolumeChange: (volume: number) => void;
    isMuted: boolean;
    onSelectTrack: (index: number) => void;
}

/* ─────────────────────────────────────────
   Icons
───────────────────────────────────────── */

const PlayIcon = () => (
    <svg viewBox='370.5 3605 8 8' aria-hidden='true'>
        <defs>
            <linearGradient id='playIconGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='var(--gradient-primary-start)' />
                <stop offset='100%' stopColor='var(--gradient-primary-end)' />
            </linearGradient>
        </defs>
        <polygon fill='url(#playIconGradient)' points='371 3605 371 3613 378 3609' />
    </svg>
);

const PlayIconSecondary = () => (
    <svg viewBox='370.5 3605 8 8' aria-hidden='true'>
        <defs>
            <linearGradient id='playIconSecondaryGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='#5679bb' />
                <stop offset='100%' stopColor='#849cce' />
            </linearGradient>
        </defs>
        <polygon fill='url(#playIconSecondaryGradient)' points='371 3605 371 3613 378 3609' />
    </svg>
);

const PauseIcon = () => (
    <svg viewBox='0 0 16 16' aria-hidden='true'>
        <defs>
            <linearGradient id='pauseIconGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='var(--gradient-primary-start)' />
                <stop offset='100%' stopColor='var(--gradient-primary-end)' />
            </linearGradient>
        </defs>
        <rect x='3' y='2' width='3' height='12' fill='url(#pauseIconGradient)' />
        <rect x='10' y='2' width='3' height='12' fill='url(#pauseIconGradient)' />
    </svg>
);

const StopIcon = () => (
    <svg viewBox='10 3605 8 8' aria-hidden='true'>
        <defs>
            <linearGradient id='stopIconGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='var(--gradient-primary-start)' />
                <stop offset='100%' stopColor='var(--gradient-primary-end)' />
            </linearGradient>
        </defs>
        <rect fill='url(#stopIconGradient)' x='11' y='3605' width='6' height='8' />
    </svg>
);

const SkipForwardIcon = () => (
    <svg viewBox='0 0 16 16' aria-hidden='true'>
        <defs>
            <linearGradient id='skipForwardGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='#5679bb' />
                <stop offset='100%' stopColor='#849cce' />
            </linearGradient>
        </defs>
        <path fill='url(#skipForwardGradient)' d='M10.00244,8.29091,2,12.30348V4.29335ZM14,2H12V14h2Z' />
    </svg>
);

const SkipBackIcon = () => (
    <svg viewBox='0 0 16 16' aria-hidden='true'>
        <defs>
            <linearGradient id='skipBackGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='#5679bb' />
                <stop offset='100%' stopColor='#849cce' />
            </linearGradient>
        </defs>
        <g transform='translate(16,0) scale(-1,1)'>
            <path fill='url(#skipBackGradient)' d='M10.00244,8.29091,2,12.30348V4.29335ZM14,2H12V14h2Z' />
        </g>
    </svg>
);

const FullscreenIcon = () => (
    <svg viewBox='0 0 100 100' aria-hidden='true'>
        <rect x="32" y="32" width="36" height="36" fill="none" stroke="#ffffff" strokeWidth="10" />
        <path fill='#ffffff' d='M 50 6  L 65 21 L 35 21 Z' />
        <path fill='#ffffff' d='M 50 94 L 65 79 L 35 79 Z' />
        <path fill='#ffffff' d='M 6  50 L 21 35 L 21 65 Z' />
        <path fill='#ffffff' d='M 94 50 L 79 35 L 79 65 Z' />
    </svg>
);

const SoundIcon = () => (
    <svg viewBox='0 0 100 60' aria-hidden='true'>
        <defs>
            <linearGradient id='soundIconGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='var(--gradient-primary-start)' />
                <stop offset='100%' stopColor='var(--gradient-primary-end)' />
            </linearGradient>
        </defs>
        <path fill='url(#soundIconGradient)' d='M 24 22 L 34 22 L 52 4 L 52 56 L 34 38 L 24 38 Z' />
        <rect fill='url(#soundIconGradient)' x="61" y="17" width="22" height="9" transform="rotate(-18 48 13)" />
        <rect fill='url(#soundIconGradient)' x="61" y="26" width="22" height="9" />
        <rect fill='url(#soundIconGradient)' x="61" y="35" width="22" height="9" transform="rotate(18 48 47)" />
    </svg>
);

/* ─────────────────────────────────────────
   Component
───────────────────────────────────────── */

const MediaPlayerApp = ({
    tracks,
    startIndex,
    isPlaying,
    audioRef,
    onPlayPause,
    onStop,
    onNext,
    onPrev,
    onSelectTrack,
    volume,
    onVolumeChange
}: MediaPlayerAppProps) => {
    const [durations, setDurations] = useState<Record<number, number>>({});
    const [currentTime, setCurrentTime] = useState(0);

    const currentTrack = tracks[startIndex];
    const totalTime = Object.values(durations).reduce((acc, dur) => acc + dur, 0);

    const handleLoadedMetadata = (index: number) => {
        const audio = audioRef.current;
        if (!audio) return;
        setDurations(prev => ({ ...prev, [index]: audio.duration }));
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        tracks.forEach((track, index) => {
            const audio = new Audio(track.url);
            audio.onloadedmetadata = () => {
                setDurations(prev => ({ ...prev, [index]: audio.duration }));
            };
        });
    }, [tracks]);

    // Update progress
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        const update = () => setCurrentTime(audio.currentTime);
        audio.addEventListener('timeupdate', update);
        return () => audio.removeEventListener('timeupdate', update);
    }, [audioRef]);

    // Sync volume to the audio element
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.volume = volume;
    }, [volume, audioRef]);

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.currentTime = Number(e.target.value);
        setCurrentTime(Number(e.target.value));
    };


    return (
        <div className='media-player-app'>

            {/* ── Audio Element ── */}
            <audio 
                ref={audioRef} 
                src={currentTrack?.url}
                onLoadedMetadata={() => handleLoadedMetadata(startIndex)}
            />

            {/* ── Left Menu ── */}
            <aside className='left-menu'>
                <ul>
                    <li>Now<br/>Playing</li>
                    <li>Media<br/>Guide</li>
                    <li>Copy<br/>from CD</li>
                    <li>Media<br/>Library</li>
                    <li>Radio<br/>Tuner</li>
                    <li>Copy to CD<br/>or Device</li>
                    <li>Skin<br/>Chooser</li>
                </ul>
            </aside>

            {/* ── Song Info ── */}
            <div className='song-wrap'>
                <div className='song-title'>
                    <span className='artist'>{currentTrack?.artist ?? 'Unknown Artist'}</span>
                    <span className='song'>{currentTrack?.name ?? 'No track selected'}</span>
                </div>
                <div className='song-cover' />
                <div className='song-buttons'>
                    <button type='button' className='asterisk'>✱</button>
                    <button type='button' className='move-back'>◀</button>
                    <button type='button' className='move-next'>▶</button>
                    <span>Ambience:Random</span>
                    <button type='button' className='fullscreen'>
                        <FullscreenIcon />
                    </button>
                </div>
            </div>

            {/* ── Song Info Bar ── */}
            <div className='song-info'>
                <button type='button' className='play-song' title='play song' onClick={onPlayPause}>
                    <PlayIconSecondary />
                </button>
                <span className='song-name'>Song:</span>
                <span className='track'>{currentTrack?.name ?? ''}</span>
                <span className='duration'>{durations[startIndex] ? formatTime(durations[startIndex]) : '--:--'}</span>
            </div>

            {/* ── Playlist ── */}
            <aside className='playlist'>
                <span className='open-playlist'>
                    <button type='button' className='show-playlists' title='show playlists'>
                        ▶
                    </button>
                </span>
                <ul className='playlist-items'>
                    {tracks.map((track, index) => (
                        <li
                            key={index}
                            className={`playlist-item${index === startIndex ? ' active' : ''}`}
                            onClick={() => onSelectTrack(index)}
                        >
                            <span>{track.name}</span>
                            <span>{durations[index] ? formatTime(durations[index]) : '--:--'}</span>
                        </li>
                    ))}
                </ul>
                <span className='total-time'>Total Time: {totalTime > 0 ? formatTime(totalTime) : '--:--'}</span>
            </aside>

            {/* ── Playback Controls ── */}
            <div className='player-button'>
                <input
                    type='range'
                    className='progress-bar'
                    min={0}
                    max={durations[startIndex] ?? 0}
                    value={currentTime}
                    onChange={handleSeek}
                    step={0.1}
                />
                <button type='button' className='play-button play' onClick={onPlayPause}>
                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </button>
                <button type='button' className='play-button stop' onClick={onStop}>
                    <StopIcon />
                </button>
                <button type='button' className='play-button back' onClick={onPrev}>
                    <SkipBackIcon />
                </button>
                <button type='button' className='play-button forward' onClick={onNext}>
                    <SkipForwardIcon />
                </button>
                <button type='button' className='play-button sound'>
                    <SoundIcon />
                </button>
                <div className='volume-track'>
                    <div 
                        className='volume-fill-wrap'
                        style={{ '--volume': `${volume * 100}%` } as React.CSSProperties}
                    >
                        <div className='volume-fill' />
                    </div>
                    <div
                        className='volume-thumb'
                        style={{ left: `${volume * 37}px` }}
                    />
                      <input
                        className='volume-input'
                        type='range'
                        min={0}
                        max={1}
                        step={0.01}
                        value={volume}
                        onChange={(e) => onVolumeChange(Number(e.target.value))}
                    />
                </div>
            </div>
        </div>
    );
};

export default MediaPlayerApp;
import { useState, useEffect, useRef } from 'react';
import type { WMPTrack } from './types/WMPTrack';
import type { VisualizationPreset } from './types/VisualizationPreset';
import VizDropdown from './VizDropdown';
import './MediaPlayer.css';

const base = import.meta.env.BASE_URL;
const fallbackCover = `${base}music/visualizations/fallback.webp`;

const VIZ_CATEGORIES: { name: string; presets: { file: string; label: string }[] }[] = [
    {
        name: 'Ambience',
        presets: [
            { file: 'Ambience Water.mp4', label: 'Ambience:Water' },
            { file: 'Ambience Falloff.mp4', label: 'Ambience:Falloff' },
            { file: 'Ambience Swirl.mp4', label: 'Ambience:Swirl' },
        ],
    },
    {
        name: 'Bars and Waves',
        presets: [
            { file: 'Bars and Waves - Bars.mp4', label: 'Bars and Waves:Bars' },
            { file: 'Bars and Waves Oceam Mist.mp4', label: 'Bars and Waves:Ocean Mist' },
            { file: 'Bars and Waves Firestorm.mp4', label: 'Bars and Waves:Fire Storm' },
            { file: 'Bars and Waves Osciloscop.mp4', label: 'Bars and Waves:Scope' },
        ],
    },
    {
        name: 'Battery',
        presets: [
            { file: 'Battery Randomization.mp4', label: 'Battery:Randomization' },
            { file: 'Battery - Lotos.mp4', label: 'Battery:Lotus' },
            { file: 'Battery Event Horizon.mp4', label: 'Battery:Event Horizon' },
            { file: 'Battery - Smoke or Water.mp4', label: 'Battery:Smoke or Water?' },
        ],
    },
    {
        name: 'Particle',
        presets: [
            { file: 'Particle.mp4', label: 'Particle:Particle' },
            { file: 'RotatingParticle.mp4', label: 'Particle:Rotating Particle' },
        ],
    },
    {
        name: 'Plenoptics',
        presets: [
            { file: 'Plenoptic Smokey Circles.mp4', label: 'Plenoptics:Random' },
            { file: 'Penoptic Smokey CirclesSM.mp4', label: 'Plenoptics:Random' },
            { file: 'PlenopticsSmokeyLines.mp4', label: 'Plenoptics:Smokey Lines' },
            { file: 'PlenopticVox.mp4', label: 'Plenoptics:Vox' },
        ],
    },
    {
        name: 'Spikes',
        presets: [
            { file: 'Spikes.mp4', label: 'Spikes:Spike' },
        ],
    },
    {
        name: 'Musical Colors',
        presets: [
            { file: 'MusicalColors.mp4', label: 'Musical Colors:Colors in Motion' },
        ],
    },
];

interface MediaPlayerAppProps {
    onFullscreen: () => void;
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
    skinMode: boolean;
    onSkinMode: () => void;
    shuffle: boolean;
    onShuffle: () => void;
    visualization: VisualizationPreset;
    onVisualizationChange: (v: VisualizationPreset) => void;
}

/* ─────────────────────────────────────────
   Icons
───────────────────────────────────────── */
interface IconProps {
    color1?: string;
    color2?: string;
}

const COLORS = {
    normal: { color1: '#04053a', color2: '#5679bb' },
    disabled: { color1: '#5679bb', color2: '#849cce' },
    hover: { color1: '#7b2a00', color2: '#ffb55e' },
    active: { color1: '#04053a', color2: '#04053a' },
};

const getIconColors = (hover: boolean, active: boolean, disabled: boolean) => {
    if (disabled) return COLORS.disabled;
    if (active) return COLORS.active;
    if (hover) return COLORS.hover;
    return COLORS.normal;
};

const PlayIcon = ({ color1 = '#04053a', color2 = '#5679bb' }: IconProps) => (
    <svg viewBox='370.5 3605 8 8' aria-hidden='true'>
        <defs>
            <linearGradient id='playIconGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor={color1} />
                <stop offset='100%' stopColor={color2} />
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

const PauseIcon = ({ color1 = '#04053a', color2 = '#5679bb' }: IconProps) => (
    <svg viewBox='0 0 16 16' aria-hidden='true'>
        <defs>
            <linearGradient id='pauseIconGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor={color1} />
                <stop offset='100%' stopColor={color2} />
            </linearGradient>
        </defs>
        <rect x='3' y='2' width='3' height='12' fill='url(#pauseIconGradient)' />
        <rect x='10' y='2' width='3' height='12' fill='url(#pauseIconGradient)' />
    </svg>
);

const StopIcon = ({ color1 = '#04053a', color2 = '#5679bb' }: IconProps) => (
    <svg viewBox='10 3605 8 8' aria-hidden='true'>
        <defs>
            <linearGradient id='stopIconGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor={color1} />
                <stop offset='100%' stopColor={color2} />
            </linearGradient>
        </defs>
        <rect fill='url(#stopIconGradient)' x='11' y='3605' width='6' height='8' />
    </svg>
);


const SkipForwardIcon = ({ color1 = '#5679bb', color2 = '#849cce' }: IconProps) => (
    <svg viewBox='0 0 16 16' aria-hidden='true'>
        <defs>
            <linearGradient id='skipForwardGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor={color1} />
                <stop offset='100%' stopColor={color2} />
            </linearGradient>
        </defs>
        <path fill='url(#skipForwardGradient)' d='M10.00244,8.29091,2,12.30348V4.29335ZM14,2H12V14h2Z' />
    </svg>
);

const SkipBackIcon = ({ color1 = '#5679bb', color2 = '#849cce' }: IconProps) => (
    <svg viewBox='0 0 16 16' aria-hidden='true'>
        <defs>
            <linearGradient id='skipBackGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor={color1} />
                <stop offset='100%' stopColor={color2} />
            </linearGradient>
        </defs>
        <g transform='translate(16,0) scale(-1,1)'>
            <path fill='url(#skipBackGradient)' d='M10.00244,8.29091,2,12.30348V4.29335ZM14,2H12V14h2Z' />
        </g>
    </svg>
);

const FullscreenIcon = () => (
    <svg viewBox='0 0 100 100' aria-hidden='true'>
        <rect x='32' y='32' width='36' height='36' fill='none' stroke='#ffffff' strokeWidth='10' />
        <path fill='#ffffff' d='M 50 6  L 65 21 L 35 21 Z' />
        <path fill='#ffffff' d='M 50 94 L 65 79 L 35 79 Z' />
        <path fill='#ffffff' d='M 6  50 L 21 35 L 21 65 Z' />
        <path fill='#ffffff' d='M 94 50 L 79 35 L 79 65 Z' />
    </svg>
);

const SoundIcon = ({ color1 = '#04053a', color2 = '#5679bb' }: IconProps) => (
    <svg viewBox='0 0 100 60' aria-hidden='true'>
        <defs>
            <linearGradient id='soundIconGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor={color1} />
                <stop offset='100%' stopColor={color2} />
            </linearGradient>
        </defs>
        <path fill='url(#soundIconGradient)' d='M 24 22 L 34 22 L 52 4 L 52 56 L 34 38 L 24 38 Z' />
        <rect fill='url(#soundIconGradient)' x='61' y='17' width='22' height='9' transform='rotate(-18 48 13)' />
        <rect fill='url(#soundIconGradient)' x='61' y='26' width='22' height='9' />
        <rect fill='url(#soundIconGradient)' x='61' y='35' width='22' height='9' transform='rotate(18 48 47)' />
    </svg>
);

/* ─────────────────────────────────────────
   Component
───────────────────────────────────────── */

const MediaPlayerApp = ({
    onFullscreen,
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
    onVolumeChange,
    skinMode,
    onSkinMode,
    shuffle,
    onShuffle,
    visualization,
    onVisualizationChange
}: MediaPlayerAppProps) => {
    const [durations, setDurations] = useState<Record<number, number>>({});
    const [currentTime, setCurrentTime] = useState(0);
    const [playHover, setPlayHover] = useState(false);
    const [playActive, setPlayActive] = useState(false);
    const [stopHover, setStopHover] = useState(false);
    const [stopActive, setStopActive] = useState(false);
    const [backHover, setBackHover] = useState(false);
    const [backActive, setBackActive] = useState(false);
    const [forwardHover, setForwardHover] = useState(false);
    const [forwardActive, setForwardActive] = useState(false);
    const [soundHover, setSoundHover] = useState(false);
    const [soundActive, setSoundActive] = useState(false);
    const [vizDropdownOpen, setVizDropdownOpen] = useState(false);
    const [playlistHidden, setPlaylistHidden] = useState(false);

    const asteriskRef = useRef<HTMLButtonElement>(null);

    const noTracks = tracks.length === 0;

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

    // Reset durations when the playlist changes (render-time adjustment,
    // see react.dev "You Might Not Need an Effect")
    const [prevTracks, setPrevTracks] = useState(tracks);
    if (prevTracks !== tracks) {
        setPrevTracks(tracks);
        setDurations({});
    }

    useEffect(() => {
        const audios = tracks.map((track, index) => {
            const audio = new Audio();
            audio.preload = 'metadata';
            audio.onloadedmetadata = () => {
                setDurations(prev => ({ ...prev, [index]: audio.duration }));
            };
            audio.src = track.url;
            return audio;
        });
        return () => {
            audios.forEach(audio => {
                audio.onloadedmetadata = null;
                audio.removeAttribute('src');
            });
        };
    }, [tracks]);

    // Update progress
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        const update = () => setCurrentTime(audio.currentTime);
        audio.addEventListener('timeupdate', update);
        return () => audio.removeEventListener('timeupdate', update);
    }, [audioRef]);

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.currentTime = Number(e.target.value);
        setCurrentTime(Number(e.target.value));
    };

    const cycleViz = (direction: 1 | -1) => {
        if (!visualization.file) return;
        for (const cat of VIZ_CATEGORIES) {
            const idx = cat.presets.findIndex(p => p.file === visualization.file);
            if (idx === -1) continue;
            const len = cat.presets.length;
            const next = cat.presets[(idx + direction + len) % len];
            onVisualizationChange({ type: 'video', file: next.file, label: next.label });
            return;
        }
    };

    // Close the Visualization Dopdown
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('.asterisk') || target.closest('.viz-dropdown')) return;
            setVizDropdownOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className='media-player-app'>

            {/* ── Audio Element ── */}
            <audio 
                ref={audioRef} 
                src={currentTrack?.url}
                onLoadedMetadata={() => handleLoadedMetadata(startIndex)}
            />
            <button
                type='button'
                className='skin-mode-toggle'
                onClick={onSkinMode}
                data-tooltip={skinMode ? 'Switch to Full Mode' : 'Switch to Skin Mode'}
                aria-label={skinMode ? 'Switch to Full Mode' : 'Switch to Skin Mode'}
            />

            <button
                type='button'
                className='shuffle-mode-toggle'
                onClick={onShuffle}
                data-tooltip={shuffle ? 'Turn Shuffle Off' : 'Turn Shuffle On'}
                aria-label={shuffle ? 'Turn Shuffle Off' : 'Turn Shuffle On'}
                aria-pressed={shuffle}
            />
            <button
                type='button'
                className='equlizer-toggle'
                data-tooltip='Show Equalizer and Settings'
                aria-label='Show Equalizer and Settings'
            />
            <button
                type='button'
                className='playlist-toggle'
                onClick={() => setPlaylistHidden(prev => !prev)}
                data-tooltip={playlistHidden ? 'Show Playlist' : 'Hide Playlist'}
                aria-label={playlistHidden ? 'Show Playlist' : 'Hide Playlist'}
                aria-pressed={!playlistHidden}
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
            <div className={`song-wrap${playlistHidden ? ' playlist-hidden' : ''}`}>
                <div className='song-title'>
                    <span className='artist'>{currentTrack?.artist ?? 'Unknown Artist'}</span>
                    <span className='song'>{currentTrack?.name ?? 'No track selected'}</span>
                </div>
                <div className='song-cover'>
                    {visualization.type === 'albumart' && currentTrack?.cover
                        ? <img src={currentTrack.cover} alt={currentTrack.album ?? currentTrack.name} onError={(e) => { (e.target as HTMLImageElement).src = fallbackCover; }} />
                        : visualization.type === 'video' && visualization.file
                        ? <video
                            src={`${base}music/visualizations/${encodeURIComponent(visualization.file)}`}
                            autoPlay loop muted playsInline
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        : <img src={fallbackCover} alt='Visualization' />
                    }
                </div>
                <div className='song-buttons'>
                    <button 
                        type='button' 
                        className={`asterisk${vizDropdownOpen ? ' active' : ''}`}
                        ref={asteriskRef}
                        onClick={() => setVizDropdownOpen(prev => !prev)}
                    >✱</button>
                    {vizDropdownOpen && (
                        <VizDropdown
                            visualization={visualization}
                            onSelect={onVisualizationChange}
                            onClose={() => setVizDropdownOpen(false)}
                        />
                    )}
                    <button
                        type='button'
                        className='move-back'
                        onClick={() => cycleViz(-1)}
                        disabled={!visualization.file}
                    >◀</button>
                    <button
                        type='button'
                        className='move-next'
                        onClick={() => cycleViz(1)}
                        disabled={!visualization.file}
                    >▶</button>
                    <span>{visualization.label ?? 'Album Art'}</span>
                    <button 
                        type='button' 
                        className='fullscreen'
                        onClick={onFullscreen}
                    >
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
            <aside className={`playlist${playlistHidden ? ' playlist-hidden' : ''}`}>
                <span className='open-playlist'>
                    <button type='button' className='show-playlists' title='show playlists'>
                        <span>⯆</span>                      
                    </button>
                </span>
                <ul className='playlist-items'>
                    {tracks.map((track, index) => (
                        <li
                            key={track.url}
                            className={`playlist-item${index === startIndex ? ' active' : ''}`}
                            onClick={() => onSelectTrack(index)}
                        >
                            <span>{track.name}</span>
                            <span>{durations[index] ? formatTime(durations[index]) : '--:--'}</span>
                        </li>
                    ))}
                </ul>
                <span className={`total-time${playlistHidden ? ' playlist-hidden' : ''}`}>Total Time: {totalTime > 0 ? formatTime(totalTime) : '--:--'}</span>
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
                <button
                    type='button'
                    className='play-button play'
                    onClick={onPlayPause}
                    disabled={noTracks}
                    onMouseEnter={() => setPlayHover(true)}
                    onMouseLeave={() => { setPlayHover(false); setPlayActive(false); }}
                    onMouseDown={() => setPlayActive(true)}
                    onMouseUp={() => setPlayActive(false)}
                >
                    {isPlaying
                        ? <PauseIcon {...getIconColors(playHover, playActive, noTracks)} />
                        : <PlayIcon {...getIconColors(playHover, playActive, noTracks)} />
                    }
                </button>

                <button
                    type='button'
                    className='play-button stop'
                    onClick={onStop}
                    disabled={!isPlaying}
                    onMouseEnter={() => setStopHover(true)}
                    onMouseLeave={() => { setStopHover(false); setStopActive(false); }}
                    onMouseDown={() => setStopActive(true)}
                    onMouseUp={() => setStopActive(false)}
                >
                    <StopIcon {...getIconColors(stopHover, stopActive, !isPlaying)} />
                </button>

                <button
                    type='button'
                    className='play-button back'
                    onClick={onPrev}
                    disabled={startIndex === 0}
                    onMouseEnter={() => setBackHover(true)}
                    onMouseLeave={() => { setBackHover(false); setBackActive(false); }}
                    onMouseDown={() => setBackActive(true)}
                    onMouseUp={() => setBackActive(false)}
                >
                    <SkipBackIcon {...getIconColors(backHover, backActive, startIndex === 0)} />
                </button>

                <button
                    type='button'
                    className='play-button forward'
                    onClick={onNext}
                    disabled={noTracks}
                    onMouseEnter={() => setForwardHover(true)}
                    onMouseLeave={() => { setForwardHover(false); setForwardActive(false); }}
                    onMouseDown={() => setForwardActive(true)}
                    onMouseUp={() => setForwardActive(false)}
                >
                    <SkipForwardIcon {...getIconColors(forwardHover, forwardActive, noTracks)} />
                </button>

               <button
                    type='button'
                    className='play-button sound'
                    onMouseEnter={() => setSoundHover(true)}
                    onMouseLeave={() => { setSoundHover(false); setSoundActive(false); }}
                    onMouseDown={() => setSoundActive(true)}
                    onMouseUp={() => setSoundActive(false)}
                >
                    <SoundIcon {...getIconColors(soundHover, soundActive, false)} />
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
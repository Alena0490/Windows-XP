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
    onClose: () => void;
    onMinimize: () => void;
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
    onMute: () => void;
    onSelectTrack: (index: number) => void;
    skinMode: boolean;
    onSkinMode: () => void;
    onSwitchSkin: () => void;
    shuffle: boolean;
    onShuffle: () => void;
    visualization: VisualizationPreset;
    onVisualizationChange: (v: VisualizationPreset) => void;
    videoOpen: boolean;
    setVideoOpen: (value: boolean) => void;
}


const FullscreenIcon = () => (
    <svg viewBox='0 0 100 100' aria-hidden='true'>
        <rect x='32' y='32' width='36' height='36' fill='none' stroke='#ffffff' strokeWidth='10' />
        <path fill='#ffffff' d='M 50 6  L 65 21 L 35 21 Z' />
        <path fill='#ffffff' d='M 50 94 L 65 79 L 35 79 Z' />
        <path fill='#ffffff' d='M 6  50 L 21 35 L 21 65 Z' />
        <path fill='#ffffff' d='M 94 50 L 79 35 L 79 65 Z' />
    </svg>
);

/* ─────────────────────────────────────────
   Component
───────────────────────────────────────── */

const MediaPlayerApp = ({
    onClose,
    onMinimize,
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
    isMuted,
    onMute,
    skinMode,
    onSkinMode,
    onSwitchSkin,
    shuffle,
    onShuffle,
    visualization,
    onVisualizationChange,
    videoOpen,
    setVideoOpen,
}: MediaPlayerAppProps) => {
    const [durations, setDurations] = useState<Record<number, number>>({});
    const [currentTime, setCurrentTime] = useState(0);
    const [vizDropdownOpen, setVizDropdownOpen] = useState(false);
    const [playlistHidden, setPlaylistHidden] = useState(skinMode);
    const [engineShuttingDown, setEngineShuttingDown] = useState(false);
    const prevPlaylistHiddenRef = useRef(playlistHidden);

    useEffect(() => {
        setPlaylistHidden(skinMode);
    }, [skinMode]);

    useEffect(() => {
        if (!prevPlaylistHiddenRef.current && playlistHidden) {
            setEngineShuttingDown(true);
            const t = setTimeout(() => setEngineShuttingDown(false), 1000);
            prevPlaylistHiddenRef.current = playlistHidden;
            return () => clearTimeout(t);
        }
        prevPlaylistHiddenRef.current = playlistHidden;
    }, [playlistHidden]);
    const [playPressed, setPlayPressed] = useState(false);
    const [playlistDropdownOpen, setPlaylistDropdownOpen] = useState(false);

    const asteriskRef = useRef<HTMLButtonElement>(null);
    const playlistDropdownRef = useRef<HTMLDivElement>(null);

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

    const advanceVizAcrossCategories = () => {
        const flat = VIZ_CATEGORIES.flatMap(c => c.presets);
        if (!visualization.file) {
            const first = flat[0];
            onVisualizationChange({ type: 'video', file: first.file, label: first.label });
            return;
        }
        const idx = flat.findIndex(p => p.file === visualization.file);
        const next = flat[(idx + 1) % flat.length];
        onVisualizationChange({ type: 'video', file: next.file, label: next.label });
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

    // Close the Playlist Dropdown
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!playlistDropdownRef.current) return;
            const target = e.target as HTMLElement;
            if (playlistDropdownRef.current.contains(target)) return;
            setPlaylistDropdownOpen(false);
        };
        if (playlistDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [playlistDropdownOpen]);

    return (
        <div className={`media-player-app${engineShuttingDown ? ' engine-shutting-down' : ''}`}>
            {/* ── Audio Element ── */}
            <div className={`video-viewer${videoOpen ? ' open' : ''}`}></div>

            {/* Space skin - decorative elements */}
            <div className="engine-left engine" aria-hidden tabIndex={-1}></div>
            <div className="engine-right engine" aria-hidden tabIndex={-1}></div>

            {/* ── Audio Element ── */}
            <audio
                ref={audioRef}
                src={currentTrack?.url}
                onLoadedMetadata={() => handleLoadedMetadata(startIndex)}
            />

            <button
                className='video-off'
                data-tooltip='Small Screen'
                aria-label='small screen'
                onClick={() => setVideoOpen(false)}
            ></button>

            <button
                className='video-on'
                data-tooltip='Size 320x240'
                aria-label='size 320*240'
                onClick={() => setVideoOpen(true)}
            ></button>

            <button
                type='button'
                className='skin-mode-toggle'
                onClick={onSkinMode}
                data-tooltip={skinMode ? 'Switch to Full Mode' : 'Switch to Skin Mode'}
                aria-label={skinMode ? 'Switch to Full Mode' : 'Switch to Skin Mode'}
            />

             <button
                type='button'
                className='fullscreen-toggle'
                data-tooltip='Full Screen'
                aria-label='full screen'
                disabled
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
                className='show-song-cover'
                data-tooltip='Display album art'
                aria-label='display album art'
                onClick={()  => onVisualizationChange({ type: 'albumart', file: null, label: 'Album Art' })}
            />

            <button
                type='button'
                className='playlist-toggle'
                onClick={() => setPlaylistHidden(prev => !prev)}
                data-tooltip={playlistHidden ? 'Show Playlist' : 'Hide Playlist'}
                aria-label={playlistHidden ? 'Show Playlist' : 'Hide Playlist'}
                aria-pressed={!playlistHidden}
            />

            <button 
                type='button'
                className='player-minimize'
                aria-label='minimize'
                onClick={onMinimize}
                data-tooltip='Minimize'
            ></button>

            <button 
                type='button'
                className='player-close'
                aria-label='close'
                onClick={onClose}
                data-tooltip='Close'
            ></button>

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
            <div className={`song-wrap${!skinMode && playlistHidden ? ' playlist-hidden' : ''}`}>
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

            {skinMode && (
                <>
                    <button
                        type='button'
                        className='asterisk asterisk-skin'
                        onClick={advanceVizAcrossCategories}
                        data-tooltip='Next Visualization'
                        aria-label='next visualization'                        
                    >✱</button>
                </>
            )}

            {/* ── Song Info Bar ── */}
            <div className='song-info'>
                <button type='button' className='play-song' title='play song' onClick={onPlayPause}>
                </button>
                <span className='song-name'>Song:</span>
                <span className='track'>{currentTrack?.name ?? ''}</span>
                <span className='duration'>{durations[startIndex] ? formatTime(durations[startIndex]) : '--:--'}</span>
            </div>

            {/* ── Playlist ── */}
            <aside className={`playlist${playlistHidden ? ' playlist-hidden' : ''}`}>
                <button
                    className='playlist-close'            
                    aria-label={playlistHidden ? 'show playlist' : 'close playlist'}
                    data-tooltip={playlistHidden ? 'Show playlist' : 'Close playlist'}
                    onClick={() => setPlaylistHidden(prev => !prev)}
                ></button>
                <div className='open-playlist' ref={playlistDropdownRef}>
                    <div className='playlist-label'>Current Playlist</div>
                    <button
                        type='button'
                        className='show-playlists'
                        title='show playlists'
                        onClick={() => setPlaylistDropdownOpen(prev => !prev)}
                    >
                        <span>⯆</span>
                    </button>
                    {playlistDropdownOpen && (
                        <div className='playlist-dropdown'>
                            <div className='playlist-dropdown-item'>Current Playlist</div>
                        </div>
                    )}
                </div>
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

            <button
                type='button'
                className='switch-skin'
                onClick={onSwitchSkin}
                aria-label='Switch to Skin Mode'
            />

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
                    className={`play-button play${!skinMode && isPlaying ? ' running' : ''}${playPressed ? ' active' : ''}`}
                    onClick={onPlayPause}
                    disabled={noTracks || isPlaying}
                    aria-label={skinMode || !isPlaying ? 'Play' : 'Pause'}
                    onMouseDown={() => setPlayPressed(true)}
                    onMouseUp={() => setPlayPressed(false)}
                    onMouseLeave={() => setPlayPressed(false)}
                />

                {skinMode && (
                    <button
                        type='button'
                        className='play-button pause'
                        onClick={onPlayPause}
                        disabled={!isPlaying}
                        aria-label='Pause'
                    />
                )}

                <button
                    type='button'
                    className='play-button stop'
                    onClick={onStop}
                    disabled={!isPlaying}
                    aria-label='Stop'
                />

                <button
                    type='button'
                    className='play-button back'
                    onClick={onPrev}
                    disabled={startIndex === 0}
                    aria-label='Previous'
                >
                </button>

                <button
                    type='button'
                    className='play-button forward'
                    onClick={onNext}
                    disabled={noTracks || startIndex === tracks.length - 1}
                    aria-label='Next'
                >
                </button>

               <button
                    type='button'
                    className={`play-button sound${isMuted ? ' muted' : ''}`}
                    onClick={onMute}
                    aria-label={`${isMuted ? 'Unmute' : 'Mute'}`}
                />

                <div
                    className='volume-track'
                    style={{ '--volume': `${volume * 100}%` } as React.CSSProperties}
                >
                    <div className='volume-fill-wrap'>
                        <div className='volume-fill' />
                    </div>
                    <div className='volume-thumb' />
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
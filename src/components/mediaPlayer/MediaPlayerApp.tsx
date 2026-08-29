import { useState, useEffect, useRef } from 'react';

import type { WMPTrack } from './types/WMPTrack';
import type { VisualizationPreset } from './types/VisualizationPreset';
import VizDropdown from './VizDropdown';
import SkinChooser from './SkinChooser'

import { useExclusivePanel } from './hooks/useExclusivePanel';
import { useEqualizer } from './hooks/useEqualizer';
import { useVisualization } from './hooks/useVisualization';
import { useTrackDurations } from './hooks/useTrackDurations';

import './MediaPlayer.css';

const base = import.meta.env.BASE_URL;
const fallbackCover = `${base}music/visualizations/fallback.webp`;

type WMPPage = 'now-playing' | 'media-guide' | 'copy-from-cd' | 'media-library' | 'radio-tuner' | 'copy-to-cd' | 'skin-chooser';

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
    activeSkin: 'nature' | 'space' | 'davinci' | 'aquarium' | 'headspace' | 'windowsxp' | 'toothy' | 'heart' |  null;
    hasSkin: boolean;
    onSkinMode: () => void;
    onSwitchSkin: () => void;
    shuffle: boolean;
    onShuffle: () => void;
    visualization: VisualizationPreset;
    onVisualizationChange: (v: VisualizationPreset) => void;
    videoOpen: boolean;
    setVideoOpen: (value: boolean) => void;
    onSkinChange: (skin: string) => void;
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
    hasSkin,
    activeSkin,
    onSkinMode,
    onSwitchSkin,
    shuffle,
    onShuffle,
    visualization,
    onVisualizationChange,
    videoOpen,
    setVideoOpen,
    onSkinChange,
}: MediaPlayerAppProps) => {
    const [currentTime, setCurrentTime] = useState(0);
    const [vizDropdownOpen, setVizDropdownOpen] = useState(false);
    const [songButtonsHidden, setSongButtonsHidden] = useState(skinMode);
    const [engineShuttingDown, setEngineShuttingDown] = useState(false);
    const [activePage, setActivePage] = useState<WMPPage>('now-playing');
    const [prevSkinKey, setPrevSkinKey] = useState(`${skinMode}-${activeSkin}`);
    const [skinSwitching, setSkinSwitching] = useState(true);
    const [playPressed, setPlayPressed] = useState(false);
    const [playlistDropdownOpen, setPlaylistDropdownOpen] = useState(false);

    const isXP = activeSkin === 'windowsxp';
    const isToothy = activeSkin === 'toothy';
    const isHeart = activeSkin === 'heart';
    const panelMode = isXP ? 'xp' : isToothy ? 'toothy' : isHeart ? 'heart' : 'default';

    const {
        playlistHidden, setPlaylistHidden,
        equalizerDrawerHidden, setEqualizerDrawerHidden,
        infoHidden, setInfoHidden,
        togglePlaylist, toggleEqualizer, toggleInfo,
    } = useExclusivePanel(panelMode, skinMode);

    const [prevPlaylistHidden, setPrevPlaylistHidden] = useState(playlistHidden);

    const eq = useEqualizer();
    const { cycleViz, advanceVizAcrossCategories } = useVisualization(visualization, onVisualizationChange);
    const { durations, handleLoadedMetadata, totalTime } = useTrackDurations(tracks, audioRef);

    const skinKey = `${skinMode}-${activeSkin}`;

    const xpPanel: 'viz' | 'playlist' | 'equalizer' =
        !equalizerDrawerHidden ? 'equalizer' : !playlistHidden ? 'playlist' : 'viz';

    if (playlistHidden !== prevPlaylistHidden) {
        setPrevPlaylistHidden(playlistHidden);
        if (!prevPlaylistHidden && playlistHidden) {
            setEngineShuttingDown(true);
        }
    }

    if (skinKey !== prevSkinKey) {
        setPrevSkinKey(skinKey);
        setPlaylistHidden(activeSkin === 'headspace' ? false : (isToothy ? false : skinMode));
        setEqualizerDrawerHidden(isToothy ? true : skinMode);
        setSongButtonsHidden(skinMode);
        setInfoHidden(true);
        setSkinSwitching(true);
        if (skinMode) setActivePage('now-playing');
    }

    useEffect(() => {
        if (!engineShuttingDown) return;
        const t = setTimeout(() => setEngineShuttingDown(false), 1000);
        return () => clearTimeout(t);
    }, [engineShuttingDown]);

    useEffect(() => {
        if (!skinSwitching) return;
        const t = requestAnimationFrame(() => setSkinSwitching(false));
        return () => cancelAnimationFrame(t);
    }, [skinSwitching]);

    const asteriskRef = useRef<HTMLButtonElement>(null);
    const playlistDropdownRef = useRef<HTMLDivElement>(null);

    const noTracks = tracks.length === 0;

    const currentTrack = tracks[startIndex];

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

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
        <div
    className={`media-player-app${engineShuttingDown ? ' engine-shutting-down' : ''}`}
        data-xp-panel={isXP ? xpPanel : undefined}
    >
            {/* ── Audio Element ── */}
            <div className={`video-viewer${videoOpen ? ' open' : ''}`}></div>

            {/* SPACE skin - decorative elements */}
            <div className="engine-left engine" aria-hidden tabIndex={-1}></div>
            <div className="engine-right engine" aria-hidden tabIndex={-1}></div>

            {/* AQUARIUM skin - decorative elements */}
            <div className="jewel ruby-left" aria-hidden tabIndex={-1}></div>
            <div className="jewel ruby-right" aria-hidden tabIndex={-1}></div>
            <div className="jewel diamond-left" aria-hidden tabIndex={-1}></div>
            <div className="jewel diamond-right" aria-hidden tabIndex={-1}></div>
            <div className="jewel pendant" aria-hidden tabIndex={-1}></div>

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
                className='info'
                onClick={toggleInfo}
                data-tooltip={infoHidden ? 'Show Song Info' : 'Hide Song Info'}
                aria-label={infoHidden ? 'Show Song Info' : 'Hide Song Info'}
            />

            <button
                type='button'
                className='equlizer-toggle'
                onClick={toggleEqualizer}
                data-tooltip={activeSkin === 'aquarium'
                    ? (equalizerDrawerHidden ? 'Show Equalizer and Settings' : 'Hide Equalizer and Settings')
                    : (equalizerDrawerHidden ? 'Hide Equalizer and Settings' : 'Show Equalizer and Settings')}
                aria-label={activeSkin === 'aquarium'
                    ? (equalizerDrawerHidden ? 'Show Equalizer and Settings' : 'Hide Equalizer and Settings')
                    : (equalizerDrawerHidden ? 'Hide Equalizer and Settings' : 'Show Equalizer and Settings')}
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
                onClick={togglePlaylist}
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
                    <li className={activePage === 'now-playing' ? 'is-active' : ''} onClick={() => setActivePage('now-playing')}>Now<br/>Playing</li>
                    <li>Media<br/>Guide</li>
                    <li>Copy<br/>from CD</li>
                    <li>Media<br/>Library</li>
                    <li>Radio<br/>Tuner</li>
                    <li>Copy to CD<br/>or Device</li>
                    <li className={activePage === 'skin-chooser' ? 'is-active' : ''} onClick={() => setActivePage('skin-chooser')}>Skin<br/>Chooser</li>
                </ul>
            </aside>

            {/* ── Skin Chooser── */}
            {activePage === 'skin-chooser' && (
                <SkinChooser
                    onClose={() => setActivePage('now-playing')}
                    onApplySkin={(skin) => { onSkinChange(skin); setActivePage('now-playing'); }}
                />
              )}

            {/* ── Song Info ── */}
            <div className={`song-wrap${!skinMode && playlistHidden ? ' playlist-hidden' : ''}`} style={activePage === 'skin-chooser' ? { display: 'none' } : undefined}>
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
                    {isToothy && !(visualization.type === 'albumart' && currentTrack?.cover) && !(visualization.type === 'video' && visualization.file) && (
                        <div className="eye" aria-hidden tabIndex={-1}></div>
                    )}
                </div>
                <div className={`song-buttons${songButtonsHidden ? ' song-buttons-hidden' : ''}`}>
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
                    {activeSkin === 'headspace' && (
                        <button
                            type='button'
                            className='song-buttons-close'
                            onClick={() => setSongButtonsHidden(true)}
                            data-tooltip='Close the visualization chooser'
                            aria-label='Close the visualization chooser'
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
                    <span className='visualization'>{visualization.label ?? 'Album Art'}</span>
                    <button
                        type='button'
                        className='fullscreen'
                        onClick={onFullscreen}
                        disabled
                    >
                        <FullscreenIcon />
                    </button>
                </div>
            </div>

            {skinMode && hasSkin && activePage !== 'skin-chooser' && (
                <>
                    <button
                        type='button'
                        className='asterisk asterisk-skin'
                        onClick={() => {
                            if (isXP) {
                                setEqualizerDrawerHidden(true);
                                setPlaylistHidden(true);
                                advanceVizAcrossCategories();
                                return;
                            }
                            if (activeSkin === 'headspace') {
                                setSongButtonsHidden(prev => !prev);
                            } else {
                                advanceVizAcrossCategories();
                            }
                        }}
                        data-tooltip={activeSkin === 'headspace' ? (songButtonsHidden ? 'Show Controls' : 'Hide Controls') : 'Next Visualization'}
                        aria-label={activeSkin === 'headspace' ? (songButtonsHidden ? 'Show Controls' : 'Hide Controls') : 'next visualization'}
                    >✱</button>
                </>
            )}

            {/* ── Song Info Bar ── */}
            <div className='song-info'>
                <button type='button' className='play-song' title='play song' onClick={onPlayPause}>
                </button>
                <span className='song-name'>{activePage === 'skin-chooser' ? 'Ready:' : 'Song:'}</span>
                <span className='track'>
                    <span className='track-scroll'>
                        <span className='track-copy'>{currentTrack?.name ?? ''}</span>
                        <span className='track-copy' aria-hidden='true'>{currentTrack?.name ?? ''}</span>
                    </span>
                </span>
                <span className='duration'>{durations[startIndex] ? formatTime(durations[startIndex]) : '--:--'}</span>
            </div>

            {/* ── Playlist ── */}
            <aside className={`playlist${playlistHidden ? ' playlist-hidden' : ''}`} style={activePage === 'skin-chooser' ? { display: 'none' } : undefined}><button
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
                    className={`play-button play${(!skinMode || isXP || isToothy) && isPlaying ? ' running' : ''}${playPressed ? ' active' : ''}`}
                    onClick={onPlayPause}
                    disabled={noTracks}
                    aria-label={skinMode || !isPlaying ? 'Play' : 'Pause'}
                    onMouseDown={() => setPlayPressed(true)}
                    onMouseUp={() => setPlayPressed(false)}
                    onMouseLeave={() => setPlayPressed(false)}
                />

                {skinMode && !isXP && !isToothy && (
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

                <div className="volume-track-wrap balance-track-wrap">
                    <span className='volume-slider-label headspace-only'>Balance</span>
                    <div
                        className='volume-track'
                        style={{ '--volume': '50%' } as React.CSSProperties}
                    >
                        <div className='volume-fill-wrap'>
                            <div className='volume-fill' />
                        </div>
                        <div className='volume-thumb' />
                        <input
                            key={`balance-${activeSkin}-${eq.resetKey}`}
                            className='volume-input'
                            type='range'
                            defaultValue={50}
                        />
                    </div>
                </div>

                <div className="volume-track-wrap">
                    <span className='volume-slider-label headspace-only'>Volume</span>
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

            {/* ── Headspace-only skin drawer toggles ── */}
            <button
                type='button'
                className={`headspace-eq-toggle${equalizerDrawerHidden ? ' is-closed' : ' is-open'}`}
                onClick={() => setEqualizerDrawerHidden(prev => !prev)}
                data-tooltip={equalizerDrawerHidden ? 'Show Equalizer' : 'Hide Equalizer'}
                aria-label={equalizerDrawerHidden ? 'Show Equalizer' : 'Hide Equalizer'}
            />
            <button
                type='button'
                className={`headspace-playlist-toggle${playlistHidden ? ' is-closed' : ' is-open'}`}
                onClick={() => setPlaylistHidden(prev => !prev)}
                data-tooltip={playlistHidden ? 'Hide Playlist' : 'Show Playlist'}
                aria-label={playlistHidden ? 'Hide Playlist' : 'Show Playlist'}
            />

            {/* ── DaVinci-only extra playlist toggle (bottom-left of disc) ── */}
            {activeSkin === 'davinci' && (
                <button
                    type='button'
                    className={`davinci-playlist-toggle${playlistHidden ? ' is-closed' : ' is-open'}`}
                    onClick={() => setPlaylistHidden(prev => !prev)}
                    data-tooltip={playlistHidden ? 'Show Playlist' : 'Hide Playlist'}
                    aria-label={playlistHidden ? 'Show Playlist' : 'Hide Playlist'}
                />
            )}

            <aside className={`equalizer-drawer${equalizerDrawerHidden ? ' equalizer-drawer-hidden' : ''}${skinSwitching ? ' no-initial-transition' : ''}`}>
                <button
                    className='equalizer-drawer-close'
                    onClick={() => setEqualizerDrawerHidden(prev => !prev)}
                    data-tooltip='Close Equalizer'
                    aria-label='Close Equalizer'
                />

                <div className='eq-sliders'>
                    <div className='eq-slider-wrap'>
                        <input key={`bass-${activeSkin}-${eq.resetKey}`} className='eq-input' type='range' defaultValue={50} />
                        <span className='eq-label'>bass</span>
                    </div>
                    <div className='eq-slider-wrap'>
                        <input key={`treble-${activeSkin}-${eq.resetKey}`} className='eq-input' type='range' defaultValue={50} />
                        <span className='eq-label'>treble</span>
                    </div>
                    <div className='eq-slider-wrap eq-slider-wrap--balance'>
                        <input key={`balance-eq-${activeSkin}-${eq.resetKey}`} className='eq-input' type='range' defaultValue={50} />
                        <span className='eq-label'>balance</span>
                    </div>
                    {/* Extra bands — Headspace, Windows XP and Heart shows a 10-band EQ; hidden in all other skins via CSS */}
                    {eq.values.map((val, i) => (
                        <div key={i} className='eq-slider-wrap eq-slider-wrap--headspace-only'>
                            <input
                                className='eq-input'
                                type='range'
                                min={0}
                                max={100}
                                value={val}
                                onChange={(e) => eq.handleChange(i, Number(e.target.value))}
                                onInput={(e) => eq.handleChange(i, Number((e.target as HTMLInputElement).value))}
                            />
                        </div>
                    ))}
                </div>
                <button
                    type='button'
                    className='eq-reset'
                    onClick={eq.reset}
                    data-tooltip='Reset graphic equalizer controls'
                    aria-label='Reset graphic equalizer controls'
                >
                    reset
                </button>
                {isHeart && (
                    <div className='eq-preset-switcher'>
                        <button className='prev-preset' aria-label='Previous preset' onClick={eq.prevPreset}></button>
                        <span className='preset-name'>{eq.presetName}</span>
                        <button className='next-preset' aria-label='Next preset' onClick={eq.nextPreset}></button>
                    </div>
                )}

            </aside>

            {isHeart && (
                <aside className={`info-panel${infoHidden ? ' info-panel-hidden' : ''}`}>
                    <div className='info-panel-row'><span className='info-panel-label'>Artist:</span> <span className='info-panel-value'>{currentTrack?.artist ?? 'Unknown Artist'}</span></div>
                    <div className='info-panel-row'><span className='info-panel-label'>Album:</span> <span className='info-panel-value'>{currentTrack?.album ?? 'Unknown Album'}</span></div>
                    <div className='info-panel-row'><span className='info-panel-label'>Track:</span> <span className='info-panel-value'>{currentTrack?.name ?? 'No track selected'}</span></div>
                    <div className='info-panel-row'><span className='info-panel-label'>Elapsed time:</span> <span className='info-panel-value'>{formatTime(currentTime)}</span></div>
                    <div className='info-panel-row'><span className='info-panel-label'>Total time:</span> <span className='info-panel-value'>{durations[startIndex] ? formatTime(durations[startIndex]) : '--:--'}</span></div>
                </aside>
            )}
        </div>
    );
};

export default MediaPlayerApp;

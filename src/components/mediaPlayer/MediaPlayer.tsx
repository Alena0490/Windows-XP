import { useState, useEffect, useRef } from 'react';
import useDraggable from '../../hooks/useDraggable';
import MediaPlayerApp from './MediaPlayerApp';
import MediaPlayerMenu from './MediaPlayerMenu';
import WindowSystemMenu from '../WindowsSystemMenu';
import type { WMPTrack } from './types/WMPTrack';
import type { VisualizationPreset } from './types/VisualizationPreset';

import MediaPlayerIcon from '../../img/WindowsMediaPlayer 9.webp';

import './MediaPlayer.css';
import './skinStyles/Nature.css';
import './skinStyles/Space.css';
import './skinStyles/DaVinci.css';
import './skinStyles/Aquarium.css';
import '../../App.css';

interface MediaPlayerProps {
    isFullscreen: boolean;
    setIsFullscreen: (value: boolean | ((prev: boolean) => boolean)) => void;
    isMinimized: boolean;
    setIsMinimized: (value: boolean | ((prev: boolean) => boolean)) => void;
    onClose: () => void;
    onMouseDown?: () => void;
    isActive?: boolean;
    tracks: WMPTrack[];
    startIndex: number;
    onOpenFM: () => void;
    globalVolume: number;
    globalMuted: boolean;
    cdVolume: number;
    cdMuted: boolean; 
    plusTheme?: 'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
}

const MediaPlayer = ({
    isFullscreen,
    setIsFullscreen,
    isMinimized,
    setIsMinimized,
    onClose,
    onMouseDown,
    isActive,
    tracks,
    startIndex,
    onOpenFM,
    globalVolume,
    globalMuted,
    plusTheme,
    cdVolume,
    cdMuted,
}: MediaPlayerProps) => {

    const [openModal, setOpenModal] = useState<'about' | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(startIndex);
    const [volume, setVolume] = useState(0.8);
    const [isMuted, setIsMuted] = useState(false);
    const [shuffle, setShuffle] = useState(false);
    const [repeat, setRepeat] = useState(false);
    const [playedTracks, setPlayedTracks] = useState<number[]>([]);
    const [playbackRate, setPlaybackRate] = useState(1);
    const SKIN_CYCLE = ['off', 'default-skin', 'nature', 'space', 'davinci', 'aquarium'] as const;
    type SkinCycle = typeof SKIN_CYCLE[number];

    const readSkinFromStorage = (): SkinCycle => {
        const v = localStorage.getItem('wmp-skin-mode');
        return (SKIN_CYCLE as readonly string[]).includes(v ?? '') ? (v as SkinCycle) : 'off';
    };

    const [skinCycle, setSkinCycle] = useState<SkinCycle>(readSkinFromStorage);
    const skinMode = skinCycle !== 'off';
    const activeSkin: 'nature' | 'space' | 'davinci' | 'aquarium' | null = (skinCycle !== 'off' && skinCycle !== 'default-skin') ? skinCycle : null;

    const SKINS_ONLY = SKIN_CYCLE.filter(s => s !== 'off' && s !== 'default-skin') as ('nature' | 'space' | 'davinci' | 'aquarium')[];

    const toggleSkinMode = () => {
        setSkinCycle(prev => (prev === 'off' ? 'default-skin' : 'off'));
    };

    const cycleSkin = () => {
        setSkinCycle(prev => {
            const idx = SKINS_ONLY.indexOf(prev as 'nature' | 'space' | 'davinci' | 'aquarium');
            const nextIdx = (idx + 1) % SKINS_ONLY.length;
            return SKINS_ONLY[nextIdx];
        });
    };

    const SKIN_NAME_MAP: Record<string, SkinCycle> = {
        'Plus! Nature':    'nature',
        'Plus! Space':     'space',
        'Plus! da Vinci':  'davinci',
        'Plus! daVinci':   'davinci',
        'Plus! Aquarium':  'aquarium',
    };

    const handleSkinChange = (skin: string) => {
        const mapped = SKIN_NAME_MAP[skin];
        if (mapped) setSkinCycle(mapped);
    };

    useEffect(() => {
        localStorage.setItem('wmp-skin-mode', skinCycle);
    }, [skinCycle]);

    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (e.key === 'wmp-skin-mode') setSkinCycle(readSkinFromStorage());
        };
        window.addEventListener('storage', onStorage);
        const onCustom = () => setSkinCycle(readSkinFromStorage());
        window.addEventListener('wmp-skin-mode-change', onCustom);
        return () => {
            window.removeEventListener('storage', onStorage);
            window.removeEventListener('wmp-skin-mode-change', onCustom);
        };
    }, []);
    const [visualization, setVisualization] = useState<VisualizationPreset>({ type: 'albumart', file: null });
    const [systemMenuOpen, setSystemMenuOpen] = useState(false);
    const [videoOpen, setVideoOpen] = useState(false);
    
    const localTracks = tracks;

    const audioRef = useRef<HTMLAudioElement>(null);
    const mediaPlayerIconRef = useRef<HTMLImageElement>(null);
    const { position, handleMouseDown } = useDraggable(220, 20);

    /*** SONG OPENING ***/
    const handleOpen = () => {
        onOpenFM();
    };

    /*** PLAYBACK CONTROLS ***/

    // Playing speed
    const setSpeed = (rate: number) => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.playbackRate = rate;
        setPlaybackRate(rate);
    };

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
    }, [currentIndex, localTracks.length, shuffle, repeat, playedTracks]);
    
    // Select a track
    useEffect(() => {
        setCurrentIndex(startIndex);
        setIsPlaying(false);
        setPlayedTracks([]);
    }, [tracks, startIndex]);

    // Audio keeps playing when skipped
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !isPlaying) return;
        audio.play().catch(() => {});
    }, [currentIndex, isPlaying]);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch(() => {});
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
        if (shuffle) {
            const available = localTracks.map((_, i) => i).filter(i => !playedTracks.includes(i) && i !== currentIndex);
            if (available.length === 0) {
                if (repeat) {
                    setPlayedTracks([]);
                    setCurrentIndex(Math.floor(Math.random() * localTracks.length));
                }
                return;
            }
            const randomIndex = available[Math.floor(Math.random() * available.length)];
            setPlayedTracks(prev => [...prev, currentIndex]);
            setCurrentIndex(randomIndex);
        } else {
            if (currentIndex === localTracks.length - 1) {
                if (repeat) setCurrentIndex(0);
            } else {
                setCurrentIndex(prev => prev + 1);
            }
        }
    };

    const prevTrack = () => {
        setCurrentIndex(prev => Math.max(prev - 1, 0));
    };

    const selectTrack = (index: number) => {
        setCurrentIndex(index);
        setIsPlaying(true);
    };

    const toggleShuffle = () => {
        setShuffle(prev => !prev);
        setPlayedTracks([]);
    };

    /*** VOLUME CONTROLS ***/

    const volumeUp = () => {
        setVolume(prev => Math.min(1, prev + 0.1));
    };

    const volumeDown = () => {
        setVolume(prev => Math.max(0, prev - 0.1));
    };

    const toggleMute = () => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.muted = !isMuted;
        setIsMuted(prev => !prev);
    };

       // WMP- Volume Control
        useEffect(() => {
            const audio = audioRef.current;
            if (!audio) return;
            audio.volume = cdMuted ? 0 : cdVolume * volume;
        }, [cdVolume, cdMuted, volume]);

    // Keyboard shortcuts — only when this window is active
    useEffect(() => {
        if (!isActive || isMinimized) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (true) {
                case e.ctrlKey && e.key === 'p': e.preventDefault(); togglePlay(); break;
                case e.ctrlKey && e.key === 's': e.preventDefault(); stopTrack(); break;
                case e.ctrlKey && e.key === 'b': e.preventDefault(); prevTrack(); break;
                case e.ctrlKey && e.key === 'f': e.preventDefault(); nextTrack(); break;
                case e.key === 'F8': e.preventDefault(); toggleMute(); break;
                case e.key === 'F9': e.preventDefault(); volumeDown(); break;
                case e.key === 'F10': e.preventDefault(); volumeUp(); break;
                case e.ctrlKey && e.key === 'h': e.preventDefault(); toggleShuffle(); break;
                case e.ctrlKey && e.key === 't': e.preventDefault(); setRepeat(prev => !prev); break;
                case e.ctrlKey && e.key === '1': e.preventDefault(); setSkinCycle('off'); break;
                case e.ctrlKey && e.key === '2': e.preventDefault(); setSkinCycle('nature'); break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isActive, isMinimized, isPlaying, isMuted, currentIndex, shuffle, repeat, playedTracks]);

    return (
        <div
            className={[
                'app-window',
                'player-window',
                isActive && !openModal && 'app-window--active',
                skinMode && 'skin-mode',
                videoOpen && 'video-open',
                isMinimized && 'player--minimized',
                isMinimized && 'app-window--minimized',
                isFullscreen && 'player--fullscreen',
                isFullscreen && 'app-window--fullscreen',
            ].filter(Boolean).join(' ')}
            data-skin={activeSkin ?? undefined}
            style={isFullscreen ? {} : { left: position.x, top: position.y }}
            onMouseDown={onMouseDown}
        >
            {/* ── Title Bar ── */}
            <div className='title-bar' onMouseDown={handleMouseDown}>
                <span className='title-bar-text'>
                    <img 
                        className='paint-icon' 
                        src={MediaPlayerIcon} 
                        alt='Windows Media Player Icon'
                        ref={mediaPlayerIconRef}
                        onClick={() => setSystemMenuOpen(prev => !prev)} 
                    />
                    {systemMenuOpen && (
                        <WindowSystemMenu
                            open={systemMenuOpen}
                            onRequestClose={() => setSystemMenuOpen(false)}
                            triggerRef={mediaPlayerIconRef}
                            isFullscreen={isFullscreen}
                            onRestore={() => setIsFullscreen(false)}
                            onMove={() => {}}
                            onSize={() => {}}
                            onMinimize={() => setIsMinimized(true)}
                            onMaximize={() => { setIsMinimized(false); setIsFullscreen(prev => !prev); }}
                            onClose={onClose}
                        />
                    )}
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
                        disabled
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
                onShuffle={toggleShuffle}
                shuffle={shuffle}
                repeat={repeat}
                onRepeat={() => setRepeat(prev => !prev)}
                onOpen={handleOpen}
                playbackRate={playbackRate} 
                onSpeedChange={setSpeed}
                onSkinMode={toggleSkinMode}
                skinMode={skinMode}
                visualization={visualization}
                onVisualizationChange={setVisualization}
                globalVolume={globalVolume}
                globalMuted={globalMuted}
                plusTheme={plusTheme}
            />

            {/* ── App ── */}
            <MediaPlayerApp
                onClose={onClose}
                onMinimize={() => setIsMinimized(true)}
                onFullscreen={() => setIsFullscreen(prev => !prev)}
                tracks={localTracks}
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
                onMute={toggleMute}
                onSelectTrack={selectTrack}

                onSkinMode={toggleSkinMode}
                onSwitchSkin={cycleSkin}
                onSkinChange={handleSkinChange}
                skinMode={skinMode}
                activeSkin={activeSkin}
                hasSkin={activeSkin !== null}
                shuffle={shuffle}
                onShuffle={toggleShuffle}
                visualization={visualization}
                onVisualizationChange={setVisualization}
                videoOpen={videoOpen}
                setVideoOpen={setVideoOpen}
            />
        </div>
    );
};

export default MediaPlayer;
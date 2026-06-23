import { useState } from 'react';
import useDraggable from '../../hooks/useDraggable';
import useSound from '../../hooks/useSound';

import VolumeControlMenu from './VolumeControlMenu';
import type { ChannelId, Channel } from './hooks/useChannels';
import VolumeChannel from './VolumeChannel';
import AboutDialog from '../AboutDialog';

import './VolumeControl.css'
import VolumeLevel from '../../img/VolumeLevel.webp'
import '../../App.css'

interface VolumeControlProps {
    onClose: () => void;
    isMinimized: boolean;
    setIsMinimized: (value: boolean | ((prev: boolean) => boolean)) => void;
    isFullscreen: boolean;
    toggleFullscreen: () => void;
    onMouseDown?: () => void;
    isActive?: boolean;
    globalVolume: number;
    globalMuted: boolean;
    onGlobalVolumeChange: (v: number) => void;
    onGlobalMuteToggle: () => void;
    channels: Record<ChannelId, Channel>;
    setChannel: (id: ChannelId, patch: Partial<Channel>) => void;
    plusTheme?: 'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
}

const VolumeControl = ({
    onClose,
    isFullscreen,
    toggleFullscreen,
    isMinimized,
    setIsMinimized,
    onMouseDown,
    isActive,
    globalVolume,
    globalMuted,
    onGlobalVolumeChange,
    onGlobalMuteToggle,
    channels, 
    setChannel, 
    plusTheme

}:VolumeControlProps) => {
    const { position, handleMouseDown } = useDraggable(400, 150);
    const sounds = useSound(globalVolume, globalMuted);

    const [openAbout, setOpenAbout] = useState(false);

    const themeSound = plusTheme === 'aquarium' ? sounds.aquarium
        : plusTheme === 'davinci' ? sounds.daVinci
        : plusTheme === 'nature' ? sounds.nature
        : plusTheme === 'space' ? sounds.space
        : null;

    const playDefault = () => themeSound ? themeSound.playDefault() : sounds.playDefault();

  return (
      <div
            className={[
                'app-window',
                'volume-control-window',
                isActive  && 'app-window--active',
                isMinimized && 'volume-control--minimized',
                isMinimized && 'app-window--minimized',
                isFullscreen && 'volume-control--fullscreen',
                isFullscreen && 'app-window--fullscreen',
            ].filter(Boolean).join(' ')}
            style={isFullscreen ? {} : { left: position.x, top: position.y }}
            onMouseDown={onMouseDown}
        >
            <div className='title-bar' onMouseDown={handleMouseDown}>
                <span className='title-bar-text'>
                    <img className='volume-icon' src={VolumeLevel} alt='Volume Control Icon' />
                    Volume Control
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
                            toggleFullscreen();
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
            <VolumeControlMenu
                onClose={onClose}
                globalVolume={globalVolume}
                globalMuted={globalMuted}
                plusTheme={plusTheme}
                onAbout={() => setOpenAbout(true)}  
            />

            <div className="volume-main">
                <main className='volume-setting'>
                    <div className="app-volume">
                        <div className="main-volume">
                            <div className="item-name">Volume Control</div>
                            <VolumeChannel
                            muteLabel="Mute all"
                            volume={globalVolume}
                            muted={globalMuted}
                            onVolumeChange={onGlobalVolumeChange}
                            onMuteToggle={onGlobalMuteToggle}
                            onTestSound={playDefault}
                        />
                        </div>
                    </div>

                    <div className="mixers">
                        <div className="wave volume-item">
                            <div className="item-name">Wave</div>
                            <VolumeChannel
                                volume={channels.wave.volume}
                                muted={channels.wave.muted}
                                onVolumeChange={v => setChannel('wave', { volume: v })}
                                onMuteToggle={() => setChannel('wave', { muted: !channels.wave.muted })}
                                onTestSound={playDefault}
                            />
                        </div>
                        <div className="sw-synth volume-item">
                            <div className="item-name">SW Synth</div>
                            <VolumeChannel
                                volume={channels.swSynth.volume}
                                muted={channels.swSynth.muted}
                                onVolumeChange={v => setChannel('swSynth', { volume: v })}
                                onMuteToggle={() => setChannel('swSynth', { muted: !channels.swSynth.muted })}
                                onTestSound={playDefault}
                            />
                        </div>
                        <div className="line-in volume-item">
                            <div className="item-name">Line In</div>
                            <VolumeChannel
                                volume={channels.lineIn.volume}
                                muted={channels.lineIn.muted}
                                onVolumeChange={v => setChannel('lineIn', { volume: v })}
                                onMuteToggle={() => setChannel('lineIn', { muted: !channels.lineIn.muted })}
                                onTestSound={playDefault}
                            />
                        </div>
                        <div className="cd-audio volume-item">
                            <div className="item-name">CD Audio</div>
                            <VolumeChannel
                                volume={channels.cdAudio.volume}
                                muted={channels.cdAudio.muted}
                                onVolumeChange={v => setChannel('cdAudio', { volume: v })}
                                onMuteToggle={() => setChannel('cdAudio', { muted: !channels.cdAudio.muted })}
                                onTestSound={playDefault}
                            />
                        </div>
                    </div>
                </main>
                <div className='volume-control-footer'>Creative Sound Blaster PCI</div>
            </div>
            {openAbout && (
                <AboutDialog title="Volume Control" onClose={() => setOpenAbout(false)} />
            )}
    </div>
  )
}

export default VolumeControl
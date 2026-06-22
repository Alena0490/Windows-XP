import { useState } from 'react';
import VolumeLeft from '../../img/vol-left.webp';
import VolumeRight from '../../img/vol-right.webp';

interface VolumeChannelProps {
    muteLabel?: string;
    muted?: boolean;
    volume?: number;
    onVolumeChange?: (v: number) => void;
    onMuteToggle?: () => void;
}

const VolumeChannel = ({
    muteLabel = 'Mute',
    muted: externalMuted,
    volume: externalVolume,
    onVolumeChange: externalOnVolumeChange,
    onMuteToggle: externalOnMuteToggle,
}: VolumeChannelProps) => {
    const [balance, setBalance] = useState(1);
    const [localVolume, setLocalVolume] = useState(0.75);
    const [localMuted, setLocalMuted] = useState(externalMuted ?? false);

    const isControlled = externalVolume !== undefined;
    const volume = isControlled ? externalVolume! : localVolume;
    const isMuted = isControlled ? externalMuted! : localMuted;
    const onVolumeChange = isControlled ? externalOnVolumeChange! : setLocalVolume;
    const onMuteToggle = isControlled ? externalOnMuteToggle! : () => setLocalMuted(p => !p);

    const TICKS = 5;

    return (
        <div className='volume-channel'>
            <div className="balance-section">
                <div className="control-label">Balance:</div>

                <div className="balance-control">
                    <img src={VolumeLeft} alt="" aria-hidden="true" />

                    <div className="balance-slider-wrap">
                        <input
                            className="balance-slider"
                            type="range"
                            min={0}
                            max={2}
                            step={1}
                            value={balance}
                            onChange={(e) => setBalance(Number(e.target.value))}
                        />
                        <div className="balance-ticks" aria-hidden="true">
                            <span /><span /><span />
                        </div>
                    </div>

                    <img src={VolumeRight} alt="" aria-hidden="true" />
                </div>
            </div>

            <div className="volume-section">
                <div className="control-label">Volume:</div>

                <div className="volume-control">
                    <div className="volume-ticks" aria-hidden="true">
                        {Array.from({ length: TICKS }).map((_, i) => <span key={i} />)}
                    </div>
                    <input
                        className="channel-volume-slider"
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={isMuted ? 0 : volume}
                        disabled={isMuted}
                        onChange={(e) => onVolumeChange(Number(e.target.value))}
                        aria-label="Volume"
                    />
                    <div className="volume-ticks" aria-hidden="true">
                        {Array.from({ length: TICKS }).map((_, i) => <span key={i} />)}
                    </div>
                </div>
            </div>

            <label className="mute-control">
                <input
                    type="checkbox"
                    checked={isMuted}
                    onChange={onMuteToggle}
                />
                {muteLabel}
            </label>
        </div>
    );
};

export default VolumeChannel;

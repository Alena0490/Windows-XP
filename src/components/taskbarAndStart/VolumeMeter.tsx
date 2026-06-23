import { useEffect, useRef } from 'react';
import './VolumeMeter.css'

interface VolumeMeterProps {
    volume: number;
    onVolumeChange: (volume: number) => void;
    isMuted: boolean;
    onMuteToggle: () => void;
    onClose: () => void;
}

const VolumeMeter = ({
    volume, 
    onVolumeChange, 
    isMuted, 
    onMuteToggle, 
    onClose
}:VolumeMeterProps) => {

    const windowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (windowRef.current && !windowRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

  return (
    <div className='volume-window' ref={windowRef}>
        <label className='volume-label' htmlFor='volume'>Volume</label>

        <input 
            className='volume-slider'
            type='range' 
            id='volume'
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            disabled={isMuted}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
        />

        <label className='mute-row' htmlFor='mute'>
            <input 
                className='mute-checkbox'
                type='checkbox' 
                id='mute' 
                checked={isMuted}
                onChange={onMuteToggle}
            />
            <span>Mute</span>
        </label>
    </div>
  )
}

export default VolumeMeter
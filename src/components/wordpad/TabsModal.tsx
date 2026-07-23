import { useState } from 'react';
import useDraggable from '../../hooks/useDraggable';
import useSound from '../../hooks/useSound';

import XPScrollbar from '../XPScrollbar';
import '../keyboard/FontModal.css';
import './TabsModal.css';
import '../../App.css';

interface TabsModalProps {
    onClose: () => void;
    style?: React.CSSProperties;
    globalVolume: number;
    globalMuted: boolean;
    plusTheme?: 'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
    onApply: (tabStops: number[]) => void;
    initialTabStops?: number[];
}

const TabsModal = ({
    onClose,
    style,
    globalVolume,
    globalMuted,
    plusTheme,
    onApply,
    initialTabStops,
}: TabsModalProps) => {
    const initialX = typeof style?.left === 'number' ? style.left : Math.round(window.innerWidth  / 2 - 175);
    const initialY = typeof style?.top  === 'number' ? style.top  : Math.round(window.innerHeight / 2 - 100);
    const { position, handleMouseDown } = useDraggable(initialX, initialY);

    const [tabStops, setTabStops] = useState<number[]>(initialTabStops ?? []);
    const [positionInput, setPositionInput] = useState('');
    const [selected, setSelected] = useState<number | null>(null);

    const sounds = useSound(globalVolume, globalMuted);
    const themeSound = plusTheme === 'aquarium' ? sounds.aquarium
        : plusTheme === 'davinci' ? sounds.daVinci
        : plusTheme === 'nature' ? sounds.nature
        : plusTheme === 'space' ? sounds.space
        : null;
    const playStartMenu = () => themeSound ? themeSound.playMenuCmd() : sounds.playStartMenu();

    const handleSet = () => {
        const num = parseFloat(positionInput.replace('"', '').trim());
        if (isNaN(num)) return;
        playStartMenu();
        setTabStops(prev => [...new Set([...prev, num])].sort((a, b) => a - b));
        setPositionInput('');
    };

    const handleClear = () => {
        if (selected === null) return;
        playStartMenu();
        setTabStops(prev => prev.filter((_, i) => i !== selected));
        setSelected(null);
    };

    const handleClearAll = () => {
        playStartMenu();
        setTabStops([]);
        setSelected(null);
    };

    return (
        <div
            className='app-window find-replace-dialog tabs-modal'
            style={{ left: position.x, top: position.y }}
            tabIndex={-1}
            onMouseDown={e => e.stopPropagation()}
        >
            <div className='title-bar' onMouseDown={handleMouseDown}>
                <span className='title-bar-text'>Tabs</span>
                <div className='title-bar-buttons xp-title-controls'>
                    <button type='button' className='xp-title-control btn-help'  aria-label='Help'>?</button>
                    <button type='button' className='xp-title-control btn-close' aria-label='Close' onClick={onClose}>✕</button>
                </div>
            </div>

            <div className='tabs-modal-body'>
                <fieldset className='fm-sample-frame tabs-modal-frame'>
                    <legend className='fm-sample-legend'>Tab stop position</legend>

                    <input
                        type='text'
                        className='tabs-modal-input'
                        value={positionInput}
                        onChange={e => setPositionInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleSet(); }}
                    />

                    <XPScrollbar className='tabs-modal-list'>
                    <ul className='tabs-modal-list-inner'>
                        {tabStops.map((pos, i) => (
                            <li
                                key={i}
                                className={`tabs-modal-list-item${selected === i ? ' tabs-modal-list-item--selected' : ''}`}
                                onClick={() => setSelected(i)}
                            >
                                {pos}"
                            </li>
                        ))}
                    </ul>
                    </XPScrollbar>

                    <div className='tabs-modal-frame-buttons'>
                        <button 
                          type='button' 
                          className='luna-btn secondary' 
                          onClick={handleSet}
                          disabled={positionInput.trim() === ''}
                        >Set</button>
                        <button
                            type='button'
                            className='luna-btn secondary'
                            onClick={handleClear}
                            disabled={selected === null}
                        >
                            Clear
                        </button>
                    </div>
                </fieldset>

                <div className='tabs-modal-actions'>
                    <button
                        type='button'
                        className='luna-btn'
                        onClick={() => {
                            playStartMenu();
                            onApply(tabStops);
                            onClose();
                        }}
                    >
                        OK
                    </button>
                    <button
                        type='button'
                        className='luna-btn secondary'
                        onClick={() => { playStartMenu(); onClose(); }}
                    >
                        Cancel
                    </button>
                    <button
                        type='button'
                        className='luna-btn secondary'
                        onClick={handleClearAll}
                        disabled={tabStops.length === 0}
                    >
                        Clear All
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TabsModal;
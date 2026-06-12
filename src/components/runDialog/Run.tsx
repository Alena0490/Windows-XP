import { useState } from 'react';
import useDraggable from '../../hooks/useDraggable';
import RunIcon from '../../img/Run.webp'

import './Run.css'
import '../../App.css'

interface RunProps {
    isMinimized: boolean;
    onClose: () => void;
    onMouseDown?: () => void;
    isActive?: boolean;

    onOpenCalculator?: () => void;
    onOpenDisplayProperties?: () => void;
    onOpenFileManager?: () => void;
    onOpenIE?: () => void;
    onOpenMediaPlayer?: () => void;
    onOpenMinesweeper?: () => void;
    onOpenNotepad?: () => void;  
    onOpenPaint?: () => void;
    onOpenSolitaire?: () => void;
    onOpenTerminal?: () => void;
  
}

const Run = ({
    isMinimized,
    onClose,
    onMouseDown,
    isActive,
    onOpenCalculator,
    onOpenDisplayProperties,
    onOpenFileManager,
    onOpenIE,
    onOpenMediaPlayer,
    onOpenMinesweeper,
    onOpenNotepad,
    onOpenPaint,
    onOpenSolitaire,
    onOpenTerminal,
}:RunProps) => {

    const [value, setValue] = useState('');
    const [history] = useState(['notepad', 'calc', 'mspaint']);
    const [showHistory, setShowHistory] = useState(false);

    const { position, handleMouseDown } = useDraggable(450, 50);

    // Start searching
    const handleOK = () => {
        const cmd = value.trim().toLowerCase();
        if (cmd === 'notepad') onOpenNotepad?.();
        else if (cmd === 'calc') onOpenCalculator?.();
        else if (cmd === 'mspaint') onOpenPaint?.();
        else if (cmd === 'iexplore') onOpenIE?.();
        else if (cmd === 'cmd') onOpenTerminal?.();
        else if (cmd === 'explorer') onOpenFileManager?.();
        else if (cmd === 'minesweeper') onOpenMinesweeper?.();
        else if (cmd === 'solitaire') onOpenSolitaire?.();
        else if (cmd === 'wmplayer') onOpenMediaPlayer?.();
        else if (cmd === 'desk.cpl') onOpenDisplayProperties?.();
        onClose();
    };

    return (
        <div 
            className={[
                'app-window',
                'run-window',
                isActive && 'app-window--active',
                isMinimized && 'run--minimized',
                isMinimized && 'app-window--minimized',
            ].filter(Boolean).join(' ')}
            style={{ left: position.x, top: position.y }}
            onMouseDown={onMouseDown}
        >
            <div className='title-bar' onMouseDown={handleMouseDown}>
                <span className='title-bar-text'>Run</span>
                <div className='title-bar-buttons xp-title-controls'>
                    <button type='button' className='xp-title-control btn-help' aria-label='Help' />
                    <button type='button' className='xp-title-control btn-close' onClick={onClose} aria-label='Close'>✕</button>
                </div>
            </div>

            <div className='run-body'>
                <div className='run-settings'>
                    <img src={RunIcon} alt='' />
                    <p>Type the name of a program, folder, document, or Internet resource, and Windows will open it for you.</p>
                </div>
                <div className='run-input-row'>
                    <label htmlFor='open-input'>Open:</label>
                    <div className='xp-select-wrapper'>
                        <input
                            type='text'
                            id='open-input'
                            className='open-input'
                            value={value}
                            onChange={e => setValue(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') handleOK(); }}
                            autoFocus
                        />
                        <span
                            className='xp-select-arrow'
                            aria-hidden='true'
                            onClick={() => setShowHistory(prev => !prev)}
                        />
                        {showHistory && (
                            <div className='run-dropdown'>
                                {history.map(cmd => (
                                    <div key={cmd} className='run-dropdown-item' onClick={() => { setValue(cmd); setShowHistory(false); }}>
                                        {cmd}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className='run-buttons'>
                    <button className='luna-btn' onClick={handleOK}>OK</button>
                    <button className='luna-btn secondary' onClick={onClose}>Cancel</button>
                    <button className='luna-btn secondary' onClick={() => { onOpenFileManager?.(); onClose(); }}>Browse...</button>
                </div>
            </div>
        </div>
    );
}

export default Run

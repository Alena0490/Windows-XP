import { useState } from 'react';
import { useDraggableDialog } from '../../hooks/useDraggableDialog';
import aplicationWindow from '../../img/ApplicationWindow.webp'
import './GameMiniModal.css';
import '../../App.css'

interface BestTimesProps {
    onClose: () => void;
    style?: React.CSSProperties;
}

const DEFAULT_TIMES = { easy: 999, intermediate: 999, expert: 999 };

const BestTimes = ({ onClose, style }: BestTimesProps) => {
    const { dialogRef, onMouseDown, draggableStyle } = useDraggableDialog();

    const loadTimes = () => {
        const saved = localStorage.getItem('minesweeper-times');
        return saved ? JSON.parse(saved) : DEFAULT_TIMES;
    };

    const [times, setTimes] = useState(loadTimes);

    const handleReset = () => {
        localStorage.setItem('minesweeper-times', JSON.stringify(DEFAULT_TIMES));
        setTimes(DEFAULT_TIMES);
    };

    return (
        <div
            id='times'
            className='app-window'
            style={{ ...style, ...draggableStyle }}
            ref={dialogRef}
            tabIndex={-1}
            onMouseDown={onMouseDown}
        >
            <div className='title-bar mine-modal-title'>
                <span className='title-bar-text mine-modal-text'>
                    <img src={aplicationWindow} alt='' aria-hidden='true' />
                    Fastest Mine Sweepers
                </span>
                <div className='title-bar-buttons xp-title-controls'>
                    <button
                        type='button'
                        className='xp-title-control btn-help'
                        aria-label='Help'
                    />
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
            <div className='mine-dialog-body'>
                <ul className='times'>
                    <li><span><span className='mnemonic'>B</span>eginner:</span> <span>{times.easy ?? 999} sec</span></li>
                    <li><span><span className='mnemonic'>I</span>ntermediate:</span> <span>{times.intermediate ?? 999} sec</span></li>
                    <li><span><span className='mnemonic'>E</span>xpert:</span> <span>{times.expert ?? 999} sec</span></li>
                </ul>
                <div className='mine-dialog-actions'>
                    <button type='button' className='luna-btn secondary' onClick={handleReset}>
                        <span className='underline'>R</span>eset Scores
                    </button>
                    <button type='button' className='luna-btn' onClick={onClose} autoFocus>
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BestTimes;
import { useState } from 'react';
import { useDraggableDialog } from '../../hooks/useDraggableDialog';
import type { BoardConfig } from './data/game';
import aplicationWindow from '../../img/ApplicationWindow.webp'
import './GameMiniModal.css';
import '../../App.css'
interface CustomProps {
    onClose: () => void;
    onReset: (newLevel: BoardConfig) => void;
    setLevel: (level: BoardConfig) => void;
    style?: React.CSSProperties;
}

const Custom = ({ onClose, onReset, setLevel, style }: CustomProps) => {
    const [height, setHeight] = useState(9);
    const [width, setWidth] = useState(9);
    const [mines, setMines] = useState(10);

    const { dialogRef, onMouseDown, draggableStyle } = useDraggableDialog();

    const handleOk = () => {
        const rows = Math.min(24, Math.max(9, height));
        const cols = Math.min(30, Math.max(9, width));
        const maxMines = rows * cols - 1;
        const safeMines = Math.min(maxMines, Math.max(10, mines));
        const newLevel: BoardConfig = { rows, cols, mines: safeMines };
        setLevel(newLevel);
        onReset(newLevel);
        onClose();
    };

    return (
        <div
            id='custom'
            className='app-window'
            style={{ ...style, ...draggableStyle }}
            ref={dialogRef}
            tabIndex={-1}
            onMouseDown={onMouseDown}
        >
            <div className='title-bar mine-modal-title'>
                <span className='title-bar-text mine-modal-text'>
                    <img src={aplicationWindow} alt='' aria-hidden='true' />
                    Custom Field
                </span>
                <div className='title-bar-buttons xp-title-controls'>
                    <button
                        type='button'
                        className='xp-title-control btn-help'
                        aria-label='Help'
                    >
                        ?
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
            <div className='mine-dialog-body'>
                <ul>
                    <li>
                        <label htmlFor='height'><span className='mnemonic'>H</span>eight:</label>
                        <input
                            id='height'
                            type='number'
                            min={9}
                            max={24}
                            value={height}
                            onChange={e => setHeight(Number(e.target.value))}
                        />
                    </li>
                    <li>
                        <label htmlFor='width'><span className='mnemonic'>W</span>idth:</label>
                        <input
                            id='width'
                            type='number'
                            min={9}
                            max={30}
                            value={width}
                            onChange={e => setWidth(Number(e.target.value))}
                        />
                    </li>
                    <li>
                        <label htmlFor='mines'><span className='mnemonic'>M</span>ines:</label>
                        <input
                            id='mines'
                            type='number'
                            min={10}
                            value={mines}
                            onChange={e => setMines(Number(e.target.value))}
                        />
                    </li>
                </ul>
                <div className='mine-dialog-actions'>
                    <button type='button' className='luna-btn' onClick={handleOk} autoFocus>OK</button>
                    <button type='button' className='luna-btn secondary' onClick={onClose}>Cancel</button>            
                </div>
            </div>
        </div>
    );
};

export default Custom;
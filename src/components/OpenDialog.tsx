import { createPortal } from 'react-dom';
import { useState } from 'react';
import useDraggable from '../hooks/useDraggable';
import QuestionIcon from '../img/Question.webp';
import './OpenDialog.css'
import './CriticalError.css'
import '../App.css'

interface OpenDialogProps {
    history?: string[];
    titleBar?: string;
    onOpen: (url: string) => void;
    onClose: () => void;
    onBrowse?: () => void;
}

const OpenDialog = ({ history = [], titleBar = 'Open', onOpen, onClose, onBrowse }: OpenDialogProps) => {
    const [value, setValue] = useState('');
    const [asWebFolder, setAsWebFolder] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    const { position, handleMouseDown } = useDraggable(
        Math.round(window.innerWidth / 2 - 200),
        Math.round(window.innerHeight / 2 - 90)
    );

    const handleOk = () => {
        if (value.trim()) {
            onOpen(value.trim());
            onClose();
        }
    };
    

    return createPortal (
        <div
            className='app-window error-window open-dialog'
            style={{ left: position.x, top: position.y }}
        >
            <div className='title-bar' onMouseDown={handleMouseDown}>
                <span className='title-bar-text'>{titleBar}</span>
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

            <div className='error-body open-dialog-body'>
                <img className='error-body-icon' src={QuestionIcon} alt='' />
                <div className='error-text'>
                    <span className='error-message'>
                        Type the Internet address of a document or folder, and
                        Internet Explorer will open it for you.
                    </span>
                    <div className='open-dialog-row'>
                        <label htmlFor='open-input'>Open:</label>
                        <input
                            id='open-input'
                            type='text'
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleOk()}
                            autoFocus
                        />
                    </div>
                    <button 
                        className='open-recent' 
                        aria-label='Show history'
                        onClick={() => setShowHistory(prev => !prev)}
                        ></button>
                        {showHistory && history.length > 0 && (
                            <ul className='open-dialog-history'>
                                {history.map((url, i) => (
                                    <li
                                        key={i}
                                        onClick={() => {
                                            setValue(url);
                                            setShowHistory(false);
                                        }}
                                    >
                                        {url}
                                    </li>
                                ))}
                            </ul>
                        )}
                    <label className='open-dialog-check'>
                        <input
                            type='checkbox'
                            checked={asWebFolder}
                            onChange={(e) => setAsWebFolder(e.target.checked)}
                        />
                        Open as Web Folder
                    </label>
                </div>
            </div>

            <div className='error-footer open-dialog-footer'>
                <button
                    type='button'
                    id={value.trim() ? 'xp-default-btn' : undefined}
                    className='error-dialog-btn'
                    onClick={handleOk}
                    disabled={!value.trim()}
                >
                    OK
                </button>
                <button
                    type='button'
                    className='error-dialog-btn'
                    onClick={onClose}
                >
                    Cancel
                </button>
                <button
                    type='button'
                    className='error-dialog-btn'
                    onClick={onBrowse}
                >
                    Browse...
                </button>
            </div>
        </div>,
        document.body
    )
}

export default OpenDialog
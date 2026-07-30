import { useState } from 'react';
import useDraggable from '../../hooks/useDraggable';
import './SendWebModal.css'
import '../../App.css'


interface SendWebModalProps {
    onClose: () => void;
    onSubmit: (url: string) => void;
    onMouseDown?: () => void;
    isActive?: boolean;
}

const SendWebModal = ({
    onClose,
    onSubmit,
    onMouseDown,
    isActive
}:SendWebModalProps) => {
    const [url, setUrl] = useState('');

    const { position, handleMouseDown } = useDraggable(
        Math.round(window.innerWidth / 2 - 190),
        Math.round(window.innerHeight / 2 - 60)
    );

    const handleOk = () => {
        if (!url.trim()) return;
        onSubmit(url.trim());
        onClose();
    };

  return (
        <div
            className={['app-window', 'send-webpage-dialog', isActive && 'app-window--active'].filter(Boolean).join(' ')}
            style={{ left: position.x, top: position.y }}
            onMouseDown={onMouseDown}
        >
            <div className='title-bar' onMouseDown={handleMouseDown}>
                <span className='title-bar-text'>Send Web Page</span>
                <div className='title-bar-buttons xp-title-controls'>
                    <button type='button' className='xp-title-control btn-help' aria-label='Help'>?</button>
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

            <div className='swp-body'>
                <div className='swp-content'>
                    <div className='swp-text'>
                        <span>Enter the URL of the web page you want to send:</span>
                        <input
                            type='text'
                            className='swp-input'
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleOk()}
                            autoFocus
                        />
                    </div>
                </div>

                <div className='swp-buttons'>
                    <button type='button' id='xp-default-btn' className='luna-btn' onClick={handleOk}>
                        OK
                    </button>
                    <button type='button' className='luna-btn secondary' onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SendWebModal
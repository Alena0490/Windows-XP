import { useState, useEffect } from 'react';
import useDraggable from '../hooks/useDraggable';
import './SaveAsModal.css';
import '../App.css';

interface SaveAsModalProps {
    initialName: string;
    title?: string;
    onSave: (name: string) => void;
    onClose: () => void;
    isActive?: boolean;
    onMouseDown?: () => void;
}

const SaveAsModal = ({
    initialName,
    title = 'Save As',
    onSave,
    onClose,
    isActive,
    onMouseDown,
}: SaveAsModalProps) => {
    const [name, setName] = useState(initialName);

    const { position, handleMouseDown } = useDraggable(
        Math.round(window.innerWidth / 2 - 190),
        Math.round(window.innerHeight / 2 - 60)
    );

    useEffect(() => {
        setName(initialName);
    }, [initialName]);

    const handleSave = () => {
        const safe = name.trim() || initialName;
        onSave(safe);
    };

    return (
        <div
            className={['app-window', 'save-as-dialog', isActive && 'app-window--active'].filter(Boolean).join(' ')}
            style={{ left: position.x, top: position.y }}
            onMouseDown={onMouseDown}
        >
            <div
                className='title-bar'
                onMouseDown={(e) => {
                    if ((e.target as HTMLElement).closest('.xp-title-control')) return;
                    handleMouseDown(e);
                }}
            >
                <span className='title-bar-text'>{title}</span>
                <div className='title-bar-buttons xp-title-controls'>
                    <button
                        type='button'
                        className='xp-title-control btn-close'
                        onClick={onClose}
                        onMouseDown={(e) => e.stopPropagation()}
                        aria-label='Close'
                    >
                        ✕
                    </button>
                </div>
            </div>

            <div className='save-as-body'>
                <div className='save-as-content'>
                    <label htmlFor='save-as-filename'>File name:</label>
                    <input
                        id='save-as-filename'
                        type='text'
                        className='save-as-input'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') { e.preventDefault(); handleSave(); }
                            else if (e.key === 'Escape') { e.preventDefault(); onClose(); }
                        }}
                        autoFocus
                    />
                </div>

                <div className='save-as-buttons'>
                    <button type='button' id='xp-default-btn' className='luna-btn' onClick={handleSave}>
                        Save
                    </button>
                    <button type='button' className='luna-btn secondary' onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SaveAsModal;

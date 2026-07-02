import { useState } from 'react';
import useDraggable from '../../hooks/useDraggable';
import { DATE_FORMATS } from './data/timeData';
import './DateAndTimeModal.css';
import '../keyboard/FontModal.css';
import '../../App.css';

// ── Props ──────────────────────────────────────────────────────────────────────

interface DateAndTimeModalProps {
    onClose:      () => void;
    style?:       React.CSSProperties;
    editorRef:    React.RefObject<HTMLDivElement | null>;
    globalVolume: number;
    globalMuted:  boolean;
    plusTheme?:   'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
}

// ── Component ──────────────────────────────────────────────────────────────────

const DateAndTimeModal = ({ onClose, style, editorRef }: DateAndTimeModalProps) => {
    const initialX = typeof style?.left === 'number' ? style.left : Math.round(window.innerWidth  / 2 - 140);
    const initialY = typeof style?.top  === 'number' ? style.top  : Math.round(window.innerHeight / 2 - 70);
    const { position, handleMouseDown } = useDraggable(initialX, initialY);

    // ── State ──────────────────────────────────────────────────────────────────
    const [selected, setSelected] = useState(0);

    // Formats are generated once at open time; the timestamp stays fixed while the dialog is open
    const now       = new Date();
    const formatted = DATE_FORMATS.map(fn => fn(now));

    // ── Render ─────────────────────────────────────────────────────────────────

    return (
        <div
            className='app-window find-replace-dialog'
            style={{ left: position.x, top: position.y }}
            tabIndex={-1}
            onMouseDown={e => e.stopPropagation()}
        >
            {/* Title bar */}
            <div className='title-bar' onMouseDown={handleMouseDown}>
                <span className='title-bar-text'>Date and Time</span>
                <div className='title-bar-buttons xp-title-controls'>
                    <button type='button' className='xp-title-control btn-help'  aria-label='Help'>?</button>
                    <button type='button' className='xp-title-control btn-close' aria-label='Close' onClick={onClose}>✕</button>
                </div>
            </div>

            {/* Body */}
            <div className='time-modal-body'>
                <span className='available-formats'>Available formats:</span>
                <div className='time-modal-main'>

                    {/* Format list */}
                    <div className='formats fm-list-wrap'>
                        <ul className='fm-list time-list'>
                            {formatted.map((str, i) => (
                                <li
                                    key={i}
                                    className={`fm-item ${i === selected ? 'fm-selected' : ''}`}
                                    onClick={() => setSelected(i)}
                                >
                                    {str}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Action buttons */}
                    <div className='buttons'>
                        <button
                            type='button'
                            className='luna-btn'
                            onClick={() => {
                                editorRef.current?.focus();
                                document.execCommand('insertText', false, formatted[selected]);
                                onClose();
                            }}
                        >
                            OK
                        </button>
                        <button type='button' className='luna-btn secondary' onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DateAndTimeModal;

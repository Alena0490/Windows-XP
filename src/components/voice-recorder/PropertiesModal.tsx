import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import useDraggable from '../../hooks/useDraggable';
import useSound from '../../hooks/useSound';

import Format from './img/Format.webp'
import SoundProperties from './img/SoundProperties1.webp'

import './PropertiesModal.css';
import '../../App.css';

type FormatChoice = 'All formats' | 'Playback formats' | 'Recording formats';

interface PropertiesModalProps {
    onClose: () => void;
    savedName?: string | null;
    length?: number;
    dataSize?: number;
    globalVolume?: number;
    globalMuted?: boolean;
    plusTheme?: 'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
    onConvertNow?: () => void;
    style?: React.CSSProperties;
    isActive?: boolean;
    onMouseDown?: () => void;
}

const FORMAT_OPTIONS: FormatChoice[] = [
    'All formats',
    'Playback formats',
    'Recording formats',
];

const PropertiesModal = ({
    onClose,
    savedName,
    length = 0,
    dataSize = 0,
    globalVolume = 1,
    globalMuted = false,
    plusTheme,
    onConvertNow,
    style,
    isActive,
    onMouseDown,
}: PropertiesModalProps) => {
    const initialX = typeof style?.left === 'number'
        ? style.left
        : Math.round(window.innerWidth / 2 - 175);
    const initialY = typeof style?.top === 'number'
        ? style.top
        : Math.round(window.innerHeight / 2 - 175);
    const { position, handleMouseDown } = useDraggable(initialX, initialY);

    const sounds = useSound(globalVolume, globalMuted);
    const themeSound = plusTheme === 'aquarium' ? sounds.aquarium
        : plusTheme === 'davinci' ? sounds.daVinci
        : plusTheme === 'nature' ? sounds.nature
        : plusTheme === 'space' ? sounds.space
        : null;
    const playStartMenu = () => themeSound ? themeSound.playMenuCmd() : sounds.playStartMenu();

    const [formatChoice, setFormatChoice] = useState<FormatChoice>('All formats');
    const [formatOpen, setFormatOpen] = useState(false);
    const [formatListPos, setFormatListPos] = useState({ top: 0, left: 0, width: 0 });
    const formatTriggerRef = useRef<HTMLDivElement>(null);

    // measure trigger rect when the format select opens so the portal list can align to it
    useEffect(() => {
        if (!formatOpen || !formatTriggerRef.current) return;
        const r = formatTriggerRef.current.getBoundingClientRect();
        setFormatListPos({ top: r.bottom, left: r.left, width: r.width });
    }, [formatOpen]);

    // close the format select on outside mousedown
    useEffect(() => {
        if (!formatOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (formatTriggerRef.current?.contains(target)) return;
            if (target.closest('.properties-select-list')) return;
            setFormatOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [formatOpen]);

    const displayName = savedName ?? 'Sound';
    const lengthText = `${length.toFixed(2)} sec.`;
    const audioFormatText = 'PCM 22.050 kHz, 8 Bit, Mono';

    // dialog button handlers
    const handleOk = () => { playStartMenu(); onClose(); };
    const handleCancel = () => { playStartMenu(); onClose(); };
    const handleConvertNow = () => {
        playStartMenu();
        onConvertNow?.();
    };

    return (
        <div
            className={['app-window', 'properties-dialog', isActive && 'app-window--active'].filter(Boolean).join(' ')}
            style={{ left: position.x, top: position.y }}
            tabIndex={-1}
            onMouseDown={onMouseDown}
        >
            {/* Title Bar */}
            <div
                className='title-bar'
                onMouseDown={(e) => {
                    if ((e.target as HTMLElement).closest('.xp-title-control')) return;
                    handleMouseDown(e);
                }}
            >
                <span className='title-bar-text'>Properties for Sound</span>
                <div className='title-bar-buttons xp-title-controls'>
                    <button
                        type='button'
                        className='xp-title-control btn-help'
                        onMouseDown={(e) => e.stopPropagation()}
                        aria-label='Help'
                    >
                        ?
                    </button>
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

            {/* Properties Body */}
            <div className='properties'>
                {/* Tab Buttons */}
                <div className='setting-buttons'>
                    <button type='button' className='picked'>Details</button>
                </div>

                <div className='settings'>
                    {/* Header */}
                    <div className='properties-header'>
                        <img src={SoundProperties} alt='' aria-hidden='true' className='properties-header-icon' />
                        <span className='properties-header-name'>{displayName}</span>
                    </div>

                    {/* Details */}
                    <div className='properties-details'>
                        <div className='properties-row'>
                            <span className='properties-label'>Copyright:</span>
                            <span className='properties-value'>No Copyright information</span>
                        </div>
                        <div className='properties-row'>
                            <span className='properties-label'>Length:</span>
                            <span className='properties-value'>{lengthText}</span>
                        </div>
                        <div className='properties-row'>
                            <span className='properties-label'>Data Size:</span>
                            <span className='properties-value'>{dataSize > 0 ? `${dataSize} bytes` : '0 bytes'}</span>
                        </div>
                        <div className='properties-row'>
                            <span className='properties-label'>Audio Format:</span>
                            <span className='properties-value'>{audioFormatText}</span>
                        </div>
                    </div>

                    {/* Format Conversion */}
                    <fieldset className='properties-frame'>
                        <legend>Format Conversion</legend>

                        <div className='properties-convert-top'>
                            <img src={Format} alt='' aria-hidden='true' className='properties-convert-icon' />
                            <p className='properties-hint'>
                                To adjust the sound quality or use less space for
                                this sound, click Convert Now.
                            </p>
                        </div>

                        <div className='properties-convert-controls'>
                            <label htmlFor='properties-format' className='properties-format-row'>
                                <span><span className='mnemonic'>C</span>hoose from:</span>
                                <div className='xp-select-wrapper'>
                                    <div
                                        className='fm-color-trigger'
                                        onClick={() => setFormatOpen(o => !o)}
                                        ref={formatTriggerRef}
                                    >
                                        <span className='fm-color-name'>{formatChoice}</span>
                                        <span className='xp-select-arrow' aria-hidden='true' />
                                    </div>

                                    {formatOpen && createPortal(
                                        <ul
                                            className='fm-color-list properties-select-list'
                                            style={{
                                                top: formatListPos.top,
                                                left: formatListPos.left,
                                                minWidth: formatListPos.width,
                                            }}
                                        >
                                            {FORMAT_OPTIONS.map(value => (
                                                <li
                                                    key={value}
                                                    className={`fm-color-item${value === formatChoice ? ' fm-color-item--selected' : ''}`}
                                                    onClick={() => {
                                                        playStartMenu();
                                                        setFormatChoice(value);
                                                        setFormatOpen(false);
                                                    }}
                                                >
                                                    {value}
                                                </li>
                                            ))}
                                        </ul>,
                                        document.body
                                    )}
                                </div>
                            </label>

                            <button
                                type='button'
                                className='luna-btn'
                                onClick={handleConvertNow}
                            >
                                Convert&nbsp;<span className='mnemonic'>N</span>ow...
                            </button>
                        </div>
                    </fieldset>
                </div>

                {/* Dialog Buttons */}
                <div className='properties-buttons'>
                    <button
                        type='button'
                        id='xp-default-btn'
                        className='luna-btn'
                        onClick={handleOk}
                        autoFocus
                    >
                        OK
                    </button>
                    <button
                        type='button'
                        className='luna-btn secondary'
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PropertiesModal;

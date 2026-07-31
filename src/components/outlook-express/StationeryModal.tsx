import { useState } from 'react';
import useDraggable from '../../hooks/useDraggable';

import FolderClosed from '../../img/FolderClosed.webp'
import Back from '../../img/Back.webp'
import Up from '../../img/Up.webp'
import NewFolder from '../../img/NewFolder.webp'
import IconView from '../../img/IconView.webp'
import URL from '../../img/URL.webp'

// Stationeries (backgrounds — used for the preview panel, matches the tall narrow aside)
import CitrusBG from './stationeries/citrbg.gif'
import MaizeBG from './stationeries/maizebg.jpg'
import LeavesBG from './stationeries/leavesbg.jpg'
import NatureBG from './stationeries/naturebg.jpg'
import SunflowerBG from './stationeries/sunfbg.jpg'
import ClearDayBG from './stationeries/clrdaybg.jpg'

import './StationeryModal.css'
import '../keyboard/FontModal.css'
import './../../App.css'

interface StationeryOption {
    id: string | null;
    label: string;
    bg?: string;
}

const STATIONERY_OPTIONS: StationeryOption[] = [
    { id: null, label: 'Blank' },
    { id: 'citrus-punch', label: 'Citrus Punch', bg: CitrusBG },
    { id: 'clear-day', label: 'Clear Day', bg: ClearDayBG },
    { id: 'leaves', label: 'Leaves', bg: LeavesBG },
    { id: 'maize', label: 'Maize', bg: MaizeBG },
    { id: 'nature', label: 'Nature', bg: NatureBG },
    { id: 'sunflower', label: 'Sunflower', bg: SunflowerBG },
];

interface StationeryModalProps {
    onClose: () => void;
    onSubmit: (id: string | null) => void;
    onMouseDown?: () => void;
    isActive?: boolean;
}

const StationeryModal = ({
    onClose,
    onSubmit,
    onMouseDown,
    isActive
}: StationeryModalProps) => {

    const { position, handleMouseDown } = useDraggable(
        Math.round(window.innerWidth / 2 - 190),
        Math.round(window.innerHeight / 2 - 60)
    );

    const [selected, setSelected] = useState<StationeryOption | null>(null);
    const [showPreview, setShowPreview] = useState(true);

    const handleOk = () => {
        if (!selected) return;
        onSubmit(selected.id);
        onClose();
    };

    return (
        <div
            className={['app-window', 'stationery-dialog', isActive && 'app-window--active'].filter(Boolean).join(' ')}
            style={{ left: position.x, top: position.y }}
            onMouseDown={onMouseDown}
        >
            <div className='title-bar' onMouseDown={handleMouseDown}>
                <span className='title-bar-text'>Select Stationery</span>
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

            <div className='stationery-body'>
                <div className='main-part'>
                    <div className='main-heading'>
                        <label className='fm-label'>Look in:</label>
                        <div className='fm-color-select'>
                            <div className='fm-color-trigger'>
                                <img src={FolderClosed} alt='' className='fm-color-swatch' />
                                <span className='fm-color-name'>Stationery</span>
                                <span className='xp-select-arrow' aria-hidden='true' />
                            </div>
                        </div>
                        <button type='button' className='heading-icon-btn' disabled aria-label='Back'>
                            <img src={Back} alt='' />
                        </button>
                        <button type='button' className='heading-icon-btn' disabled aria-label='Up one level'>
                            <img src={Up} alt='' />
                        </button>
                        <button type='button' className='heading-icon-btn' disabled aria-label='Create new folder'>
                            <img src={NewFolder} alt='' />
                        </button>
                        <button type='button' className='heading-icon-btn' disabled aria-label='View icons'>
                            <img src={IconView} alt='' />
                        </button>
                    </div>

                    <div className='stationery-list'>
                        {STATIONERY_OPTIONS.map((opt) => (
                            <button
                                type='button'
                                key={opt.label}
                                className={`stationery-grid-item${selected?.label === opt.label ? ' selected' : ''}`}
                                onClick={() => setSelected(opt)}
                            >
                                <img src={URL} alt='' />
                                <span>{opt.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className='main-foot'>
                        <div className='inputs'>
                            <label htmlFor='filename'>File name:
                                <input type='text' id='filename' value={selected?.label ?? ''} readOnly />
                            </label>
                            <label className='fm-label'>Files of type:</label>
                            <div className='fm-color-select'>
                                <div className='fm-color-trigger'>
                                    <span className='fm-color-name'>HTML Files (*.htm;*.html)</span>
                                    <span className='xp-select-arrow' aria-hidden='true' />
                                </div>
                            </div>
                        </div>
                        <div className='buttons'>
                            <button className='luna-btn' onClick={handleOk} disabled={!selected}>OK</button>
                            <button className='luna-btn secondary' onClick={onClose}>Cancel</button>
                        </div>
                    </div>
                </div>

                <aside className='aside-right'>
                    <div className='aside-body'>
                        Preview:
                        <output className='stationery-preview'>
                            {showPreview && selected?.bg && (
                                <img src={selected.bg} alt='' className='stationery-preview-img' />
                            )}
                            {showPreview && selected && !selected.bg && (
                                <span className='preview-placeholder'>{selected.label}</span>
                            )}
                        </output>
                        <label htmlFor='show-preview'>
                            <input
                                type='checkbox'
                                id='show-preview'
                                checked={showPreview}
                                onChange={(e) => setShowPreview(e.target.checked)}
                            />
                            Show Preview.
                        </label>
                    </div>
                    <div className='aside-buttons'>
                        <button className='luna-btn secondary' disabled>Create New...</button>
                        <button className='luna-btn secondary' disabled>Edit</button>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default StationeryModal;

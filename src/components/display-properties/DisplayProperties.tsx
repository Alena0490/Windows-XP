import { useState } from 'react';
import useDraggable from '../../hooks/useDraggable';
import JPG from '../../img/JPG.webp'

// import displayProperties from '../../img/DisplayProperties.webp'
import './DisplayProperties.css'
import '../../App.css'

type TabType = 'Themes' | 'Desktop' | 'Screen Saver' | 'Appearance' | 'Settings';

// type TabType = typeof TABS[number];

interface DisplayPropertiesProps {
    isMinimized: boolean;
    setIsMinimized: (value: boolean | ((prev: boolean) => boolean)) => void;
    onClose: () => void;
    onMouseDown?: () => void;
    isActive?: boolean;
    onWallpaperChange?: (path: string) => void;
    onPositionChange?: (position: string) => void;
    onColorChange?: (color: string) => void;
    currentPosition?: string;
    currentColor?: string;
    onBrowse?: () => void;
    /** URL handed over by App.tsx when the user picked an image in the Browse
     *  → File Manager flow. Loaded into the draft on every change so the CRT
     *  preview reflects it, then cleared via onPendingWallpaperConsumed. */
    pendingWallpaperUrl?: string;
    onPendingWallpaperConsumed?: () => void;
}

const DisplayProperties = ({
    isMinimized,
    isActive,
    onMouseDown,
    onClose,
    onWallpaperChange,
    onPositionChange,
    onColorChange,
    currentPosition = 'Stretch',
    currentColor = '#000000',
    onBrowse,
    pendingWallpaperUrl,
    onPendingWallpaperConsumed,
}:DisplayPropertiesProps) => {
    const [activeTab, setActiveTab] = useState<TabType>('Themes');
    const { position, handleMouseDown } = useDraggable(450, 50);

    // Both hold a full URL ('' = none). Presets resolve to their wallpaper
    // file URL on click; custom picks coming through pendingWallpaperUrl
    // land here directly.
    const [selectedWallpaper, setSelectedWallpaper] = useState('');
    const [appliedWallpaper, setAppliedWallpaper] = useState('');
    const [selectedPosition, setSelectedPosition] = useState(currentPosition);
    const [selectedColor, setSelectedColor] = useState(currentColor);
    const displayedWallpaper = pendingWallpaperUrl || selectedWallpaper;


    const presetUrl = (file: string) =>
        `${import.meta.env.BASE_URL}WINDOWS/Web/Wallpaper/${file}.webp`;
   

    // `file` is the actual basename of the .webp in public/WINDOWS/Web/Wallpaper/.
    // Not derivable from `label` because of spelling quirks (VortecSpace, RedMoonDessert).
    const wallpapers = [
        { value: 'ascent', label: 'Ascent', file: 'Ascent' },
        { value: 'autumn', label: 'Autumn', file: 'Autumn' },
        { value: 'azul', label: 'Azul', file: 'Azul' },
        { value: 'bliss', label: 'Bliss', file: 'Bliss' },
        { value: 'crystal', label: 'Crystal', file: 'Crystal' },
        { value: 'follow', label: 'Follow', file: 'Follow' },
        { value: 'friend', label: 'Friend', file: 'Friend' },
        { value: 'home', label: 'Home', file: 'Home' },
        { value: 'moon-flower', label: 'Moon Flower', file: 'MoonFlower' },
        { value: 'peace', label: 'Peace', file: 'Peace' },
        { value: 'power', label: 'Power', file: 'Power' },
        { value: 'purple-flower', label: 'Purple Flower', file: 'PurpleFlower' },
        { value: 'radiance', label: 'Radiance', file: 'Radiance' },
        { value: 'red-moon-dessert', label: 'Red Moon Desert', file: 'RedMoonDessert' },
        { value: 'ripples', label: 'Ripples', file: 'Ripples' },
        { value: 'stonehenge', label: 'Stonehenge', file: 'Stonehenge' },
        { value: 'tulips', label: 'Tulips', file: 'Tulips' },
        { value: 'vortex-space', label: 'Vortex Space', file: 'VortecSpace' },
        { value: 'wind', label: 'Wind', file: 'Wind' },
        { value: 'windows-xp', label: 'Windows XP', file: 'WindowsXP' },
    ];

    // selectedWallpaper IS the preview URL (empty = CSS fallback).
    const previewUrl = displayedWallpaper || undefined;

    // Wallpapers - Action Handlers
    const handleApply = () => {
        if (activeTab === 'Desktop') {
            const wallpaperToApply = pendingWallpaperUrl || selectedWallpaper;
            onWallpaperChange?.(wallpaperToApply);
            onPositionChange?.(selectedPosition);
            onColorChange?.(selectedColor);
            setAppliedWallpaper(wallpaperToApply);
            setSelectedWallpaper(wallpaperToApply);
            onPendingWallpaperConsumed?.();
        }
        // other tabs...
    };

    const handleOk = () => {
        handleApply();
        onClose();
    };

    const handleCancel = () => {
        if (activeTab === 'Desktop') {
            setSelectedWallpaper(appliedWallpaper);
            setSelectedPosition(currentPosition);
            setSelectedColor(currentColor);
            onPendingWallpaperConsumed?.();
        }
        // other tabs...
    };
    
  return (
    <div
        className={[
            'app-window',
            'properties-window',
                isActive  && 'app-window--active',
                isMinimized && 'file--minimized',
                isMinimized && 'app-window--minimized',
            ].filter(Boolean).join(' ')}
            style={{ left: position.x, top: position.y }}
            onMouseDown={onMouseDown}
        >
            <div className='title-bar' onMouseDown={handleMouseDown}>
                <span className='title-bar-text'>
                    {/* <img className='file-icon' src={displayProperties} alt='Display Properties' /> */}
                    Display Properties
                </span>
                <div className='title-bar-buttons xp-title-controls'>
                    <button type="button" className="xp-title-control btn-help" aria-label="Help"></button>
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

            <div className='properties'>
                <div className="setting-buttons">
                    <button     
                        className={activeTab === 'Themes' ? 'picked' : ''} 
                        onClick={() => setActiveTab('Themes')}
                    >
                        Themes
                    </button>
                    <button
                        className={activeTab === 'Desktop' ? 'picked' : ''} 
                        onClick={() => setActiveTab('Desktop')}
                    >
                        Desktop
                    </button>
                    <button
                        className={activeTab === 'Screen Saver' ? 'picked' : ''} 
                        onClick={() => setActiveTab('Screen Saver')}
                    >
                        Screen Saver
                    </button>
                    <button
                        className={activeTab === 'Appearance' ? 'picked' : ''} 
                        onClick={() => setActiveTab('Appearance')}
                    >
                        Appearance
                    </button>
                    <button
                        className={activeTab === 'Settings' ? 'picked' : ''} 
                        onClick={() => setActiveTab('Settings')}
                    >
                        Settings
                    </button>
                </div>
                <div className="settings">

                    {/* THEME */}
                    {activeTab === 'Themes' && (
                        <div className="tab-themes-content">
                            <p>A theme is a background plus a set of sounds, icons, and other elements to help you personalize your computer with one click.</p>
                        
                            <div className="selection">
                                <div className="themes">
                                    <label htmlFor="theme-selection">Theme:</label>
                                    <select id='theme-selection'>
                                        <option value="default">Default</option>
                                    </select>
                                </div>
                                <button className='luna-btn secondary'>Save As...</button>
                                <button className='luna-btn secondary disabled'>Delete</button>
                            </div>

                            <p>Sample:</p>
                            <div className="sample-image">
                                <div className="active-theme"></div>
                            </div>
                        </div>                       
                    )}
                    
                    {/* DESKTOP */}
                    {activeTab === 'Desktop' && (
                        <div className="tab-desktop-content">
                            <div
                                className="crt-monitor"
                                style={{ '--preview-bg': previewUrl ? `url(${previewUrl})` : undefined } as React.CSSProperties}
                            />
                            <div className="background-options">
                                  <div className="wallpapers">
                                    <label htmlFor="background-selection">Bac<span className="mnemonic">k</span>ground:</label>
                                    <div className="wallpaper-listbox">
                                        {wallpapers.map(w => (
                                            <div
                                                key={w.value}
                                                className={`wallpaper-listbox-item${displayedWallpaper === presetUrl(w.file) ? ' selected' : ''}`}
                                                onClick={() => setSelectedWallpaper(presetUrl(w.file))}
                                            >
                                                <img src={JPG} alt="" />
                                                {w.label}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="other-settings">
                                    <button className="luna-btn secondary" onClick={onBrowse}><span className="mnemonic">B</span>rowse...</button>
                                    <label><span className="mnemonic">P</span>osition:</label>
                                    <div className="xp-select-wrapper">
                                        <select 
                                            value={selectedPosition}
                                            onChange={e => setSelectedPosition(e.target.value)}
                                        >
                                            <option>Stretch</option>
                                            <option>Center</option>
                                            <option>Tile</option>
                                        </select>
                                        <span className="xp-select-arrow" aria-hidden="true"></span>
                                    </div>
                                    <label><span className="mnemonic">C</span>olor:</label>
                                    <input 
                                        type="color" 
                                        value={selectedColor} 
                                        onChange={e => setSelectedColor(e.target.value)} 
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SCREEN SAVER */}
                    {activeTab === 'Screen Saver' && (
                        <div className="tab-screensaver-content">
                            <div className='crt-monitor screensaver'></div>
                        </div>
                    )}

                    {/* APPEARANCE */}
                    {activeTab === 'Appearance' && (
                        <div className="tab-appearance-content">
                            <p>Windows and buttons styles...</p>
                        </div>
                    )}

                    {/* SETTINGS */}
                    {activeTab === 'Settings' && (
                        <div className="tab-settings-content">
                            <p>Screen resolution and color quality...</p>
                        </div>
                    )}
                </div>
                <div className="properties-buttons">
                    <button className='luna-btn' onClick={handleOk}>OK</button>
                    <button className='luna-btn secondary' onClick={handleCancel}>Cancel</button>
                    <button className='luna-btn secondary' onClick={handleApply}>Apply</button>
                </div>
            </div>
    </div>
  )
}

export default DisplayProperties

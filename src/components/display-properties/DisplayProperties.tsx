import { useState } from 'react';
import useDraggable from '../../hooks/useDraggable';
import JPG from '../../img/JPG.webp'
import Energy from '../../img/energy.jpg'
import lunaPreview from '../../img/Luna/default.webp'
import homesteadPreview from '../../img/Luna/homestead.webp'
import silverPreview from '../../img/Luna/silver.webp'

//Videos
import daVinci from '../../../public/WINDOWS/Resources/Themes/Screensavers/daVinci.mp4';
import aquarium from '../../../public/WINDOWS/Resources/Themes/Screensavers/aquarium.mp4';
import nature from '../../../public/WINDOWS/Resources/Themes/Screensavers/nature.mp4';
import space from '../../../public/WINDOWS/Resources/Themes/Screensavers/space.mp4';
import curvesAndColors from '../../../public/WINDOWS/Resources/Themes/Screensavers/curvesAndColors.mp4';
import flyingWindows from '../../../public/WINDOWS/Resources/Themes/Screensavers/flyingWindows.mp4';
import hauntedHouse from '../../../public/WINDOWS/Resources/Themes/Screensavers/hauntedHouse.mp4';
import maze from '../../../public/WINDOWS/Resources/Themes/Screensavers/maze.mp4';
import mercuryPool from '../../../public/WINDOWS/Resources/Themes/Screensavers/mercuryPool.mp4';
import mystifyYourMind from '../../../public/WINDOWS/Resources/Themes/Screensavers/MystifyYourMind.mp4';
import theSandPendulum from '../../../public/WINDOWS/Resources/Themes/Screensavers/theSandPendulum.mp4';
import theRobotCircus from '../../../public/WINDOWS/Resources/Themes/Screensavers/theRobotCircus.mp4';
import windows98 from '../../../public/WINDOWS/Resources/Themes/Screensavers/windows98.mp4';

import './DisplayProperties.css'
import '../../App.css'

type TabType = 'Themes' | 'Desktop' | 'Screen Saver' | 'Appearance' | 'Settings';

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
    pendingWallpaperUrl?: string;
    onPendingWallpaperConsumed?: () => void;
    screensaverSetting?: string;
    screensaverWait?: number;
    onScreensaverChange?: (value: string) => void;
    onScreensaverWaitChange?: (value: number) => void;
    currentTheme?: 'luna' | 'homestead' | 'silver';
    onThemeChange?: (theme: 'luna' | 'homestead' | 'silver') => void;
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
    screensaverSetting = '',
    screensaverWait = 10,
    onScreensaverChange,
    onScreensaverWaitChange,
    currentTheme,
    onThemeChange,
}:DisplayPropertiesProps) => {
    const [activeTab, setActiveTab] = useState<TabType>('Themes');
    const { position, handleMouseDown } = useDraggable(450, 50);

    const [selectedTheme, setSelectedTheme] = useState<'luna' | 'homestead' | 'silver'>(currentTheme as 'luna' | 'homestead' | 'silver');
    const themePreviewMap = {
        luna: lunaPreview,
        homestead: homesteadPreview,
        silver: silverPreview,
    };
    const [selectedWallpaper, setSelectedWallpaper] = useState<string>('');
    const [appliedWallpaper, setAppliedWallpaper] = useState('');
    const [selectedPosition, setSelectedPosition] = useState(currentPosition);
    const [selectedColor, setSelectedColor] = useState(currentColor);
    const displayedWallpaper = pendingWallpaperUrl || selectedWallpaper;
    const [selectedScreensaver, setSelectedScreensaver] = useState(screensaverSetting);
    const [waitValue, setWaitValue] = useState(screensaverWait);
    const [resolutionIndex, setResolutionIndex] = useState(2);
    const [colorQuality, setColorQuality] = useState<'16bit' | '32bit'>('32bit');


    const presetUrl = (file: string | null): string => {
        if (file === null) return '';
        return `${import.meta.env.BASE_URL}WINDOWS/Web/Wallpaper/${file}.webp`;
    };
   

    // `file` is the actual basename of the .webp in public/WINDOWS/Web/Wallpaper/.
    const wallpapers = [
        { value: 'none', label: '(None)', file: null },
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
    // const previewUrl = displayedWallpaper || undefined;

    const screensavers = [
        { value: '', label: '(None)', src: '' },
        { value: 'aquarium', label: 'Plus! Aquarium', src: aquarium },
        { value: 'daVinci', label: 'Plus! da Vinci', src: daVinci },
        { value: 'nature', label: 'Plus! Nature', src: nature },
        { value: 'space', label: 'Plus! Space', src: space },
        { value: 'curvesAndColors', label: 'Curves and Colors', src: curvesAndColors },
        { value: 'flyingWindows', label: 'Flying Windows', src: flyingWindows },
        { value: 'hauntedHouse', label: 'Haunted House', src: hauntedHouse },
        { value: 'maze', label: 'Maze', src: maze },
        { value: 'mercuryPool', label: 'Mercury Pool', src: mercuryPool },
        { value: 'mystifyYourMind', label: 'Mystify Your Mind', src: mystifyYourMind },
        { value: 'theSandPendulum', label: 'Sand Pendulum', src: theSandPendulum },
        { value: 'theRobotCircus', label: 'Robot Circus', src: theRobotCircus },
        { value: 'windows98', label: 'Windows 98', src: windows98 },
    ];

    // Settings
    const resolutions = [
        { label: '640 by 480 pixels', value: 0 },
        { label: '800 by 600 pixels', value: 1 },
        { label: '1024 by 768 pixels', value: 2 },
        { label: '1280 by 1024 pixels', value: 3 },
        { label: '1600 by 1200 pixels', value: 4 },
    ];

    // CRT Preivew resolution filter
    const crtFilter = [
        `blur(1.5px) saturate(0.4)`,  // 640×480
        `blur(1px) saturate(0.7)`,    // 800×600
        `blur(0px) saturate(1)`,      // 1024×768
        `blur(0px) saturate(1.1)`,    // 1280×1024
        `blur(0px) saturate(1.2)`,    // 1600×1200
    ][resolutionIndex] + (colorQuality === '16bit' ? ' grayscale(0.3) contrast(0.9)' : '');

    // Set the resolution
    const handleResolutionChange = (index: number) => {
        setResolutionIndex(index);
        if (index === 4) {
            setColorQuality('16bit');
        } else {
            setColorQuality('32bit');
        }
    };

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
        if (activeTab === 'Screen Saver') {
            onScreensaverChange?.(selectedScreensaver);
            onScreensaverWaitChange?.(waitValue);
        }
        if (activeTab === 'Appearance') {
            onThemeChange?.(selectedTheme);
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
        if (activeTab === 'Appearance') {
            setSelectedTheme(currentTheme as 'luna' | 'homestead' | 'silver');
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
                                <div className="xp-select-wrapper">
                                    <select id='theme-selection'>
                                        <option value="default">Default</option>
                                    </select>
                                    <span className="xp-select-arrow" aria-hidden="true"></span>
                                </div>
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
                                style={{
                                    '--preview-bg': displayedWallpaper
                                        ? `url(${displayedWallpaper})`
                                        : 'none',
                                    '--preview-color': selectedColor,
                                } as React.CSSProperties}
                            />
                            <div className="background-options">
                                  <div className="wallpapers">
                                    <label htmlFor="background-selection">Bac<span className="mnemonic">k</span>ground:</label>
                                    <div className="wallpaper-listbox">
                                        {wallpapers.map(w => (
                                            <div
                                                key={w.value}
                                                className={`wallpaper-listbox-item${
                                                    w.file === null
                                                        ? displayedWallpaper === ''
                                                            ? ' selected'
                                                            : ''
                                                        : displayedWallpaper === presetUrl(w.file)
                                                            ? ' selected'
                                                            : ''
                                                }`}
                                                onClick={() => {
                                                    if (w.file === null) {
                                                        setSelectedWallpaper('');
                                                        onPendingWallpaperConsumed?.();
                                                    } else {
                                                        setSelectedWallpaper(presetUrl(w.file));
                                                        onPendingWallpaperConsumed?.();
                                                    }
                                                }}
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
                            <div className={`crt-monitor screensaver${selectedScreensaver ? ' playing' : ''}`}>
                                {selectedScreensaver && (
                                    <video
                                        key={selectedScreensaver}
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        src={screensavers.find(s => s.value === selectedScreensaver)?.src}
                                    />
                                )}
                            </div>

                            <fieldset className="screensaver-fieldset">
                                <legend>Screen saver</legend>
                                <div className="screensaver-row">
                                    <div className="xp-select-wrapper screensaver-select">
                                        <select
                                            value={selectedScreensaver}
                                            onChange={e => setSelectedScreensaver(e.target.value)}
                                        >
                                            {screensavers.map(s => (
                                                <option key={s.value} value={s.value}>{s.label}</option>
                                            ))}
                                        </select>
                                        <span className="xp-select-arrow" aria-hidden="true"></span>
                                    </div>
                                    <button className="luna-btn secondary"><span className="mnemonic">S</span>ettings</button>
                                    <button className="luna-btn secondary"><span className="mnemonic">P</span>review</button>
                                </div>
                                <div className="screensaver-wait-row">
                                    <label>
                                        <span className="mnemonic">W</span>ait:
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        max={999}
                                        value={waitValue}
                                        onChange={e => {
                                            const val = Number(e.target.value);
                                            if (val >= 1) setWaitValue(val);
                                        }}
                                        className="wait-input"
                                    />
                                    <span>minutes</span>
                                    <label className="screensaver-checkbox">
                                        <input type="checkbox" />
                                        On <span className="mnemonic">r</span>esume, display Welcome screen
                                    </label>
                                </div>
                            </fieldset>

                            <fieldset className="screensaver-fieldset">
                                <legend>Monitor power</legend>
                                <span>
                                    <img src={Energy} alt="" />
                                    <p>To adjust monitor power settings and save energy, click Power.</p>
                                </span>
                                <div className="screensaver-power-row">
                                    <button className="luna-btn secondary">Po<span className="mnemonic">w</span>er...</button>
                                </div>
                            </fieldset>
                        </div>
                    )}

                    {/* APPEARANCE */}
                    {activeTab === 'Appearance' && (
                        <div className="tab-appearance-content">
                            <div className="sample-image">
                                <div
                                    className="color-theme"
                                    style={{
                                        backgroundImage: `url(${themePreviewMap[selectedTheme]})`,
                                    }}
                                />
                            </div>

                            <div className="background-options appearance-options">
                                <div className="wallpapers">
                                    <label htmlFor="windows-buttons-selection">
                                        <span className="mnemonic">W</span>indows and buttons:
                                    </label>
                                    <div className="xp-select-wrapper">
                                        <select id="windows-buttons-selection">
                                            <option value="xp">Windows XP style</option>
                                            <option value="classic" className='is-disabled' disabled>Windows Classic style</option>
                                        </select>
                                        <span className="xp-select-arrow" aria-hidden="true"></span>
                                    </div>

                                    <label htmlFor="color-scheme-selection">
                                        Color <span className="mnemonic">s</span>cheme:
                                    </label>
                                    <div className="xp-select-wrapper">
                                        <select
                                            id="color-scheme-selection"
                                            value={selectedTheme}
                                            onChange={e => setSelectedTheme(e.target.value as 'luna' | 'homestead' | 'silver')}
                                        >
                                            <option value="luna">Default (blue)</option>
                                            <option value="homestead">Olive Green</option>
                                            <option value="silver">Silver</option>
                                        </select>
                                        <span className="xp-select-arrow" aria-hidden="true"></span>
                                    </div>

                                    <label htmlFor="font-size-selection">
                                        <span className="mnemonic">F</span>ont size:
                                    </label>
                                    <div className="xp-select-wrapper">
                                        <select id="font-size-selection">
                                            <option value="normal">Normal</option>
                                            <option value="large">Large</option>
                                            <option value="extra-large">Extra Large</option>
                                        </select>
                                        <span className="xp-select-arrow" aria-hidden="true"></span>
                                    </div>
                                </div>

                                <div className="other-settings appearance">
                                    <button className="luna-btn secondary"><span className="mnemonic">E</span>ffect...</button>
                                    <button className="luna-btn secondary"><span className="mnemonic">A</span>dvanced</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SETTINGS */}
                    {activeTab === 'Settings' && (
                        <div className="tab-settings-content">
                            <div
                                className="crt-monitor settings"
                                style={{ '--crt-filter': crtFilter } as React.CSSProperties}
                            />

                            <fieldset className='settings-fieldset'>
                                <legend>Screen resolution</legend>
                                <p className="settings-display-label">Display:</p>
                                <p className="settings-display-label">Default Monitor on Intel(R) 82865G Graphic Controller</p>

                                <div className="fieldset-row">
                                    <fieldset>
                                        <legend><span className='mnemonic'>S</span>creen resolution</legend>
                                        <div className="resolution-slider-row">
                                            <span className="resolution-label">Less</span>
                                            <input
                                                type="range"
                                                min={0}
                                                max={4}
                                                step={1}
                                                value={resolutionIndex}
                                                onChange={e => handleResolutionChange(Number(e.target.value))}
                                                className="resolution-slider"
                                            />
                                            <span className="resolution-label">More</span>
                                        </div>
                                        <p className="resolution-value">{resolutions[resolutionIndex].label}</p>
                                    </fieldset>

                                    <fieldset>
                                        <legend><span className='mnemonic'>C</span>olor quality</legend>
                                        <div className="xp-select-wrapper">
                                            <select 
                                                value={colorQuality}
                                                onChange={e => setColorQuality(e.target.value as '16bit' | '32bit')}
                                            >
                                                <option value="16bit">Medium (16 bit)</option>
                                                <option value="32bit">Highest (32 bit)</option>
                                            </select>
                                            <span className="xp-select-arrow" aria-hidden="true"></span>
                                        </div>
                                        <div
                                            className="color-quality-bar"
                                            style={{
                                                filter: colorQuality === '16bit' ? 'saturate(0.5) contrast(0.8)' : 'none'
                                            }}
                                        />
                                    </fieldset>
                                </div>

                                <div className="fieldset-buttons">
                                    <button className="luna-btn secondary"><span className='mnemonic'>T</span>roubleshoot...</button>
                                    <button className="luna-btn secondary">A<span className='mnemonic'>d</span>vanced</button>
                                </div>
                            </fieldset>
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

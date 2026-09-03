import { useEffect, useMemo, useRef, useState } from 'react';
import { getFontCharCodes } from './utils/getFontChars';
import { createPortal } from 'react-dom';
import useDraggable from '../../hooks/useDraggable';
import Charmap from '../../img/Charmap.webp'
import { getAllFonts, type FontEntry } from './utils/getFonts';
import { getCharName } from './utils/charNames';

import XPScrollbar from '../XPScrollbar';
import './CharacterMap.css'
import '../../App.css'

interface CharacterMapProps {
    onClose: () => void;
    isMinimized: boolean;
    setIsMinimized: (value: boolean | ((prev: boolean) => boolean)) => void;
    isFullscreen: boolean;
    onMouseDown?: () => void;
    isActive?: boolean;
    onHelpOpen: () => void;
}

const CharacterMap = ({
    onClose,
    isMinimized,
    setIsMinimized,
    isFullscreen,
    isActive,
    onMouseDown,
    onHelpOpen,
}:CharacterMapProps) => {
    
    const { position, handleMouseDown } = useDraggable(200, 100);
    const fonts = useMemo(() => getAllFonts(), []);
    const [chars, setChars] = useState<number[]>(() => {
        const arr: number[] = [];
        for (let c = 0x20; c <= 0xff; c++) {
            if (c !== 0x7f) arr.push(c);
        }
        return arr;
    });
    const [selectedFont, setSelectedFont] = useState<FontEntry | null>(fonts[0] ?? null);
    const [fontFamilyName, setFontFamilyName] = useState<string>('Arial');
    const [selectedCode, setSelectedCode] = useState<number>(0x21);
    const [charsToCopy, setCharsToCopy] = useState<string>('');
    const [advancedView, setAdvancedView] = useState(false);
    const [copied, setCopied] = useState(false);
    // ── Custom font dropdown ─────────────────────────────────────────────
    const [fontOpen, setFontOpen] = useState(false);
    const [fontListPos, setFontListPos] = useState({ top: 0, left: 0, width: 0 });

    const fontSelectRef  = useRef<HTMLDivElement>(null);
    const fontTriggerRef = useRef<HTMLDivElement>(null);
    const fontListRef    = useRef<HTMLUListElement>(null);
    const listRef        = useRef<HTMLDivElement>(null);

    const updateTooltipPos = (e: React.MouseEvent<HTMLButtonElement>) => {
        const cell = e.currentTarget;
        const container = listRef.current;
        if (!container) return;
        const cellRect = cell.getBoundingClientRect();
        const contRect = container.getBoundingClientRect();
        const spaceTop = cellRect.top - contRect.top;
        const spaceRight = contRect.right - cellRect.right;
        const vertical = spaceTop < 60 ? 'b' : 't';
        const horizontal = spaceRight < 200 ? 'l' : 'r';
        container.setAttribute('data-tt-pos', `${vertical}${horizontal}`);
    };

    const loadedFontsRef = useRef<Set<string>>(new Set());

    // Position dropdown + close on outside click
    useEffect(() => {
        if (!fontOpen) return;
        if (fontTriggerRef.current) {
            const r = fontTriggerRef.current.getBoundingClientRect();
            setFontListPos({ top: r.bottom, left: r.left, width: r.width });
        }
        const handler = (e: MouseEvent) => {
            if (fontTriggerRef.current?.contains(e.target as Node)) return;
            if (fontListRef.current?.contains(e.target as Node)) return;
            if (fontSelectRef.current && !fontSelectRef.current.contains(e.target as Node))
                setFontOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [fontOpen]);

    // Scroll selected item into view on open
    useEffect(() => {
        if (fontOpen) {
            fontListRef.current?.querySelector('.fm-selected')?.scrollIntoView({ block: 'nearest' });
        }
    }, [fontOpen]);

    // Loading selected font - FontFace API
    useEffect(() => {
        if (!selectedFont) return;

        const familyName = `charmap-${selectedFont.id}`;

        if (loadedFontsRef.current.has(familyName)) {
            setTimeout(() => setFontFamilyName(familyName), 0);
            return;
        }

        const fontFace = new FontFace(familyName, `url("${encodeURI(selectedFont.fontUrl)}")`);
        fontFace
            .load()
            .then(loaded => {
                document.fonts.add(loaded);
                loadedFontsRef.current.add(familyName);
                setFontFamilyName(familyName);
            })
            .catch(err => {
                console.error('Font load failed:', selectedFont.fontUrl, err);
                setFontFamilyName('Arial');
            });
    }, [selectedFont]);

    useEffect(() => {
        if (!selectedFont) return;

        let cancelled = false;

        getFontCharCodes(selectedFont.fontUrl)
            .then(codes => {
                if (cancelled) return;
                setChars(codes);
                if (codes.length > 0) setSelectedCode(codes[0]);
            })
            .catch(() => {
                if (cancelled) return;
                // fallback na základní latinku, pokud se cmap nepodaří přečíst
                const fallback: number[] = [];
                for (let c = 0x20; c <= 0xff; c++) {
                    if (c !== 0x7f) fallback.push(c);
                }
                setChars(fallback);
            });

        return () => { cancelled = true; };
    }, [selectedFont]);

    const handleSelectChar = (code: number) => {
        setSelectedCode(code);
    };

    const handleAddChar = (code: number) => {
        setSelectedCode(code);
        setCharsToCopy(prev => prev + String.fromCharCode(code));
    };

    const handleCopy = async () => {
        if (!charsToCopy) return;
        try {
            await navigator.clipboard.writeText(charsToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        } catch {
            // clipboard API nemusí být dostupné
        }
    };

    const hexCode = selectedCode.toString(16).toUpperCase().padStart(4, '0');

  return (
    <div className={[
        'app-window',
        'character-window',
        isActive  && 'app-window--active',
        isMinimized && 'ie-window--minimized',
        isMinimized && 'app-window--minimized',
        isFullscreen && 'ie-window--fullscreen',
        isFullscreen && 'app-window--fullscreen',
    ].filter(Boolean).join(' ')}
    style={isFullscreen ? {} : { left: position.x, top: position.y }}
    onMouseDown={onMouseDown}
    >
        <div className='title-bar' onMouseDown={handleMouseDown}>
            <div className='title'>
                <img
                    className='browser-icon'
                    alt='Character Map Icon'
                    src={Charmap}
                />

                <span className='title-bar-text'>Character Map</span>
            </div>

            <div className='title-bar-buttons xp-title-controls'>
                <button
                    type='button'
                    className='xp-title-control btn-minimize'
                    onClick={() => setIsMinimized(true)}
                    aria-label='Minimize'
                >
                    _
                </button>
                <button
                    type='button'
                    className={`xp-title-control ${isFullscreen ? 'btn-restore' : 'btn-maximize'}`}
                    aria-label={isFullscreen ? 'Restore' : 'Maximize'}
                >
                    {isFullscreen ? '❐' : '□'}
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

        <div className='character-map-body'>
            <div className='character-header'>
                Font:
                <div className='fm-color-select character-font-select' ref={fontSelectRef}>
                    <div
                        className='fm-color-trigger'
                        ref={fontTriggerRef}
                        onClick={() => setFontOpen(o => !o)}
                    >
                        {selectedFont && <img src={selectedFont.icon} className='fm-icon' alt='' />}
                        <span className='fm-color-name'>{selectedFont?.displayName ?? ''}</span>
                        <span className='xp-select-arrow' aria-hidden='true' />
                    </div>
                    {fontOpen && createPortal(
                        <XPScrollbar
                            className='fm-color-list character'
                            style={{
                                position: 'fixed',
                                top: fontListPos.top,
                                left: fontListPos.left,
                                minWidth: fontListPos.width,
                                zIndex: 9999,
                            }}
                        >
                        <ul ref={fontListRef} className='fm-color-list-inner'>
                           {fonts.map(f => (
                                <li
                                    key={f.id}
                                    className={`fm-color-item${f.id === selectedFont?.id ? ' fm-color-item--selected fm-selected' : ''}`}
                                    onClick={() => {
                                        setSelectedFont(f);
                                        setFontOpen(false);
                                    }}
                                >
                                    <img src={f.icon} className='fm-icon' alt='' />
                                    {f.displayName}
                                </li>
                            ))}
                        </ul>
                        </XPScrollbar>,
                        document.body
                    )}
                </div>
                <button className='luna-btn secondary' onClick={onHelpOpen}>Help</button>
            </div>

            <div className='character-list' ref={listRef}>
                <div className='character-grid'>
                    {chars.map(code => (
                        <button
                            key={code}
                            type='button'
                            className={`character-cell${selectedCode === code ? ' character-cell--selected' : ''}`}
                            style={{ fontFamily: fontFamilyName }}
                            onClick={() => handleSelectChar(code)}
                            onDoubleClick={() => handleAddChar(code)}
                            onMouseEnter={updateTooltipPos}
                            data-tooltip={`U+${code.toString(16).toUpperCase().padStart(4, '0')}: ${getCharName(code)}`}
                        >
                            {String.fromCharCode(code)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="character-footer">
                <div className="copy-character">
                    Characters to copy:
                    <output style={{ fontFamily: fontFamilyName }}>{charsToCopy}</output>

                    <div className="copy-buttons">
                        <button className='luna-btn' onClick={() => handleAddChar(selectedCode)}>
                            Select
                        </button>

                        <button className='luna-btn secondary' onClick={handleCopy}>
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>
                <label htmlFor="advanced-view" className='advanced-view'>
                    <input 
                        type="checkbox" 
                        id='advanced-view'
                        checked={advancedView}
                        onChange={e => setAdvancedView(e.target.checked)} 
                    />
                    Advanced view
                </label>
            </div>
            {/* Status bar */}
            <div className='status-bar'>
                <div className='status-bar-field'>
                    U+{hexCode}: {getCharName(selectedCode)}
                </div>
            </div>
        </div>
    </div>
  )
}

export default CharacterMap
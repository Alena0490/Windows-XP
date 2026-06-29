import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useDraggableDialog } from '../../hooks/useDraggableDialog';
import { windowsFolder } from '../files/data/windowsFolder';
import type { FMItem } from '../files/data/types';
import { COLORS } from './data/wordpadData';
import TrueTypeIcon from './img/TrueType.webp';
import OpenTypeIcon from './img/OpenType.webp';
import '../keyboard/FontModal.css';
import './WordpadFontModal.css'
import '../../App.css'

export interface FontSelection {
    family: string;
    style: string;
    size: number;
    fontUrl: string;
    strikeout: boolean; 
    underline: boolean;
    color: string;   
}

interface WordpadFontModalProps {
    current: FontSelection;
    onApply: (s: FontSelection) => void;
    onClose: () => void;
    style?: React.CSSProperties;
}

const fontsFolder = (windowsFolder.children ?? []).find(c => c.name === 'Fonts');
const allFontItems: FMItem[] = fontsFolder?.children ?? [];

type Variant = { style: string; fontUrl: string; isOT: boolean };
type Family  = { name: string; variants: Variant[]; icon: string };

const STYLE_ORDER = ['Regular', 'Italic', 'Bold', 'Bold Italic'];

function buildFamilies(): Family[] {
    const map = new Map<string, Variant[]>();
    const iconMap = new Map<string, string>();

    for (const item of allFontItems) {
        if (!item.fontUrl || !item.displayName) continue;
        const dn = item.displayName;
        let family = dn;
        let style = 'Regular';
        for (const suffix of ['Bold Italic', 'Bold', 'Italic']) {
            if (dn.endsWith(' ' + suffix)) {
                family = dn.slice(0, dn.length - suffix.length - 1);
                style = suffix;
                break;
            }
        }
        if (!map.has(family)) map.set(family, []);
        map.get(family)!.push({ style, fontUrl: item.fontUrl, isOT: item.fontUrl.endsWith('.otf') });
        if (style === 'Regular') iconMap.set(family, item.fontUrl.endsWith('.otf') ? OpenTypeIcon : TrueTypeIcon);
    }

    const families: Family[] = [];
    for (const [name, variants] of map) {
        const sorted = [...variants].sort((a, b) => {
            const ai = STYLE_ORDER.indexOf(a.style);
            const bi = STYLE_ORDER.indexOf(b.style);
            return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
        });
        const icon = iconMap.get(name) ?? (sorted[0].isOT ? OpenTypeIcon : TrueTypeIcon);
        families.push({ name, variants: sorted, icon });
    }
    return families.sort((a, b) => a.name.localeCompare(b.name));
}

const FAMILIES = buildFamilies();
const SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];

const WordpadFontModal = ({current, onApply, onClose, style}:WordpadFontModalProps) => {
     const { dialogRef, onMouseDown: handleDrag, draggableStyle } = useDraggableDialog();
        const initFamily = FAMILIES.find(f => f.name === current.family) ?? FAMILIES.find(f => f.variants.some(v => v.fontUrl === current.fontUrl)) ?? FAMILIES[0];
        const [selFamily, setSelFamily] = useState<Family>(initFamily);
        const [selStyle,  setSelStyle]  = useState(current.style);
        const [selSize,   setSelSize]   = useState(current.size);
        const [strikeout, setStrikeout] = useState(current.strikeout);
        const [underline, setUnderline] = useState(current.underline);
        const [selColor, setSelColor] = useState(current.color);
        const [colorOpen, setColorOpen] = useState(false);
        const [selScript, setSelScript] = useState('Western');
        const [scriptOpen, setScriptOpen] = useState(false);

        const familyRef = useRef<HTMLUListElement>(null);
        const styleRef  = useRef<HTMLUListElement>(null);
        const sizeRef   = useRef<HTMLUListElement>(null);
        const colorRef  = useRef<HTMLDivElement>(null);
        const triggerRef = useRef<HTMLDivElement>(null);
        const colorListRef = useRef<HTMLUListElement>(null);
        const [listPos, setListPos] = useState({ top: 0, left: 0, width: 0 });
        const scriptRef = useRef<HTMLDivElement>(null);
        const scriptTriggerRef = useRef<HTMLDivElement>(null);
        const scriptListRef = useRef<HTMLUListElement>(null);
        const [scriptPos, setScriptPos] = useState({ top: 0, left: 0, width: 0 });

        useEffect(() => {
            familyRef.current?.querySelector('.fm-selected')?.scrollIntoView({ block: 'nearest' });
            styleRef.current?.querySelector('.fm-selected')?.scrollIntoView({ block: 'nearest' });
            sizeRef.current?.querySelector('.fm-selected')?.scrollIntoView({ block: 'nearest' });
        }, []);

        useEffect(() => {
            if (!colorOpen) return;
            if (triggerRef.current) {
                const r = triggerRef.current.getBoundingClientRect();
                setListPos({ top: r.bottom, left: r.left, width: r.width });
            }
            const handler = (e: MouseEvent) => {
                if (triggerRef.current?.contains(e.target as Node)) return;
                if (colorListRef.current?.contains(e.target as Node)) return;
                if (colorRef.current && !colorRef.current.contains(e.target as Node))
                    setColorOpen(false);
            };
            document.addEventListener('mousedown', handler);
            return () => document.removeEventListener('mousedown', handler);
        }, [colorOpen]);

        useEffect(() => {
            if (!scriptOpen) return;
            if (scriptTriggerRef.current) {
                const r = scriptTriggerRef.current.getBoundingClientRect();
                setScriptPos({ top: r.bottom, left: r.left, width: r.width });
            }
            const handler = (e: MouseEvent) => {
                if (scriptTriggerRef.current?.contains(e.target as Node)) return;
                if (scriptListRef.current?.contains(e.target as Node)) return;
                if (scriptRef.current && !scriptRef.current.contains(e.target as Node))
                    setScriptOpen(false);
            };
            document.addEventListener('mousedown', handler);
            return () => document.removeEventListener('mousedown', handler);
        }, [scriptOpen]);
    
        const variant = selFamily.variants.find(v => v.style === selStyle) ?? selFamily.variants[0];
    
        useEffect(() => {
            if (!variant.fontUrl) return;
            const weight = variant.style.includes('Bold') ? 'bold' : 'normal';
            const style  = variant.style.includes('Italic') ? 'italic' : 'normal';
            const font = new FontFace(selFamily.name, `url(${variant.fontUrl})`, { weight, style });
            font.load().then(loaded => { document.fonts.add(loaded); }).catch(() => {});
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [variant.fontUrl]);
        const effectiveStyle = variant.style;
    
        const handleApply = () => {
            onApply({
                family: selFamily.name,
                style: effectiveStyle,
                size: selSize,
                fontUrl: variant.fontUrl,
                strikeout,
                underline,
                color: selColor,
            });
            onClose();
        };
  return (
        <div className='app-window fm-window wordpad-window' ref={dialogRef} style={{ ...style, ...draggableStyle }} onMouseDown={e => { if ((e.target as HTMLElement).closest('.title-bar')) { setColorOpen(false); setScriptOpen(false); } handleDrag(e); }}>
            <div className='title-bar'>
                <span className='title-bar-text'>Font</span>
                <div className='title-bar-buttons xp-title-controls'>
                      <button
                        type='button'
                        className='xp-title-control btn-help'
                        aria-label='Help'
                    >
                        ?
                    </button>
                    <button type='button' className='xp-title-control btn-close' onClick={onClose} aria-label='Close'>✕</button>
                </div>
            </div>

            <div className='fm-body'>
                <div className='fm-columns wordpad'>
                    <div className='fm-col fm-col--font'>
                        <label className='fm-label'>Font:</label>
                        <input className='fm-input' value={selFamily.name} readOnly />
                        <div className='fm-list-wrap'>
                            <ul className='fm-list' ref={familyRef}>
                                {FAMILIES.map(f => (
                                    <li
                                        key={f.name}
                                        className={`fm-item ${f.name === selFamily.name ? 'fm-selected' : ''}`}
                                        onClick={() => {
                                            setSelFamily(f);
                                            if (!f.variants.some(v => v.style === selStyle)) {
                                                setSelStyle(f.variants[0].style);
                                            }
                                        }}
                                    >
                                        <img src={f.icon} className='fm-icon' alt='' />
                                        {f.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className='fm-col fm-col--style'>
                        <label className='fm-label'>Font style:</label>
                        <input className='fm-input' value={effectiveStyle} readOnly />
                        <div className='fm-list-wrap'>
                            <ul className='fm-list' ref={styleRef}>
                                {selFamily.variants.map(v => (
                                    <li
                                        key={v.style}
                                        className={`fm-item ${v.style === effectiveStyle ? 'fm-selected' : ''}`}
                                        onClick={() => setSelStyle(v.style)}
                                    >
                                        {v.style}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className='fm-col fm-col--size'>
                        <label className='fm-label'>Size:</label>
                        <input className='fm-input' value={selSize} readOnly />
                        <div className='fm-list-wrap'>
                            <ul className='fm-list' ref={sizeRef}>
                                {SIZES.map(s => (
                                    <li
                                        key={s}
                                        className={`fm-item ${s === selSize ? 'fm-selected' : ''}`}
                                        onClick={() => setSelSize(s)}
                                    >
                                        {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className='fm-btns'>
                        <button type='button' className='luna-btn' onClick={handleApply}>OK</button>
                        <button type='button' className='luna-btn secondary' onClick={onClose}>Cancel</button>
                    </div>
                </div>
                <div className="wordpad-font-bottom">
                    
                    {/* EFFECTS */}
                    <fieldset className='fm-effects-frame'>
                        <legend className='fm-effects-legend'>Effects</legend>

                        <label className='fm-checkbox wordpad'>
                            <input
                                type='checkbox'
                                checked={strikeout}
                                onChange={e => setStrikeout(e.target.checked)}
                            />
                            Strikeout
                        </label>

                        <label className='fm-checkbox wordpad'>
                            <input
                                type='checkbox'
                                checked={underline}
                                onChange={e => setUnderline(e.target.checked)}
                            />
                            Underline
                        </label>

                        <label className='fm-label'>Color:</label>
                        <div className="fm-color-select" ref={colorRef}>
                            <div className="fm-color-trigger" ref={triggerRef} onClick={() => setColorOpen(o => !o)}>
                                <div className="fm-color-swatch" style={{ backgroundColor: selColor }} />
                                <span className="fm-color-name">
                                    {COLORS.find(c => c.value === selColor)?.name ?? 'Black'}
                                </span>
                                <span className="xp-select-arrow" aria-hidden="true" />
                            </div>
                            {colorOpen && createPortal(
                                <ul ref={colorListRef} className="fm-color-list" style={{ position: 'fixed', top: listPos.top, left: listPos.left, minWidth: listPos.width, zIndex: 9999 }}>
                                    {COLORS.map(c => (
                                        <li
                                            key={c.name}
                                            className={`fm-color-item${c.value === selColor ? ' fm-color-item--selected' : ''}`}
                                            onClick={() => { setSelColor(c.value); setColorOpen(false); }}
                                        >
                                            <div className="fm-color-swatch" style={{ backgroundColor: c.value }} />
                                            {c.name}
                                        </li>
                                    ))}
                                </ul>,
                                document.body
                            )}
                        </div>
                    </fieldset>

                    {/* FONT SAMPLES */}
                    <div className='fm-sample-section'>
                        <fieldset className='fm-sample-frame'>
                            <legend className='fm-sample-legend'>Sample</legend>
                            <div
                                className='fm-sample-text'
                                style={{
                                    fontFamily: `'${selFamily.name}', sans-serif`,
                                    fontWeight: effectiveStyle.includes('Bold') ? 'bold' : 'normal',
                                    fontStyle: effectiveStyle.includes('Italic') ? 'italic' : 'normal',
                                    fontSize: `${selSize}pt`,
                                }}
                            >
                                AaBbYyZz
                            </div>
                        </fieldset>

                        {/* SCRIPT */}
                        <div className='fm-script-row'>
                            <label className='fm-label'>Script:</label>
                            <div className="fm-color-select" ref={scriptRef}>
                                <div className="fm-color-trigger" ref={scriptTriggerRef} onClick={() => setScriptOpen(o => !o)}>
                                    <span className="fm-color-name">{selScript}</span>
                                    <span className="xp-select-arrow" aria-hidden="true" />
                                </div>
                                {scriptOpen && createPortal(
                                    <ul ref={scriptListRef} className="fm-color-list" style={{ position: 'fixed', top: scriptPos.top, left: scriptPos.left, minWidth: scriptPos.width, zIndex: 9999 }}>
                                        {['Western', 'Central European', 'Baltic', 'Greek', 'Turkish', 'Cyrillic'].map(s => (
                                            <li
                                                key={s}
                                                className={`fm-color-item${s === selScript ? ' fm-color-item--selected' : ''}`}
                                                onClick={() => { setSelScript(s); setScriptOpen(false); }}
                                            >
                                                {s}
                                            </li>
                                        ))}
                                    </ul>,
                                    document.body
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className='fm-font-note'>
                    {variant.isOT
                        ? 'This is an OpenType font. This same font will be used on both your printer and your screen.'
                        : 'This is a TrueType font. This same font will be used on both your printer and your screen.'}
                </div>
            </div>
        </div>
    );
}

export default WordpadFontModal
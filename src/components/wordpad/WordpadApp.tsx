import React, { useState, useRef, useEffect } from 'react'
import Document from './img/file.webp'
import Folder from './img/folder.webp'
import Save from './img/save.webp'
import Print from './img/print.webp'
import Search from './img/search.webp'
import Binocular from './img/binocular.webp'
import Redo from './img/redo.webp'
import Calendar from './img/calendar.webp'
import Cut from './img/Cut.webp'
import Copy from './img/Copy.webp'
import Paste from './img/Paste.webp'
import Bold from './img/bold.webp'
import Italic from './img/italic.webp'
import Underline from './img/underline.webp'
import Color from './img/imgText.webp'
import textLeft from './img/left.webp'
import textRight from './img/right.webp'
import TextCenter from './img/center.webp'
import ListView from './img/list.webp'

import RulerTop from './img/ruler-top.webp'
import RulerBottom from './img/ruler-bottom.webp'
import RulerUnder from './img/ruler-under.webp'

import TrueTypeIcon from './img/TrueType.webp'
import OpenTypeIcon from './img/OpenType.webp'
import BitmapFontIcon from './img/Font.webp'

import './Wordpad.css'

type FontType = 'truetype' | 'opentype' | 'other';
type FontEntry = { name: string; type: FontType };

const FONTS: FontEntry[] = [
    { name: 'Abadi MT Condensed',         type: 'truetype' },
    { name: 'Abadi MT Condensed Light',   type: 'truetype' },
    { name: 'Algerian',                   type: 'truetype' },
    { name: 'Arial',                      type: 'truetype' },
    { name: 'Arial Black',                type: 'truetype' },
    { name: 'Arial Narrow',               type: 'truetype' },
    { name: 'Baskerville Old Face',       type: 'truetype' },
    { name: 'Bauhaus 93',                 type: 'truetype' },
    { name: 'Book Antiqua',               type: 'truetype' },
    { name: 'Bookman Old Style',          type: 'truetype' },
    { name: 'Bradley Hand ITC',           type: 'truetype' },
    { name: 'Brush Script MT Italic',     type: 'truetype' },
    { name: 'Castella',                   type: 'truetype' },
    { name: 'Century Gothic',             type: 'truetype' },
    { name: 'Century Schoolbook',         type: 'truetype' },
    { name: 'Chiller',                    type: 'truetype' },
    { name: 'Comic Sans Graffiti',        type: 'truetype' },
    { name: 'Comic Sans MS',              type: 'truetype' },
    { name: 'Copperplate Gothic Bold',    type: 'truetype' },
    { name: 'Copperplate Gothic Light',   type: 'truetype' },
    { name: 'Courier New',                type: 'truetype' },
    { name: 'Digital Numbers',            type: 'truetype' },
    { name: 'Digital Numbers WOFF',       type: 'other' },
    { name: 'Digital-7',                  type: 'truetype' },
    { name: 'Engravers MT',               type: 'truetype' },
    { name: 'Estrangelo Edessa',          type: 'truetype' },
    { name: 'Fixedsys',                   type: 'other' },
    { name: 'Franklin Gothic Medium',     type: 'opentype' },
    { name: 'Garamond',                   type: 'truetype' },
    { name: 'Gautami',                    type: 'truetype' },
    { name: 'Georgia',                    type: 'truetype' },
    { name: 'Haettenschweiler',           type: 'truetype' },
    { name: 'Helvetica',                  type: 'truetype' },
    { name: 'Helvetica Neue',             type: 'truetype' },
    { name: 'Helvetica Neue Ultra Light', type: 'opentype' },
    { name: 'Impact',                     type: 'truetype' },
    { name: 'Informal Roman',             type: 'truetype' },
    { name: 'Jokerman',                   type: 'truetype' },
    { name: 'Juice ITC',                  type: 'truetype' },
    { name: 'Latha',                      type: 'truetype' },
    { name: 'Levi',                       type: 'truetype' },
    { name: 'Lucida Console',             type: 'truetype' },
    { name: 'Lucida Sans Unicode',        type: 'truetype' },
    { name: 'Mangal',                     type: 'truetype' },
    { name: 'Marlett',                    type: 'truetype' },
    { name: 'Modern No. 20',              type: 'truetype' },
    { name: 'Monotype Corsiva',           type: 'truetype' },
    { name: 'MS Sans Serif',              type: 'truetype' },
    { name: 'MV Boli',                    type: 'truetype' },
    { name: 'OCR A Extended',             type: 'truetype' },
    { name: 'OPTI Franklin Gothic Medium',type: 'opentype' },
    { name: 'Palatino Linotype',          type: 'truetype' },
    { name: 'Papyrus',                    type: 'truetype' },
    { name: 'Parchment',                  type: 'truetype' },
    { name: 'Raavi',                      type: 'truetype' },
    { name: 'Script MT Bold',             type: 'truetype' },
    { name: 'Shruti',                     type: 'truetype' },
    { name: 'Stencil',                    type: 'truetype' },
    { name: 'Symbol',                     type: 'truetype' },
    { name: 'Sylfaen',                    type: 'truetype' },
    { name: 'Tahoma',                     type: 'truetype' },
    { name: 'Terminal Greek',             type: 'other' },
    { name: 'Terminal Italic',            type: 'other' },
    { name: 'Terminal Regular',           type: 'other' },
    { name: 'Ticking Timebomb BB',        type: 'truetype' },
    { name: 'Times New Roman',            type: 'truetype' },
    { name: 'Trebuchet MS',               type: 'truetype' },
    { name: 'Tunga',                      type: 'truetype' },
    { name: 'Verdana',                    type: 'truetype' },
    { name: 'Webdings',                   type: 'truetype' },
    { name: 'Wide Latin',                 type: 'truetype' },
    { name: 'Wingdings',                  type: 'truetype' },
    { name: 'WST Czech',                  type: 'other' },
    { name: 'WST English',                type: 'other' },
    { name: 'WST French',                 type: 'other' },
    { name: 'WST German',                 type: 'other' },
    { name: 'WST Italian',                type: 'other' },
    { name: 'WST Spanish',                type: 'other' },
    { name: 'WST Swedish',                type: 'other' },
];

interface WordpadAppProps {
    showStatusBar: boolean;
    wordWrap: boolean;
    editorRef: React.RefObject<HTMLDivElement | null>;
    newRef: React.RefObject<() => void>;
    onSaved: (name: string) => void;
    saveAsOpen: boolean;
    setSaveAsOpen: (value: boolean) => void;
    fileName: string;
    setFileName: (value: string) => void;
    undoRef: React.RefObject<() => void>;
    redoRef: React.RefObject<() => void>;
    onHistoryChange: (canUndo: boolean, canRedo: boolean) => void;
    initialContent?: string;
    initialFileName?: string;
    onChanges: () => void;
    insertDateTimeRef: React.RefObject<() => void>;
}

const WordpadApp = ({ showStatusBar, editorRef, initialContent, onChanges }: WordpadAppProps) => {
    void Document; void Folder; void Save; void Print; void Search;
    void Binocular; void Redo; void Calendar; void Cut; void Copy;
    void Paste; void Bold; void Italic; void Underline; void textLeft;
    void textRight; void TextCenter; void ListView; void RulerTop;
    void RulerBottom; void RulerUnder; void Color;

    const [selectedFont, setSelectedFont] = useState('Arial');
    const [fontOpen, setFontOpen] = useState(false);
    const fontRef = useRef<HTMLDivElement>(null);
    const selectedFontEntry = FONTS.find(f => f.name === selectedFont);

    // Load the initial content
    useEffect(() => {
        if (editorRef.current && initialContent) {
            editorRef.current.innerHTML = initialContent;
        }
    }, [initialContent, editorRef]);

    useEffect(() => {
        if (!fontOpen) return;
        const handler = (e: MouseEvent) => {
            if (fontRef.current && !fontRef.current.contains(e.target as Node))
                setFontOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [fontOpen]);


    return (
        <div className='wordpad-app'>
            <div className="wordpad-tools">
                <div className="toolbar">
                    <button aria-label='Create a new document' data-tooltip='New'><img src={Document} alt="" /></button>
                    <button aria-label='Open document' data-tooltip='Open'><img src={Folder} alt="" /></button>
                    <button aria-label='Save file' data-tooltip='Save'><img src={Save} alt="" /></button>
                    <button aria-label='Print document' data-tooltip='Print'><img src={Print} alt="" /></button>
                    <button aria-label='Show PPrint Preview' data-tooltip='Print Preview'><img src={Search} alt="" /></button>
                    <button aria-label='Search in the document' data-tooltip='Find'><img src={Binocular} alt="" /></button>
                    <button className='is-disabled' aria-label='Cut' data-tooltip='Cut'><img src={Cut} alt="" /></button>
                    <button aria-label='Copy' data-tooltip='Copy'><img src={Copy} alt="" /></button>
                    <button aria-label='Paste' data-tooltip='Paste'><img src={Paste} alt="" /></button>
                    <button aria-label='Insert date and time' data-tooltip='Insert Date/Time'><img src={Calendar} alt="" /></button>
                </div>
                <div className="format-bar">
                    <div className="texttool-buttons">
                        <div className="font-picker format-bar__font" ref={fontRef}>
                            <div className="font-picker__trigger" onClick={() => setFontOpen(o => !o)} aria-label="Font">
                                <img
                                    src={selectedFontEntry?.type === 'opentype' ? OpenTypeIcon : selectedFontEntry?.type === 'other' ? BitmapFontIcon : TrueTypeIcon}
                                    alt=""
                                    className="font-picker__type-icon"
                                />
                                <span className="font-picker__name">{selectedFont}</span>
                                <span className="xp-select-arrow font-picker__arrow" aria-hidden="true" />
                            </div>
                            {fontOpen && (
                                <ul className="font-picker__list">
                                    {FONTS.map(f => (
                                        <li
                                            key={f.name}
                                            className={`font-picker__item${f.name === selectedFont ? ' font-picker__item--selected' : ''}`}
                                            onClick={() => { setSelectedFont(f.name); setFontOpen(false); }}
                                        >
                                            <img
                                                src={f.type === 'opentype' ? OpenTypeIcon : f.type === 'other' ? BitmapFontIcon : TrueTypeIcon}
                                                alt={f.type === 'opentype' ? 'OpenType' : f.type === 'other' ? 'Font' : 'TrueType'}
                                                className="font-picker__type-icon"
                                            />
                                            <span style={{ fontFamily: f.name }}>{f.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    
                        <div className="xp-select-wrapper format-bar__size">
                            <select defaultValue="10" aria-label="Font size">
                                <option>8</option>
                                <option>9</option>
                                <option>10</option>
                                <option>11</option>
                                <option>12</option>
                                <option>14</option>
                                <option>16</option>
                                <option>18</option>
                                <option>20</option>
                                <option>24</option>
                                <option>28</option>
                                <option>36</option>
                                <option>48</option>
                                <option>72</option>
                            </select>
                            <span className="xp-select-arrow" aria-hidden="true" />
                        </div>
                        <div className="xp-select-wrapper format-bar__script">
                            <select defaultValue="Western" aria-label="Script">
                                <option>Western</option>
                                <option>Central European</option>
                                <option>Baltic</option>
                                <option>Greek</option>
                                <option>Turkish</option>
                                <option>Cyrillic</option>
                            </select>
                            <span className="xp-select-arrow" aria-hidden="true" />
                        </div>
                        <button data-tooltip='Bold' aria-label='Bold'><img src={Bold} alt="" /></button>
                        <button data-tooltip='Italic' aria-label='Italic'><img src={Italic} alt="" /></button>
                        <button data-tooltip='Underline' aria-label='Underline'><img src={Underline} alt="" /></button>
                        <button data-tooltip='Color' aria-label='Color'><img src={Color} alt="" /></button>
                        <button data-tooltip='Align Left' aria-label='Align Left'><img src={textLeft} alt="" /></button>
                        <button data-tooltip='Align Center' aria-label='Align Center'><img src={TextCenter} alt="" /></button>
                        <button data-tooltip='Alight Right' aria-label='Align Right'><img src={textRight} alt="" /></button>  
                        <button data-tooltip='Bullet' aria-label='Bullet List'><img src={ListView} alt="" /></button>
                    </div>
                </div>
                <div className="rulers"></div>
            </div>
            <div
                className="text-window"
                contentEditable
                suppressContentEditableWarning
                ref={editorRef}
                onInput={() => onChanges()}
            ></div>
            {showStatusBar && (
                <div className='wordpad-statusbar'>
                    <div className='status'>For Help, press F1</div>
                    <div className="status second"></div>
                </div>
            )}
        </div>
    );
}

export default WordpadApp;

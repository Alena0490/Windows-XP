import { useState, useEffect, useRef, type ReactNode } from 'react';
import useSound from '../../hooks/useSound';
import type { FontSelection } from './FontModal';
import { typeIntoActiveElement } from './utils/typeIntoActive.Element';
import WindowsKey from '../../img/keyboard/WindowsKey.webp'
import WindowsKeyHover from '../../img/keyboard/WindowsKeyHover.webp'
import CalculatorKey from '../../img/keyboard/CalculatorKey.webp'
import CalculatorKeyHover from '../../img/keyboard/CalculatorKeyHover.webp' 
import ArromLeft from '../../img/keyboard/ArrowLeft.webp' 
import ArrowRight from '../../img/keyboard/ArrowRight.webp' 
import ArrowUp from '../../img/keyboard/ArrowUP.webp' 
import ArrowBottom from '../../img/keyboard/ArrowBottom.webp' 

import './Keyboard.css';

type BaseKey = {
  base: string;
  shifted?: string;
  className?: string;
};

type ActionKey = {
  action: 'Backspace' | 'Tab' | 'Caps Lock' | 'Enter' | 'Shift' | 'Ctrl' | 'Alt' | 'Windows' | 'Calculator'
    | 'Esc' | 'F1' | 'F2' | 'F3' | 'F4' | 'F5' | 'F6' | 'F7' | 'F8' | 'F9' | 'F10' | 'F11' | 'F12'
    | 'psc' | 'slk' | 'brk' | 'nlk'
    | 'ins' | 'hm' | 'pup' | 'del' | 'end' | 'pdn'
    | 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';
  icon?: ReactNode;
  side?: 'left' | 'right';
  className?: string;
};

type Key = BaseKey | ActionKey;

interface KeyboardAppProps {
    openCalculator: () => void;
    openStartMenu: () => void;
    view: 'enhanced' | 'standard';
    globalVolume: number;
    globalMuted: boolean;
    clickSound: boolean;
    keys: 101 | 102;
    fontSelection: FontSelection;
    layout: 'regular' | 'block';
}

const ROW0: Key[] = [
    { action: 'Esc', className: 'esc'},
    { action: 'F1',  className: 'keyboard-key--fn' },
    { action: 'F2',  className: 'keyboard-key--fn' },
    { action: 'F3',  className: 'keyboard-key--fn' },
    { action: 'F4',  className: 'keyboard-key--fn f-key block-space' },
    { action: 'F5',  className: 'keyboard-key--fn' },
    { action: 'F6',  className: 'keyboard-key--fn' },
    { action: 'F7',  className: 'keyboard-key--fn' },
    { action: 'F8',  className: 'keyboard-key--fn f-key f-8' },
    { action: 'F9',  className: 'keyboard-key--fn f-9' },
    { action: 'F10', className: 'keyboard-key--fn' },
    { action: 'F11', className: 'keyboard-key--fn' },
    { action: 'F12', className: 'keyboard-key--fn F-12' },
];

const ROW1: Key[] = [
  { base: '`', shifted: '~' },
  { base: '1', shifted: '!' },
  { base: '2', shifted: '@' },
  { base: '3', shifted: '#' },
  { base: '4', shifted: '$' , className: 'block-space'},
  { base: '5', shifted: '%' },
  { base: '6', shifted: '^' },
  { base: '7', shifted: '&' },
  { base: '8', shifted: '*' },
  { base: '9', shifted: '(', className: 'block-space'},
  { base: '0', shifted: ')' },
  { base: '-', shifted: '_' },
  { base: '=', shifted: '+' },
  { action: 'Backspace', icon: 'bksp'},
];

const ROW2: Key[] = [
  { action: 'Tab', icon: 'tab',className: 'tab'},
  { base: 'q' },
  { base: 'w'},
  {base: 'e',className: 'block-space' },
  { base: 'r' },
  { base: 't' },
  { base: 'y' },
  { base: 'u' },
  { base: 'i', className: 'block-space'},
  { base: 'o' },
  { base: 'p' },
  { base: '[', shifted: '{' },
  { base: ']', shifted: '}' },
  { base: '\\', shifted: '|' },
];

const ROW3: Key[] = [
  { action: 'Caps Lock', icon: 'lock', className: 'keyboard-key--modifier' },
  { base: 'a' },
  { base: 's' },
  { base: 'd', className: 'block-space' },
  { base: 'f' },
  { base: 'g' },
  { base: 'h' },
  { base: 'j' },
  { base: 'k', className: 'block-space' },
  { base: 'l' },
  { base: ';', shifted: ':' },
  { base: "'", shifted: '"' },
  { action: 'Enter', icon: 'enter' },
];


const ROW4: Key[] = [
  { action: 'Shift', side: 'left', icon: 'shift', className: 'keyboard-key--modifier'},
  { base: 'z' },
  { base: 'x' },
  { base: 'c', className: 'block-space'  },
  { base: 'v' },
  { base: 'b' },
  { base: 'n' },
  { base: 'm' },
  { base: ',', shifted: '<', className: 'block-space'  },
  { base: '.', shifted: '>' },
  { base: '/', shifted: '?' },
  { action: 'Shift', side: 'right', icon: 'shift', className: 'keyboard-key--modifier r-shift' },                          
];

const ROW4_102: Key[] = [
  { action: 'Shift', side: 'left', icon: 'shift', className: 'keyboard-key--modifier'},
  { base: '\\', shifted: '|' },
  { base: 'z' }, 
  { base: 'x' }, 
  { base: 'c', className: 'block-space'  }, 
  { base: 'v' }, 
  { base: 'b' },
  { base: 'n' }, 
  { base: 'm' },
  { base: ',', shifted: '<', className: 'block-space'  }, 
  { base: '.', shifted: '>' }, 
  { base: '/', shifted: '?' },
  { action: 'Shift', side: 'right', icon: 'shift', className: 'keyboard-key--modifier r-shift' },
];

const ROW5: Key[] = [
    { action: 'Ctrl', className: 'keyboard-key--modifier l-ctrl' },
    { 
        action: 'Windows', 
        icon: (
            <span className='key-img-swap'>
                <img src={WindowsKey} className='key-img' alt='Windows' />
                <img src={WindowsKeyHover} className='key-img key-img--hover' alt='' />
            </span>
        ), 
        className: 'keyboard-key--modifier' 
    },
    { action: 'Alt', className: 'keyboard-key--modifier l-alt block-space' },
    { base: ' ', className: 'block-space' }, // Space
    { action: 'Alt', className: 'keyboard-key--modifier' },
    { action: 'Windows', 
        icon: (
            <span className='key-img-swap'>
                <img src={WindowsKey} className='key-img' alt='Windows' />
                <img src={WindowsKeyHover} className='key-img key-img--hover' alt='' />
            </span>
        ), 
        className: 'keyboard-key--modifier' 
    },
    { action: 'Calculator', 
        icon: (
            <span className='key-img-swap'>
                <img src={CalculatorKey} className='key-img' alt='Calculator' />
                <img src={CalculatorKeyHover} className='key-img key-img--hover' alt='' />
            </span>
        ), 
        className: 'keyboard-key--modifier' 
    },
    { action: 'Ctrl', className: 'keyboard-key--modifier r-ctrl' },
];

const NAV: Key[] = [
  { action: 'psc' }, { action: 'slk', className: 'keyboard-key--modifier' }, { action: 'brk' },
  { action: 'ins' }, { action: 'hm' },  { action: 'pup' },
  { action: 'del' }, { action: 'end' }, { action: 'pdn' },
];

const NUMPAD: Key[] = [
  { action: 'nlk', className: 'keyboard-key--modifier'}, { base: '/' }, { base: '*' }, { base: '-' },
  { base: '7' }, { base: '8' }, { base: '9' }, { base: '+', className: 'keyboard-key--tall' },
  { base: '4' }, { base: '5' }, { base: '6' },
  { base: '1' }, { base: '2' }, { base: '3' }, { action: 'Enter', icon: 'ent', className: 'keyboard-key--tall' },
  { base: '0', className: 'keyboard-key--wide-num' }, { base: '.' },
];

const KeyboardApp = ({
    openCalculator,
    openStartMenu,
    view,
    globalVolume,
    globalMuted,
    clickSound,
    keys,
    fontSelection,
    layout,
}:KeyboardAppProps) => {

    useEffect(() => {
        if (!fontSelection.fontUrl) return;
        const weight = fontSelection.style.includes('Bold') ? 'bold' : 'normal';
        const style  = fontSelection.style.includes('Italic') ? 'italic' : 'normal';
        const font = new FontFace(fontSelection.family, `url(${fontSelection.fontUrl})`, { weight, style });
        font.load().then(loaded => { document.fonts.add(loaded); }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fontSelection.fontUrl]);

    const keyStyle = {
        fontFamily: `'${fontSelection.family}', sans-serif`,
        fontStyle: fontSelection.style.includes('Italic') ? 'italic' as const : 'normal' as const,
        fontSize: `${fontSelection.size}pt`,
        '--kbd-key-font-weight': fontSelection.style.includes('Bold') ? '700' : '600',
    } as React.CSSProperties;

    const sounds = useSound(globalVolume, globalMuted);
    const playKeyDown = () => { if (clickSound) sounds.playKeyDown(); };
    const playKeyUp = () => { if (clickSound) sounds.playKeyUp(); };
    const playStickyKey = () => { if (clickSound) sounds.playStickyKey(); };

  const [isCaps, setIsCaps] = useState(false);
  const [shiftState, setShiftState] = useState<{
    active: boolean;
    side: 'left' | 'right' | null;
  }>({ active: false, side: null });

  const row4 = keys === 102 ? ROW4_102 : ROW4;

  // Track last focused input/textarea outside the keyboard itself
  const lastTargetRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const lastContentEditableRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onFocusIn = (e: FocusEvent) => {
      const el = e.target as HTMLElement;
      if (!el.closest('.keyboard-window')) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          lastTargetRef.current = el as HTMLInputElement | HTMLTextAreaElement;
          lastContentEditableRef.current = null;
        } else if (el.contentEditable === 'true' || el.closest('[contenteditable="true"]')) {
          lastContentEditableRef.current = el.contentEditable === 'true' ? el : (el.closest('[contenteditable="true"]') as HTMLElement);
          lastTargetRef.current = null;
        }
      }
    };
    document.addEventListener('focusin', onFocusIn);
    return () => document.removeEventListener('focusin', onFocusIn);
  }, []);

  const applyKey = (key: string) => {
    // check contentEditable first
    if (lastContentEditableRef.current) {
      const el = lastContentEditableRef.current;
      el.focus({ preventScroll: true });

      if (key === 'Enter') {
        document.execCommand('insertHTML', false, '<br>');
      } else if (key === 'Backspace' || key === 'Delete') {
        document.execCommand(key === 'Backspace' ? 'delete' : 'forwardDelete');
      } else if (key === 'Home' || key === 'End' || key.startsWith('Arrow')) {
        el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
        el.dispatchEvent(new KeyboardEvent('keyup',   { key, bubbles: true, cancelable: true }));
      } else {
        el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
        el.dispatchEvent(new KeyboardEvent('keyup',   { key, bubbles: true, cancelable: true }));
      }
      el.dispatchEvent(new Event('input', { bubbles: true }));
      return;
    }

    const el = lastTargetRef.current;
    if (!el) return;
    el.focus({ preventScroll: true });

    // For input/textarea
    const start = el.selectionStart ?? 0;
    const end   = el.selectionEnd   ?? 0;
    const val   = el.value;

    const nativeSetter = Object.getOwnPropertyDescriptor(
      el.tagName === 'TEXTAREA'
        ? window.HTMLTextAreaElement.prototype
        : window.HTMLInputElement.prototype,
      'value'
    )?.set;

    const commit = (newVal: string, newCursor: number) => {
      nativeSetter?.call(el, newVal);
      el.selectionStart = el.selectionEnd = newCursor;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    };

    if (key === 'Enter') {
      if (el.tagName === 'TEXTAREA') {
        commit(val.slice(0, start) + '\n' + val.slice(end), start + 1);
      }
    } else if (key === 'Backspace') {
      if (start !== end) {
        commit(val.slice(0, start) + val.slice(end), start);
      } else if (start > 0) {
        commit(val.slice(0, start - 1) + val.slice(start), start - 1);
      }
    } else if (key === 'Delete') {
      if (start !== end) {
        commit(val.slice(0, start) + val.slice(end), start);
      } else if (start < val.length) {
        commit(val.slice(0, start) + val.slice(start + 1), start);
      }
    } else if (key === 'ArrowLeft') {
      const pos = start !== end ? start : Math.max(0, start - 1);
      el.selectionStart = el.selectionEnd = pos;
    } else if (key === 'ArrowRight') {
      const pos = start !== end ? end : Math.min(val.length, end + 1);
      el.selectionStart = el.selectionEnd = pos;
    } else if (key === 'ArrowUp' || key === 'ArrowDown') {
      // For textarea: find position on previous/next line
      if (el.tagName === 'TEXTAREA') {
        const lines = val.slice(0, start).split('\n');
        const col = lines[lines.length - 1].length;
        if (key === 'ArrowUp') {
          const prevLines = lines.slice(0, -1);
          if (prevLines.length > 0) {
            const newPos = prevLines.slice(0, -1).join('\n').length + (prevLines.length > 1 ? 1 : 0) + Math.min(col, prevLines[prevLines.length - 1].length);
            el.selectionStart = el.selectionEnd = newPos;
          }
        } else {
          const afterLines = val.slice(start).split('\n');
          if (afterLines.length > 1) {
            const newPos = start + (afterLines[0].length - col) + 1 + Math.min(col, afterLines[1].length);
            el.selectionStart = el.selectionEnd = Math.min(newPos, val.length);
          }
        }
      }
    } else if (key === 'Home') {
      const lineStart = val.lastIndexOf('\n', start - 1) + 1;
      el.selectionStart = el.selectionEnd = lineStart;
    } else if (key === 'End') {
      const lineEnd = val.indexOf('\n', start);
      el.selectionStart = el.selectionEnd = lineEnd === -1 ? val.length : lineEnd;
    } else {
      // For keys like F1-F12, Escape, etc. — just dispatch the event
      el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
      el.dispatchEvent(new KeyboardEvent('keyup',   { key, bubbles: true, cancelable: true }));
    }
  };

  const isLetter = (ch: string) => ch.length === 1 && ch.toLowerCase() !== ch.toUpperCase();

  const handleCharacterKey = (base: string, shifted?: string) => {
    const shiftOn = shiftState.active;
    const capsOn  = isCaps;
    let char = base;

    if (isLetter(base)) {
      char = (capsOn !== shiftOn) ? base.toUpperCase() : base.toLowerCase();
    } else if (shiftOn && shifted) {
      char = shifted;
    }

    if (lastContentEditableRef.current) {
      lastContentEditableRef.current.focus({ preventScroll: true });
      document.execCommand('insertText', false, char);
      lastContentEditableRef.current.dispatchEvent(new Event('input', { bubbles: true }));
    } else if (lastTargetRef.current) {
      lastTargetRef.current.focus({ preventScroll: true });
      typeIntoActiveElement(char);
    }

    if (shiftState.active) setShiftState({ active: false, side: null });
  };

  const handleShiftKey = (side: 'left' | 'right') => {
    playStickyKey();
    setShiftState(prev =>
      (prev.active && prev.side === side)
        ? { active: false, side: null }
        : { active: true, side }
    );
  };

  // 🔹 Normal letters / numbers / symbols
  // const handleRegularKey = (key: string) => {
  //   handleCharacterKey(key);
  // };

  const NAV_KEY_MAP: Record<string, string> = {
    ins: 'Insert', hm: 'Home', pup: 'PageUp',
    del: 'Delete', end: 'End', pdn: 'PageDown',
    psc: 'PrintScreen', slk: 'ScrollLock', brk: 'Pause',
    nlk: 'NumLock',
    Esc: 'Escape',
  };

  const handleKeyClick = (key: string) => {
    if (key === 'Windows') {
      openStartMenu();
    } else if (key === 'Calculator') {
      openCalculator();
    } else if (key === 'Caps Lock') {
      playStickyKey();
      setIsCaps(prev => !prev);
    } else if (key === ' ') {
      if (lastTargetRef.current) {
        lastTargetRef.current.focus({ preventScroll: true });
        typeIntoActiveElement(' ');
      }
    } else {
      applyKey(NAV_KEY_MAP[key] ?? key);
    }
  };

  return (
    <div className='keyboard-container' style={keyStyle} onMouseDown={e => { e.preventDefault(); playKeyDown(); }} onMouseUp={playKeyUp}>
      <div className={`keyboard-panel${layout === 'block' ? ' keyboard-panel--block' : ''}`}>
            <div    className={
                `keyboard-main${layout === 'block' ? ' keyboard-main--block' : ''}` +
                (keys === 102 ? ' keyboard-main--102' : '')
            }>

                {/* ROW0 */}
                <div className='keyboard-row row-0'>
                    {ROW0.map((keyObj, index) => (
                        <button
                        key={index}
                        className={
                            'keyboard-key' +
                            ('className' in keyObj && keyObj.className
                                ? ' ' + keyObj.className
                                : '')
                        }
                        onClick={() => {
                            if ('action' in keyObj) {
                            handleKeyClick(keyObj.action as string);
                            } else {
                            handleCharacterKey(keyObj.base, keyObj.shifted);
                            }
                        }}
                        >
                        {'action' in keyObj
                            ? keyObj.icon ?? keyObj.action
                            : keyObj.base}
                        </button>
                    ))}
                </div>

                {/* ROW1 */}
                <div className='keyboard-row'>
                {ROW1.map((keyObj, index) => (
                    <button
                    key={index}
                    className={
                        'keyboard-key' +
                        ('action' in keyObj && keyObj.action === 'Backspace'
                            ? ' keyboard-key--wide'
                            : '') +
                        ('className' in keyObj && keyObj.className
                            ? ' ' + keyObj.className
                            : '')
                    }
                    onClick={() => {
                        if ('action' in keyObj) {
                        handleKeyClick(keyObj.action as string); // 'Backspace'
                        } else {
                        // Characters: numbers, symbols, etc.
                        handleCharacterKey(keyObj.base, keyObj.shifted);
                        }
                    }}

                    >
                    { 'base' in keyObj && keyObj.shifted ? (
                        <>
                        <span className='keyboard-key--shifted'>{keyObj.shifted}</span>
                        <span className='keyboard-key--base'>{keyObj.base}</span>
                        </>
                    ) : 'base' in keyObj ? (
                        keyObj.base
                    ) : (
                        keyObj.icon ?? keyObj.action
                    )}
                    </button>
                ))}   
                </div>

                {/* ROW2 */}
                <div className='keyboard-row'>
                {ROW2.map((keyObj, index) => (
                    <button
                    key={index}
                    className={
                        'keyboard-key' +
                        ('className' in keyObj && keyObj.className
                            ? ' ' + keyObj.className
                            : '')
                    }
                    onClick={() => {
                        if ('action' in keyObj) {
                        handleKeyClick(keyObj.action as string); // 'Tab'
                        } else {
                        handleCharacterKey(keyObj.base, keyObj.shifted);
                        }
                    }}
                    >
                    { 'base' in keyObj && keyObj.shifted ? (
                        <>
                        <span className='keyboard-key--shifted'>{keyObj.shifted}</span>
                        <span className='keyboard-key--base'>{keyObj.base}</span>
                        </>
                    ) : 'base' in keyObj ? (
                        keyObj.base
                    ) : (
                        keyObj.icon ?? keyObj.action
                    )}
                    </button>
                ))}
                </div>

                {/* ROW3 */}
                <div className='keyboard-row'>
                {ROW3.map((keyObj, index) => (
                    <button    
                    key={index}
                    className={
                        'keyboard-key' +
                        ('action' in keyObj && keyObj.action === 'Caps Lock'
                            ? ' keyboard-key--wide'
                            : '') +
                        ('action' in keyObj && keyObj.action === 'Enter'
                            ? ' keyboard-key--wide'
                            : '') +
                        ('action' in keyObj && keyObj.action === 'Caps Lock' && isCaps
                            ? ' keyboard-key--active'
                            : '') +
                        ('className' in keyObj && keyObj.className
                            ? ' ' + keyObj.className
                            : '')
                    }
                    onClick={() => {  
                        if ('action' in keyObj) {
                        handleKeyClick(keyObj.action as string); 
                        } else {
                        handleCharacterKey(keyObj.base, keyObj.shifted);
                        } 
                    }}
                    >
                    { 'base' in keyObj && keyObj.shifted ? (
                        <>
                            <span className='keyboard-key--shifted'>{keyObj.shifted}</span>
                            <span className='keyboard-key--base'>{keyObj.base}</span>
                        </>
                        ) : 'base' in keyObj ? (
                        keyObj.base
                        ) : (
                        keyObj.icon ?? keyObj.action
                        )}
                    </button>  
                ))}
                </div>

                {/* ROW4 */}
                <div className='keyboard-row'>
                {row4.map((keyObj, index) => (
                    <button
                        key={index}
                        className={
                            'keyboard-key' +
                            ('action' in keyObj && keyObj.action === 'Shift'
                                ? ' keyboard-key--wide'
                                : '') +
                            ('action' in keyObj &&
                            keyObj.action === 'Shift' &&
                            keyObj.side === shiftState.side
                                ? ' keyboard-key--active'
                                : '') +
                            ('className' in keyObj && keyObj.className
                                ? ' ' + keyObj.className
                                : '')
                        }
                        onClick={() => {
                            if ('action' in keyObj) {
                                if (keyObj.action === 'Shift') {
                                handleShiftKey(keyObj.side as 'left' | 'right');
                                } else {
                                handleKeyClick(keyObj.action as string);
                                }
                            } else {
                                handleCharacterKey(keyObj.base, keyObj.shifted);
                            }
                    }}

                    >
                    { 'base' in keyObj && keyObj.shifted ? (
                    <>
                    <span className='keyboard-key--shifted'>{keyObj.shifted}</span>
                    <span className='keyboard-key--base'>{keyObj.base}</span>
                    </>
                ) : 'base' in keyObj ? (
                    keyObj.base
                ) : (
                    keyObj.icon ?? keyObj.action
                )}
                    </button>
                ))}
                </div>

                {/* ROW5 */}
                <div className='keyboard-row'>
                {ROW5.map((keyObj, index) => (
                    <button
                        key={index}
                        className={
                            'keyboard-key' +
                            ('base' in keyObj && keyObj.base === ' '
                                ? ' keyboard-key--extra-wide'
                                : ' keyboard-key--wide') +
                            ('className' in keyObj && keyObj.className
                                ? ' ' + keyObj.className
                                : '')
                        }
                        onClick={() => {  
                            if ('action' in keyObj) {
                            handleKeyClick(keyObj.action as string);
                            } else {
                            handleCharacterKey(keyObj.base, keyObj.shifted);
                            }
                        }}
                    >
                    {'base' in keyObj
                        ? keyObj.base === ' '
                            ? ''
                            : keyObj.base
                        : keyObj.icon ?? keyObj.action}
                    </button>

                ))} 
                </div>
            </div>

            {view === 'enhanced' && layout === 'block' && (
                <div className='kbd-block-panel'>
                    {/* row 1: psc slk brk pup pdn */}
                    <button className='keyboard-key keyboard-key--fn  kbp-r1c1' onClick={() => handleKeyClick('psc')}>psc</button>
                    <button className='keyboard-key keyboard-key--modifier kbp-r1c2' onClick={() => handleKeyClick('slk')}>slk</button>
                    <button className='keyboard-key kbp-r1c3' onClick={() => handleKeyClick('brk')}>brk</button>
                    <button className='keyboard-key kbp-r1c4' onClick={() => handleKeyClick('pup')}>pup</button>
                    <button className='keyboard-key kbp-r1c5' onClick={() => handleKeyClick('pdn')}>pdn</button>
                    {/* row 2: nlk / * - ins */}
                    <button className='keyboard-key keyboard-key--modifier kbp-r2c1' onClick={() => handleKeyClick('nlk')}>nlk</button>
                    <button className='keyboard-key kbp-r2c2' onClick={() => handleCharacterKey('/')}>/</button>
                    <button className='keyboard-key kbp-r2c3' onClick={() => handleCharacterKey('*')}>*</button>
                    <button className='keyboard-key kbp-r2c4' onClick={() => handleCharacterKey('-')}>-</button>
                    <button className='keyboard-key kbp-r2c5' onClick={() => handleKeyClick('ins')}>ins</button>
                    {/* row 3: 7 8 9 + hm */}
                    <button className='keyboard-key kbp-r3c1' onClick={() => handleCharacterKey('7')}>7</button>
                    <button className='keyboard-key kbp-r3c2' onClick={() => handleCharacterKey('8')}>8</button>
                    <button className='keyboard-key kbp-r3c3' onClick={() => handleCharacterKey('9')}>9</button>
                    <button className='keyboard-key kbp-r3c4' onClick={() => handleCharacterKey('+')}>+</button>
                    <button className='keyboard-key kbp-r3c5' onClick={() => handleKeyClick('hm')}>hm</button>
                    {/* row 4: 4 5 6 end del */}
                    <button className='keyboard-key kbp-r4c1' onClick={() => handleCharacterKey('4')}>4</button>
                    <button className='keyboard-key kbp-r4c2' onClick={() => handleCharacterKey('5')}>5</button>
                    <button className='keyboard-key kbp-r4c3' onClick={() => handleCharacterKey('6')}>6</button>
                    <button className='keyboard-key kbp-r4c4' onClick={() => handleKeyClick('end')}>end</button>
                    <button className='keyboard-key kbp-r4c5' onClick={() => handleKeyClick('del')}>del</button>
                    {/* row 5: 1 2 3 ← ↑ */}
                    <button className='keyboard-key kbp-r5c1' onClick={() => handleCharacterKey('1')}>1</button>
                    <button className='keyboard-key kbp-r5c2' onClick={() => handleCharacterKey('2')}>2</button>
                    <button className='keyboard-key kbp-r5c3' onClick={() => handleCharacterKey('3')}>3</button>
                    <button className='keyboard-key keyboard-key--modifier kbp-r5c4' onClick={() => handleKeyClick('ArrowLeft')}><img src={ArromLeft} alt='Left' /></button>
                    <button className='keyboard-key keyboard-key--modifier kbp-r5c5' onClick={() => handleKeyClick('ArrowUp')}><img src={ArrowUp} alt='Up' /></button>
                    {/* row 6: 0 . ent ↓ → */}
                    <button className='keyboard-key kbp-r6c1' onClick={() => handleCharacterKey('0')}>0</button>
                    <button className='keyboard-key kbp-r6c2' onClick={() => handleCharacterKey('.')}>.</button>
                    <button className='keyboard-key kbp-r6c3' onClick={() => handleKeyClick('Enter')}>ent</button>
                    <button className='keyboard-key keyboard-key--modifier kbp-r6c4' onClick={() => handleKeyClick('ArrowDown')}><img src={ArrowBottom} alt='Down' /></button>
                    <button className='keyboard-key keyboard-key--modifier kbp-r6c5' onClick={() => handleKeyClick('ArrowRight')}><img src={ArrowRight} alt='Right' /></button>
                </div>



            )}

            {view === 'enhanced' && layout !== 'block' && (
                <>
                    {/* NAVIGATION BLOCK */}
                    <div className='keyboard-nav'>
                        <div className='keyboard-nav-cluster'>
                            {NAV.map((keyObj, index) => (
                            <button
                                key={index}
                                className={
                                    'keyboard-key' +
                                    ('className' in keyObj && keyObj.className ? ' ' + keyObj.className : '')
                                }
                                onClick={() => {
                                    if ('action' in keyObj) handleKeyClick(keyObj.action as string);
                                    else handleCharacterKey(keyObj.base, keyObj.shifted);
                                }}
                            >
                                {'action' in keyObj ? keyObj.icon ?? keyObj.action : keyObj.base}
                            </button>
                            ))}
                        </div>
                        <div className='keyboard-arrows'>
                            <span className='keyboard-arrow-spacer' />
                            <button className='keyboard-key keyboard-key--modifier arrow' onClick={() => handleKeyClick('ArrowUp')}>
                                <img src={ArrowUp} alt='Up' />
                            </button>
                            <span className='keyboard-arrow-spacer' />
                            <button className='keyboard-key keyboard-key--modifier arrow' onClick={() => handleKeyClick('ArrowLeft')}>
                                <img src={ArromLeft} alt='Left' />
                            </button>
                            <button className='keyboard-key keyboard-key--modifier arrow' onClick={() => handleKeyClick('ArrowDown')}>
                                <img src={ArrowBottom} alt='Down' />
                            </button>
                            <button className='keyboard-key keyboard-key--modifier arrow' onClick={() => handleKeyClick('ArrowRight')}>
                                <img src={ArrowRight} alt='Right' />
                            </button>
                        </div>
                    </div>

                    {/* NUMPAD */}
                    <div className='keyboard-numpad'>
                        {NUMPAD.map((keyObj, index) => (
                            <button
                            key={index}
                            className={
                                'keyboard-key' +
                                ('className' in keyObj && keyObj.className ? ' ' + keyObj.className : '')
                            }
                            onClick={() => {
                                if ('action' in keyObj) handleKeyClick(keyObj.action as string);
                                else handleCharacterKey(keyObj.base, keyObj.shifted);
                            }}
                            >
                            {'action' in keyObj ? keyObj.icon ?? keyObj.action : keyObj.base}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    </div>
  );
};


export default KeyboardApp

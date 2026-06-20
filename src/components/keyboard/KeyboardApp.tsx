import { useState, useEffect, useRef, type ReactNode } from "react";
import { typeIntoActiveElement } from './utils/typeIntoActive.Element';
import WindowsKey from '../../img/keyboard/WindowsKey.webp'
import WindowsKeyHover from '../../img/keyboard/WindowsKeyHover.webp'
import CalculatorKey from '../../img/keyboard/CalculatorKey.webp'
import CalculatorKeyHover from '../../img/keyboard/CalculatorKeyHover.webp' 
import ArromLeft from '../../img/keyboard/ArrowLeft.webp' 
import ArrowRight from '../../img/keyboard/ArrowRight.webp' 
import ArrowUp from '../../img/keyboard/ArrowUP.webp' 
import ArrowBottom from '../../img/keyboard/ArrowBottom.webp' 

import "./Keyboard.css";

type BaseKey = {
  base: string;
  shifted?: string;
  className?: string;
};

type ActionKey = {
  action: "Backspace" | "Tab" | "Caps Lock" | "Enter" | "Shift" | "Ctrl" | "Alt" | "Windows" | "Calculator"
    | "Esc" | "F1" | "F2" | "F3" | "F4" | "F5" | "F6" | "F7" | "F8" | "F9" | "F10" | "F11" | "F12"
    | "psc" | "slk" | "brk" | "nlk"
    | "ins" | "hm" | "pup" | "del" | "end" | "pdn"
    | "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight";
  icon?: ReactNode;
  side?: "left" | "right";
  className?: string;
};

type Key = BaseKey | ActionKey;

interface KeyboardAppProps {
    openCalculator: () => void;
    openStartMenu: () => void;
}

const ROW0: Key[] = [
    { action: "Esc", className: "esc"},
    { action: "F1",  className: "keyboard-key--fn" },
    { action: "F2",  className: "keyboard-key--fn" },
    { action: "F3",  className: "keyboard-key--fn" },
    { action: "F4",  className: "keyboard-key--fn f-key" },
    { action: "F5",  className: "keyboard-key--fn" },
    { action: "F6",  className: "keyboard-key--fn" },
    { action: "F7",  className: "keyboard-key--fn" },
    { action: "F8",  className: "keyboard-key--fn f-key" },
    { action: "F9",  className: "keyboard-key--fn" },
    { action: "F10", className: "keyboard-key--fn" },
    { action: "F11", className: "keyboard-key--fn" },
    { action: "F12", className: "keyboard-key--fn" },
];

const ROW1: Key[] = [
  { base: "`", shifted: "~" },
  { base: "1", shifted: "!" },
  { base: "2", shifted: "@" },
  { base: "3", shifted: "#" },
  { base: "4", shifted: "$" },
  { base: "5", shifted: "%" },
  { base: "6", shifted: "^" },
  { base: "7", shifted: "&" },
  { base: "8", shifted: "*" },
  { base: "9", shifted: "(" },
  { base: "0", shifted: ")" },
  { base: "-", shifted: "_" },
  { base: "=", shifted: "+" },
  { action: "Backspace", icon: "bksp"},
];

const ROW2: Key[] = [
  { action: "Tab", icon: "tab"  },
  { base: "q" },
  { base: "w" },
  { base: "e" },
  { base: "r" },
  { base: "t" },
  { base: "y" },
  { base: "u" },
  { base: "i" },
  { base: "o" },
  { base: "p" },
  { base: "[", shifted: "{" },
  { base: "]", shifted: "}" },
  { base: "\\", shifted: "|" },
];

const ROW3: Key[] = [
  { action: "Caps Lock", icon: "lock", className: "keyboard-key--modifier" },
  { base: "a" },
  { base: "s" },
  { base: "d" },
  { base: "f" },
  { base: "g" },
  { base: "h" },
  { base: "j" },
  { base: "k" },
  { base: "l" },
  { base: ";", shifted: ":" },
  { base: "'", shifted: '"' },
  { action: "Enter", icon: "enter" },
];

const ROW4: Key[] = [
  { action: "Shift", side: "left", icon: 'shift', className: 'keyboard-key--modifier'},
  { base: "z" },
  { base: "x" },
  { base: "c" },
  { base: "v" },
  { base: "b" },
  { base: "n" },
  { base: "m" },
  { base: ",", shifted: "<" },
  { base: ".", shifted: ">" },
  { base: "/", shifted: "?" },
  { action: "Shift", side: "right", icon: 'shift', className: "keyboard-key--modifier" },
];

const ROW5: Key[] = [
    { action: "Ctrl", className: "keyboard-key--modifier" },
    { 
        action: "Windows", 
        icon: (
            <span className="key-img-swap">
                <img src={WindowsKey} className="key-img" alt="Windows" />
                <img src={WindowsKeyHover} className="key-img key-img--hover" alt="" />
            </span>
        ), 
        className: "keyboard-key--modifier" 
    },
    { action: "Alt", className: "keyboard-key--modifier" },
    { base: " " }, // Space
    { action: "Alt", className: "keyboard-key--modifier" },
    { action: "Windows", 
        icon: (
            <span className="key-img-swap">
                <img src={WindowsKey} className="key-img" alt="Windows" />
                <img src={WindowsKeyHover} className="key-img key-img--hover" alt="" />
            </span>
        ), 
        className: "keyboard-key--modifier" 
    },
    { action: "Calculator", 
        icon: (
            <span className="key-img-swap">
                <img src={CalculatorKey} className="key-img" alt="Calculator" />
                <img src={CalculatorKeyHover} className="key-img key-img--hover" alt="" />
            </span>
        ), 
        className: "keyboard-key--modifier" 
    },
    { action: "Ctrl", className: "keyboard-key--modifier" },
];

const NAV: Key[] = [
  { action: "psc" }, { action: "slk", className: 'keyboard-key--modifier' }, { action: "brk" },
  { action: "ins" }, { action: "hm" },  { action: "pup" },
  { action: "del" }, { action: "end" }, { action: "pdn" },
];

const NUMPAD: Key[] = [
  { action: "nlk", className: 'keyboard-key--modifier'}, { base: "/" }, { base: "*" }, { base: "-" },
  { base: "7" }, { base: "8" }, { base: "9" }, { base: "+", className: "keyboard-key--tall" },
  { base: "4" }, { base: "5" }, { base: "6" },
  { base: "1" }, { base: "2" }, { base: "3" }, { action: "Enter", icon: "ent", className: "keyboard-key--tall" },
  { base: "0", className: "keyboard-key--wide-num" }, { base: "." },
];

const KeyboardApp = ({openCalculator, openStartMenu}:KeyboardAppProps) => {

  const [isCaps, setIsCaps] = useState(false);
  const [shiftState, setShiftState] = useState<{
    active: boolean;
    side: "left" | "right" | null;
  }>({ active: false, side: null });

  // Track last focused input/textarea outside the keyboard itself
  const lastTargetRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const onFocusIn = (e: FocusEvent) => {
      const el = e.target as HTMLElement;
      if (
        (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') &&
        !el.closest('.keyboard-window')
      ) {
        lastTargetRef.current = el as HTMLInputElement | HTMLTextAreaElement;
      }
    };
    document.addEventListener('focusin', onFocusIn);
    return () => document.removeEventListener('focusin', onFocusIn);
  }, []);

  const applyKey = (key: string) => {
    const el = lastTargetRef.current;
    if (!el) return;
    el.focus({ preventScroll: true });

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

    if (lastTargetRef.current) {
      lastTargetRef.current.focus({ preventScroll: true });
      typeIntoActiveElement(char);
    }

    if (shiftState.active) setShiftState({ active: false, side: null });
  };

  const handleShiftKey = (side: "left" | "right") => {
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
    ins: "Insert", hm: "Home", pup: "PageUp",
    del: "Delete", end: "End", pdn: "PageDown",
    psc: "PrintScreen", slk: "ScrollLock", brk: "Pause",
    nlk: "NumLock",
    Esc: "Escape",
  };

  const handleKeyClick = (key: string) => {
    if (key === "Windows") {
      openStartMenu();
    } else if (key === "Calculator") {
      openCalculator();
    } else if (key === "Caps Lock") {
      setIsCaps(prev => !prev);
    } else if (key === " ") {
      if (lastTargetRef.current) {
        lastTargetRef.current.focus({ preventScroll: true });
        typeIntoActiveElement(" ");
      }
    } else {
      applyKey(NAV_KEY_MAP[key] ?? key);
    }
  };

  return (
    <div className="keyboard-container" onMouseDown={e => e.preventDefault()}>
      <div className="keyboard-panel">
            <div className="keyboard-main">

                {/* ROW0 */}
                <div className="keyboard-row row-0">
                    {ROW0.map((keyObj, index) => (
                        <button
                        key={index}
                        className={
                            "keyboard-key" +
                            ("className" in keyObj && keyObj.className
                                ? " " + keyObj.className
                                : "")
                        }
                        onClick={() => {
                            if ("action" in keyObj) {
                            handleKeyClick(keyObj.action as string);
                            } else {
                            handleCharacterKey(keyObj.base, keyObj.shifted);
                            }
                        }}
                        >
                        {"action" in keyObj
                            ? keyObj.icon ?? keyObj.action
                            : keyObj.base}
                        </button>
                    ))}
                </div>

                {/* ROW1 */}
                <div className="keyboard-row">
                {ROW1.map((keyObj, index) => (
                    <button
                    key={index}
                        className={
                        "keyboard-key" +
                        ("action" in keyObj && keyObj.action === "Backspace"
                            ? " keyboard-key--wide"
                            : "")
                        }
                    onClick={() => {
                        if ("action" in keyObj) {
                        handleKeyClick(keyObj.action as string); // "Backspace"
                        } else {
                        // Characters: numbers, symbols, etc.
                        handleCharacterKey(keyObj.base, keyObj.shifted);
                        }
                    }}

                    >
                    { "base" in keyObj && keyObj.shifted ? (
                        <>
                        <span className="keyboard-key--shifted">{keyObj.shifted}</span>
                        <span className="keyboard-key--base">{keyObj.base}</span>
                        </>
                    ) : "base" in keyObj ? (
                        keyObj.base
                    ) : (
                        keyObj.icon ?? keyObj.action
                    )}
                    </button>
                ))}   
                </div>

                {/* ROW2 */}
                <div className="keyboard-row">
                {ROW2.map((keyObj, index) => (
                    <button
                    key={index}
                    className="keyboard-key"
                    onClick={() => {
                        if ("action" in keyObj) {
                        handleKeyClick(keyObj.action as string); // "Tab"
                        } else {
                        handleCharacterKey(keyObj.base, keyObj.shifted);
                        }
                    }}
                    >
                    { "base" in keyObj && keyObj.shifted ? (
                        <>
                        <span className="keyboard-key--shifted">{keyObj.shifted}</span>
                        <span className="keyboard-key--base">{keyObj.base}</span>
                        </>
                    ) : "base" in keyObj ? (
                        keyObj.base
                    ) : (
                        keyObj.icon ?? keyObj.action
                    )}
                    </button>
                ))}
                </div>

                {/* ROW3 */}
                <div className="keyboard-row">
                {ROW3.map((keyObj, index) => (
                    <button    
                    key={index}
                    className={
                        "keyboard-key" +
                        ("action" in keyObj && keyObj.action === "Caps Lock"
                            ? " keyboard-key--wide"
                            : "") +
                        ("action" in keyObj && keyObj.action === "Enter"
                            ? " keyboard-key--wide"
                            : "") +
                        ("action" in keyObj && keyObj.action === "Caps Lock" && isCaps
                            ? " keyboard-key--active"
                            : "") +
                        ("className" in keyObj && keyObj.className
                            ? " " + keyObj.className
                            : "")
                    }
                    onClick={() => {  
                        if ("action" in keyObj) {
                        handleKeyClick(keyObj.action as string); // "Caps Lock" nebo "Enter"
                        } else {
                        handleCharacterKey(keyObj.base, keyObj.shifted);
                        } 
                    }}
                    >
                    { "base" in keyObj && keyObj.shifted ? (
                        <>
                            <span className="keyboard-key--shifted">{keyObj.shifted}</span>
                            <span className="keyboard-key--base">{keyObj.base}</span>
                        </>
                        ) : "base" in keyObj ? (
                        keyObj.base
                        ) : (
                        keyObj.icon ?? keyObj.action
                        )}
                    </button>  
                ))}
                </div>

                {/* ROW4 */}
                <div className="keyboard-row">
                {ROW4.map((keyObj, index) => (
                    <button
                        key={index}
                        className={
                            "keyboard-key" +
                            ("action" in keyObj && keyObj.action === "Shift"
                                ? " keyboard-key--wide"
                                : "") +
                            ("action" in keyObj &&
                            keyObj.action === "Shift" &&
                            keyObj.side === shiftState.side
                                ? " keyboard-key--active"
                                : "") +
                            ("className" in keyObj && keyObj.className
                                ? " " + keyObj.className
                                : "")
                        }
                        onClick={() => {
                            if ("action" in keyObj) {
                                if (keyObj.action === "Shift") {
                                handleShiftKey(keyObj.side as "left" | "right");
                                } else {
                                handleKeyClick(keyObj.action as string);
                                }
                            } else {
                                handleCharacterKey(keyObj.base, keyObj.shifted);
                            }
                    }}

                    >
                    { "base" in keyObj && keyObj.shifted ? (
                    <>
                    <span className="keyboard-key--shifted">{keyObj.shifted}</span>
                    <span className="keyboard-key--base">{keyObj.base}</span>
                    </>
                ) : "base" in keyObj ? (
                    keyObj.base
                ) : (
                    keyObj.icon ?? keyObj.action
                )}
                    </button>
                ))}
                </div>

                {/* ROW5 */}
                <div className="keyboard-row">
                {ROW5.map((keyObj, index) => (
                    <button
                        key={index}
                        className={
                            "keyboard-key" +
                            ("base" in keyObj && keyObj.base === " "
                                ? " keyboard-key--extra-wide"
                                : " keyboard-key--wide") +
                            ("className" in keyObj && keyObj.className
                                ? " " + keyObj.className
                                : "")
                        }
                        onClick={() => {  
                            if ("action" in keyObj) {
                            handleKeyClick(keyObj.action as string);
                            } else {
                            handleCharacterKey(keyObj.base, keyObj.shifted);
                            }
                        }}
                    >
                    {"base" in keyObj
                        ? keyObj.base === " "
                            ? ""
                            : keyObj.base
                        : keyObj.icon ?? keyObj.action}
                    </button>

                ))} 
                </div>
            </div>

            {/* NAVIGATION BLOCK */}
                <div className="keyboard-nav">
                    <div className="keyboard-nav-cluster">
                        {NAV.map((keyObj, index) => (
                        <button
                            key={index}
                            className={
                                "keyboard-key" +
                                ("className" in keyObj && keyObj.className ? " " + keyObj.className : "")
                            }
                            onClick={() => {
                                if ("action" in keyObj) handleKeyClick(keyObj.action as string);
                                else handleCharacterKey(keyObj.base, keyObj.shifted);
                            }}
                        >
                            {"action" in keyObj ? keyObj.icon ?? keyObj.action : keyObj.base}
                        </button>
                        ))}
                        </div>
                    <div className="keyboard-arrows">
                        <span className="keyboard-arrow-spacer" />
                        <button className="keyboard-key keyboard-key--modifier" onClick={() => handleKeyClick("ArrowUp")}>
                            <img src={ArrowUp} alt="Up" />
                        </button>
                        <span className="keyboard-arrow-spacer" />
                        <button className="keyboard-key keyboard-key--modifier" onClick={() => handleKeyClick("ArrowLeft")}>
                            <img src={ArromLeft} alt="Left" />
                        </button>
                        <button className="keyboard-key keyboard-key--modifier" onClick={() => handleKeyClick("ArrowDown")}>
                            <img src={ArrowBottom} alt="Down" />
                        </button>
                        <button className="keyboard-key keyboard-key--modifier" onClick={() => handleKeyClick("ArrowRight")}>
                            <img src={ArrowRight} alt="Right" />
                        </button>
                    </div>
                </div>

                {/* NUMPAD */}
                <div className="keyboard-numpad">
                {NUMPAD.map((keyObj, index) => (
                    <button
                    key={index}
                    className={
                        "keyboard-key" +
                        ("className" in keyObj && keyObj.className ? " " + keyObj.className : "")
                    }
                    onClick={() => {
                        if ("action" in keyObj) handleKeyClick(keyObj.action as string);
                        else handleCharacterKey(keyObj.base, keyObj.shifted);
                    }}
                    >
                    {"action" in keyObj ? keyObj.icon ?? keyObj.action : keyObj.base}
                    </button>
                ))}
            </div>    
        </div>
    </div>
  );
};

export default KeyboardApp

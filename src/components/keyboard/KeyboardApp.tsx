import { useRef, useState, useEffect, type ReactNode } from "react";
import "./Keyboard.css";

type BaseKey = {
  base: string;
  shifted?: string;
  className?: string;
};

type ActionKey = {
  action: "Backspace" | "Tab" | "Caps Lock" | "Enter" | "Shift" | "Ctrl" | "Alt";
  icon?: ReactNode;
  side?: "left" | "right";
  className?: string;
};

type Key = BaseKey | ActionKey;

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
  { action: "Alt", className: "keyboard-key--modifier" },
  { base: " " }, // Space
  { action: "Alt", className: "keyboard-key--modifier" },
  { action: "Ctrl", className: "keyboard-key--modifier" },
];


const KeyboardApp = () => {

  const [inputText, setInputText] = useState("");
  const [isCaps, setIsCaps] = useState(false);
  const [shiftState, setShiftState] = useState<{
    active: boolean;
    side: "left" | "right" | null;
  }>({ active: false, side: null });

  //🔹 Textarea
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // 🔹 Helper to check if a character is a letter
   const isLetter = (ch: string): boolean => {
    return ch.length === 1 && ch.toLowerCase() !== ch.toUpperCase();
  };

  // 🔹 Character keys (letters, numbers, symbols)
  const handleCharacterKey = (base: string, shifted?: string) => {
    let charToAdd = base;

    const shiftOn = shiftState.active;  
    const capsOn = isCaps;

    if (isLetter(base)) {
      // 🔤 LETTERS 
      // Caps XOR Shift → choice of uppercase/lowercase
      const shouldUppercase =
        (capsOn && !shiftOn) || (!capsOn && shiftOn);

      charToAdd = shouldUppercase
        ? base.toUpperCase()
        : base.toLowerCase();
    } else {
      // 🔢 NUMBERS / SYMBOLS– Caps do not affect them, Shift switch base/shifted
      if (shiftOn && shifted) {
        charToAdd = shifted;
      } else {
        charToAdd = base;
      }
    }

    setInputText(prev => prev + charToAdd);

    // Shift is one-time use
    if (shiftState.active) {
      setShiftState({ active: false, side: null });
    }
  };

  // 🔹 Shift
  const handleShiftKey = (side: "left" | "right") => {
  setShiftState(prev => 
    (prev.active && prev.side === side)
      ? { active: false, side: null }
      : { active: true, side: side }
  );
};

  // 🔹 Space
  const handleSpaceKey = () => {
    setInputText(prev => prev + " "); 
  };

  // 🔹 Enter
  const handleEnterKey = () => {
    setInputText(prev => prev + "\n");
  };

  // 🔹 Tab 
  const handleTabKey = () => {
    setInputText(prev => prev + "\t");
  };

  // 🔹 Backspace
  const handleBackspaceKey = () => {
    setInputText(prev => prev.slice(0, -1));
  };

  // 🔹 Caps Lock
  const handleCapsLockKey = () => {
    setIsCaps(prev => !prev);
  };

  // 🔹 Normal letters / numbers / symbols
  // const handleRegularKey = (key: string) => {
  //   handleCharacterKey(key);
  // };


  // 🔹 The main key router
  const handleKeyClick = (key: string) => {
    if (key === "Enter") {
      handleEnterKey();
    } else if (
      key === "Ctrl" ||   
      key === "Alt" ||
      key === "Delete" ||
      key === "ArrowUp" ||
      key === "ArrowDown" ||
      key === "ArrowLeft" ||
      key === "ArrowRight"
    ) {
      // Do nothing for these keys for now
    } else if (key === " ") {  
      handleSpaceKey();
    } else if (key === "Caps Lock") {
      handleCapsLockKey();
    } else if (key === "Tab") {
      handleTabKey();
    } else if (key === "Backspace") {
      handleBackspaceKey();
    }
  };

  return (
    <div className="keyboard-container">
      <textarea
        className="keyboard-display"
        value={inputText}
        readOnly
      />
      <div className="keyboard-panel">

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
                : keyObj.action}
            </button>
          ))} 
        </div>    

      </div>
    </div>
  );
};

export default KeyboardApp

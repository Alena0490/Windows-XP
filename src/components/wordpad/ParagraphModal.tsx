import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import useDraggable from '../../hooks/useDraggable';
import useSound from '../../hooks/useSound';

import '../keyboard/FontModal.css';
import './ParagraphModal.css'
import '../../App.css';
interface ParagraphModalProps {
    onClose:      () => void;
    style?:       React.CSSProperties;
    globalVolume: number;
    globalMuted:  boolean;
    plusTheme?:   'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
    onApply:      (values: { left: string; right: string; firstLine: string; alignment: string }) => void;
    initialValues?: { left: string; right: string; firstLine: string; alignment: string };
}

const ParagraphModal = ({
  onClose, 
  style, 
  globalVolume, 
  globalMuted, 
  plusTheme,
  onApply,
  initialValues
}:ParagraphModalProps) => {
  const initialX = typeof style?.left === 'number' ? style.left : Math.round(window.innerWidth  / 2 - 140);
  const initialY = typeof style?.top  === 'number' ? style.top  : Math.round(window.innerHeight / 2 - 70);
  const { position, handleMouseDown } = useDraggable(initialX, initialY);

  const [left,      setLeft]      = useState(initialValues?.left      ?? '0"');
  const [right,     setRight]     = useState(initialValues?.right     ?? '0"');
  const [firstLine, setFirstLine] = useState(initialValues?.firstLine ?? '0"');
  const [alignment, setAlignment] = useState(initialValues?.alignment ?? 'Left');
  const [alignmentOpen, setAlignmentOpen] = useState(false);
  const [alignmentListPos, setAlignmentListPos] = useState({ top: 0, left: 0, width: 0 });

  const alignmentTriggerRef = useRef<HTMLDivElement>(null);
  const alignmentListRef = useRef<HTMLUListElement>(null);

  const sounds = useSound(globalVolume, globalMuted);
  const themeSound = plusTheme === 'aquarium' ? sounds.aquarium
    : plusTheme === 'davinci' ? sounds.daVinci
    : plusTheme === 'nature' ? sounds.nature
    : plusTheme === 'space' ? sounds.space
    : null;
  const playStartMenu = () => themeSound ? themeSound.playMenuCmd() : sounds.playStartMenu();

  useEffect(() => {
  if (!alignmentOpen || !alignmentTriggerRef.current) return;

  const r = alignmentTriggerRef.current.getBoundingClientRect();
  setAlignmentListPos({ top: r.bottom, left: r.left, width: r.width });
}, [alignmentOpen]);

  return (
     <div
            className='app-window find-replace-dialog'
            style={{ left: position.x, top: position.y }}
            tabIndex={-1}
            onMouseDown={e => e.stopPropagation()}
        >
          {/* Title bar */}
          <div className='title-bar' onMouseDown={handleMouseDown}>
              <span className='title-bar-text'>Paragraph</span>
              <div className='title-bar-buttons xp-title-controls'>
                  <button type='button' className='xp-title-control btn-help'  aria-label='Help'>?</button>
                  <button type='button' className='xp-title-control btn-close' aria-label='Close' onClick={onClose}>✕</button>
              </div>
          </div>

            {/* Body */}
            <div className='paragraph-modal-body'>
              <div className='paragraph-modal-main'>
                   <fieldset className='fm-sample-frame'>
                    <legend className='fm-sample-legend'>Indentation</legend>
                    <label htmlFor="left">
                      <span className='mnemonic'>L</span>eft:
                      <input type="text" id='left' value={left} onChange={e => setLeft(e.target.value)} />
                    </label>

                   <label htmlFor="right">
                      <span className='mnemonic'>R</span>ight:
                      <input type="text" id='right' value={right} onChange={e => setRight(e.target.value)} />
                    </label>

                    <label htmlFor="first-line">
                      <span className='mnemonic'>F</span>irst line:
                      <input type="text" id='first-line' value={firstLine} onChange={e => setFirstLine(e.target.value)} />
                    </label>
                  </fieldset>

                  <label htmlFor='alignment' className='paragraph-alignment-row'>
                    <span className='mnemonic'>A</span>lignment:
                    <div className='xp-select-wrapper'>
                      <div
                        className="fm-color-trigger"
                        onClick={() => setAlignmentOpen(o => !o)}
                        ref={alignmentTriggerRef}
                      >
                        <span className="fm-color-name">{alignment}</span>
                        <span className="xp-select-arrow" aria-hidden="true" />
                      </div>

                      {alignmentOpen && createPortal(
                        <ul
                          ref={alignmentListRef}
                          className="fm-color-list paragraph-select-list"
                          style={{
                            top: alignmentListPos.top,
                            left: alignmentListPos.left,
                            minWidth: alignmentListPos.width,
                          }}
                        >
                          {['Left', 'Center', 'Right', 'Justify'].map(value => (
                            <li
                              key={value}
                              className={`fm-color-item paragraph-select-item${value === alignment ? ' fm-color-item--selected' : ''}`}
                              onClick={() => {
                                playStartMenu();
                                setAlignment(value);
                                setAlignmentOpen(false);
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
              </div>
              {/* Action buttons */}
                    <div className='buttons'>
                        <button
                            type='button'
                            className='luna-btn'
                            onClick={() => {
                                playStartMenu();
                                onApply({ left, right, firstLine, alignment });
                                onClose();
                            }}
                        >
                            OK
                        </button>
                        <button 
                          type='button' 
                          className='luna-btn secondary' 
                          onClick={() => { playStartMenu(); onClose(); }}
                        >
                            Cancel
                        </button>
                    </div>
            </div>
    </div>
  )
}

export default ParagraphModal
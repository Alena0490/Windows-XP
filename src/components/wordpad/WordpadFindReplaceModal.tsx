import { useState, useRef } from 'react';
import useDraggable from '../../hooks/useDraggable';
import useSound from '../../hooks/useSound';
import CriticalError from '../CriticalError';
import '../notepad/FindReplaceModal.css';
import '../../App.css';

interface WordpadFindReplaceProps {
    onClose: () => void;
    style?: React.CSSProperties;
    editorRef: React.RefObject<HTMLDivElement | null>;
    mode: 'find' | 'replace';
    globalVolume: number;
    globalMuted: boolean;
    plusTheme?: 'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
}

const WordpadFindReplaceModal = ({ style, onClose, editorRef, mode, globalVolume, globalMuted, plusTheme }: WordpadFindReplaceProps) => {
    const initialX = typeof style?.left === 'number'
        ? style.left
        : Math.round(window.innerWidth / 2 - 140);

    const initialY = typeof style?.top === 'number'
        ? style.top
        : Math.round(window.innerHeight / 2 - 70);

    const { position, handleMouseDown } = useDraggable(initialX, initialY);

    const [findText, setFindText] = useState('');
    const [replaceText, setReplaceText] = useState('');
    const [matchCase, setMatchCase] = useState(false);
    const [wrapAround, setWrapAround] = useState(true);
    const [direction, setDirection] = useState<'up' | 'down'>('down');
    const lastRangeRef = useRef<Range | null>(null);
    const [notFound, setNotFound] = useState(false);
    const sounds = useSound(globalVolume, globalMuted);
    const themeSound = plusTheme === 'aquarium' ? sounds.aquarium
        : plusTheme === 'davinci' ? sounds.daVinci
        : plusTheme === 'nature' ? sounds.nature
        : plusTheme === 'space' ? sounds.space
        : null;
    const playExclamation = () => themeSound ? themeSound.playExclamation() : sounds.playExclamation();

    const findInEditor = (startAfterRange?: Range): Range | null => {
        const el = editorRef.current;
        if (!el || !findText) return null;
        const search = matchCase ? findText : findText.toLowerCase();

        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        const textNodes: Text[] = [];
        let node: Node | null;
        while ((node = walker.nextNode())) textNodes.push(node as Text);

        const fullText = textNodes.map(n => matchCase ? n.textContent ?? '' : (n.textContent ?? '').toLowerCase()).join('');
        const offsets: number[] = [];
        let acc = 0;
        for (const n of textNodes) { offsets.push(acc); acc += (n.textContent ?? '').length; }

        let searchFrom = 0;
        if (startAfterRange) {
            for (let i = 0; i < textNodes.length; i++) {
                if (textNodes[i] === startAfterRange.endContainer) {
                    searchFrom = offsets[i] + startAfterRange.endOffset;
                    break;
                }
            }
        }

        const tryFind = (from: number): number => {
            if (direction === 'up') {
                let idx = -1;
                const pos = fullText.lastIndexOf(search, from - 1);
                if (pos !== -1) idx = pos;
                return idx;
            }
            return fullText.indexOf(search, from);
        };

        let idx = tryFind(direction === 'up' ? searchFrom : searchFrom);
        if (idx === -1 && wrapAround) idx = tryFind(direction === 'up' ? fullText.length : 0);
        if (idx === -1) return null;

        const nodeAt = (charIdx: number) => {
            let i = offsets.length - 1;
            while (i > 0 && offsets[i] > charIdx) i--;
            return { node: textNodes[i], offset: charIdx - offsets[i] };
        };

        const start = nodeAt(idx);
        const end = nodeAt(idx + search.length);
        const range = document.createRange();
        range.setStart(start.node, start.offset);
        range.setEnd(end.node, end.offset);
        return range;
    };

    const handleFindNext = () => {
        const range = findInEditor(lastRangeRef.current ?? undefined);
        if (!range) { playExclamation(); setNotFound(true); return; }
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
        lastRangeRef.current = range;
        (range.startContainer as Element).parentElement?.scrollIntoView?.({ block: 'nearest' });
    };

    const handleReplace = () => {
        const el = editorRef.current;
        if (!el || !findText) return;
        const stored = lastRangeRef.current;
        if (stored) {
            const selected = stored.toString();
            const matches = matchCase ? selected === findText : selected.toLowerCase() === findText.toLowerCase();
            if (matches) {
                stored.deleteContents();
                stored.insertNode(document.createTextNode(replaceText));
                lastRangeRef.current = null;
                el.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
        handleFindNext();
    };

    const handleReplaceAll = () => {
        const el = editorRef.current;
        if (!el || !findText) return;
        const flags = matchCase ? 'g' : 'gi';
        const escaped = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escaped, flags);

        const replaceInNode = (node: Node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent ?? '';
                if (regex.test(text)) {
                    regex.lastIndex = 0;
                    const newText = text.replace(regex, replaceText);
                    node.textContent = newText;
                }
            } else {
                node.childNodes.forEach(replaceInNode);
            }
        };

        replaceInNode(el);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.focus();
    };

    return (
        <>
        <div
            className='app-window find-replace-dialog'
            style={{ left: position.x, top: position.y }}
            tabIndex={-1}
        >
            <div className='title-bar' onMouseDown={handleMouseDown}>
                <span className='title-bar-text'>{mode === 'find' ? 'Find' : 'Replace'}</span>
                <div className='title-bar-buttons xp-title-controls'>
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

            <div className='find-replace-body'>
                <div className='find-replace-fields'>
                    <div className='find-replace-row'>
                        <label htmlFor='wp-find-input'>Find what:</label>
                        <input
                            id='wp-find-input'
                            type='text'
                            value={findText}
                            onChange={e => setFindText(e.target.value)}
                            autoFocus
                        />
                    </div>

                    {mode === 'replace' && (
                        <div className='find-replace-row'>
                            <label htmlFor='wp-replace-input'>Replace with:</label>
                            <input
                                id='wp-replace-input'
                                type='text'
                                value={replaceText}
                                onChange={e => setReplaceText(e.target.value)}
                            />
                        </div>
                    )}

                    <div className='find-replace-lower'>
                        <div className='find-replace-checks'>
                            <label className='find-replace-checkbox' htmlFor='wp-match-case'>
                                <input
                                    id='wp-match-case'
                                    type='checkbox'
                                    checked={matchCase}
                                    onChange={e => setMatchCase(e.target.checked)}
                                />
                                <span>Match case</span>
                            </label>

                            {mode === 'find' && (
                                <label className='find-replace-checkbox' htmlFor='wp-wrap-around'>
                                    <input
                                        id='wp-wrap-around'
                                        type='checkbox'
                                        checked={wrapAround}
                                        onChange={e => setWrapAround(e.target.checked)}
                                    />
                                    <span>Wrap around</span>
                                </label>
                            )}
                        </div>

                        {mode === 'find' && (
                            <div className='find-replace-direction'>
                                <span>Direction</span>
                                <div className='direction-labels'>
                                    <label>
                                        <input
                                            type='radio'
                                            name='wp-direction'
                                            value='up'
                                            checked={direction === 'up'}
                                            onChange={() => setDirection('up')}
                                        />
                                        Up
                                    </label>
                                    <label>
                                        <input
                                            type='radio'
                                            name='wp-direction'
                                            value='down'
                                            checked={direction === 'down'}
                                            onChange={() => setDirection('down')}
                                        />
                                        Down
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className='find-replace-actions'>
                    <button
                        type='button'
                        className='find-replace-btn'
                        onClick={handleFindNext}
                        disabled={!findText}
                    >
                        Find Next
                    </button>
                    {mode === 'replace' && (
                        <button
                            type='button'
                            className='find-replace-btn'
                            onClick={handleReplace}
                            disabled={!findText}
                        >
                            Replace
                        </button>
                    )}
                    {mode === 'replace' && (
                        <button
                            type='button'
                            className='find-replace-btn'
                            onClick={handleReplaceAll}
                            disabled={!findText}
                        >
                            Replace All
                        </button>
                    )}
                    <button
                        type='button'
                        className='find-replace-btn'
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>

        {notFound && (
            <CriticalError
                type='textNotFound'
                onClose={() => setNotFound(false)}
                messageOverride={[`Cannot find "${findText}"`]}
            />
        )}
        </>
    );
};

export default WordpadFindReplaceModal;

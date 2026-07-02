import { useState, useRef, useEffect } from 'react';

const PAGE_WIDTH    = 700;
const EDITOR_PADDING = 16; // matches .text-window padding: var(--space-8)

interface WordpadRulerProps {
    editorRef: React.RefObject<HTMLDivElement | null>;
    onChanges: () => void;
}

const WordpadRuler = ({ editorRef, onChanges }: WordpadRulerProps) => {
    const [leftIndent,  setLeftIndent]  = useState(EDITOR_PADDING);
    const [rightIndent, setRightIndent] = useState(EDITOR_PADDING);
    const draggingRef = useRef<'left' | 'right' | null>(null);
    const rulerRef    = useRef<HTMLDivElement>(null);

    const startDrag = (which: 'left' | 'right') => (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        draggingRef.current = which;
    };

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            if (!draggingRef.current || !rulerRef.current || !editorRef.current) return;
            const rect = rulerRef.current.getBoundingClientRect();
            const pos  = e.clientX - rect.left;

            if (draggingRef.current === 'left') {
                const clamped = Math.max(0, Math.min(PAGE_WIDTH - rightIndent - 20, pos));
                setLeftIndent(clamped);
                editorRef.current.style.paddingLeft = clamped + 'px';
            } else {
                const rightVal = Math.max(0, Math.min(PAGE_WIDTH - leftIndent - 20, PAGE_WIDTH - pos));
                setRightIndent(rightVal);
                editorRef.current.style.paddingRight = rightVal + 'px';
            }
            onChanges();
        };

        const onUp = () => { draggingRef.current = null; };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup',   onUp);
        return () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup',   onUp);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [leftIndent, rightIndent]);

    return (
        <div className='rulers'>
            <div className='ruler' ref={rulerRef}>
                {/* Left indent slider */}
                <div
                    className='ruler-slider ruler-slider--left'
                    onMouseDown={startDrag('left')}
                    style={{ '--drag-x': leftIndent + 'px' } as React.CSSProperties}
                >
                    <div className='top' />
                    <div className='bottom' />
                    <div className='under' />
                </div>

                {/* Right indent slider */}
                <div
                    className='ruler-slider ruler-slider--right'
                    onMouseDown={startDrag('right')}
                    style={{ '--drag-x': rightIndent + 'px' } as React.CSSProperties}
                >
                    <div className='bottom' />
                </div>
            </div>
        </div>
    );
};

export default WordpadRuler;

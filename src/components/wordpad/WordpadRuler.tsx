import { useState, useRef, useEffect } from 'react';

const PAGE_WIDTH = 700;

interface WordpadRulerProps {
    editorRef: React.RefObject<HTMLDivElement | null>;
    onChanges: () => void;
}

const WordpadRuler = ({ editorRef, onChanges }: WordpadRulerProps) => {
    const [leftIndent, setLeftIndent] = useState(0);
    const [rightIndent, setRightIndent] = useState(0);
    const draggingRef = useRef<'left' | 'right' | null>(null);
    const rulerRef = useRef<HTMLDivElement>(null);

    // Find the active paragraph or text node's closest block
    const getActiveBlock = (): HTMLElement | null => {
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return editorRef.current ?? null;
        let node: Node | null = sel.anchorNode;
        while (node && node !== editorRef.current) {
            if (node instanceof HTMLElement &&
                ['P', 'DIV', 'LI', 'H1', 'H2', 'H3'].includes(node.tagName)) {
                return node;
            }
            node = node.parentNode;
        }
        return editorRef.current ?? null;
    };

    const startDrag = (which: 'left' | 'right') => (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        draggingRef.current = which;
    };

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            if (!draggingRef.current || !rulerRef.current || !editorRef.current) return;
            const rect = rulerRef.current.getBoundingClientRect();
            let pos = e.clientX - rect.left;
            pos = Math.max(0, Math.min(PAGE_WIDTH, pos));

            const block = getActiveBlock();
            if (draggingRef.current === 'left') {
                setLeftIndent(pos);
                if (block) {
                    block.style.paddingLeft = pos + 'px';
                }
            } else if (draggingRef.current === 'right') {
                const rightIndentVal = PAGE_WIDTH - pos;
                setRightIndent(rightIndentVal);
                if (block) {
                    block.style.paddingRight = rightIndentVal + 'px';
                }
            }
            onChanges();
        };
        const onUp = () => { draggingRef.current = null; };
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
        return () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="rulers">
            <div className="ruler" ref={rulerRef}>
                <div
                    className="ruler-slider ruler-slider--left"
                    onMouseDown={startDrag('left')}
                    style={{ '--drag-x': leftIndent + 'px' } as React.CSSProperties}
                >
                    <div className="top"></div>
                    <div className="bottom"></div>
                    <div className="under"></div>
                </div>
                <div
                    className="ruler-slider ruler-slider--right"
                    onMouseDown={startDrag('right')}
                    style={{ '--drag-x': rightIndent + 'px' } as React.CSSProperties}
                >
                    <div className="bottom"></div>
                </div>
            </div>
        </div>
    );
};

export default WordpadRuler;
import { useRef, useEffect, useCallback, useState } from 'react';
import './XPScrollbar.css';

interface XPScrollbarProps {
    children: React.ReactNode;
    className?: string;
    direction?: 'vertical' | 'horizontal';
    style?: React.CSSProperties;
}

const STEP = 40;
const REPEAT_DELAY = 400;
const REPEAT_INTERVAL = 50;

const XPScrollbar = ({ children, className = '', direction = 'vertical', style }: XPScrollbarProps) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const railRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);
    const repeatTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const repeatInterval = useRef<ReturnType<typeof setInterval> | null>(null);
    const dragStart = useRef<{ pos: number; scroll: number } | null>(null);
    const [thumbStyle, setThumbStyle] = useState<React.CSSProperties>({ top: 0, height: 20 });
    const [dragging, setDragging] = useState(false);
    const horiz = direction === 'horizontal';

    const updateThumb = useCallback(() => {
        const el = contentRef.current;
        const rail = railRef.current;
        if (!el || !rail) return;
        if (horiz) {
            const ratio = el.scrollWidth > el.clientWidth
                ? el.clientWidth / el.scrollWidth : 1;
            const railW = rail.clientWidth;
            const thumbW = Math.max(20, railW * ratio);
            const scrollRatio = el.scrollWidth - el.clientWidth > 0
                ? el.scrollLeft / (el.scrollWidth - el.clientWidth) : 0;
            setThumbStyle({ left: scrollRatio * (railW - thumbW), width: thumbW });
        } else {
            const ratio = el.scrollHeight > el.clientHeight
                ? el.clientHeight / el.scrollHeight : 1;
            const railH = rail.clientHeight;
            const thumbH = Math.max(20, railH * ratio);
            const scrollRatio = el.scrollHeight - el.clientHeight > 0
                ? el.scrollTop / (el.scrollHeight - el.clientHeight) : 0;
            setThumbStyle({ top: scrollRatio * (railH - thumbH), height: thumbH });
        }
    }, [horiz]);

    useEffect(() => {
        const el = contentRef.current;
        if (!el) return;
        const ro = new ResizeObserver(updateThumb);
        ro.observe(el);
        el.addEventListener('scroll', updateThumb, { passive: true });
        updateThumb();
        return () => { ro.disconnect(); el.removeEventListener('scroll', updateThumb); };
    }, [updateThumb]);

    const clearRepeat = () => {
        if (repeatTimer.current) clearTimeout(repeatTimer.current);
        if (repeatInterval.current) clearInterval(repeatInterval.current);
    };

    const startScroll = (delta: number) => {
        const el = contentRef.current;
        if (!el) return;
        const scroll = () => horiz
            ? el.scrollBy({ left: delta })
            : el.scrollBy({ top: delta });
        scroll();
        repeatTimer.current = setTimeout(() => {
            repeatInterval.current = setInterval(scroll, REPEAT_INTERVAL);
        }, REPEAT_DELAY);
    };

    const onArrowDown = (delta: number) => (e: React.MouseEvent) => {
        e.preventDefault();
        startScroll(delta);
    };

    const onMouseUp = () => clearRepeat();

    const onThumbMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        const el = contentRef.current;
        const rail = railRef.current;
        if (!el || !rail) return;
        dragStart.current = horiz
            ? { pos: e.clientX, scroll: el.scrollLeft }
            : { pos: e.clientY, scroll: el.scrollTop };
        setDragging(true);
    };

    useEffect(() => {
        if (!dragging) return;
        const onMove = (e: MouseEvent) => {
            const el = contentRef.current;
            const rail = railRef.current;
            if (!el || !rail || !dragStart.current) return;
            if (horiz) {
                const delta = e.clientX - dragStart.current.pos;
                const ratio = el.scrollWidth / rail.clientWidth;
                el.scrollLeft = dragStart.current.scroll + delta * ratio;
            } else {
                const delta = e.clientY - dragStart.current.pos;
                const ratio = el.scrollHeight / rail.clientHeight;
                el.scrollTop = dragStart.current.scroll + delta * ratio;
            }
        };
        const onUp = () => { setDragging(false); dragStart.current = null; };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    }, [dragging, horiz]);

    return (
        <div
            className={`xp-scroll-wrap${horiz ? ' xp-scroll-wrap--horiz' : ''} ${className}`}
            style={style}
        >
            <div ref={contentRef} className='xp-scroll-content'>
                {children}
            </div>
            <div className='xp-scrollbar-track'>
                <button
                    className={`xp-scrollbar-arrow ${horiz ? 'xp-scrollbar-arrow--left' : 'xp-scrollbar-arrow--up'}`}
                    onMouseDown={onArrowDown(horiz ? -STEP : -STEP)}
                    onMouseUp={onMouseUp}
                    onMouseLeave={onMouseUp}
                    aria-label={horiz ? 'Scroll left' : 'Scroll up'}
                />
                <div ref={railRef} className='xp-scrollbar-rail'>
                    <div
                        ref={thumbRef}
                        className={`xp-scrollbar-thumb${dragging ? ' xp-scrollbar-thumb--dragging' : ''}`}
                        style={thumbStyle}
                        onMouseDown={onThumbMouseDown}
                    />
                </div>
                <button
                    className={`xp-scrollbar-arrow ${horiz ? 'xp-scrollbar-arrow--right' : 'xp-scrollbar-arrow--down'}`}
                    onMouseDown={onArrowDown(horiz ? STEP : STEP)}
                    onMouseUp={onMouseUp}
                    onMouseLeave={onMouseUp}
                    aria-label={horiz ? 'Scroll right' : 'Scroll down'}
                />
            </div>
        </div>
    );
};

export default XPScrollbar;

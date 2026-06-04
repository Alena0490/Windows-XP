import { useEffect, useRef } from 'react';
import type { Card } from './data/dataSolitaire';

import './WinAnimation.css';
import './Solitaire.css';

interface WinAnimationProps {
    foundations: Card[][];
    onNewGame: () => void;
}

const CARD_W = 71;
const CARD_H = 96;
const DECAY = 0.2;
const BOUNCE_DAMP = 0.7;

type Launch = {
    img: HTMLImageElement;
    originX: number;
    originY: number;
};

const WinAnimation = ({ foundations, onNewGame }: WinAnimationProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const parent = canvas.parentElement;
        const width = parent?.clientWidth ?? canvas.clientWidth;
        const height = parent?.clientHeight ?? canvas.clientHeight;
        canvas.width = width;
        canvas.height = height;

        const canvasRect = canvas.getBoundingClientRect();
        const foundationEls = parent
            ? Array.from(parent.querySelectorAll<HTMLElement>('.foundation-pile'))
            : [];
        const origins = foundationEls.map(el => {
            const r = el.getBoundingClientRect();
            return {
                x: r.left - canvasRect.left + r.width / 2 - CARD_W / 2,
                y: r.top - canvasRect.top,
            };
        });

        // Round-robin queue across the four piles: King from pile 0,
        // King from pile 1, ..., then Queens, then Jacks, etc.
        const queue: Launch[] = [];
        const maxLen = foundations.reduce((m, p) => Math.max(m, p.length), 0);
        for (let rank = 0; rank < maxLen; rank++) {
            for (let pileIdx = 0; pileIdx < foundations.length; pileIdx++) {
                const pile = foundations[pileIdx];
                const cardIdx = pile.length - 1 - rank;
                if (cardIdx < 0) continue;
                const origin = origins[pileIdx] ?? { x: width * 0.7, y: 20 };
                const img = new Image();
                img.src = pile[cardIdx].image;
                queue.push({ img, originX: origin.x, originY: origin.y });
            }
        }

        let cancelled = false;
        let animId = 0;

        // Single card state — exactly one card animates at a time, and the
        // canvas is never cleared so cards leave a trail across the board
        // (the classic XP cascade fill).
        let nextIdx = 0;
        let cx = 0;
        let cy = 0;
        let vx = 0;
        let vy = 0;
        let currentImg: HTMLImageElement | null = null;

        const launchNext = (): boolean => {
            if (nextIdx >= queue.length) return false;
            const launch = queue[nextIdx];
            currentImg = launch.img;
            cx = launch.originX;
            cy = launch.originY;
            // Horizontal velocity: ±2..±6, biased away from zero so the card
            // clearly travels sideways.
            vx = 5 * (1 - Math.random() * 2);
            vx += vx > 0 ? 1 : -1;
            // Initial downward kick big enough to be visible immediately.
            vy = 2 + Math.random() * 3;
            nextIdx++;
            return true;
        };

        const animate = () => {
            if (cancelled || !currentImg) return;

            cx += vx;
            cy += vy;
            vy += DECAY;

            if (cy >= height - CARD_H) {
                cy = height - CARD_H;
                vy = vy * -BOUNCE_DAMP + (1 - Math.random() * 2);
                if (vy > 0.1) vy = -1;
            }

            if (cx <= -CARD_W || cx >= width) {
                if (!launchNext()) {
                    currentImg = null;
                    return;
                }
            } else {
                ctx.drawImage(
                    currentImg,
                    Math.round(cx),
                    Math.round(cy),
                    CARD_W,
                    CARD_H,
                );
            }

            animId = requestAnimationFrame(animate);
        };

        // Preload every card image before starting — drawImage on an
        // unloaded image is a silent no-op, which would freeze the cards
        // in place on slow first paint.
        let pending = queue.length;
        const onReady = () => {
            if (cancelled || pending > 0) return;
            if (!launchNext()) return;
            animId = requestAnimationFrame(animate);
        };
        if (queue.length === 0) return;
        queue.forEach(l => {
            if (l.img.complete && l.img.naturalWidth > 0) {
                pending--;
            } else {
                l.img.onload = () => {
                    pending--;
                    if (pending === 0) onReady();
                };
                l.img.onerror = () => {
                    pending--;
                    if (pending === 0) onReady();
                };
            }
        });
        if (pending === 0) onReady();

        return () => {
            cancelled = true;
            if (animId) cancelAnimationFrame(animId);
        };
    }, [foundations]);

    return <canvas 
      className='win-canvas' 
      ref={canvasRef} 
      onClick={onNewGame}
    />;
};

export default WinAnimation;

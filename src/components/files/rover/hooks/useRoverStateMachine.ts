import { useState, useEffect, useRef } from 'react';
import useRoverAnimation, { getSoundUrl } from './useRoverAnimation';
import { trickAnimations } from '../data/roverAnimation';
import type { RoverFrame } from './useRoverAnimation';

// ── Constants ────────────────────────────────────────────────────────────────
const IDLE_VARIANTS = ['1idle', '2idle', '3idle', '4idle', '5idle', '6idle', '7idle', '8idle', '9idle', '10idle'];
const RETURN_TO_IDLE = new Set([
    'come', 'pleased', 'ashamed', 'attention', 'congratulate',
    'shopping', 'writing', 'money', 'sports', 'travel', 'thinking',
    'haf', 'lick',
]);
const IDLE_TIMEOUT_MS = 30_000;

const pickIdle = () => IDLE_VARIANTS[Math.floor(Math.random() * IDLE_VARIANTS.length)];
const pickIdleExcluding = (current: string) => {
    const choices = IDLE_VARIANTS.filter(n => n !== current);
    return choices[Math.floor(Math.random() * choices.length)];
};
export const pickTrick = () => trickAnimations[Math.floor(Math.random() * trickAnimations.length)];

// ── Types ────────────────────────────────────────────────────────────────────
export type RoverView = 'idle' | 'results' | 'results-found' | 'results-empty' | 'you-rang';

interface UseRoverStateMachineProps {
    view: RoverView;
    onClose: () => void;
    globalVolume: number;
    globalMuted: boolean;
}

interface UseRoverStateMachineReturn {
    roverFrame: RoverFrame;
    currentAnimation: string;
    isExiting: boolean;
    handleRoverClick: () => void;
    handleCloseClick: () => void;
    cancelSearch: () => void;
    handleDoTrick: () => void;
    setView: (view: RoverView) => void;
}

// ── Hook ─────────────────────────────────────────────────────────────────────
const useRoverStateMachine = ({ view, onClose, globalVolume, globalMuted }: UseRoverStateMachineProps): UseRoverStateMachineReturn => {
    const [internalView, setInternalView] = useState<RoverView>(view);
    const viewRef = useRef(internalView);
    viewRef.current = internalView;

    const [currentAnimation, setCurrentAnimation] = useState('come');
    const [isExiting, setIsExiting] = useState(false);

    const handleAnimationComplete = () => {
        if (isExiting) {
            onClose();
            return;
        }
        setCurrentAnimation(prev => {
            if (viewRef.current === 'results-found' && prev === 'congratulate') return 'pleased';
            if (/^\d+idle$/.test(prev)) return pickIdleExcluding(prev);
            return RETURN_TO_IDLE.has(prev) ? pickIdle() : prev;
        });
    };

    const roverFrame = useRoverAnimation(currentAnimation, handleAnimationComplete, globalVolume, globalMuted);

    // Sync external view changes
    useEffect(() => {
        setInternalView(view);
    }, [view]);

    // View transitions
    useEffect(() => {
        if (internalView === 'results-empty') setCurrentAnimation('ashamed');
        else if (internalView === 'results-found') setCurrentAnimation('congratulate');
        else if (internalView !== 'results' &&
            (currentAnimation === 'searching' || currentAnimation === 'reading' || currentAnimation === 'sleep')) {
            setCurrentAnimation(pickIdle());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [internalView]);

    // Alternate searching ↔ reading while searching
    useEffect(() => {
        if (internalView !== 'results') return;
        const sequence = ['searching', 'reading'];
        let i = 0;
        setCurrentAnimation(sequence[i]);
        const timer = window.setInterval(() => {
            i = (i + 1) % sequence.length;
            setCurrentAnimation(sequence[i]);
        }, 4000);
        return () => window.clearInterval(timer);
    }, [internalView]);

    // Sleep after inactivity
    const idleStartRef = useRef<number | null>(null);
    useEffect(() => {
        const isIdle = /^\d+idle$/.test(currentAnimation);
        if (!isIdle || internalView === 'results') {
            idleStartRef.current = null;
            return;
        }
        if (idleStartRef.current === null) idleStartRef.current = Date.now();
        const elapsed = Date.now() - idleStartRef.current;
        const remaining = Math.max(IDLE_TIMEOUT_MS - elapsed, 0);
        const timer = window.setTimeout(() => {
            setCurrentAnimation('sleep');
            idleStartRef.current = null;
        }, remaining);
        return () => window.clearTimeout(timer);
    }, [currentAnimation, internalView]);

    const handleRoverClick = () => {
        setCurrentAnimation('pleased');
        setInternalView('you-rang');
    };

    const handleCloseClick = () => {
        setIsExiting(true);
        setCurrentAnimation('exit');
    };

    const cancelSearch = () => {
        setCurrentAnimation('attention');
        setInternalView('idle');
    };

    const handleDoTrick = () => {
        setCurrentAnimation(pickTrick());
        if (globalMuted) return;
        const url = getSoundUrl('./sounds/rover_Resources_Haf.wav');
        if (url) {
            const audio = new Audio(url);
            audio.volume = globalVolume;
            audio.play().catch(() => undefined);
        }
    };

    return {
        roverFrame,
        currentAnimation,
        isExiting,
        handleRoverClick,
        handleCloseClick,
        cancelSearch,
        handleDoTrick,
        setView: setInternalView,
    };
};

export default useRoverStateMachine;
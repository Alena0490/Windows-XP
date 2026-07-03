import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { playBubbleSound } from '../hooks/useSound';

import daVinci from '../../public/WINDOWS/Resources/Themes/Screensavers/daVinci.mp4';
import aquarium from '../../public/WINDOWS/Resources/Themes/Screensavers/aquarium.mp4';
import nature from '../../public/WINDOWS/Resources/Themes/Screensavers/nature.mp4';
import space from '../../public/WINDOWS/Resources/Themes/Screensavers/space.mp4';
import curvesAndColors from '../../public/WINDOWS/Resources/Themes/Screensavers/curvesAndColors.mp4';
import flyingWindows from '../../public/WINDOWS/Resources/Themes/Screensavers/flyingWindows.mp4';
import hauntedHouse from '../../public/WINDOWS/Resources/Themes/Screensavers/hauntedHouse.mp4';
import maze from '../../public/WINDOWS/Resources/Themes/Screensavers/maze.mp4';
import mercuryPool from '../../public/WINDOWS/Resources/Themes/Screensavers/mercuryPool.mp4';
import mystifyYourMind from '../../public/WINDOWS/Resources/Themes/Screensavers/MystifyYourMind.mp4';
import theSandPendulum from '../../public/WINDOWS/Resources/Themes/Screensavers/theSandPendulum.mp4';
import theRobotCircus from '../../public/WINDOWS/Resources/Themes/Screensavers/theRobotCircus.mp4';
import windows98 from '../../public/WINDOWS/Resources/Themes/Screensavers/windows98.mp4';

const SCREENSAVER_SRCS: Record<string, string> = {
    aquarium, daVinci, nature, space, curvesAndColors,
    flyingWindows, hauntedHouse, maze, mercuryPool,
    mystifyYourMind, theSandPendulum, theRobotCircus, windows98,
};

interface Props {
    screensaverName: string;
    onDismiss: () => void;
    globalVolume: number;
    globalMuted: boolean;
}

const ScreensaverOverlay = ({ screensaverName, onDismiss, globalVolume, globalMuted }: Props) => {
    const bubbleTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
    const bubbleAudiosRef = useRef<Set<HTMLAudioElement>>(new Set());
    const globalVolumeRef = useRef(globalVolume);
    const globalMutedRef  = useRef(globalMuted);

    useEffect(() => { globalVolumeRef.current = globalVolume; }, [globalVolume]);
    useEffect(() => { globalMutedRef.current  = globalMuted;  }, [globalMuted]);

    useEffect(() => {
        if (screensaverName !== 'aquarium') return;

        // Snapshot the Set reference so the cleanup below always refers to the
        // same collection this effect created, not whatever .current happens to be later.
        const bubbleAudios = bubbleAudiosRef.current;

        // Track every audio instance we spawn so we can stop them all on dismiss —
        // otherwise older still-playing bubble clips leak past the screensaver end.
        const play = () => {
            const audio = playBubbleSound(globalVolumeRef.current, globalMutedRef.current);
            if (audio) {
                bubbleAudios.add(audio);
                audio.addEventListener('ended', () => bubbleAudios.delete(audio));
            }
        };

        const schedule = () => {
            bubbleTimerRef.current = setTimeout(() => {
                play();
                schedule();
            }, 1500 + Math.random() * 4000);
        };

        play();
        schedule();

        // Also stop bubbles the moment the tab is backgrounded — otherwise the
        // last-scheduled clip keeps playing while the user is on another tab.
        const handleVisibility = () => {
            if (document.hidden) {
                bubbleAudios.forEach(a => { a.pause(); a.currentTime = 0; });
                bubbleAudios.clear();
            }
        };
        document.addEventListener('visibilitychange', handleVisibility);

        return () => {
            if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
            bubbleAudios.forEach(a => { a.pause(); a.currentTime = 0; });
            bubbleAudios.clear();
            document.removeEventListener('visibilitychange', handleVisibility);
        };
    }, [screensaverName]);

    useEffect(() => {
        const handler = () => onDismiss();
        const events = ['mousemove', 'mousedown', 'keydown', 'touchstart'];
        const t = setTimeout(() => {
            events.forEach(e => window.addEventListener(e, handler));
        }, 500);
        return () => {
            clearTimeout(t);
            events.forEach(e => window.removeEventListener(e, handler));
        };
    }, [onDismiss]);

    const src = SCREENSAVER_SRCS[screensaverName];
    if (!src) return null;

    return createPortal(
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2147483647,
            background: '#000',
            cursor: 'none',
        }}>
            <video
                key={screensaverName}
                src={src}
                autoPlay
                loop
                muted
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
        </div>,
        document.body
    );
};

export default ScreensaverOverlay;

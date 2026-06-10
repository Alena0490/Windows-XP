import { useEffect } from 'react';

// Stejný seznam jako v DisplayProperties
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

import './ScreensaverOverlay.css'

const SCREENSAVER_SRCS: Record<string, string> = {
    aquarium, daVinci, nature, space, curvesAndColors,
    flyingWindows, hauntedHouse, maze, mercuryPool,
    mystifyYourMind, theSandPendulum, theRobotCircus, windows98,
};

interface Props {
    screensaverName: string;
    onDismiss: () => void;
}

const ScreensaverOverlay = ({ screensaverName, onDismiss }: Props) => {
    useEffect(() => {
        const handler = () => onDismiss();
        const events = ['mousemove', 'mousedown', 'keydown', 'touchstart'];
        // Krátká prodleva aby dismiss nespustil hned při aktivaci
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

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100000,
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
        </div>
    );
};

export default ScreensaverOverlay;
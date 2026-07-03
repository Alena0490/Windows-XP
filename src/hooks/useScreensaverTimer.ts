import { useEffect, useRef } from 'react';

interface UseScreensaverTimerParams {
    screensaverName: string;
    screensaverWait: number;
    screensaverActive: boolean;
    setScreensaverActive: (active: boolean) => void;
}

const useScreensaverTimer = ({
    screensaverName,
    screensaverWait,
    screensaverActive,
    setScreensaverActive,
}: UseScreensaverTimerParams) => {
    const screensaverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!screensaverName || screensaverActive) return;

        const startTimer = () => {
            if (screensaverTimer.current) clearTimeout(screensaverTimer.current);
            screensaverTimer.current = setTimeout(
                () => setScreensaverActive(true),
                screensaverWait * 60 * 1000
            );
        };

        const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
        events.forEach(e => window.addEventListener(e, startTimer));
        startTimer();

        return () => {
            if (screensaverTimer.current) clearTimeout(screensaverTimer.current);
            events.forEach(e => window.removeEventListener(e, startTimer));
        };
    }, [screensaverName, screensaverWait, screensaverActive, setScreensaverActive]);
};

export default useScreensaverTimer;
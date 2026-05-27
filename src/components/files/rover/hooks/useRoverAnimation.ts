import { useState, useEffect, useRef } from 'react';
import { roverAnimations } from '../data/roverAnimation';
import { spriteAnimations, SPRITE_FRAME_W, SPRITE_FRAME_H, SPRITE_SHEET_SRC } from '../data/spriteanimation';

export type RoverFrame =
    | { type: 'png'; src: string }
    | { type: 'sprite'; x: number; y: number; w: number; h: number; sheet: string };

const pngFrames = import.meta.glob('../img/**/*.png', {
    eager: true,
    query: '?url',
    import: 'default',
}) as Record<string, string>;

const soundFiles = import.meta.glob('../sounds/*', {
    eager: true,
    query: '?url',
    import: 'default',
}) as Record<string, string>;

const getFrameUrl = (animPath: string, frameNum: number): string => {
    const file = `/${animPath}/${String(frameNum).padStart(3, '0')}.png`.toLowerCase();
    const key = Object.keys(pngFrames).find(k => k.toLowerCase().endsWith(file));
    return key ? pngFrames[key] : '';
};

export const getSoundUrl = (rel: string): string => {
    const basename = rel.split('/').pop() ?? '';
    const key = Object.keys(soundFiles).find(k => k.endsWith(`/${basename}`));
    return key ? soundFiles[key] : '';
};

const useRoverAnimation = (animationName: string, onComplete?: () => void) => {
    const [frame, setFrame] = useState<RoverFrame>({ type: 'png', src: '' });
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const onCompleteRef = useRef(onComplete);
    onCompleteRef.current = onComplete;

    useEffect(() => {
        const pngAnim = roverAnimations[animationName];
        const spriteEntry = spriteAnimations[animationName]; // SpriteAnimation | undefined
        const spriteFrames = spriteEntry?.frames;

        if (intervalRef.current) clearInterval(intervalRef.current);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }

        if (!spriteFrames && !pngAnim) return;

        // Prefer PNG when its frames actually exist on disk. If PNG metadata
        // is declared but the folder is missing, fall back to the sprite sheet.
        const isIdle = /^\d+idle$/.test(animationName);
        const animPath = isIdle ? `idle/${animationName}` : animationName;
        const firstPngUrl = pngAnim ? getFrameUrl(animPath, 1) : '';
        const usePng = pngAnim && firstPngUrl;

        // Sound: prefer the active source's own sound declaration
        const sound = usePng ? pngAnim?.sound : (spriteEntry?.sound ?? pngAnim?.sound);
        if (sound) {
            audioRef.current = new Audio(getSoundUrl(sound));
            audioRef.current.play().catch(() => undefined);
        }

        if (usePng) {
            let frameIndex = 1;
            let repeatCount = 0;

            setFrame({ type: 'png', src: firstPngUrl });

            const tick = () => {
                frameIndex++;
                if (frameIndex > pngAnim.frames) {
                    frameIndex = 1;
                    repeatCount++;
                    if (pngAnim.repeat !== Infinity && repeatCount >= pngAnim.repeat) {
                        clearInterval(intervalRef.current!);
                        onCompleteRef.current?.();
                        return;
                    }
                }
                const url = getFrameUrl(animPath, frameIndex);
                if (url) setFrame({ type: 'png', src: url });
            };

            intervalRef.current = setInterval(tick, pngAnim.frameTime);
        } else if (spriteFrames && spriteFrames.length > 0) {
            // Sprite-sheet fallback. Repeat preference: sprite's own declaration,
            // else the PNG metadata (declared even without a PNG folder), else once.
            const frameMs = (i: number) => (spriteFrames[i]?.duration ?? 10) * 10;
            const repeat = spriteEntry?.repeat ?? pngAnim?.repeat ?? 1;

            let frameIndex = 0;
            let repeatCount = 0;

            const showFrame = (i: number) => {
                const f = spriteFrames[i];
                setFrame({ type: 'sprite', x: f.x, y: f.y, w: SPRITE_FRAME_W, h: SPRITE_FRAME_H, sheet: SPRITE_SHEET_SRC });
            };

            showFrame(0);

            const tick = () => {
                frameIndex++;
                if (frameIndex >= spriteFrames.length) {
                    frameIndex = 0;
                    repeatCount++;
                    if (repeat !== Infinity && repeatCount >= repeat) {
                        clearInterval(intervalRef.current!);
                        onCompleteRef.current?.();
                        return;
                    }
                }
                showFrame(frameIndex);
                clearInterval(intervalRef.current!);
                intervalRef.current = setInterval(tick, frameMs(frameIndex));
            };

            intervalRef.current = setInterval(tick, frameMs(0));
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [animationName]);

    return frame;
};

export default useRoverAnimation;
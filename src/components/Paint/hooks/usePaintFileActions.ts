import { useState, useEffect, useCallback } from 'react';
import useSound from '../../../hooks/useSound';

export const usePaintFileActions = (
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    ctxRef: React.RefObject<CanvasRenderingContext2D | null>,
    snapshot: () => void,
    onStatusChange: (message: string) => void,
    saveAsOpen: boolean,
    setSaveAsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    globalVolume: number,
    globalMuted: boolean,
    setHasChanges: React.Dispatch<React.SetStateAction<boolean>>,
    onSaved: (name?: string) => void,
    plusTheme?: 'none' | 'aquarium' | 'davinci' | 'nature' | 'space',
    initialImageUrl?: string,
    onInitialImageConsumed?: () => void,
) => {
    const [fileName, setFileName] = useState('drawing.png');
    const sounds = useSound(globalVolume, globalMuted);
    const themeSound = plusTheme === 'aquarium' ? sounds.aquarium
        : plusTheme === 'davinci' ? sounds.daVinci
        : plusTheme === 'nature' ? sounds.nature
        : plusTheme === 'space' ? sounds.space
        : null;
    const playNavStart = () => themeSound ? themeSound.playOpen()    : sounds.playNavStart();
    const playMinimize = () => themeSound ? themeSound.playMinimize() : sounds.playMinimize();

    // Save the canvas as a PNG file with the current filename
    const handleSaveAsConfirm = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const safeName = fileName.trim() || 'drawing.png';
        const finalName = safeName.toLowerCase().endsWith('.png') ? safeName : `${safeName}.png`;
        playNavStart();
        const a = document.createElement('a');
        a.download = finalName;
        a.href = canvas.toDataURL('image/png');
        a.click();
        setSaveAsOpen(false);
        setHasChanges(false);
        onSaved(finalName);
    }, [canvasRef, fileName, setSaveAsOpen, playNavStart, setHasChanges, onSaved]);

    // Open an image file and draw it onto the canvas
    const handleOpenFile = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!canvas || !ctx) return;
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                const result = ev.target?.result;
                if (typeof result !== 'string') return;
                const img = new Image();
                img.onload = () => {
                    snapshot();
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    onStatusChange('Image opened');
                    setHasChanges(false);
                };
                img.onerror = () => onStatusChange('Failed to open image');
                img.src = result;
            };
            reader.readAsDataURL(file);
        };
        input.click();
    }, [canvasRef, ctxRef, snapshot, onStatusChange, setHasChanges]);

    // Load an image passed in from outside (e.g. Picture & Fax Viewer -> "Open for editing")
    useEffect(() => {
        if (!initialImageUrl) return;
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!canvas || !ctx) return;
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            snapshot();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            onStatusChange('Image opened');
            setHasChanges(false);
            onInitialImageConsumed?.();
        };
        img.onerror = () => {
            onStatusChange('Failed to open image');
            onInitialImageConsumed?.();
        };
        img.src = initialImageUrl;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialImageUrl]);

    // Keyboard shortcuts for Save As dialog
    useEffect(() => {
        if (!saveAsOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Enter') { e.preventDefault(); handleSaveAsConfirm(); }
            if (e.key === 'Escape') { e.preventDefault(); setSaveAsOpen(false); }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [saveAsOpen, handleSaveAsConfirm, setSaveAsOpen]);

    return {
        fileName,
        setFileName,
        playMinimize,
        handleSaveAsConfirm,
        handleOpenFile,
    };
};
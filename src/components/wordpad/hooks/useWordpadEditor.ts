import { useState, useRef, useEffect, useCallback } from "react";

export function useWordpadEditor(
    editorRef: React.RefObject<HTMLDivElement | null>,
    onChanges: () => void,
    undoRef: React.RefObject<() => void>,
    redoRef: React.RefObject<() => void>,
    onHistoryChange: (canUndo: boolean, 
    canRedo: boolean) => void,
    newRef: React.RefObject<() => void>
) {
    const [activeFormats, setActiveFormats] = useState<Record<string, boolean>>({});
    const [history, setHistory] = useState<string[]>(['']);
    const [historyIndex, setHistoryIndex] = useState(0);


    // Handle Undo
    const handleUndo = useCallback(() => {
        setHistoryIndex(prev => {
            const i = prev - 1;
            if (i < 0) return prev;
            if (editorRef.current) editorRef.current.innerHTML = history[i];
            return i;
        });
    }, [history, editorRef]);

    // Handle Redo
    const handleRedo = useCallback(() => {
        setHistoryIndex(prev => {
            const i = prev + 1;
            if (i >= history.length) return prev;
            if (editorRef.current) editorRef.current.innerHTML = history[i];
            return i;
        });
    }, [history, editorRef]);

    // Push from History
    const pushHistory = useCallback(() => {
        const html = editorRef.current?.innerHTML ?? '';
        setHistory(prev => {
            const next = prev.slice(0, historyIndex + 1);
            const updated = [...next, html];
            return updated;
        });
        setHistoryIndex(prev => prev + 1);
    }, [historyIndex, editorRef]);

    const savedRange = useRef<Range | null>(null);

    useEffect(() => {
        undoRef.current = handleUndo;
        redoRef.current = handleRedo;
    }, [handleUndo, handleRedo, undoRef, redoRef]);

    useEffect(() => {
        onHistoryChange(historyIndex > 0, historyIndex < history.length - 1);
    }, [historyIndex, history.length, onHistoryChange]);

    useEffect(() => {
        newRef.current = () => {
            if (editorRef.current) editorRef.current.innerHTML = '';
            setHistory(['']);
            setHistoryIndex(0);
        };
    });

    // default paragraph separator
    useEffect(() => {
        document.execCommand('defaultParagraphSeparator', false, 'p');
    }, []);

    // track active formats on selection change
    useEffect(() => {
        const update = () => {
            if (!editorRef.current?.contains(document.getSelection()?.anchorNode ?? null)) return;
            setActiveFormats({
                bold:                document.queryCommandState('bold'),
                italic:              document.queryCommandState('italic'),
                underline:           document.queryCommandState('underline'),
                justifyLeft:         document.queryCommandState('justifyLeft'),
                justifyCenter:       document.queryCommandState('justifyCenter'),
                justifyRight:        document.queryCommandState('justifyRight'),
                insertUnorderedList: document.queryCommandState('insertUnorderedList'),
            });
        };
        document.addEventListener('selectionchange', update);
        return () => document.removeEventListener('selectionchange', update);
    }, [editorRef]);

    const exec = (command: string, value?: string) => {
        editorRef.current?.focus();
        document.execCommand(command, false, value);
        onChanges();
    };

    const saveSelection = () => {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0)
            savedRange.current = sel.getRangeAt(0).cloneRange();
    };

    const restoreSelection = () => {
        const sel = window.getSelection();
        if (sel && savedRange.current) {
            sel.removeAllRanges();
            sel.addRange(savedRange.current);
        }
    };

    return { activeFormats, exec, saveSelection, restoreSelection, pushHistory };
}
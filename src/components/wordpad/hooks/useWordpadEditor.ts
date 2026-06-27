import { useState, useRef, useEffect } from "react";

export function useWordpadEditor(
    editorRef: React.RefObject<HTMLDivElement | null>,
    onChanges: () => void
) {
    const [activeFormats, setActiveFormats] = useState<Record<string, boolean>>({});
    const savedRange = useRef<Range | null>(null);

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

    return { activeFormats, exec, saveSelection, restoreSelection };
}
import { useEffect, useState, useCallback, type ReactNode } from 'react';
import type { FMItem } from '../components/files/data/types';
import { loadOverlay, saveOverlay } from '../utils/idbStorage';
import { FileSystemContext, emptyOverlay, type FSOverlay } from './fileSystemContext';

export function FileSystemProvider({ children }: { children: ReactNode }) {
    // ── State & Hydration ──
    const [overlay, setOverlay] = useState<FSOverlay>(emptyOverlay);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        loadOverlay(emptyOverlay).then(o => { setOverlay({ ...emptyOverlay, ...o }); setReady(true); });
    }, []);

    const persist = (next: FSOverlay) => { saveOverlay(next); return next; };

    // ── Create / Update / Rename ──
    const createFile = useCallback((parentId: string, item: FMItem) => {
        setOverlay(prev => persist({ ...prev, created: { ...prev.created, [parentId]: [...(prev.created[parentId] ?? []), item] } }));
    }, []);

    const updateFile = useCallback((itemId: string, patch: Partial<FMItem>) => {
        setOverlay(prev => persist({ ...prev, edited: { ...prev.edited, [itemId]: { ...prev.edited[itemId], ...patch } } }));
    }, []);

    const renameFile = useCallback((itemId: string, newName: string) => {
        updateFile(itemId, { name: newName });
    }, [updateFile]);

    // ── Delete / Restore / Empty Bin ──
    const deleteFile = useCallback((itemId: string, item: FMItem, originalParentId: string) => {
        setOverlay(prev => persist({ ...prev, recycleBin: { ...prev.recycleBin, [itemId]: { item, originalParentId } } }));
    }, []);

    const restoreFile = useCallback((itemId: string) => {
        setOverlay(prev => {
            const entry = prev.recycleBin[itemId];
            if (!entry) return prev;
            const { item, originalParentId } = entry;
            const restBin = { ...prev.recycleBin };
            delete restBin[itemId];
            return persist({
                ...prev,
                created: { ...prev.created, [originalParentId]: [...(prev.created[originalParentId] ?? []), item] },
                recycleBin: restBin,
            });
        });
    }, []);

    const emptyRecycleBin = useCallback(() => {
        setOverlay(prev => persist({ ...prev, recycleBin: {} }));
    }, []);

    // ── Overlay Selectors ──
    const applyOverlay = useCallback((item: FMItem): FMItem => {
        const patch = overlay.edited[item.id];
        return patch ? { ...item, ...patch } : item;
    }, [overlay]);

    const getExtraChildren = useCallback((parentId: string) => overlay.created[parentId] ?? [], [overlay]);
    const isDeleted = useCallback((itemId: string) => itemId in overlay.recycleBin, [overlay]);
    const getRecycleBinItems = useCallback(() => Object.values(overlay.recycleBin).map(entry => entry.item), [overlay]);

    // ── Provider Render ──
    return (
        <FileSystemContext.Provider value={{
            ready, 
            createFile, 
            updateFile, 
            deleteFile, 
            renameFile, 
            applyOverlay, 
            getExtraChildren, 
            isDeleted, 
            getRecycleBinItems, 
            emptyRecycleBin, 
            restoreFile 
        }}>
            {children}
        </FileSystemContext.Provider>
    );
}
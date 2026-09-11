import { useEffect, useState, useCallback, type ReactNode } from 'react';
import type { FMItem } from '../components/files/data/types';
import { loadOverlay, saveOverlay } from '../utils/idbStorage';
import { FileSystemContext, emptyOverlay, type FSOverlay } from './fileSystemContext';

export function FileSystemProvider({ children }: { children: ReactNode }) {
    const [overlay, setOverlay] = useState<FSOverlay>(emptyOverlay);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        loadOverlay(emptyOverlay).then(o => { setOverlay(o); setReady(true); });
    }, []);

    const createFile = useCallback((parentId: string, item: FMItem) => {
        setOverlay(prev => {
            const next = { ...prev, created: { ...prev.created, [parentId]: [...(prev.created[parentId] ?? []), item] } };
            saveOverlay(next);
            return next;
        });
    }, []);

    const updateFile = useCallback((itemId: string, patch: Partial<FMItem>) => {
        setOverlay(prev => {
            const next = { ...prev, edited: { ...prev.edited, [itemId]: { ...prev.edited[itemId], ...patch } } };
            saveOverlay(next);
            return next;
        });
    }, []);

    const renameFile = useCallback((itemId: string, newName: string) => {
        updateFile(itemId, { name: newName });
    }, [updateFile]);

    const deleteFile = useCallback((itemId: string) => {
        setOverlay(prev => {
            const next = { ...prev, deletedIds: [...prev.deletedIds, itemId] };
            saveOverlay(next);
            return next;
        });
    }, []);

    const applyOverlay = useCallback((item: FMItem): FMItem => {
        const patch = overlay.edited[item.id];
        return patch ? { ...item, ...patch } : item;
    }, [overlay]);

    const getExtraChildren = useCallback((parentId: string) => overlay.created[parentId] ?? [], [overlay]);
    const isDeleted = useCallback((itemId: string) => overlay.deletedIds.includes(itemId), [overlay]);

    return (
        <FileSystemContext.Provider value={{ ready, createFile, updateFile, deleteFile, renameFile, applyOverlay, getExtraChildren, isDeleted }}>
            {children}
        </FileSystemContext.Provider>
    );
}
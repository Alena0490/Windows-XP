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

            // Find existing names in the target folder
            const siblingNames = new Set(
                (prev.created[originalParentId] ?? [])
                    .filter(i => !(i.id in prev.recycleBin) && !(i.id in prev.permanentlyDeleted))
                    .map(i => i.name)
            );

            let restoredItem = item;
            if (siblingNames.has(item.name)) {
                let n = 1;
                while (siblingNames.has(`${item.name} (${n})`)) n++;
                restoredItem = { ...item, name: `${item.name} (${n})` };
            }

            return persist({
                ...prev,
                created: { ...prev.created, [originalParentId]: [...(prev.created[originalParentId] ?? []), restoredItem] },
                recycleBin: restBin,
            });
        });
    }, []);

    const stripFromCreated = (created: Record<string, FMItem[]>, itemId: string) => {
        const next: Record<string, FMItem[]> = {};
        for (const [parentId, items] of Object.entries(created)) {
            const filtered = items.filter(i => i.id !== itemId);
            if (filtered.length) next[parentId] = filtered;
        }
        return next;
    };

    const emptyRecycleBin = useCallback(() => {
        setOverlay(prev => {
            const ids = Object.keys(prev.recycleBin);
            let created = prev.created;
            const permanentlyDeleted = { ...prev.permanentlyDeleted };
            for (const id of ids) {
                created = stripFromCreated(created, id);
                permanentlyDeleted[id] = true;
            }
            return persist({ ...prev, recycleBin: {}, created, permanentlyDeleted });
        });
    }, []);

    const permanentlyDeleteFile = useCallback((itemId: string) => {
        setOverlay(prev => {
            const restBin = { ...prev.recycleBin };
            delete restBin[itemId];
            return persist({
                ...prev,
                recycleBin: restBin,
                created: stripFromCreated(prev.created, itemId),
                permanentlyDeleted: { ...prev.permanentlyDeleted, [itemId]: true },
            });
        });
    }, []);

    const moveFile = useCallback((itemId: string, item: FMItem, fromParentId: string, toParentId: string) => {
        setOverlay(prev => persist({
            ...prev,
            created: {
                ...stripFromCreated(prev.created, itemId),
                [toParentId]: [...(prev.created[toParentId] ?? []), item],
            },
            edited: { ...prev.edited, [itemId]: { ...prev.edited[itemId] } },
            permanentlyDeleted: fromParentId.startsWith('root-original')
                ? prev.permanentlyDeleted
                : { ...prev.permanentlyDeleted, [`orig-${itemId}`]: true },
        }));
    }, []);

    // ── Overlay Selectors ──
    const applyOverlay = useCallback((item: FMItem): FMItem => {
        const patch = overlay.edited[item.id];
        return patch ? { ...item, ...patch } : item;
    }, [overlay]);

    const getExtraChildren = useCallback((parentId: string) => overlay.created[parentId] ?? [], [overlay]);
    const isDeleted = useCallback((itemId: string) => itemId in overlay.recycleBin || itemId in overlay.permanentlyDeleted, [overlay]);
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
            restoreFile,
            permanentlyDeleteFile,
            moveFile 
        }}>
            {children}
        </FileSystemContext.Provider>
    );
}
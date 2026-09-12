import { createContext, useContext } from 'react';
import type { FMItem } from '../components/files/data/types';

export interface FSOverlay {
    created: Record<string, FMItem[]>;
    edited: Record<string, Partial<FMItem>>;
    recycleBin: Record<string, { item: FMItem; originalParentId: string }>;
}

export const emptyOverlay: FSOverlay = { created: {}, edited: {}, recycleBin: {} };

export interface FileSystemContextValue {
    ready: boolean;
    createFile: (parentId: string, item: FMItem) => void;
    updateFile: (itemId: string, patch: Partial<FMItem>) => void;
    deleteFile: (itemId: string, item: FMItem, originalParentId: string) => void;
    renameFile: (itemId: string, newName: string) => void;
    applyOverlay: (item: FMItem) => FMItem;
    getExtraChildren: (parentId: string) => FMItem[];
    isDeleted: (itemId: string) => boolean;
    getRecycleBinItems: () => FMItem[];
}

export const FileSystemContext = createContext<FileSystemContextValue | null>(null);

export function useFileSystem() {
    const ctx = useContext(FileSystemContext);
    if (!ctx) throw new Error('useFileSystem must be used within FileSystemProvider');
    return ctx;
}
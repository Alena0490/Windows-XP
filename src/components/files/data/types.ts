import type { WMPTrack } from '../../mediaPlayer/types/WMPTrack';

// ── FOLDER TYPE — drives the folder watermark & task panel in the UI ─────────
export type FolderType = 'pictures' | 'music' | 'video' | 'documents' | 'cursors';

export interface FMItem {
    id: string;
    name: string;
    type: 'folder' | 'file';
    icon: string;
    children?: FMItem[];
    size?: string;
    modified?: string;
    thumbnailUrl?: string;
    previewFolder?: boolean;
    content?: string;
    url?: string;
    trackData?: WMPTrack;
    folderType?: FolderType;
    fontUrl?: string;
    displayName?: string;
    imageUrl?: string;
    hidden?: boolean;
    largeThumbnail?: boolean;
}
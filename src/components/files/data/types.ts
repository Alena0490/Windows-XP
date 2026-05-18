import type { WMPTrack } from '../../mediaPlayer/types/WMPTrack';

// ── FOLDER TYPE — drives the folder watermark & task panel in the UI ─────────
export type FolderType = 'pictures' | 'music' | 'video' | 'documents';

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
}
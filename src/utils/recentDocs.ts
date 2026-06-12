export type RecentDoc = {
    name: string;
    path: string;
    type: 'txt' | 'image' | 'folder' | 'mp3';
    content?: string;
};

const KEY = 'xp-recent-docs';
const MAX = 15;

export const addRecentDoc = (doc: RecentDoc) => {
    const existing = getRecentDocs().filter(d => d.path !== doc.path);
    const updated = [doc, ...existing].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(updated));
};

export const getRecentDocs = (): RecentDoc[] => {
    try {
        return JSON.parse(localStorage.getItem(KEY) ?? '[]');
    } catch {
        return [];
    }
};

export const clearRecentDocs = () => localStorage.removeItem(KEY);
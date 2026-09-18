import type { FMItem } from './types';

export const ROOT_CATEGORY_ORDER = [
    'Files Stored on This Computer',
    'Hard Disk Drives',
    'Devices with Removable Storage',
] as const;

export type RootCategory = typeof ROOT_CATEGORY_ORDER[number];

const ROOT_CATEGORY_MAP: Record<string, RootCategory> = {
    'root-shared-docs': 'Files Stored on This Computer',
    'root-user-docs': 'Files Stored on This Computer',
    localdisc: 'Hard Disk Drives',
    cdrom: 'Hard Disk Drives',
    floppyA: 'Devices with Removable Storage',
    floppyB: 'Devices with Removable Storage',
    cdrw: 'Devices with Removable Storage',
};

const UNCATEGORIZED_IDS = new Set(['controlpanel', 'recyclebin']);

export const getRootCategory = (item: FMItem): RootCategory | null =>
    UNCATEGORIZED_IDS.has(item.id) ? null : (ROOT_CATEGORY_MAP[item.id] ?? 'Files Stored on This Computer');

export const getRootCategoryIndex = (id: string): number => {
    const cat = ROOT_CATEGORY_MAP[id];
    return cat ? ROOT_CATEGORY_ORDER.indexOf(cat) : 99;
};

export const groupRootItems = (items: FMItem[]) => {
    const groups = new Map<RootCategory, FMItem[]>();
    const uncategorized: FMItem[] = [];
    for (const item of items) {
        const cat = getRootCategory(item);
        if (cat === null) { uncategorized.push(item); continue; }
        if (!groups.has(cat)) groups.set(cat, []);
        groups.get(cat)!.push(item);
    }
    return {
        groups: ROOT_CATEGORY_ORDER.filter(cat => groups.has(cat)).map(cat => ({ category: cat, items: groups.get(cat)! })),
        uncategorized,
    };
};
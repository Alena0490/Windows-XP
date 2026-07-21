import { windowsFolder } from '../../files/data/windowsFolder';

import TrueTypeIcon from '../../wordpad/img/TrueType.webp';
import OpenTypeIcon from '../../wordpad/img/OpenType.webp';
import BitmapFontIcon from '../../wordpad/img/Font.webp';

export interface FontEntry {
    id: string;
    displayName: string;
    fontUrl: string;
    icon: string;
}

function iconForUrl(url: string): string {
    if (url.endsWith('.otf')) return OpenTypeIcon;
    if (url.endsWith('.ttf')) return TrueTypeIcon;
    return BitmapFontIcon; // .fon, .eot, atd.
}

export function getAllFonts(): FontEntry[] {
    const fontsNode = windowsFolder.children?.find(c => c.id === 'c-windows-fonts');
    if (!fontsNode?.children) return [];

    const seen = new Set<string>();
    const fonts: FontEntry[] = [];

    for (const f of fontsNode.children) {
        if (f.type !== 'file' || !f.fontUrl) continue;
        const name = f.displayName || f.name;
        const key = f.fontUrl;
        if (seen.has(key)) continue;
        seen.add(key);
        fonts.push({ id: f.id, displayName: name, fontUrl: f.fontUrl, icon: iconForUrl(f.fontUrl) });
    }

    return fonts;
}
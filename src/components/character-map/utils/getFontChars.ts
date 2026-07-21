import * as opentype from 'opentype.js';

const cache = new Map<string, number[]>();

function loadFont(url: string): Promise<opentype.Font> {
    return new Promise((resolve, reject) => {
        opentype.load(url, (err, font) => {
            if (err || !font) reject(err);
            else resolve(font);
        });
    });
}

export async function getFontCharCodes(url: string): Promise<number[]> {
    if (cache.has(url)) return cache.get(url)!;

    const font = await loadFont(url);
    const codes = new Set<number>();

    const numGlyphs = font.glyphs.length;
    for (let i = 0; i < numGlyphs; i++) {
        const glyph = font.glyphs.get(i);
        const g = glyph as unknown as { unicode?: number; unicodes?: number[] };
        if (typeof g.unicode === 'number') codes.add(g.unicode);
        if (Array.isArray(g.unicodes)) g.unicodes.forEach(u => codes.add(u));
    }

    const sorted = [...codes]
        .filter(c => c >= 0x20 && c !== 0x7f)
        .sort((a, b) => a - b);

    cache.set(url, sorted);
    return sorted;
}
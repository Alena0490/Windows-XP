import { useState, useLayoutEffect, useRef } from 'react';

export interface IconPosition {
    x: number;
    y: number;
}

type Positions = Record<string, IconPosition>;
export type GetDefaultPosition = (id: string, container: { width: number; height: number }) => IconPosition;

const GRID_X = 82;
const GRID_Y = 82;
const STORAGE_KEY = 'xp-desktop-icon-positions-v8';

try {
    ['xp-desktop-icon-positions', 'xp-desktop-icon-positions-v2', 'xp-desktop-icon-positions-v3', 'xp-desktop-icon-positions-v4', 'xp-desktop-icon-positions-v5', 'xp-desktop-icon-positions-v6'].forEach(k => localStorage.removeItem(k));
} catch { /* ignore */ }

const toCell = (pos: IconPosition) => ({
    col: Math.round(pos.x / GRID_X),
    row: Math.round(pos.y / GRID_Y),
});

const cellKey = (col: number, row: number) => `${col},${row}`;

const cellToPos = (col: number, row: number): IconPosition => ({
    x: Math.max(0, col * GRID_X),
    y: Math.max(0, row * GRID_Y),
});

const loadPositions = (): Positions => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
};

const savePositions = (positions: Positions) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
};

const findFreeCell = (
    desiredCol: number,
    desiredRow: number,
    occupied: Set<string>
): { col: number; row: number } => {
    if (!occupied.has(cellKey(desiredCol, desiredRow))) {
        return { col: Math.max(0, desiredCol), row: Math.max(0, desiredRow) };
    }
    for (let radius = 1; radius < 50; radius++) {
        for (let dRow = -radius; dRow <= radius; dRow++) {
            for (let dCol = -radius; dCol <= radius; dCol++) {
                if (Math.max(Math.abs(dRow), Math.abs(dCol)) !== radius) continue;
                const col = Math.max(0, desiredCol + dCol);
                const row = Math.max(0, desiredRow + dRow);
                if (!occupied.has(cellKey(col, row))) {
                    return { col, row };
                }
            }
        }
    }
    return { col: desiredCol, row: desiredRow };
};

const resolveAllPositions = (
    itemIds: string[],
    stored: Positions,
    getDefaultPosition: GetDefaultPosition,
    container: { width: number; height: number }
): Positions => {
    const occupied = new Set<string>();
    const merged: Positions = {};
    itemIds.forEach(id => {
        const candidate = stored[id] ?? getDefaultPosition(id, container);
        const cell = toCell(candidate);
        const free = findFreeCell(cell.col, cell.row, occupied);
        merged[id] = cellToPos(free.col, free.row);
        occupied.add(cellKey(free.col, free.row));
    });
    return merged;
};

interface UseDesktopIconPositionsParams {
    itemIds: string[];
    getDefaultPosition: GetDefaultPosition;
    containerRef: React.RefObject<HTMLDivElement | null>;
}

const useDesktopIconPositions = ({ itemIds, getDefaultPosition, containerRef }: UseDesktopIconPositionsParams) => {
    const [positions, setPositions] = useState<Positions>({});
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const dragOffsetRef = useRef({ x: 0, y: 0 });

    // Measure the container synchronously before paint, so we place icons
    useLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const vw = document.documentElement.clientWidth;
        const vh = document.documentElement.clientHeight;
        const width  = Math.min(rect.width  || vw - 48, vw - 48);
        const height = Math.min(rect.height || vh - 60, vh - 60);
        const stored = loadPositions();
        setPositions(resolveAllPositions(itemIds, stored, getDefaultPosition, { width, height }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleMouseDown = (id: string, e: React.MouseEvent) => {
        if (e.button !== 0) return;
        const pos = positions[id];
        if (!pos) return;
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        setDraggingId(id);
        dragOffsetRef.current = {
            x: (e.clientX - rect.left) - pos.x,
            y: (e.clientY - rect.top) - pos.y,
        };
    };

    useLayoutEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!draggingId || !containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = Math.max(0, Math.min(e.clientX - rect.left - dragOffsetRef.current.x, rect.width - GRID_X));
            const y = Math.max(0, Math.min(e.clientY - rect.top - dragOffsetRef.current.y, rect.height - GRID_Y));
            setPositions(prev => ({ ...prev, [draggingId]: { x, y } }));
        };

        const handleMouseUp = () => {
            if (!draggingId) return;
            setPositions(prev => {
                const current = prev[draggingId];
                const desired = toCell(current);
                const occupied = new Set<string>();
                Object.entries(prev).forEach(([id, pos]) => {
                    if (id === draggingId) return;
                    occupied.add(cellKey(toCell(pos).col, toCell(pos).row));
                });
                const freeCell = findFreeCell(desired.col, desired.row, occupied);
                const snapped = { ...prev, [draggingId]: cellToPos(freeCell.col, freeCell.row) };
                savePositions(snapped);
                return snapped;
            });
            setDraggingId(null);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [draggingId, containerRef]);

    return { positions, handleMouseDown };
};

export default useDesktopIconPositions;

import { VIZ_CATEGORIES } from '../data/vizCategories';
import type { VisualizationPreset } from '../types/VisualizationPreset';

export function useVisualization(
    visualization: VisualizationPreset,
    onVisualizationChange: (v: VisualizationPreset) => void
) {
    const cycleViz = (direction: 1 | -1) => {
        if (!visualization.file) return;
        for (const cat of VIZ_CATEGORIES) {
            const idx = cat.presets.findIndex(p => p.file === visualization.file);
            if (idx === -1) continue;
            const len = cat.presets.length;
            const next = cat.presets[(idx + direction + len) % len];
            onVisualizationChange({ type: 'video', file: next.file, label: next.label });
            return;
        }
    };

    const advanceVizAcrossCategories = () => {
        const flat = VIZ_CATEGORIES.flatMap(c => c.presets);
        if (!visualization.file) {
            const first = flat[0];
            onVisualizationChange({ type: 'video', file: first.file, label: first.label });
            return;
        }
        const idx = flat.findIndex(p => p.file === visualization.file);
        const next = flat[(idx + 1) % flat.length];
        onVisualizationChange({ type: 'video', file: next.file, label: next.label });
    };

    return { cycleViz, advanceVizAcrossCategories };
}
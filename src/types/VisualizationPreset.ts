export interface VisualizationPreset {
    type: 'albumart' | 'video';
    file: string | null;
    label?: string;
}
import { useState } from "react";
import { EQ_PRESETS } from '../data/eqPresets';

export function useEqualizer(bandCount = 10, initial = 50) {
    const [values, setValues] = useState<number[]>(Array(bandCount).fill(initial));
    const [resetKey, setResetKey] = useState(0);
    const [presetIndex, setPresetIndex] = useState(0);
    const [presetName, setPresetName] = useState('Default');

    const handleChange = (index: number, rawValue: number) => {
        setPresetName('Own');
        setPresetIndex(-1);
        setValues(prev => {
            const delta = rawValue - prev[index];
            return prev.map((v, i) => {
                const falloff = Math.max(0, 1 - Math.abs(i - index) * 0.35);
                return Math.min(100, Math.max(0, v + delta * falloff));
            });
        });
    };

    const reset = () => {
        setResetKey(k => k + 1);
        setValues(Array(bandCount).fill(initial));
    };

    const applyPreset = (index: number) => {
        const preset = EQ_PRESETS[index];
        if (!preset) return;
        setValues(preset.values);
        setPresetIndex(index);
        setPresetName(preset.name);
        setResetKey(k => k + 1);
    };

    const nextPreset = () => {
        const next = presetIndex < 0 ? 0 : (presetIndex + 1) % EQ_PRESETS.length;
        applyPreset(next);
    };

    const prevPreset = () => {
        const prev = presetIndex < 0 ? 0 : (presetIndex - 1 + EQ_PRESETS.length) % EQ_PRESETS.length;
        applyPreset(prev);
    };

    return { values, resetKey, handleChange, reset, presetName, nextPreset, prevPreset };
}
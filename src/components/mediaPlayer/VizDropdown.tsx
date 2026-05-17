import type { VisualizationPreset } from '../../types/VisualizationPreset';
import './VizDropdown.css'

interface VizDropdownProps {
    visualization: VisualizationPreset;
    onSelect: (v: VisualizationPreset) => void;
    onClose: () => void;
}

const VizDropdown = ({ visualization, onSelect, onClose }: VizDropdownProps) => {
    const setVis = (file: string, label: string) => {
        onSelect({ type: 'video', file, label });
        onClose();
    };
    return (
        <ul className='viz-dropdown' onMouseDown={(e) => e.stopPropagation()}>
            <li className={visualization.type === 'albumart' ? 'checked' : ''} onClick={() => { onSelect({ type: 'albumart', file: null, label: 'Album Art' }); onClose(); }}>Album Art</li>
            <li className={visualization.label?.startsWith('Ambience') ? 'checked' : ''} onClick={() => setVis('Ambience Water.mp4', 'Ambience')}>Ambience</li>
            <li className={visualization.label?.startsWith('Bars') ? 'checked' : ''} onClick={() => setVis('Bars and Waves Oceam Mist.mp4', 'Bars and Waves')}>Bars and Waves</li>
            <li className={visualization.label?.startsWith('Battery') ? 'checked' : ''} onClick={() => setVis('Battery Randomization.mp4', 'Battery')}>Battery</li>
            <li className={visualization.label?.startsWith('Particle') ? 'checked' : ''} onClick={() => setVis('Particle.mp4', 'Particle')}>Particle</li>
            <li className={visualization.label?.startsWith('Plenoptic') ? 'checked' : ''} onClick={() => setVis('Plenoptic Smokey Circles.mp4', 'Plenoptic')}>Plenoptic</li>
            <li className={visualization.label?.startsWith('Spikes') ? 'checked' : ''} onClick={() => setVis('Spikes.mp4', 'Spikes')}>Spikes</li>
            <li className={visualization.label?.startsWith('Musical') ? 'checked' : ''} onClick={() => setVis('MusicalColors.mp4', 'Musical Colors')}>Musical Colors</li>
        </ul>
    );
};

export default VizDropdown
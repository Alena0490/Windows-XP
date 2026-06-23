import AudioDevices from '../../../img/AudioDevices.webp'
import Go from '../../../img/Go.webp'
import VolumeAlt from '../../../img/VolumeAlt.webp'
import Speech from '../../../img/Speech.webp'

import '../HiddenFolderWarning.css'
import './ControlPanel.css'

interface ControlPanelSoundProps {
    onOpenVolumeControl?: () => void;
}

const ControlPanelSound = ({ onOpenVolumeControl }: ControlPanelSoundProps) => {
  return (
    <div className='file-hidden control-panel'>
        <div className='cp-subpage-header'>
            <span className='cp-subpage-title'>
                <img src={AudioDevices} alt='' />
                Sounds, Speech, and Audio Devices
            </span>
            <div className='cp-subpage-accent' />
        </div>
        <h2 className='hidden-title cp-section-title'>Pick a task...</h2>
        <ul className='cp-task-list'>
            <li onClick={onOpenVolumeControl}><img src={Go} alt='' />Adjust the system volume</li>
            <li ><img src={Go} alt='' />Change the sound scheme</li>
            <li ><img src={Go} alt='' />Change the speaker settings</li>
        </ul>
        <h2 className='hidden-title cp-section-title'>or pick a Control Panel icon</h2>
        <div className='cp-icon-grid'>

            <div><img src={VolumeAlt} alt='' />Sounds and Audio Devices</div>
            <div><img src={Speech} alt='' />Speech</div>
 
        </div>
    </div>
  )
}

export default ControlPanelSound
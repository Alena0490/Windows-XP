import Appearance from '../../../img/Appearance.webp'
import DisplayProperties from '../../../img/DisplayProperties.webp'
import FolderOptions from '../../../img/FolderOptions.webp'
import Go from '../../../img/Go.webp'
import TaskbarAndStart from '../../../img/TaskbarAndStartMenu.webp'

import '../HiddenFolderWarning.css'
import './ControlPanel.css'

interface ControlPanelAppearanceProps {
    onBack?: () => void;
    onOpenDisplayProperties?: (tab?: 'Themes' | 'Desktop' | 'Screen Saver' | 'Appearance' | 'Settings') => void;
}

const ControlPanelAppearance = ({ onOpenDisplayProperties }: ControlPanelAppearanceProps) => {
  return (
    <div className='file-hidden control-panel'>
        <div className='cp-subpage-header'>
            <span className='cp-subpage-title'>
                <img src={Appearance} alt='' />
                Appearance and Themes
            </span>
            <div className='cp-subpage-accent' />
        </div>
        <h2 className='hidden-title cp-section-title'>Pick a task...</h2>
        <ul className='cp-task-list'>
            <li onClick={() => onOpenDisplayProperties?.('Themes')}><img src={Go} alt='' />Change the computer's theme</li>
            <li onClick={() => onOpenDisplayProperties?.('Desktop')}><img src={Go} alt='' />Change the desktop background</li>
            <li onClick={() => onOpenDisplayProperties?.('Screen Saver')}><img src={Go} alt='' />Choose a screen saver</li>
            <li onClick={() => onOpenDisplayProperties?.('Settings')}><img src={Go} alt='' />Change the screen resolution</li>
        </ul>
        <h2 className='hidden-title cp-section-title'>or pick a Control Panel icon</h2>
        <div className='cp-icon-grid'>
            <div><img src={DisplayProperties} alt='' />Display</div>
            <div><img src={FolderOptions} alt='' />Folder Options</div>
            <div><img src={TaskbarAndStart} alt='' />Taskbar and Start Menu</div>
        </div>
    </div>
  )
}

export default ControlPanelAppearance

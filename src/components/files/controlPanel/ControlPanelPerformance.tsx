import AdministrativeTools from '../../../img/AdministrativeTools.webp'
import Go from '../../../img/Go.webp'
import Performance from '../../../img/Performance.webp'
import PowerOptions from '../../../img/PowerOptions.webp'
import ScheduledTasks from '../../../img/ScheduledTasks.webp'
import SystemProperties from '../../../img/SystemProperties.webp'

import '../HiddenFolderWarning.css'
import './ControlPanel.css'

const ControlPanelPerformance = () => {
  return (
    <div className='file-hidden control-panel'>
        <div className='cp-subpage-header'>
            <span className='cp-subpage-title'>
                <img src={Performance} alt='' />
                Performance and Maintenance
            </span>
            <div className='cp-subpage-accent' />
        </div>
        <h2 className='hidden-title cp-section-title'>Pick a task...</h2>
        <ul className='cp-task-list'>
            <li ><img src={Go} alt='' />See basic information about your computer</li>
            <li ><img src={Go} alt='' />Adjust visual effects</li>
            <li ><img src={Go} alt='' />Free up space on your hard disk</li>
            <li ><img src={Go} alt='' />Back up your data</li>
            <li ><img src={Go} alt='' />Rearrange items on your hard disk to make programs run faster</li>
        </ul>
        <h2 className='hidden-title cp-section-title'>or pick a Control Panel icon</h2>
        <div className='cp-icon-grid'>
            <div><img src={AdministrativeTools} alt='' />Administrative Tools</div>
            <div><img src={PowerOptions} alt='' />Power Options</div>
            <div><img src={ScheduledTasks} alt='' />Scheduled Tasks</div>
            <div><img src={SystemProperties} alt='' />System</div>
        </div>
    </div>
  )
}

export default ControlPanelPerformance

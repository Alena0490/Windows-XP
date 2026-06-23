import DateAndRegion from '../../../img/DateandRegion.webp'
import DateAndTime from '../../../img/DateAndTime.webp'
import Go from '../../../img/Go.webp'
import RegionalSettings from '../../../img/RegionalSettings.webp'

import '../HiddenFolderWarning.css'
import './ControlPanel.css'

const ControlPanelDate = () => {
  return (
    <div className='file-hidden control-panel'>
        <div className='cp-subpage-header'>
            <span className='cp-subpage-title'>
                <img src={DateAndRegion} alt='' />
                Date, Time, Language,and Regional Options
            </span>
            <div className='cp-subpage-accent' />
        </div>
        <h2 className='hidden-title cp-section-title'>Pick a task...</h2>
        <ul className='cp-task-list'>
            <li ><img src={Go} alt='' />Change the date and time</li>
            <li ><img src={Go} alt='' />Change the format of numbers, dates, and times</li>
            <li ><img src={Go} alt='' />Add other Languages</li>
        </ul>
        <h2 className='hidden-title cp-section-title'>or pick a Control Panel icon</h2>
        <div className='cp-icon-grid'>

            <div><img src={DateAndTime} alt='' />Date and Time</div>
            <div><img src={RegionalSettings} alt='' />Regional and Language Options</div>
 
        </div>
    </div>
  )
}

export default ControlPanelDate

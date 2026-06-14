import Accessibility from '../../../img/Accessibility.webp'
import Go from '../../../img/Go.webp'


import '../HiddenFolderWarning.css'
import './ControlPanel.css'

const ControlPanelAccessibility = () => {
  return (
    <div className='file-hidden control-panel'>
        <div className='cp-subpage-header'>
            <span className='cp-subpage-title'>
                <img src={Accessibility} alt="" />
                Accessibility Options
            </span>
            <div className='cp-subpage-accent' />
        </div>
        <h2 className='hidden-title cp-section-title'>Pick a task...</h2>
        <ul className='cp-task-list'>
            <li ><img src={Go} alt="" />Adjust the contrast for text and colors on your screen</li>
            <li ><img src={Go} alt="" />Configure Windows to work for your vision, hearing and mobility needs</li>
        </ul>
        <h2 className='hidden-title cp-section-title'>or pick a Control Panel icon</h2>
        <div className='cp-icon-grid'>

            <div><img src={Accessibility} alt="" />Accessibility Options</div>
        </div>
    </div>
  )
}

export default ControlPanelAccessibility

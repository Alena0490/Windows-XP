import GameControllers from '../../../img/GameController.webp'
import Go from '../../../img/Go.webp'
import Keyboard from '../../../img/Keyboard.webp'
import Mouse from '../../../img/Mouse.webp'
import PhoneAndModem from '../../../img/PhoneAndModemOptions.webp'
import PrintersAndFaxes from '../../../img/PrintersAndFaxes.webp'
import PrintersAndHardware from '../../../img/PrintersAndHardware.webp'
import ScannersAndCameras  from '../../../img/ScannersAndCameras.webp'

import '../HiddenFolderWarning.css'
import './ControlPanel.css'

const ControlPanelPrinters = () => {
  return (
    <div className='file-hidden control-panel'>
        <div className='cp-subpage-header'>
            <span className='cp-subpage-title'>
                <img src={PrintersAndHardware} alt="" />
                Printers and Other Hardware
            </span>
            <div className='cp-subpage-accent' />
        </div>
        <h2 className='hidden-title cp-section-title'>Pick a task...</h2>
        <ul className='cp-task-list'>
            <li ><img src={Go} alt="" />View installed printers or fax printers</li>
            <li ><img src={Go} alt="" />Add a printer</li>
        </ul>
        <h2 className='hidden-title cp-section-title'>or pick a Control Panel icon</h2>
        <div className='cp-icon-grid'>
            <div><img src={GameControllers} alt="" />Game Controllers</div>
            <div><img src={Keyboard} alt="" />Keyboard</div>
            <div><img src={Mouse} alt="" />Mouse</div>
            <div><img src={PhoneAndModem} alt="" />Phone and Modem Options</div>
            <div><img src={PrintersAndFaxes} alt="" />Printers and Faxes</div>
            <div><img src={ScannersAndCameras} alt="" />Scanners and Cameras</div>
        </div>
    </div>
  )
}

export default ControlPanelPrinters

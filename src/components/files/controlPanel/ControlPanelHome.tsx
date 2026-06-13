import Accessibility from '../../../img/Accessibility.webp'
import Appearance from '../../../img/Appearance.webp'
import AudioDevices from '../../../img/AudioDevices.webp'
import DateAndRegion from '../../../img/DateandRegion.webp'
import NetworksAndInternet from '../../../img/NetworksAndInternet.webp'
import Performance from '../../../img/Performance.webp'
import PrintersAndHardware from '../../../img/PrintersAndHardware.webp'
import Programs from '../../../img/Programs.webp'
import UserAccouns from '../../../img/UserAccounts.webp'

import '../HiddenFolderWarning.css'
import './ControlPanel.css'

interface ControlPanelHomeProps {
    navigateTo: (path: string[]) => void;
    path: string[];
}

const ControlPanelHome = ({ navigateTo, path }: ControlPanelHomeProps) => {
  return (
    <div className='file-hidden control-panel'>
        <h2 className='hidden-title'>Pick the Category</h2>
        <div className="categories">
            <h3 onClick={() => navigateTo([...path, 'cp-appearance'])}><img src={Appearance} alt="" />Appearance and Themes</h3>
            <h3><img src={PrintersAndHardware} alt="" />Printers and Other Hardware</h3>
            <h3><img src={NetworksAndInternet} alt="" />Network and Internet Connections</h3>
            <h3><img src={UserAccouns} alt="" />User Accounts</h3>
            <h3><img src={Programs} alt="" />Add or Remove Programs</h3>
            <h3><img src={DateAndRegion} alt="" />Date, Time, Language, and Regional Options</h3>
            <h3><img src={AudioDevices} alt="" />Sounds, Speech, and Audio Devices</h3>
            <h3><img src={Accessibility} alt="" />Accessibility Options</h3>
            <h3><img src={Performance} alt="" />Performance and Maintenace</h3>
        </div>
    </div>
  )
}

export default ControlPanelHome

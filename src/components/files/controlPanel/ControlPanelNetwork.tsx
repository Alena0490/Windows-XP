import Go from '../../../img/Go.webp'
import InternetOptions from '../../../img/InternetOptions.webp'
import NetworkAndInternet from '../../../img/NetworksAndInternet.webp'
import NetworkConnections from '../../../img/NetworkConnections.webp'

import '../HiddenFolderWarning.css'
import './ControlPanel.css'

const ControlPanelNetwork = () => {
  return (
    <div className='file-hidden control-panel'>
        <div className='cp-subpage-header'>
            <span className='cp-subpage-title'>
                <img src={NetworkAndInternet} alt="" />
                Network and Internet Connections
            </span>
            <div className='cp-subpage-accent' />
        </div>
        <h2 className='hidden-title cp-section-title'>Pick a task...</h2>
        <ul className='cp-task-list'>
            <li ><img src={Go} alt="" />Setup or Change your Internet connection</li>
            <li ><img src={Go} alt="" />Create a connection to the network at your workplace</li>
            <li ><img src={Go} alt="" />Setup or change your home or small office network</li>
        </ul>
        <h2 className='hidden-title cp-section-title'>or pick a Control Panel icon</h2>
        <div className='cp-icon-grid'>
            <div><img src={InternetOptions} alt="" />Internet Options</div>
            <div><img src={NetworkConnections} alt="" />Network Connections</div>
        </div>
    </div>
  )
}

export default ControlPanelNetwork

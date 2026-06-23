
import Accounts from '../../../img/UserAccounts.webp'
import Go from '../../../img/Go.webp'
import UserCat from '../../../img/user-cat.webp'
import UserSuitcase from '../../../../public/WINDOWS/system32/user-suitcase.jpg'
import UserChess from '../../../../public/WINDOWS/system32/user-chess.jpg'

import '../HiddenFolderWarning.css'
import './ControlPanel.css'

const ControlPanelAccounts = () => {
  return (
    <div className='file-hidden control-panel'>
        <div className='cp-subpage-header'>
            <span className='cp-subpage-title'>
                <img src={Accounts} alt='' />
                User Accounts
            </span>
            <div className='cp-subpage-accent' />
        </div>
        <h2 className='hidden-title cp-section-title'>Pick a task...</h2>
        <ul className='cp-task-list'>
            <li ><img src={Go} alt='' />Change an account</li>
            <li ><img src={Go} alt='' />Create a new account</li>
            <li ><img src={Go} alt='' />Change the way users log on or off</li>
        </ul>
        <h2 className='hidden-title cp-section-title'>or pick a account to change</h2>
        <div className='cp-icon-grid'>
            <div className='user-account'>
                <img src={UserCat} alt='' />
                <div className='user'>
                    <span className='primary'>Alena</span>
                    <span className='secondary'>Computer Administrator</span>
                </div>
            </div>
            <div className='user-account'>
                <img src={UserChess} alt='' />
                 <div className='user'>
                    <span className='primary'>Administrator</span>
                    <span className='secondary'>Computer Administrator</span>
                </div>
            </div>
            <div className='user-account'>
                <img src={UserSuitcase} alt='' />
                 <div className='user'>
                    <span className='primary'>Guest</span>
                    <span className='secondary'>Guest account is off</span>
                </div>
            </div>
            
 
        </div>
    </div>
  )
}

export default ControlPanelAccounts

import MenuLogo from '../../img/logo.webp'
import '../AppMenu.css';

const OutlookMenu = () => {
    return (
        <menu className='app-menu'>
            <ul>
                <li><span className='mnemonic'>F</span>ile</li>
                <li><span className='mnemonic'>E</span>dit</li>
                <li><span className='mnemonic'>V</span>iew</li>
                <li><span className='mnemonic'>T</span>ools</li>
                <li><span className='mnemonic'>M</span>essage</li>
                <li><span className='mnemonic'>H</span>elp</li>
            </ul>
            <span className="oe-logo">
                <img className='menu-logo' src={MenuLogo} alt="" />
            </span>
            
        </menu>
    )
}

export default OutlookMenu

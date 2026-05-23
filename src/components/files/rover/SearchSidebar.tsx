import { FILE_SYSTEM } from './data/FileManagerData';
import Close from '../../img/tileClose.png';
import './SearchSidebar.module.css'

interface SearchSidebarProps {
    onClose: () => void;
}

const SearchSidebar = ({onClose}: SearchSidebarProps) => {

  return (
    <div className='search-wrap'>
        <div className="search-panel">
            {/* ── Header ── */}
             <div className='search-header'>
                    <span className='search-title'>Search Comanion</span>
                    <button
                        type='button'
                        className='search-close'
                        aria-label='Close history'
                        onClick={onClose}
                    >
                        <img src={Close} alt='' />
                    </button>
                </div>

                {/* ── View / Search ── */}
                <div className="search-window">
                    <div className="search-bubble"></div>
                </div>
        </div>
    </div>
  )
}

export default SearchSidebar
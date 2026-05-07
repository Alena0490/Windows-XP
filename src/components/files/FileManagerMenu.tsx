import { useState, useEffect, useRef } from 'react';
import AboutDialog from '../AboutDialog';
import useSound from '../../hooks/useSound';
import FolderClosedIcon from '../../img/FolderClosed.webp';
import URL from '../../img/URL.webp';
import ZipIcon from '../../img/ZipFolder.webp';
import DesktopIcon from '../../img/Desktop.webp';
import MyDocumentsIcon from '../../img/MyDocuments.webp';
import RemovableMedia from '../../img/RemovableMedia.webp';
import LnkIcon from '../../img/URL.webp';
import TxtIcon from '../../img/TXT.webp';
import EmailIcon from '../../img/Email.webp';
import FloppyIcon from '../../img/Save.webp';
import BriefcaseIcon from '../../img/Briefcase.webp';
import BitmapIcon from '../../img/Bitmap.webp'
import WordpadIcon from '../../img/Wordpad.webp';
import RTFIcon from '../../img/RTF.webp';
import VolumeIcon from '../../img/Volume.webp';

import './FileManagerMenu.css';

interface FileManagerMenuProps {
    onClose: () => void;
    viewMode: 'default' | 'thumbnails' | 'tiles' | 'icons' | 'list';
    onViewChange: (mode: 'default' | 'thumbnails' | 'tiles' | 'icons' | 'list') => void;
}

const MENU_ITEMS = [
    { label: 'File',       mnemonic: <><u>F</u>ile</> },
    { label: 'Edit',       mnemonic: <><u>E</u>dit</> },
    { label: 'View',       mnemonic: <><u>V</u>iew</> },
    { label: 'Favourites', mnemonic: <>F<u>a</u>vourites</> },
    { label: 'Tools',      mnemonic: <><u>T</u>ools</> },
    { label: 'Help',       mnemonic: <><u>H</u>elp</> },
];

const FileManagerMenu = ({ onClose, viewMode, onViewChange }: FileManagerMenuProps) => {

    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [hoveredItem, setHoveredItem] = useState<number | null>(null);
    const [hoveredSubmenu, setHoveredSubmenu] = useState<string | null>(null);
    const [openModal, setOpenModal] = useState<'about' | null>(null);

    const { playStartMenu } = useSound();
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpenMenu(null);
                setHoveredItem(null);
                setHoveredSubmenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const closeMenu = () => {
        setOpenMenu(null);
        setHoveredItem(null);
        setHoveredSubmenu(null);
    };

    const sendToSubmenu = (
        <ul className='file-submenu file-submenu--nested'>
            <li className='file-submenu-item is-disabled'>
                <img src={ZipIcon} alt='' className='menu-item-icon' />
                <span className='file-submenu-label'>Compressed (zipped) Folder</span>
            </li>
            <li className='file-submenu-item is-disabled'>
                <img src={DesktopIcon} alt='' className='menu-item-icon' />
                <span className='file-submenu-label'>Desktop (create shortcut)</span>
            </li>
            <li className='file-submenu-item is-disabled'>
                <img src={EmailIcon} alt='' className='menu-item-icon' />
                <span className='file-submenu-label'>Mail Recipient</span>
            </li>
            <li className='file-submenu-item is-disabled'>
                <img src={MyDocumentsIcon} alt='' className='menu-item-icon' />
                <span className='file-submenu-label'>My Documents</span>
            </li>
            <li className='file-submenu-item is-disabled'>
                <img src={FloppyIcon} alt='' className='menu-item-icon' />
                <span className='file-submenu-label'>3½ Floppy (A:)</span>
            </li>
            <li className='file-submenu-item is-disabled'>
                <img src={RemovableMedia} alt='' className='menu-item-icon' />
                <span className='file-submenu-label'>CD Drive (D:)</span>
            </li>
        </ul>
    );

    const newSubmenu = (
        <ul className='file-submenu file-submenu--nested'>
            <li className='file-submenu-item is-disabled'>
                <img src={FolderClosedIcon} alt='' className='menu-item-icon' />
                <span className='file-submenu-label'><u>F</u>older</span>
            </li>
            <li className='file-submenu-item is-disabled'>
                <img src={LnkIcon} alt='' className='menu-item-icon' />
                <span className='file-submenu-label'><u>S</u>hortcut</span>
            </li>
            <li className='separator' />
            <li className='file-submenu-item is-disabled'>
                <img src={BriefcaseIcon} alt='' className='menu-item-icon' />
                <span className='file-submenu-label'>Briefcase</span>
            </li>
            <li className='file-submenu-item is-disabled'>
                <img src={BitmapIcon} alt='' className='menu-item-icon' />
                <span className='file-submenu-label'>Bitmap Image</span>
            </li>
            <li className='file-submenu-item is-disabled'>
                <img src={WordpadIcon} alt='' className='menu-item-icon' />
                <span className='file-submenu-label'>WordPad Document</span>
            </li>
            <li className='file-submenu-item is-disabled'>
                <img src={RTFIcon} alt='' className='menu-item-icon' />
                <span className='file-submenu-label'>Rich Text Document</span>
            </li>
            <li className='file-submenu-item is-disabled'>
                <img src={TxtIcon} alt='' className='menu-item-icon' />
                <span className='file-submenu-label'>Text Document</span>
            </li>
            <li className='file-submenu-item is-disabled'>
                <img src={VolumeIcon} alt='' className='menu-item-icon' />
                <span className='file-submenu-label'>Wave Sound</span>
            </li>
            <li className='file-submenu-item is-disabled'>
                <img src={ZipIcon} alt='' className='menu-item-icon' />
                <span className='file-submenu-label'>Compressed (zipped) Folder</span>
            </li>
        </ul>
    );

    const fileSubmenu = (
        <ul className='file-submenu'>
            <li className='file-submenu-item is-disabled'><span className='file-submenu-label'>Open</span></li>
            <li className='file-submenu-item is-disabled'><span className='file-submenu-label'>Edit</span></li>
            <li className='file-submenu-item is-disabled'><span className='file-submenu-label'>Print</span></li>
            <li className='separator' />
            <li className='file-submenu-item is-disabled'><span className='file-submenu-label'>Explore</span></li>
            <li className='file-submenu-item is-disabled'><span className='file-submenu-label'>Search...</span></li>
            <li className='separator' />
            <li className='file-submenu-item is-disabled'><span className='file-submenu-label'>Sharing and Security...</span></li>
            <li
                    className='file-submenu-item has-nested'
                    onMouseEnter={() => setHoveredSubmenu('sendto')}
                    onMouseLeave={() => setHoveredSubmenu(null)}
                >
                <span className='file-submenu-label'>Send To</span>
                <span className='file-submenu-arrow'>▸</span>
                {hoveredSubmenu === 'sendto' && sendToSubmenu}
            </li>
            <li
                className='file-submenu-item has-nested'
                onMouseEnter={() => setHoveredSubmenu('new')}
                onMouseLeave={() => setHoveredSubmenu(null)}
            >
                <span className='file-submenu-label'>New</span>
                <span className='file-submenu-arrow'>▸</span>
                {hoveredSubmenu === 'new' && newSubmenu}
            </li>
            <li className='file-submenu-item is-disabled'><span className='file-submenu-label'>Create Shortcut</span></li>
            <li className='separator' />
            <li className='file-submenu-item is-disabled'>
                <span className='file-submenu-label'>Delete</span>
                <span className='file-submenu-shortcut'>Del</span>
            </li>
            <li className='file-submenu-item is-disabled'>
                <span className='file-submenu-label'>Rename</span>
                <span className='file-submenu-shortcut'>F2</span>
            </li>
            <li className='file-submenu-item is-disabled'><span className='file-submenu-label'>Properties</span></li>
            <li className='separator' />
            <li className='file-submenu-item' onClick={() => { closeMenu(); onClose(); }}>
                <span className='file-submenu-label'>Close</span>
            </li>
        </ul>
    );

    const editSubmenu = (
        <ul className='file-submenu'>
            <li className='file-submenu-item is-disabled'>
                <span className='file-submenu-label'>Undo</span>
                <span className='file-submenu-shortcut'>Ctrl+Z</span>
            </li>
            <li className='separator' />
            <li className='file-submenu-item is-disabled'>
                <span className='file-submenu-label'>Cut</span>
                <span className='file-submenu-shortcut'>Ctrl+X</span>
            </li>
            <li className='file-submenu-item is-disabled'>
                <span className='file-submenu-label'>Copy</span>
                <span className='file-submenu-shortcut'>Ctrl+C</span>
            </li>
            <li className='file-submenu-item is-disabled'>
                <span className='file-submenu-label'>Paste</span>
                <span className='file-submenu-shortcut'>Ctrl+V</span>
            </li>
            <li className='file-submenu-item is-disabled'>
                <span className='file-submenu-label'>Paste Shortcut</span>
            </li>
            <li className='separator' />
            <li className='file-submenu-item is-disabled'>
                <span className='file-submenu-label'>Copy To Folder...</span>
            </li>
            <li className='file-submenu-item is-disabled'>
                <span className='file-submenu-label'>Move To Folder...</span>
            </li>
            <li className='separator' />
            <li className='file-submenu-item is-disabled'>
                <span className='file-submenu-label'>Select All</span>
                <span className='file-submenu-shortcut'>Ctrl+A</span>
            </li>
            <li className='file-submenu-item is-disabled'>
                <span className='file-submenu-label'>Invert Selection</span>
            </li>
        </ul>
    );

    const viewSubmenu = (
        <ul className='file-submenu'>
            <li
                className='file-submenu-item has-nested'
                onMouseEnter={() => setHoveredSubmenu('toolbars')}
                onMouseLeave={() => setHoveredSubmenu(null)}
            >
                <span className='file-submenu-label'>Toolbars</span>
                <span className='file-submenu-arrow'>▸</span>
                {hoveredSubmenu === 'toolbars' && (
                    <ul className='file-submenu file-submenu--nested'>
                        <li className='file-submenu-item is-disabled is-checked'>
                            <span className='file-submenu-label'>Standard Buttons</span>
                        </li>
                        <li className='file-submenu-item is-disabled is-checked'>
                            <span className='file-submenu-label'>Address Bar</span>
                        </li>
                        <li className='file-submenu-item is-disabled'>
                            <span className='file-submenu-label'>Links</span>
                        </li>
                        <li className='separator' />
                        <li className='file-submenu-item is-disabled is-checked'>
                            <span className='file-submenu-label'>Lock the Toolbars</span>
                        </li>
                        <li className='file-submenu-item is-disabled'>
                            <span className='file-submenu-label'>Customize...</span>
                        </li>
                    </ul>
                )}
            </li>
            <li className='file-submenu-item is-disabled'>
                <span className='file-submenu-label'>Status Bar</span>
            </li>
            <li
                className='file-submenu-item has-nested'
                onMouseEnter={() => setHoveredSubmenu('explorerbar')}
                onMouseLeave={() => setHoveredSubmenu(null)}
            >
                <span className='file-submenu-label'>Explorer Bar</span>
                <span className='file-submenu-arrow'>▸</span>
                {hoveredSubmenu === 'explorerbar' && (
                    <ul className='file-submenu file-submenu--nested'>
                        <li className='file-submenu-item is-disabled'>
                            <span className='file-submenu-label'>Search</span>
                            <span className='file-submenu-shortcut'>Ctrl+E</span>
                        </li>
                        <li className='file-submenu-item is-disabled'>
                            <span className='file-submenu-label'>Favorites</span>
                            <span className='file-submenu-shortcut'>Ctrl+I</span>
                        </li>
                        <li className='file-submenu-item is-disabled'>
                            <span className='file-submenu-label'>Media</span>
                        </li>
                        <li className='file-submenu-item is-disabled is-checked'>
                            <span className='file-submenu-label'>History</span>
                            <span className='file-submenu-shortcut'>Ctrl+H</span>
                        </li>
                        <li className='separator' />
                        <li className='file-submenu-item is-disabled'>
                            <span className='file-submenu-label'>Folders</span>
                        </li>
                        <li className='file-submenu-item is-disabled'>
                            <span className='file-submenu-label'>Tip of the Day</span>
                        </li>
                    </ul>
                )}
            </li>
        <li className={`file-submenu-item${viewMode === 'thumbnails' ? ' is-bullet' : ''}`} onClick={() => { onViewChange('thumbnails'); closeMenu(); }}>
                <span className='file-submenu-label'>Thumbnails</span>
            </li>
            <li className={`file-submenu-item${viewMode === 'tiles' ? ' is-bullet' : ''}`} onClick={() => { onViewChange('tiles'); closeMenu(); }}>
                <span className='file-submenu-label'>Tiles</span>
            </li>
            <li className={`file-submenu-item${viewMode === 'icons' ? ' is-bullet' : ''}`} onClick={() => { onViewChange('icons'); closeMenu(); }}>
                <span className='file-submenu-label'>Icons</span>
            </li>
            <li className={`file-submenu-item${viewMode === 'list' ? ' is-bullet' : ''}`} onClick={() => { onViewChange('list'); closeMenu(); }}>
                <span className='file-submenu-label'>List</span>
            </li>
            <li className={`file-submenu-item${viewMode === 'default' ? ' is-bullet' : ''}`} onClick={() => { onViewChange('default'); closeMenu(); }}>
                <span className='file-submenu-label'>Details</span>
            </li>
            <li className='separator' />
           <li
                className='file-submenu-item has-nested'
                onMouseEnter={() => setHoveredSubmenu('arrangeby')}
                onMouseLeave={() => setHoveredSubmenu(null)}
            >
                <span className='file-submenu-label'>Arrange Icons by</span>
                <span className='file-submenu-arrow'>▸</span>
                {hoveredSubmenu === 'arrangeby' && (
                    <ul className='file-submenu file-submenu--nested'>
                        <li className='file-submenu-item is-bullet'>
                            <span className='file-submenu-label'>Name</span>
                        </li>
                        <li className='file-submenu-item is-disabled'>
                            <span className='file-submenu-label'>Size</span>
                        </li>
                        <li className='file-submenu-item is-disabled'>
                            <span className='file-submenu-label'>Type</span>
                        </li>
                        <li className='file-submenu-item is-disabled'>
                            <span className='file-submenu-label'>Modified</span>
                        </li>
                        <li className='separator' />
                        <li className='file-submenu-item is-disabled'>
                            <span className='file-submenu-label'>Show in Groups</span>
                        </li>
                        <li className='file-submenu-item is-disabled'>
                            <span className='file-submenu-label'>Auto Arrange</span>
                        </li>
                        <li className='file-submenu-item is-disabled'>
                            <span className='file-submenu-label'>Align to Grid</span>
                        </li>
                    </ul>
                )}
            </li>
            <li className='file-submenu-item is-disabled'>
                <span className='file-submenu-label'>Choose Details...</span>
            </li>
            <li
                className='file-submenu-item has-nested'
                onMouseEnter={() => setHoveredSubmenu('goto')}
                onMouseLeave={() => setHoveredSubmenu(null)}
            >
                <span className='file-submenu-label'>Go To</span>
                <span className='file-submenu-arrow'>▸</span>
                {hoveredSubmenu === 'goto' && (
                    <ul className='file-submenu file-submenu--nested'>
                        <li className='file-submenu-item is-disabled'>
                            <span className='file-submenu-label'>Back</span>
                            <span className='file-submenu-shortcut'>Alt+←</span>
                        </li>
                        <li className='file-submenu-item is-disabled'>
                            <span className='file-submenu-label'>Forward</span>
                            <span className='file-submenu-shortcut'>Alt+→</span>
                        </li>
                        <li className='file-submenu-item is-disabled'>
                            <span className='file-submenu-label'>Up One Level</span>
                        </li>
                        <li className='separator' />
                        <li className='file-submenu-item is-disabled'>
                            <span className='file-submenu-label'>Home Page</span>
                            <span className='file-submenu-shortcut'>Alt+Home</span>
                        </li>
                    </ul>
                )}
            </li>
            <li className='file-submenu-item is-disabled'>
                <span className='file-submenu-label'>Refresh</span>
            </li>
        </ul>
    );

    const favouritesSubmenu = (
        <ul className='file-submenu'>
            <li className='file-submenu-item is-disabled'>
                <span className='file-submenu-label'>Add to Favorites...</span>
            </li>
            <li className='file-submenu-item is-disabled'>
                <span className='file-submenu-label'>Organize Favorites...</span>
            </li>
            <li className='separator' />
            <li
                className='file-submenu-item has-nested'
                onMouseEnter={() => setHoveredSubmenu('links')}
                onMouseLeave={() => setHoveredSubmenu(null)}
            >
                <img src={FolderClosedIcon} alt='' className='menu-item-icon' />
                <span className='file-submenu-label'>Links</span>
                <span className='file-submenu-arrow'>▸</span>
                {hoveredSubmenu === 'links' && (
                    <ul className='file-submenu file-submenu--nested'>
                        <li className='file-submenu-item is-disabled'>
                            <span className='file-submenu-label' style={{ fontStyle: 'italic' }}>(Empty)</span>
                        </li>
                    </ul>
                )}
            </li>
            <li className='file-submenu-item is-disabled'>
                <img src={URL} alt='' className='menu-item-icon' />
                <span className='file-submenu-label'>MSN</span>
            </li>
            <li className='file-submenu-item is-disabled'>
                <img src={URL} alt='' className='menu-item-icon' />
                <span className='file-submenu-label'>Radio Station Guide</span>
            </li>
        </ul>
    );

    
    const toolsSubmenu = (
        <ul className='file-submenu'>
            <li className='file-submenu-item is-disabled'>
                <span className='file-submenu-label'>Map Network Drive...</span>
            </li>
            <li className='file-submenu-item is-disabled'>
                <span className='file-submenu-label'>Disconnect Network Drive...</span>
            </li>
            {/* <li className='separator' /> */}
            <li className='file-submenu-item is-disabled'>
                <span className='file-submenu-label'>Synchronize...</span>
            </li>
            <li className='separator' />
            <li className='file-submenu-item is-disabled'>
                <span className='file-submenu-label'>Folder Options...</span>
            </li>
        </ul>
    );

    const helpSubmenu = (
        <ul className='file-submenu'>
             <li className='file-submenu-item is-disabled'>
                <span className='file-submenu-label'>Help and Support Center</span>
            </li>
            <li className='separator' />
            <li className='file-submenu-item' onClick={() => { closeMenu(); setOpenModal('about'); }}>
                <span className='file-submenu-label'>About File Manager</span>
            </li>
        </ul>
    );

    return (
        <menu className='file-menubar' ref={menuRef}>
            <ul className='file-menu-list'>
                {MENU_ITEMS.map(({ label, mnemonic }) => (
                    <li
                        key={label}
                        className={`file-menu-item ${openMenu === label ? 'is-open' : ''}`}
                    >
                        <button
                            type='button'
                            className='file-menu-trigger'
                            onClick={() => {
                                playStartMenu();
                                setOpenMenu(openMenu === label ? null : label);
                            }}
                        >
                            {mnemonic}
                        </button>

                        {openMenu === 'File' && label === 'File' && fileSubmenu}
                        {openMenu === 'Edit' && label === 'Edit' && editSubmenu}
                        {openMenu === 'View' && label === 'View' && viewSubmenu}
                        {openMenu === 'Favourites' && label === 'Favourites' && favouritesSubmenu}
                        {openMenu === 'Tools' && label === 'Tools' && toolsSubmenu}
                        {openMenu === 'Help' && label === 'Help' && helpSubmenu}
                    </li>
                ))}
            </ul>

            {openModal === 'about' && (
                <AboutDialog
                    title='File Manager'
                    onClose={() => setOpenModal(null)}
                />
            )}
        </menu>
    );
};

export default FileManagerMenu;
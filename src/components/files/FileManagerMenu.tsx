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
import BitmapIcon from '../../img/Bitmap.webp';
import WordpadIcon from '../../img/Wordpad.webp';
import RTFIcon from '../../img/RTF.webp';
import VolumeIcon from '../../img/Volume.webp';

import './FileManagerMenu.css';

interface FileManagerMenuProps {
    onClose: () => void;
    viewMode: 'thumbnails' | 'tiles' | 'icons' | 'list' | 'details' | 'similarity';
    onViewChange: (mode: 'thumbnails' | 'tiles' | 'icons' | 'list' | 'details' | 'similarity') => void;
    onGoBack: () => void;
    onGoForward: () => void;
    onGoUp: () => void;
    canGoBack: boolean;
    canGoForward: boolean;
    canGoUp: boolean;
    onOpenIE: () => void;
    onOpenNotepad?: () => void;
    showStatusBar: boolean;
    onToggleStatusBar: () => void;
    sortBy: 'name' | 'size' | 'type' | 'modified';
    onSortChange: (sort: 'name' | 'size' | 'type' | 'modified') => void;
    showStandardButtons: boolean;
    onToggleStandardButtons: () => void;
    showAddressBar: boolean;
    onToggleAddressBar: () => void;
    showOtherPlaces: boolean;
    onToggleOtherPlaces: () => void;
    showTipOfTheDay: boolean;
    onToggleDetails: () => void;
    showHistory: boolean;
    onToggleHistory: () => void;
    showSearch: boolean;
    onToggleSearch: () => void;
    globalVolume: number;
    globalMuted: boolean;
    plusTheme?: 'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
    onError?: (type: import('../CriticalError').ErrorType) => void;
    openModal: 'about' | null;
    setOpenModal: React.Dispatch<React.SetStateAction<'about' | null>>;
}

const MENU_ITEMS = [
    { label: 'File',       mnemonic: <><u>F</u>ile</> },
    { label: 'Edit',       mnemonic: <><u>E</u>dit</> },
    { label: 'View',       mnemonic: <><u>V</u>iew</> },
    { label: 'Favourites', mnemonic: <>F<u>a</u>vourites</> },
    { label: 'Tools',      mnemonic: <><u>T</u>ools</> },
    { label: 'Help',       mnemonic: <><u>H</u>elp</> },
];

const FileManagerMenu = ({ 
    onClose, 
    viewMode, 
    onViewChange, 
    onGoBack, 
    onGoForward, 
    onGoUp, 
    canGoBack, 
    canGoForward, 
    canGoUp,
    onOpenIE,
    onOpenNotepad,
    showStatusBar,
    onToggleStatusBar,
    sortBy,
    onSortChange,
    showStandardButtons,
    showAddressBar,
    onToggleStandardButtons,
    onToggleAddressBar,
    showTipOfTheDay,
    showOtherPlaces,
    onToggleDetails,
    onToggleOtherPlaces,
    showHistory,
    onToggleHistory,
    showSearch,
    onToggleSearch,
    globalVolume,
    globalMuted,
    plusTheme,
    onError,
    openModal,
    setOpenModal,
}: FileManagerMenuProps) => {

    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [hoveredItem, setHoveredItem] = useState<number | null>(null);
    const [hoveredSubmenu, setHoveredSubmenu] = useState<string | null>(null);

    const sounds = useSound(globalVolume, globalMuted);
    const themeSound = plusTheme === 'aquarium' ? sounds.aquarium
        : plusTheme === 'davinci' ? sounds.daVinci
        : plusTheme === 'nature' ? sounds.nature
        : plusTheme === 'space' ? sounds.space
        : null;
    const playStartMenu = () => themeSound ? themeSound.playMenuCmd() : sounds.playStartMenu();
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
            <li className='file-submenu-item' onClick={() => { playStartMenu(); onOpenNotepad?.(); closeMenu(); }}>
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
            <li className='file-submenu-item is-disabled'><span className='file-submenu-label'><u>O</u>pen</span></li>
            <li className='file-submenu-item is-disabled'><span className='file-submenu-label'><u>E</u>dit</span></li>
            <li className='file-submenu-item' onClick={() => { playStartMenu(); onError?.('printerConnect'); }}><span className='file-submenu-label'><u>P</u>rint</span></li>
            <li className='separator' />
            <li className='file-submenu-item is-disabled'><span className='file-submenu-label'>E<u>x</u>plore</span></li>
            <li className='file-submenu-item is-disabled'><span className='file-submenu-label'><u>S</u>earch...</span></li>
            <li className='separator' />
            <li className='file-submenu-item is-disabled'><span className='file-submenu-label'>Shar<u>i</u>ng and Security...</span></li>
            <li className='file-submenu-item has-nested' onMouseEnter={() => setHoveredSubmenu('sendto')} onMouseLeave={() => setHoveredSubmenu(null)}>
                <span className='file-submenu-label'>Sen<u>d</u> To</span>
                <span className='file-submenu-arrow'>▸</span>
                {hoveredSubmenu === 'sendto' && sendToSubmenu}
            </li>
            <li className='file-submenu-item has-nested' onMouseEnter={() => setHoveredSubmenu('new')} onMouseLeave={() => setHoveredSubmenu(null)}>
                <span className='file-submenu-label'><u>N</u>ew</span>
                <span className='file-submenu-arrow'>▸</span>
                {hoveredSubmenu === 'new' && newSubmenu}
            </li>
            <li className='file-submenu-item is-disabled'><span className='file-submenu-label'>Create <u>S</u>hortcut</span></li>
            <li className='separator' />
            <li className='file-submenu-item is-disabled'>
                <span className='file-submenu-label'><u>D</u>elete</span>
                <span className='file-submenu-shortcut'>Del</span>
            </li>
            <li className='file-submenu-item is-disabled'>
                <span className='file-submenu-label'>Rena<u>m</u>e</span>
                <span className='file-submenu-shortcut'>F2</span>
            </li>
            <li className='file-submenu-item is-disabled'><span className='file-submenu-label'>Propert<u>i</u>es</span></li>
            <li className='separator' />
            <li className='file-submenu-item' onClick={() => { playStartMenu(); closeMenu(); onClose(); }}>
                <span className='file-submenu-label'><u>C</u>lose</span>
            </li>
        </ul>
    );

    const editSubmenu = (
        <ul className='file-submenu'>
            <li className='file-submenu-item is-disabled'>
                <span className='file-submenu-label'><u>U</u>ndo</span>
                <span className='file-submenu-shortcut'>Ctrl+Z</span>
            </li>
            <li className='separator' />
            <li className='file-submenu-item is-disabled'>
                <span className='file-submenu-label'>Cu<u>t</u></span>
                <span className='file-submenu-shortcut'>Ctrl+X</span>
            </li>
            <li className='file-submenu-item is-disabled'>
                <span className='file-submenu-label'><u>C</u>opy</span>
                <span className='file-submenu-shortcut'>Ctrl+C</span>
            </li>
            <li className='file-submenu-item is-disabled'>
                <span className='file-submenu-label'><u>P</u>aste</span>
                <span className='file-submenu-shortcut'>Ctrl+V</span>
            </li>
            <li className='file-submenu-item is-disabled'>
                <span className='file-submenu-label'>Paste <u>S</u>hortcut</span>
            </li>
            <li className='separator' />
            <li className='file-submenu-item is-disabled'>
                <span className='file-submenu-label'>Cop<u>y</u> To Folder...</span>
            </li>
            <li className='file-submenu-item is-disabled'>
                <span className='file-submenu-label'><u>M</u>ove To Folder...</span>
            </li>
            <li className='separator' />
            <li className='file-submenu-item is-disabled'>
                <span className='file-submenu-label'>Select <u>A</u>ll</span>
                <span className='file-submenu-shortcut'>Ctrl+A</span>
            </li>
            <li className='file-submenu-item is-disabled'>
                <span className='file-submenu-label'><u>I</u>nvert Selection</span>
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
                <span className='file-submenu-label'><u>T</u>oolbars</span>
                <span className='file-submenu-arrow'>▸</span>
                {hoveredSubmenu === 'toolbars' && (
                    <ul className='file-submenu file-submenu--nested'>
                        <li
                            className={`file-submenu-item${showStandardButtons ? ' is-checked' : ''}`}
                            onClick={() => { playStartMenu(); onToggleStandardButtons(); closeMenu(); }}
                        >
                            <span className='file-submenu-label'><u>S</u>tandard Buttons</span>
                        </li>
                        <li
                            className={`file-submenu-item${showAddressBar ? ' is-checked' : ''}`}
                            onClick={() => { playStartMenu(); onToggleAddressBar(); closeMenu(); }}
                        >
                            <span className='file-submenu-label'><u>A</u>ddress Bar</span>
                        </li>
                        <li className='file-submenu-item is-disabled'>
                            <span className='file-submenu-label'><u>L</u>inks</span>
                        </li>
                        <li className='separator' />
                        <li className='file-submenu-item is-disabled is-checked'>
                            <span className='file-submenu-label'>Loc<u>k</u> the Toolbars</span>
                        </li>
                        <li className='file-submenu-item is-disabled'>
                            <span className='file-submenu-label'><u>C</u>ustomize...</span>
                        </li>
                    </ul>
                )}
            </li>
            <li
                className={`file-submenu-item${showStatusBar ? ' is-checked' : ''}`}
                onClick={() => { playStartMenu(); onToggleStatusBar(); closeMenu(); }}
            >
                <span className='file-submenu-label'>Stat<u>u</u>s Bar</span>
            </li>
            <li
                className='file-submenu-item has-nested'
                onMouseEnter={() => setHoveredSubmenu('explorerbar')}
                onMouseLeave={() => setHoveredSubmenu(null)}
            >
                <span className='file-submenu-label'><u>E</u>xplorer Bar</span>
                <span className='file-submenu-arrow'>▸</span>
                {hoveredSubmenu === 'explorerbar' && (
                    <ul className='file-submenu file-submenu--nested'>
                        <li
                            className={`file-submenu-item${showSearch ? ' is-checked' : ''}`}
                            onClick={() => { playStartMenu(); onToggleSearch(); closeMenu(); }}
                        >
                            <span className='file-submenu-label'><u>S</u>earch</span>
                            <span className='file-submenu-shortcut'>Ctrl+E</span>
                        </li>
                        <li className='file-submenu-item is-disabled'>
                            <span className='file-submenu-label'>F<u>a</u>vorites</span>
                            <span className='file-submenu-shortcut'>Ctrl+I</span>
                        </li>
                        <li className='file-submenu-item is-disabled'>
                            <span className='file-submenu-label'><u>M</u>edia</span>
                        </li>
                        {/* History */}
                        <li
                            className={`file-submenu-item${showHistory ? ' is-checked' : ''}`}
                            onClick={() => { playStartMenu(); onToggleHistory(); closeMenu(); }}
                        >
                            <span className='file-submenu-label'><u>H</u>istory</span>
                            <span className='file-submenu-shortcut'>Ctrl+H</span>
                        </li>
                        <li className='separator' />
                        {/* Folders - Other Places   */}
                        <li
                            className={`file-submenu-item is-disabled ${showOtherPlaces ? ' is-checked' : ''}`}
                            onClick={() => { onToggleOtherPlaces(); closeMenu(); }}
                        >
                            <span className='file-submenu-label'><u>F</u>olders</span>
                        </li>
                        {/* Tip of the Day - Details */}
                        <li
                            className={`file-submenu-item${showTipOfTheDay ? ' is-checked' : ''}`}
                            onClick={() => { playStartMenu(); onToggleDetails(); closeMenu(); }}
                        >
                            <span className='file-submenu-label'><u>T</u>ip of the Day</span>
                        </li>
                        <li className='separator' />
                        <li className='file-submenu-item is-disabled'>
                            <span className='file-submenu-label'>Settings</span>
                        </li>
                    </ul>
                )}
            </li>
            <li className='separator' />
            <li className={`file-submenu-item${viewMode === 'thumbnails' ? ' is-bullet' : ''}`} onClick={() => { playStartMenu(); onViewChange('thumbnails'); closeMenu(); }}>
                <span className='file-submenu-label'>T<u>h</u>umbnails</span>
            </li>
            <li className={`file-submenu-item${viewMode === 'tiles' ? ' is-bullet' : ''}`} onClick={() => { playStartMenu(); onViewChange('tiles'); closeMenu(); }}>
                <span className='file-submenu-label'>T<u>i</u>les</span>
            </li>
            <li className={`file-submenu-item${viewMode === 'icons' ? ' is-bullet' : ''}`} onClick={() => { playStartMenu(); onViewChange('icons'); closeMenu(); }}>
                <span className='file-submenu-label'><u>I</u>cons</span>
            </li>
            <li className={`file-submenu-item${viewMode === 'list' ? ' is-bullet' : ''}`} onClick={() => { playStartMenu(); onViewChange('list'); closeMenu(); }}>
                <span className='file-submenu-label'><u>L</u>ist</span>
            </li>
            <li className={`file-submenu-item${viewMode === 'details' ? ' is-bullet' : ''}`} onClick={() => { playStartMenu(); onViewChange('details'); closeMenu(); }}>
                <span className='file-submenu-label'><u>D</u>etails</span>
            </li>
            <li className='separator' />
           <li className='file-submenu-item has-nested' onMouseEnter={() => setHoveredSubmenu('arrangeby')} onMouseLeave={() => setHoveredSubmenu(null)}>
                <span className='file-submenu-label'><u>A</u>rrange Icons by</span>
                <span className='file-submenu-arrow'>▸</span>
                {hoveredSubmenu === 'arrangeby' && (
                    <ul className='file-submenu file-submenu--nested'>
                        <li
                            className={`file-submenu-item${sortBy === 'name' ? ' is-bullet' : ''}`}
                            onClick={() => { playStartMenu(); onSortChange('name'); closeMenu(); }}
                        >
                            <span className='file-submenu-label'><u>N</u>ame</span>
                        </li>
                        <li
                            className={`file-submenu-item${sortBy === 'size' ? ' is-bullet' : ''}`}
                            onClick={() => { playStartMenu(); onSortChange('size'); closeMenu(); }}
                        >
                            <span className='file-submenu-label'><u>S</u>ize</span>
                        </li>
                        <li
                            className={`file-submenu-item${sortBy === 'type' ? ' is-bullet' : ''}`}
                            onClick={() => { playStartMenu(); onSortChange('type'); closeMenu(); }}
                        >
                            <span className='file-submenu-label'><u>T</u>ype</span>
                        </li>
                        <li
                            className={`file-submenu-item${sortBy === 'modified' ? ' is-bullet' : ''}`}
                            onClick={() => { playStartMenu(); onSortChange('modified'); closeMenu(); }}
                        >
                            <span className='file-submenu-label'><u>M</u>odified</span>
                        </li>
                        <li className='separator' />
                        <li className='file-submenu-item is-disabled'>
                            <span className='file-submenu-label'>S<u>h</u>ow in Groups</span>
                        </li>
                        <li className='file-submenu-item is-disabled'>
                            <span className='file-submenu-label'><u>A</u>uto Arrange</span>
                        </li>
                        <li className='file-submenu-item is-disabled'>
                            <span className='file-submenu-label'>A<u>l</u>ign to Grid</span>
                        </li>
                    </ul>
                )}
            </li>
            <li className='file-submenu-item is-disabled'>
                <span className='file-submenu-label'>C<u>h</u>oose Details...</span>
            </li>
            <li
                className='file-submenu-item has-nested'
                onMouseEnter={() => setHoveredSubmenu('goto')}
                onMouseLeave={() => setHoveredSubmenu(null)}
            >
                <span className='file-submenu-label'>Go <u>T</u>o</span>
                <span className='file-submenu-arrow'>▸</span>
               {hoveredSubmenu === 'goto' && (
                    <ul className='file-submenu file-submenu--nested'>
                        <li className={`file-submenu-item${!canGoBack ? ' is-disabled' : ''}`} onClick={() => { if (canGoBack) { playStartMenu(); onGoBack(); closeMenu(); } }}>
                            <span className='file-submenu-label'><u>B</u>ack</span>
                            <span className='file-submenu-shortcut'>Alt+←</span>
                        </li>
                        <li className={`file-submenu-item${!canGoForward ? ' is-disabled' : ''}`} onClick={() => { if (canGoForward) { playStartMenu(); onGoForward(); closeMenu(); } }}>
                            <span className='file-submenu-label'><u>F</u>orward</span>
                            <span className='file-submenu-shortcut'>Alt+→</span>
                        </li>
                        <li className={`file-submenu-item${!canGoUp ? ' is-disabled' : ''}`} onClick={() => { if (canGoUp) { playStartMenu(); onGoUp(); closeMenu(); } }}>
                            <span className='file-submenu-label'><u>U</u>p One Level</span>
                        </li>
                        <li className='separator' />
                        <li className='file-submenu-item' onClick={() => { playStartMenu(); onOpenIE(); closeMenu(); }}>
                            <span className='file-submenu-label'>Ho<u>m</u>e Page</span>
                            <span className='file-submenu-shortcut'>Alt+Home</span>
                        </li>
                    </ul>
                )}
            </li>
            <li className='file-submenu-item is-disabled'>
                <span className='file-submenu-label'><u>R</u>efresh</span>
            </li>
        </ul>
    );

    const favouritesSubmenu = (
        <ul className='file-submenu'>
            <li className='file-submenu-item is-disabled'>
                <span className='file-submenu-label'><u>A</u>dd to Favorites...</span>
            </li>
            <li className='file-submenu-item is-disabled'>
                <span className='file-submenu-label'><u>O</u>rganize Favorites...</span>
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
                <span className='file-submenu-label'><u>M</u>ap Network Drive...</span>
            </li>
            <li className='file-submenu-item is-disabled'>
                <span className='file-submenu-label'><u>D</u>isconnect Network Drive...</span>
            </li>
            <li className='file-submenu-item is-disabled'>
                <span className='file-submenu-label'>S<u>y</u>nchronize...</span>
            </li>
            <li className='separator' />
            <li className='file-submenu-item is-disabled'>
                <span className='file-submenu-label'><u>F</u>older Options...</span>
            </li>
        </ul>
    );

    const helpSubmenu = (
        <ul className='file-submenu'>
            <li className='file-submenu-item is-disabled'>
                <span className='file-submenu-label'><u>H</u>elp and Support Center</span>
            </li>
            <li className='separator' />
            <li className='file-submenu-item' onClick={() => { playStartMenu(); closeMenu(); setOpenModal('about'); }}>
                <span className='file-submenu-label'><u>A</u>bout File Manager</span>
            </li>
        </ul>
    );

    return (
        <menu className='file-menubar' ref={menuRef}>
            <ul className='file-menu-list'>
                {MENU_ITEMS.map(({ label, mnemonic }, index) => (
                    <li
                        key={label}
                        className={`file-menu-item ${openMenu === label ? 'is-open' : ''} ${hoveredItem === index && openMenu !== null ? 'is-open' : ''}`}
                        onMouseEnter={() => {
                            setHoveredItem(index);
                            if (openMenu !== null) {
                                setOpenMenu(label);
                            }
                        }}
                        onMouseLeave={() => setHoveredItem(null)}
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
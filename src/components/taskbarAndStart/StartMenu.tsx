import { useState } from 'react';
import type { ErrorType } from '../CriticalError';
import { getRecentDocs, type RecentDoc } from '../../utils/recentDocs';
import useSound from '../../hooks/useSound';
import UserCat from '../../img/user-cat.webp';

import Internet from '../../img/InternetExplorer6.webp';
import OutlookExpress from '../../img/OutlookExpress.webp';
import Calculator from '../../img/Calculator.webp';
import MinesweeperIcon from '../../img/minesweeperIcon.webp';
import SolitaireIcon from '../../img/Solitaire.webp';
import MyDocuments from '../../img/MyDocuments.webp';
import MyRecentDocuments from '../../img/RecentDocuments.webp';
import MyPictures from '../../img/MyPictures.webp';
import MyMusic from '../../img/MyMusic.webp';
import ControlPanel from '../../img/ControlPanel.webp';
import MyComputer from '../../img/MyComputer.webp';
import ProgramAccess from '../../img/Programs.webp';
import PrintersAndFaxes from '../../img/PrintersAndFaxes.webp';
import Search from '../../img/Search.webp';
import Run from '../../img/Run.webp';
import Help from '../../img/HelpAndSupport.webp';
import LogOff from '../../img/Logout.webp';
import TurnOff from '../../img/Power.webp';
import PaintIcon from '../../img/Paint.webp';
import TerminalIcon from '../../img/CommandPrompt.webp';
import NotepadIcon from '../../img/Notepad.webp';
import MediaPlayerIcon from '../../img/WindowsMediaPlayer 9.webp';
import VolumeIcon from '../../img/VolumeLevel.webp';
import DisplayPropertiesIcon from '../../img/DisplayProperties.webp';
import KeyboardIcon from '../../img/On-Screen Keyboard.webp';
import AllProgramsIcon from '../../img/AllPrograms.webp';
import WindowsCatalog from '../../img/WindowsCatalog.webp';
import WindowsUpdate from '../../img/WindowsUpdate.webp';
import StartMenuPrograms from '../../img/StarMenuPrograms.webp';
import JPGIcon from '../../img/JPG.webp';
import FontsIcon from '../../img/Fonts.webp'
import AdministrativeTools from '../../img/AdministrativeTools.webp'
import NetworConnections from '../../img/NetworkConnections.webp'
import ScannersAndCameras from '../../img/ScannersAndCameras.webp'
import ScheduledTasks from '../../img/ScheduledTasks.webp'

import './StartMenu.css';

interface ModalProps {
    className?: string;
    onIEOpen: () => void;
    onPaintOpen: () => void;
    onCalculatorOpen: () => void;
    onMinesweeperOpen: () => void;
    onSolitaireOpen: () => void;
    onTerminalOpen: () => void;
    onNotepadOpen: () => void;
    onMediaPlayerOpen: () => void;
    onDisplayPropertiesOpen: () => void;
    onKeyboardOpen: () => void;
    onVolumeControlOpen: () => void;
    onRunOpen: () => void;
    onFileManagerOpen: (initialPath?: string[], openSearch?: boolean) => void;
    onAppUnavailable: (type: ErrorType) => void;
    onLogOff: () => void;
    onTurnOff: () => void;
    globalVolume: number;
    globalMuted: boolean;
    onOpenRecentDoc?: (doc: RecentDoc) => void;
    plusTheme?: 'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
}

const StartMenu = ({
    className,
    onIEOpen,
    onPaintOpen,
    onCalculatorOpen,
    onMinesweeperOpen,
    onSolitaireOpen,
    onTerminalOpen,
    onNotepadOpen,
    onMediaPlayerOpen,
    onDisplayPropertiesOpen,
    onKeyboardOpen,
    onVolumeControlOpen,
    onRunOpen,
    onFileManagerOpen,
    onAppUnavailable,
    onLogOff,
    onTurnOff,
    globalVolume,
    globalMuted,
    onOpenRecentDoc,
    plusTheme,
}: ModalProps) => {
    const sounds = useSound(globalVolume, globalMuted);
    const themeSound = plusTheme === 'aquarium' ? sounds.aquarium
        : plusTheme === 'davinci' ? sounds.daVinci
        : plusTheme === 'nature' ? sounds.nature
        : plusTheme === 'space' ? sounds.space
        : null;
    const playStart = () => themeSound ? themeSound.playOpen() : sounds.playStart();
    const [showAllPrograms, setShowAllPrograms] = useState(false);
    const [showAccessories, setShowAccessories] = useState(false);
    const [showGames, setShowGames] = useState(false);
    const [showStartup, setShowStartup] = useState(false);
    const [showControlPanel, setShowControlPanel] = useState(false);
    const [showRecentDocs, setShowRecentDocs] = useState(false);
    const [showPrinters, setShowPrinters] = useState(false);
    const [showAdminTools, setShowAdminTools] = useState(false);
    const [showNetwork, setShowNetwork] = useState(false);
    const [showScanners, setShowScanners] = useState(false);
    const [showScheduled, setShowScheduled] = useState(false);

    const [showAccessibility, setShowAccessibility] = useState(false);
    const [showCommunications, setShowCommunications] = useState(false);
    const [showEntertainment, setShowEntertainment] = useState(false);
    const [showSystemTools, setShowSystemTools] = useState(false);

    const recentDocs = getRecentDocs();

    return (
        <div
            className={className}
            onClick={(e) => e.stopPropagation()}
        >
            <div className='user'>
                <img src={UserCat} alt='Cat' />
                <span>Alena</span>
            </div>

            <div className='menu'>
                {/* MENU - LEFT PART */}
                <div
                    className='menu-left-outer'
                    onMouseLeave={() => setShowAllPrograms(false)}
                >
                    <div className='menu-left'>
                        <div
                            className='menu-item menu-item-detailed'
                            data-tooltip='Finds and displays information and Web sites on the Internet.'
                            onClick={() => { onIEOpen(); playStart(); }}
                        >
                            <img src={Internet} alt='Internet Icon' />
                            <span>
                                Internet
                                <small>Internet Explorer</small>
                            </span>
                        </div>

                        <div
                            className='menu-item menu-item-detailed'
                            data-tooltip='Send and receive electronic mail and newsgroup messages.'
                            onClick={() => onAppUnavailable('appNotFound')}
                        >
                            <img src={OutlookExpress} alt='Email Icon' />
                            <span>
                                E-mail
                                <small>Outlook Express</small>
                            </span>
                        </div>

                        <hr />

                        <div
                            className='menu-item'
                            data-tooltip='Clear the minefield without hitting a mine.'
                            onClick={() => { onMinesweeperOpen(); playStart(); }}
                        >
                            <img src={MinesweeperIcon} alt='Minesweeper Icon' />
                            Minesweeper
                        </div>

                        <div
                            className='menu-item'
                            data-tooltip='Performs basic arithmetic, financial, and scientific calculations'
                            onClick={() => { onCalculatorOpen(); playStart(); }}
                        >
                            <img src={Calculator} alt='Calculator Icon' />
                            Calculator
                        </div>

                        <div
                            className='menu-item'
                            data-tooltip='Opens a Microsoft Disk Operating System (MS-DOS).'
                            onClick={() => { onTerminalOpen(); playStart(); }}
                        >
                            <img src={TerminalIcon} alt='Command Prompt Icon' />
                            Command Prompt
                        </div>

                        <div
                            className='menu-item'
                            data-tooltip='Creates and edits drawings, and displays and edits scanned photos.'
                            onClick={() => { onPaintOpen(); playStart(); }}
                        >
                            <img src={PaintIcon} alt='Paint Icon' />
                            Paint
                        </div>

                        <div
                            className='menu-item'
                            data-tooltip='Creates and edits text files using basic text formatting.'
                            onClick={() => { onNotepadOpen(); playStart(); }}
                        >
                            <img src={NotepadIcon} alt='Notepad Icon' />
                            Notepad
                        </div>

                        <div
                            className='menu-item bottom'
                            onMouseEnter={() => setShowAllPrograms(true)}
                            data-tooltip='Opens a list of all programs installed on your computer.'
                        >
                            All Programs
                            <img src={AllProgramsIcon} alt='All Programs Icon' />
                        </div>
                    </div>

                    {/* ALL PROGRAMS SUBMENU */}
                    {showAllPrograms && (
                        <div className='all-programs-menu'>
                            <div className='menu-item is-disabled'>
                                <img src={ProgramAccess} alt='Program Access' />
                                Set Program Access and Default
                            </div>
                            <div className='menu-item is-disabled'>
                                <img src={WindowsCatalog} alt='Windows Catalog' />
                                Windows Catalog
                            </div>
                            <div className='menu-item is-disabled'>
                                <img src={WindowsUpdate} alt='Windows Update' />
                                Windows Update
                            </div>

                            <hr />

                            {/* ACCESSORIES SUBMENU */}
                            <div
                                className='menu-item has-submenu'
                                onMouseEnter={() => { setShowAccessories(true); setShowGames(false); }}
                                onMouseLeave={() => setShowAccessories(false)}
                            >
                                <img src={StartMenuPrograms} alt='Accessories' />
                                Accessories
                                {showAccessories && (
                                    <div className='all-programs-submenu'>

                                        <div
                                            className='menu-item has-submenu'
                                            onMouseEnter={() => setShowAccessibility(true)}
                                            onMouseLeave={() => setShowAccessibility(false)}
                                        >
                                            <img src={StartMenuPrograms} alt='Accessibility' />
                                            Accessibility
                                            {showAccessibility && (
                                                <div className='all-programs-submenu nested'>
                                                    <div
                                                        className='menu-item'
                                                        onClick={() => { onKeyboardOpen(); playStart(); }}
                                                    >
                                                        <img src={KeyboardIcon} alt='On-Screen Keyboard' />
                                                        On-Screen Keyboard
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div
                                            className='menu-item has-submenu'
                                            onMouseEnter={() => setShowCommunications(true)}
                                            onMouseLeave={() => setShowCommunications(false)}
                                        >
                                            <img src={StartMenuPrograms} alt='Communications' />
                                            Communications
                                            {showCommunications && (
                                                <div className='all-programs-submenu nested'>
                                                    <div className='menu-item menu-item-empty'>(Empty)</div>
                                                </div>
                                            )}
                                        </div>

                                        <div
                                            className='menu-item has-submenu'
                                            onMouseEnter={() => setShowEntertainment(true)}
                                            onMouseLeave={() => setShowEntertainment(false)}
                                        >
                                            <img src={StartMenuPrograms} alt='Entertainment' />
                                            Entertainment
                                            {showEntertainment && (
                                                <div className='all-programs-submenu nested'>
                                                    <div
                                                        className='menu-item'
                                                        onClick={() => { onMediaPlayerOpen(); playStart(); }}
                                                    >
                                                        <img src={MediaPlayerIcon} alt='Windows Media Player' />
                                                        Windows Media Player
                                                    </div>
                                                    <div
                                                        className='menu-item'
                                                        onClick={() => { onVolumeControlOpen(); playStart(); }}
                                                    >
                                                        <img src={VolumeIcon} alt='Volume Control' />
                                                        Volume Control
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div
                                            className='menu-item has-submenu'
                                            onMouseEnter={() => setShowSystemTools(true)}
                                            onMouseLeave={() => setShowSystemTools(false)}
                                        >
                                            <img src={StartMenuPrograms} alt='System Tools' />
                                            System Tools
                                            {showSystemTools && (
                                                <div className='all-programs-submenu nested'>
                                                    <div className='menu-item menu-item-empty'>(Empty)</div>
                                                </div>
                                            )}
                                        </div>

                                        <div
                                            className='menu-item'
                                            onClick={() => { onNotepadOpen(); playStart(); }}
                                        >
                                            <img src={NotepadIcon} alt='Notepad' />
                                            Notepad
                                        </div>
                                        <div
                                            className='menu-item'
                                            onClick={() => { onPaintOpen(); playStart(); }}
                                        >
                                            <img src={PaintIcon} alt='Paint' />
                                            Paint
                                        </div>
                                        <div
                                            className='menu-item'
                                            onClick={() => { onCalculatorOpen(); playStart(); }}
                                        >
                                            <img src={Calculator} alt='Calculator' />
                                            Calculator
                                        </div>
                                        <div
                                            className='menu-item'
                                            onClick={() => { onTerminalOpen(); playStart(); }}
                                        >
                                            <img src={TerminalIcon} alt='Command Prompt' />
                                            Command Prompt
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* GAMES SUBMENU */}
                            <div
                                className='menu-item has-submenu'
                                onMouseEnter={() => { setShowGames(true); setShowAccessories(false); }}
                                onMouseLeave={() => setShowGames(false)}
                            >
                                <img src={StartMenuPrograms} alt='Games' />
                                Games
                                {showGames && (
                                    <div className='all-programs-submenu'>
                                        <div
                                            className='menu-item'
                                            onClick={() => { onMinesweeperOpen(); playStart(); }}
                                        >
                                            <img src={MinesweeperIcon} alt='Minesweeper' />
                                            Minesweeper
                                        </div>
                                        <div
                                            className='menu-item'
                                            onClick={() => { onSolitaireOpen(); playStart(); }}
                                        >
                                            <img src={SolitaireIcon} alt='Solitaire' />
                                            Solitaire
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* STARTUP SUBMENU */}
                            <div 
                                className='menu-item has-submenu'
                                onMouseEnter={() => { setShowStartup(true); setShowAccessories(false); setShowGames(false); }}
                                onMouseLeave={() => setShowStartup(false)}                              
                            >
                                <img src={StartMenuPrograms} alt='Startup' />
                                Startup
                                 {showStartup && (
                                    <div className='all-programs-submenu'>
                                        <div className='menu-item menu-item-empty'>(Empty)</div>
                                    </div>
                                )}
                            </div>
                            <hr />

                            <div
                                className='menu-item'
                                onClick={() => onAppUnavailable('appNotFound')}
                            >
                                <img src={OutlookExpress} alt='Outlook Express' />
                                Outlook Express
                            </div>
                            <div
                                className='menu-item'
                                onClick={() => { onIEOpen(); playStart(); }}
                            >
                                <img src={Internet} alt='Internet Explorer' />
                                Internet Explorer
                            </div>
                            <div
                                className='menu-item'
                                onClick={() => { onDisplayPropertiesOpen(); playStart(); }}
                            >
                                <img src={DisplayPropertiesIcon} alt='Display Properties' />
                                Display Properties
                            </div>
                        </div>
                    )}
                </div>

                {/* MENU - RIGHT PART */}
                <div className='menu-right'>
                    <div 
                        className='menu-item top-menu-item' 
                        data-tooltip='Opens the My Documents folder, where you can store letters, reports, notes, and other kinds of documents.'
                        onClick={() => { onFileManagerOpen(['localdisc', 'c-documents', 'c-admin', 'documents']); playStart(); }}
                    >
                        <img src={MyDocuments} alt='My Documents Icon' />
                        <span>My Documents</span>
                    </div>
                    
                    {/* MY RECENT DOCUMENTS SUBMENU */}
                    <div
                        className='menu-item top-menu-item has-submenu'
                        onMouseEnter={() => setShowRecentDocs(true)}
                        onMouseLeave={() => setShowRecentDocs(false)}
                    >
                        <img src={MyRecentDocuments} alt='My Recent Documents Icon' />
                        <span data-tooltip='Opens a list of the documents you used most recently.'>My Recent Documents</span>
                        {showRecentDocs && (
                            <div className='all-programs-submenu'>
                                {recentDocs.length === 0
                                    ? <div className='menu-item menu-item-empty'>(Empty)</div>
                                    : recentDocs.map(doc => (
                                        <div key={doc.path} className='menu-item' onClick={() => onOpenRecentDoc?.(doc)}>
                                            <img src={
                                                doc.type === 'txt' ? NotepadIcon :
                                                doc.type === 'mp3' ? MediaPlayerIcon :
                                                doc.type === 'image' ? JPGIcon :
                                                NotepadIcon
                                            } alt='' />
                                            {doc.name}
                                        </div>
                                    ))
                                }
                            </div>
                        )}
                    </div>

                    <div 
                        className='menu-item top-menu-item' 
                        data-tooltip='Opens the My Pictures folder, where you can store digital photos'
                        onClick={() => { onFileManagerOpen(['localdisc', 'c-documents', 'c-admin', 'pictures']); playStart(); }}
                    >
                        <img src={MyPictures} alt='My Pictures Icon' />
                        <span>My Pictures</span>
                    </div>
                    <div 
                        className='menu-item top-menu-item' 
                        data-tooltip='Opens the My Music folder, where you can store music and other audio files'
                        onClick={() => { onFileManagerOpen(['localdisc', 'c-documents', 'c-admin', 'music']); playStart(); }}
                    >
                        <img src={MyMusic} alt='My Music Icon' />
                        <span>My Music</span>
                    </div>
                    <div 
                        className='menu-item top-menu-item' 
                        data-tooltip='Displays the drives, folders, and files on your computer'
                        onClick={() => { onFileManagerOpen(); playStart(); }}
                    >
                        <img src={MyComputer} alt='My Computer Icon' />
                        <span>My Computer</span>
                    </div>

                    <hr />

                     {/* CONTROL PANEL SUBMENU */}
                    <div
                        className='menu-item has-submenu'
                        onMouseEnter={() => setShowControlPanel(true)}
                        onMouseLeave={() => setShowControlPanel(false)}
                        onClick={() => { onFileManagerOpen(['controlpanel']); playStart(); }}
                    >
                        <img src={ControlPanel} alt='Control Panel Icon' />
                        <span data-tooltip='Provides options for you to customize the appearance and functionality of your computer, add or remove programs, and set up network connections and user accounts'>Control Panel</span>
                        {showControlPanel && (
                            <div className='all-programs-submenu'>
                                <div className='menu-item' onClick={() => { onDisplayPropertiesOpen(); playStart(); }}>
                                    <img src={DisplayPropertiesIcon} alt='Display Properties' />
                                    Display Properties
                                </div>
                                <div className='menu-item' onClick={() => { onFileManagerOpen(['localdisc', 'c-windows', 'c-windows-fonts']); playStart(); }}>
                                    <img src={FontsIcon} alt='Fonts' />
                                    Fonts
                                </div>

                                <div className='menu-item has-submenu' onMouseEnter={() => setShowPrinters(true)} onMouseLeave={() => setShowPrinters(false)}>
                                    <img src={PrintersAndFaxes} alt='Printers and Faxes' />
                                    Printers and Faxes
                                    {showPrinters && (
                                        <div className='all-programs-submenu'>
                                            <div className='menu-item menu-item-empty'>(Empty)</div>
                                        </div>
                                    )}
                                </div>
                                <div className='menu-item has-submenu' onMouseEnter={() => setShowAdminTools(true)} onMouseLeave={() => setShowAdminTools(false)}>
                                    <img src={AdministrativeTools} alt='Administrative Tools' />
                                    Administrative Tools
                                    {showAdminTools && (
                                        <div className='all-programs-submenu'>
                                            <div className='menu-item menu-item-empty'>(Empty)</div>
                                        </div>
                                    )}
                                </div>
                                <div className='menu-item has-submenu' onMouseEnter={() => setShowNetwork(true)} onMouseLeave={() => setShowNetwork(false)}>
                                    <img src={NetworConnections} alt='Network Connections' />
                                    Network Connections
                                    {showNetwork && (
                                        <div className='all-programs-submenu'>
                                            <div className='menu-item menu-item-empty'>(Empty)</div>
                                        </div>
                                    )}
                                </div>
                                <div className='menu-item has-submenu' onMouseEnter={() => setShowScanners(true)} onMouseLeave={() => setShowScanners(false)}>
                                    <img src={ScannersAndCameras} alt='Scanners and Cameras' />
                                    Scanners and Cameras
                                    {showScanners && (
                                        <div className='all-programs-submenu'>
                                            <div className='menu-item menu-item-empty'>(Empty)</div>
                                        </div>
                                    )}
                                </div>
                                <div className='menu-item has-submenu' onMouseEnter={() => setShowScheduled(true)} onMouseLeave={() => setShowScheduled(false)}>
                                    <img src={ScheduledTasks} alt='Scheduled Tasks' />
                                    Scheduled Tasks
                                    {showScheduled && (
                                        <div className='all-programs-submenu'>
                                            <div className='menu-item menu-item-empty'>(Empty)</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div 
                        className='menu-item'
                        data-tooltip='Specifies default programs for web browsing, sending e-mail, playing media, and other activities.'
                    >
                        <img src={ProgramAccess} alt='Program Access Icon' />
                        <span>Set Program Access<br />and Defaults</span>
                    </div>
                    <div
                        className='menu-item'
                        data-tooltip='Displays installed printers and fax printers and helps you add new ones.'
                        onClick={() => { onFileManagerOpen(['controlpanel', 'cp-printers']); playStart(); }}
                    >
                        <img src={PrintersAndFaxes} alt='Printers and Faxes Icon' />
                        <span>Printers and Faxes</span>
                    </div>

                    <hr />

                    <div 
                        className='menu-item'
                        data-tooltip='Opens the Help and Support Center, where you can find tutorials, troubleshooting information, and support services.'
                    >
                        <img src={Help} alt='Help Icon' />
                        <span>Help and Support</span>
                    </div>
                    <div 
                        className='menu-item' 
                        data-tooltip='Opens the Search Companion window, where you can look for files, folders, printers, computers, or people.'
                        onClick={() => onFileManagerOpen(undefined, true)}
                    >
                        <img src={Search} alt='Search Icon' />
                        <span>Search</span>
                    </div>
                    <div 
                        className='menu-item' 
                        data-tooltip='Opens a program, folder, document, or Web site.' 
                        onClick={() => { onRunOpen(); playStart(); }}
                    >
                        <img src={Run} alt='Run Icon' />
                        <span>Run...</span>
                    </div>
                </div>
            </div>

            <div className='power'>
                <div
                    className='power-button'
                    data-tooltip='Log off or switch to another user account.'
                    onClick={onLogOff}
                >
                    <img src={LogOff} alt='Log Off' />
                    Log Off
                </div>
                <div
                    className='power-button'
                    data-tooltip='Turn off, restart, hibernate, or place your computer on standby.'
                    onClick={onTurnOff}
                >
                    <img src={TurnOff} alt='Turn Off' />
                    Turn Off Computer
                </div>
            </div>
        </div>
    );
};

export default StartMenu;


import { useDraggableDialog } from '../hooks/useDraggableDialog';
import { TERMINAL_APPS } from '../data/appData';

import logo from '../img/logo.webp';
import MinesweeperIcon from '../img/Minesweeper.webp';
import CalculatorIcon from '../img/Calculator.webp';
import IEIcon from '../img/InternetExplorer6.webp';
import FileManagerIcon from '../img/FolderClosed.webp';
import WMPIcon from '../img/WindowsMediaPlayer 9.webp';
import PaintIcon from '../img/Paint.webp';
import NotepadIcon from '../img/Notepad.webp';
import IELogo from '../img/IE6_about_logo.PNG.webp';
import IEFile from '../img/URL.webp';
import SolitaireIcon from '../img/Solitaire.webp'
import KeyboardIcon from '../img/On-Screen Keyboard.webp'
import WordpadIcon from '../img/Wordpad.webp';
import OutlookIcon from './outlook-express/img/OELogo.webp'
import RecorderIcon from '../img/VolumeAlt.webp'

import './AboutDialog.css';
import '../App.css';

const APP_ICONS: Record<string, string> = {
    'Calculator': CalculatorIcon,
    'Notepad': NotepadIcon,
    'Paint': PaintIcon,
    'Internet Explorer': IEIcon,
    'Minesweeper': MinesweeperIcon,
    'File Manager': FileManagerIcon,
    'Windows Media Player': WMPIcon,
    'Solitaire': SolitaireIcon,
    'On-Screen Keyboard': KeyboardIcon,
    'WordPad': WordpadIcon, 
    'Outlook Express': OutlookIcon,
    'Sound Recorder': RecorderIcon,
};

interface AboutDialogProps {
    onClose: () => void;
    style?: React.CSSProperties;
    title: string;
}

const AboutDialog = ({ onClose, style, title }: AboutDialogProps) => {
    const { dialogRef, onMouseDown, draggableStyle } = useDraggableDialog();
    const icon = APP_ICONS[title];
    const size = TERMINAL_APPS.find(a => a.name === title)?.size;
    const wmpSize = TERMINAL_APPS.find(a => a.name === 'Windows Media Player')?.size;

    if (title === 'About Windows Media Player') {
        return (
            <div
                id='about'
                className='app-window about-dialog about-dialog--wmp'
                style={{ ...style, ...draggableStyle }}
                ref={dialogRef}
                tabIndex={-1}
                onMouseDown={onMouseDown}
            >
                <div className='title-bar wmp-title'>
                    <span className='title-bar-text'>
                        {/* <img src={WMPIcon} alt='' aria-hidden='true' /> */}
                        About Windows Media Player
                    </span>
                    <div className='title-bar-buttons xp-title-controls'>
                        <button
                            type='button'
                            className='xp-title-control btn-close'
                            onClick={onClose}
                            aria-label='Close'
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <div className='about-body about-body--wmp'>
                    <div className='about-wmp-logo-wrap'>
                        <img src={logo} alt='' aria-hidden='true' /><sup>™</sup>
                        <p>Windows</p>
                        <p>Media Player</p>
                    </div>
                    <div className='about-wmp-info'>
                        <p>Windows Media Player for Windows XP</p>
                         <p>Copyright &copy; 2026 <a href='https://alena-pumprova.cz/' target='_blank' rel='noopener noreferrer'>Alena Pumprová</a></p>
                        <p>8.00.00.4477</p>
                        {/* <p>Product ID: 55274-640-1839662-23603</p> */}
                        {wmpSize && <p>Application size: {wmpSize} KB</p>}
                    </div>
                </div>

                <div className='about-footer'>
                    <button type='button' className='luna-btn' onClick={onClose} autoFocus>OK</button>
                </div>
            </div>
        );
    }

    if (title === 'Internet Explorer') {
        return (
            <div
                id='about'
                className='app-window about-dialog about-dialog--ie'
                style={{ ...style, ...draggableStyle }}
                ref={dialogRef}
                tabIndex={-1}
                onMouseDown={onMouseDown}
            >
                <div className='title-bar'>
                    <span className='title-bar-text'>
                        <img className='file-icon' src={IEFile} alt='' aria-hidden='true' />
                        About Internet Explorer
                    </span>
                    <div className='title-bar-buttons xp-title-controls'>
                        <button
                            type='button'
                            className='xp-title-control btn-close'
                            onClick={onClose}
                            aria-label='Close'
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <div className='about-body about-body--ie'>
                    <div className='about-ie-logo'>
                        <img src={IELogo} alt='Internet Explorer' />
                    </div>

                    <div className='about-ie-info'>
                        <p>Version: 6.0.2600.0000.xpclient.010817-1148</p>
                        <p>Cipher Strength: 128-bit</p>
                        <p>Product ID: 55274-640-1839662-23603</p>
                        <p>Update Versions: 0</p>
                        {size && <p>Application size: {size} KB</p>}
                    </div>

                    <div className='about-ie-scroll'>
                        <p>This is a browser simulation built as part of a Windows XP Online Edition portfolio project. Visit <a href='https://alena-pumprova.cz/' target='_blank' rel='noopener noreferrer'>alena-pumprova.cz</a> to see more projects.</p>
                    </div>

                    <div className='about-ie-footer'>
                        <img src={logo} alt='' className='about-ie-windows-logo' aria-hidden='true' />
                        <div className='about-ie-links'>
                            <a href='https://github.com/Alena0490/' target='_blank' rel='noopener noreferrer'>
                                Alena Pumprová — Portfolio
                            </a>
                            <a href='https://alena-pumprova.cz/' target='_blank' rel='noopener noreferrer'>
                                About the author
                            </a>
                        </div>
                        <button type='button' className='luna-btn' onClick={onClose} autoFocus>OK</button>
                    </div>
                </div>
            </div>
        );
    }

    if (title === 'On-Screen Keyboard') {
        return (
            <div
                id='about'
                className='app-window about-dialog'
                style={{ ...style, ...draggableStyle }}
                ref={dialogRef}
                tabIndex={-1}
                onMouseDown={onMouseDown}
            >
                <div className='title-bar'>
                    <div className='title-bar-text'>About On-Screen Keyboard</div>
                    <div className='title-bar-buttons xp-title-controls'>
                        <button
                            type='button'
                            className='xp-title-control btn-close'
                            onClick={onClose}
                            aria-label='Close'
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <div className='about-body'>
                    {icon && <img src={icon} className='about-app-icon' alt='' aria-hidden='true' />}
                    <div className='about-content'>
                        <div className='about-app-text'>
                            <p>Microsoft On-Screen Keyboard</p>
                            <p>Version 2.0</p>
                            <p>Copyright &copy; 1998-2001 Microsoft Corporation</p>
                        </div>

                        <p>
                            On-Screen Keyboard is intended to provide a minimum level of
                            functionality for users with limited mobility. Users with limited
                            mobility will need an on-screen keyboard with higher functionality
                            for daily use.
                        </p>

                        <p>
                            On-Screen Keyboard was originally produced for Microsoft by
                            Madentec Limited. For more information about Madentec and a list
                            of Windows-based utilities, see the{' '}
                            <a href='https://alena-pumprova.cz/' target='_blank' rel='noopener noreferrer'>
                                Microsoft Web site
                            </a>.
                        </p>

                        {size && (
                            <p className='about-memory'>
                                Physical memory available to Windows: &nbsp; {size} KB
                            </p>
                        )}
                    </div>
                </div>

                <div className='about-footer'>
                    <button type='button' className='luna-btn' onClick={onClose} autoFocus>OK</button>
                </div>
            </div>
        );
    }

    if (title === 'Outlook Express') {
        return (
            <div
                id='about'
                className='app-window about-dialog about-dialog--oe'
                style={{ ...style, ...draggableStyle }}
                ref={dialogRef}
                tabIndex={-1}
                onMouseDown={onMouseDown}
            >
                <div className='title-bar'>
                    <span className='title-bar-text'>About Outlook Express</span>
                    <div className='title-bar-buttons xp-title-controls'>
                        <button
                            type='button'
                            className='xp-title-control btn-close'
                            onClick={onClose}
                            aria-label='Close'
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <div className='about-body about-body--oe'>
                    <div className='about-oe-header'>
                        {icon && <img className='about-oe-logo' src={icon} alt='' aria-hidden='true' />}
                        <div className='about-oe-wordmark'>
                            <p className='about-oe-ms'>Microsoft</p>
                            <p className='about-oe-name'>Outlook Express 6</p>
                        </div>
                    </div>

                    <div className='about-oe-info'>
                        <p>6.00.2600.0000 (xpclient.010817-1148)</p>
                        <p>&copy; Microsoft Corporation. All rights reserved.</p>
                        <p>Certain designs and sentiments are copyrights of Hallmark Licensing, Inc.</p>
                        <p>
                            No products made with the Outlook Express Stationery which include any
                            copyrighted material or trademarks of Hallmark Cards, Incorporated or its
                            affiliates may be sold or distributed for resale.
                        </p>
                    </div>

                    <div className='about-oe-files'>
                        <div className='about-oe-files-header'>
                            <span className='file-col'>File</span>
                            <span className='version-col'>Version</span>
                            <span className='path-col'>Full Path</span>
                        </div>
                        <div className='about-oe-files-body'>
                            <div className='about-oe-files-row'>
                                <span className='file-col'>acctres.dll</span>
                                <span className='version-col'>6.00.2600.0000 (xpclient.010817-1148)</span>
                                <span className='path-col'>C:\WINDOWS\system32\acctres.dll</span>
                            </div>
                            <div className='about-oe-files-row'>
                                <span className='file-col'>comctl32.dll</span>
                                <span className='version-col'>6.0 (xpclient.010817-1148)</span>
                                <span className='path-col'>C:\WINDOWS\system32\comctl32.dll</span>
                            </div>
                            <div className='about-oe-files-row'>
                                <span className='file-col'>csapi3t1.dll</span>
                                <span className='version-col'>&lt;Unknown&gt;</span>
                                <span className='path-col'>csapi3t1.dll</span>
                            </div>
                            <div className='about-oe-files-row'>
                                <span className='file-col'>directdb.dll</span>
                                <span className='version-col'>6.00.2600.0000 (xpclient.010817-1148)</span>
                                <span className='path-col'>C:\Program Files\Common Files\System\directdb.dll</span>
                            </div>
                            <div className='about-oe-files-row'>
                                <span className='file-col'>inetcomm.dll</span>
                                <span className='version-col'>6.00.2600.0000 (xpclient.010817-1148)</span>
                                <span className='path-col'>C:\WINDOWS\system32\inetcomm.dll</span>
                            </div>
                            <div className='about-oe-files-row'>
                                <span className='file-col'>msoe.dll</span>
                                <span className='version-col'>6.00.2600.0000 (xpclient.010817-1148)</span>
                                <span className='path-col'>C:\Program Files\Outlook Express\msoe.dll</span>
                            </div>
                        </div>
                    </div>

                    {size && (
                        <p className='about-memory'>
                            Application size: &nbsp; {size} KB
                        </p>
                    )}
                </div>

                <div className='about-footer about-footer--oe'>
                    <img src={logo} alt='' className='about-oe-flag' aria-hidden='true' />
                    <button type='button' className='luna-btn' onClick={onClose} autoFocus>OK</button>
                </div>
            </div>
        );
    }

    return (
        <div
            id='about'
            className='app-window about-dialog'
            style={{ ...style, ...draggableStyle }}
            ref={dialogRef}
            tabIndex={-1}
            onMouseDown={onMouseDown}
        >
            <div className='title-bar'>
                <div className='title-bar-text'>About {title}</div>
                <div className='title-bar-buttons xp-title-controls'>
                    <button
                        type='button'
                        className='xp-title-control btn-close'
                        onClick={onClose}
                        aria-label='Close'
                    >
                        ✕
                    </button>
                </div>
            </div>

            <div className='about-banner'>
                <div className='about-copy'>
                    <span>Copyright &copy; 1985-2001</span>
                    <span>Microsoft Corporation</span>
                </div>
                <div className='about-logo'>
                    <img src={logo} className='about-xp-logo' alt='' aria-hidden='true' />
                    <span className='about-tm'>™</span>
                    <p className='about-top'>Microsoft</p>
                    <p className='about-mid'>Windows<span>xp</span></p>
                    <p className='about-bottom'>Professional</p>
                </div>
                <span className='about-company'>Microsoft</span>
            </div>

            <div className='about-body'>
                {icon && <img src={icon} className='about-app-icon' alt='' aria-hidden='true' />}
                <div className='about-content'>
                    <div className='about-app-text'>
                        <p>Microsoft &#174; {title}</p>
                        <p>Version 5.1 (Build 2600.xpclient.010817-1148)</p>
                        <p>Copyright &copy; 1981-2001 Microsoft Corporation</p>
                        {title === 'Sound Recorder' && <p>PCM 22.050 kHz, 8 Bit, Mono</p>}
                    </div>
                    <p className='about-license'>
                        This product is licensed under the terms of the{' '}
                        <a href='https://alena-pumprova.cz/' target='_blank' rel='noopener noreferrer'>
                            End-User License Agreement
                        </a>{' '}
                        to:
                    </p>
                    <p className='about-username'>Alena</p>
                    <hr />
                    {size && (
                        <p className='about-memory'>
                            Physical memory available to Windows: &nbsp; {size} KB
                        </p>
                    )}
                </div>
            </div>

            <div className='about-footer'>
                <button type='button' className='luna-btn' onClick={onClose} autoFocus>OK</button>
            </div>
        </div>
    );
};

export default AboutDialog;
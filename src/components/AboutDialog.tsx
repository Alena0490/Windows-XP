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

            {/* Top Banner */}
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

            {/* Body */}
            <div className='about-body'>
                {icon && <img src={icon} className='about-app-icon' alt='' aria-hidden='true' />}

                <div className='about-content'>
                    <div className='about-app-text'>
                        <p>Microsoft &#174; {title}</p>
                        <p>Version 5.1 (Build 2600.xpclient.010817-1148)</p>
                        <p>Copyright &copy; 1981-2001 Microsoft Corporation</p>
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
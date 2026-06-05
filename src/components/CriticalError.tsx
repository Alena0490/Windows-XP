import useDraggable from '../hooks/useDraggable';
import CriticalErrorIcon from '../img/Critical.webp';
import WarningIcon from '../img/Alert.webp';
import IEIcon from '../img/IEError.png';
// import InfoIcon from '../img/Information.webp'
import './CriticalError.css';
import '../App.css';

interface ErrorButton {
    label: string;
    isDefault?: boolean;
    onClick?: () => void;
    onYes?: () => void;
    onNo?: () => void;
    onCancel?: () => void;
}

interface ErrorConfig {
    titleBar: string;
    message: string[];
    icon: string;
    buttons: ErrorButton[];
    titleIcon?: string;
    onYes?: () => void;
    onNo?: () => void;
    onCancel?: () => void;
}

export type ErrorType =
    | 'appNotFound'
    | 'accessDenied'
    | 'hardDriveFailure'
    | 'webPageNotFound'
    | 'connectionFailed'
    | 'dnsError'
    | 'renameExtension'
    | 'unsavedChanges';
    // Add new error types here

const errorConfig: Record<ErrorType, ErrorConfig>= {
    appNotFound: {
        titleBar: 'C:\\WINDOWS\\system32\\msimn.exe',
        titleIcon: CriticalErrorIcon,
        message: [
            'C:\\WINDOWS\\system32\\msimn.exe',
            'Application not found',
        ],
        icon: CriticalErrorIcon,
        buttons: [{ label: 'OK', isDefault: true }],
    },

    accessDenied: {
        titleBar: 'Local Disk (C:)',
        titleIcon: CriticalErrorIcon,
        message: [
            'C:\\Restricted is not accessible.',
            'Access is denied.',
        ],
        icon: CriticalErrorIcon,
        buttons: [{ label: 'OK', isDefault: true }],
    },

    hardDriveFailure: {
        titleBar: 'Hard Drive Failure',
        titleIcon: CriticalErrorIcon,
        message: [
            'The system has detected a problem with one or more installed IDE / SATA hard disks.',
            'It is recommended that you restart the system.',
        ],
        icon: CriticalErrorIcon,
        buttons: [{ label: 'OK', isDefault: true }],
    },

    renameExtension: {
        titleBar: 'Rename',
        message: [
            'If you change a file name extension, the file may become unusable.',
            'Are you sure you want to change it?',
        ],
        icon: WarningIcon,
        buttons: [{ label: 'Yes', isDefault: true }, { label: 'No' }],
    },

    webPageNotFound: {
        titleBar: 'Web page not found',
        message: [
            'The Web page you requested cannot be found.',
            'It may have been moved or deleted.',
        ],
        icon: IEIcon,
        buttons: [
            { label: 'OK', isDefault: true },
        ],
    },

    connectionFailed: {
        titleBar: 'Cannot connect to server',
        message: [
            'Internet Explorer cannot connect to the server.',
            'The server may be down or the address may be incorrect.',
        ],
        icon: IEIcon,
        buttons: [
            { label: 'OK', isDefault: true },
        ],
    },

    dnsError: {
        titleBar: 'DNS lookup failed',
        message: [
            'The server name could not be resolved.',
            'Check the address and try again.',
        ],
        icon: IEIcon,
        buttons: [
            { label: 'OK', isDefault: true },
        ],
    },

    unsavedChanges: {
        titleBar: 'Notepad',
        message: [
            'The text in the Untitled file has changed.',
            'Do you want to save the changes?',
        ],
        icon: WarningIcon,
        buttons: [
            { label: 'Yes', isDefault: true },
            { label: 'No' },
            { label: 'Cancel' },
        ],
    },
};
interface ErrorProps {
    type: ErrorType;
    onClose: () => void;
    onMouseDown?: () => void;
    isActive?: boolean;
    onYes?: () => void;
    onNo?: () => void;
    onCancel?: () => void;
}

const CriticalError = ({ type, onClose, onMouseDown, isActive, onYes, onNo, onCancel }: ErrorProps) => {
    const { titleBar, message, icon, titleIcon, buttons } = errorConfig[type];

    const { position, handleMouseDown } = useDraggable(
        Math.round(window.innerWidth / 2 - 190),
        Math.round(window.innerHeight / 2 - 100)
    );

    return (
        <div
            className={['app-window', 'error-window', isActive && 'app-window--active'].filter(Boolean).join(' ')}
            style={{ left: position.x, top: position.y }}
            onMouseDown={onMouseDown}
        >
            <div className='title-bar' onMouseDown={handleMouseDown}>
                <span className='title-bar-text'>
                    {titleIcon && <img className='error-title-icon' src={titleIcon} alt='' />}
                    {titleBar}
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

            <div className='error-body'>
                <img className='error-body-icon' src={icon} alt='' />
                <div className='error-text'>
                    {message.map((line, i) => (
                        <span
                            key={i}
                            className='error-message'
                        >
                            {line}
                        </span>
                    ))}
                </div>
            </div>

            <div className='error-footer'>
                {buttons.map((btn) => (
                    <button
                        key={btn.label}
                        type='button'
                        id={btn.isDefault ? 'xp-default-btn' : undefined}
                        className='error-dialog-btn'
                        onClick={
                            btn.label === 'Yes' ? (onYes ?? onClose) :
                            btn.label === 'No' ? (onNo ?? onClose) :
                            btn.label === 'Cancel' ? (onCancel ?? onClose) :
                            (btn.onClick ?? onClose)
                        }
                    >
                        {btn.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CriticalError;
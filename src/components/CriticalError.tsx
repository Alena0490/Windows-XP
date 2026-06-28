import useDraggable from '../hooks/useDraggable';
import CriticalErrorIcon from '../img/Critical.webp';
import WarningIcon from '../img/Alert.webp';
import Info from '../img/Information.webp'
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
    | 'unsavedChanges'
    | 'printerConnect'
    | 'printNoPrinter'
    | 'mixedContent'
    | 'iePrivacy'
    | 'lowDiskSpace'
    | 'catastrophicFailure'
    | 'textNotFound';

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

    printerConnect: {
        titleBar: 'Add Printer',
        message: [
            'Connect to Printer',
            'Windows cannot connect to the printer.',
            'Operation failed with error 0x00000057.',
        ],
        icon: CriticalErrorIcon,
        buttons: [{ label: 'OK', isDefault: true }],
    },

    printNoPrinter: {
        titleBar: 'Print',
        message: [
            'Before you can perform printer-related tasks such as page setup or printing a document, you need to install a printer. Do you want to install a printer now?',
        ],
        icon: Info,
        buttons: [
            { label: 'Yes', isDefault: true },
            { label: 'No' },
        ],
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
    lowDiskSpace: {
        titleBar: 'Low Disk Space',
        message: [
            'You are running out of disk space on Local Disk (C:).',
            'To free space on this drive by deleting old or unnecessary files, click here.',
        ],
        icon: WarningIcon,
        buttons: [{ label: 'OK', isDefault: true }],
    },
    mixedContent: {
        titleBar: 'Security Information',
        message: [
            'This page contains both secure and nonsecure items.',
            'Do you want to display the nonsecure items?',
        ],
        icon: WarningIcon,
        buttons: [
            { label: 'Yes', isDefault: true },
            { label: 'No' },
            { label: 'More Info' },
        ],
    },
    iePrivacy: {
        titleBar: 'Security Information',
        message: [
            'You are about to send information over the internet.',
            'It is possible for other people to see what you send.',
            'Do you want to continue?',
        ],
        icon: WarningIcon,
        buttons: [
            { label: 'Yes', isDefault: true },
            { label: 'No' },
        ],
    },
    catastrophicFailure: {
        titleBar: 'Error',
        message: [
            'Catastrophic failure.',
        ],
        icon: CriticalErrorIcon,
        buttons: [{ label: 'OK', isDefault: true }],
    },
    textNotFound: {
        titleBar: 'Notepad',
        message: [
            'Cannot find the text you specified.',
        ],
        icon: Info,
        buttons: [{ label: 'OK', isDefault: true }],
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
    messageOverride?: string[];
}

const CriticalError = ({ type, onClose, onMouseDown, isActive, onYes, onNo, onCancel, messageOverride }: ErrorProps) => {
    const { titleBar, message, icon, titleIcon, buttons } = errorConfig[type];
    const displayMessage = messageOverride ?? message;

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
                    {displayMessage.map((line, i) => (
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
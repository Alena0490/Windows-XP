import { createPortal } from 'react-dom';
import { useState } from 'react';
import { useDraggableDialog } from '../../hooks/useDraggableDialog';

import emailjs from '@emailjs/browser';
import NewMailMenu from './NewMailMenu';
import SendWebPageDialog from './SendWebModal';

import NewMailIcon from './img/NewMessage.webp';
import SendIcon from './img/Send.webp';
import CutIcon from '../../img/cut.webp';
import CopyIcon from '../../img/Copy.webp';
import PasteIcon from '../../img/Paste.webp';
import UndoIcon from '../../img/Undo.webp';
import CheckIcon from './img/Check.webp';
import WabIcon from './img/Wab.webp';

// Stationeries
import CitrusBG from './stationeries/citrbg.gif'
import CitrusBan from './stationeries/citrban.gif'
import MaizeBG from './stationeries/maizebg.jpg'
import MaizeBan from './stationeries/maizeban.gif'
import LeavesBG from './stationeries/leavesbg.jpg'
import LeavesBan from './stationeries/leavesban.gif'
import NatureBG from './stationeries/naturebg.jpg'
import NatureBan from './stationeries/natureban.gif'
import SunflowerBG from './stationeries/sunfbg.jpg'
import SunflowerBan from './stationeries/sunfban.gif'
import ClearDayBG from './stationeries/clrdaybg.jpg'

// Toolbar
import AlignTools from './img/AlignTools.webp'
import Bold from './img/Bold.webp'
import Italic from './img/Italic.webp'
import Underline from './img/Underline.webp'
import color from './img/Color.webp'
import UnorderedList from './img/List.webp'
import OrderedList from './img/list-ol.svg'

import './NewMail.css'
import '../../App.css'

interface Stationery {
    bg: string;
    banner?: string;
}

const STATIONERY_MAP: Record<string, Stationery> = {
    'nature':       { bg: NatureBG,    banner: NatureBan },
    'clear-day':    { bg: ClearDayBG },
    'maize':        { bg: MaizeBG,     banner: MaizeBan },
    'sunflower':    { bg: SunflowerBG, banner: SunflowerBan },
    'citrus-punch': { bg: CitrusBG,    banner: CitrusBan },
    'leaves':       { bg: LeavesBG,    banner: LeavesBan },
    // 'blank' 
};

interface NewMailProps {
    stationery?: string | null;
    defaultTo?: string;
    defaultSubject?: string;
    defaultBody?: string;
    onClose: () => void;
    onSent?: (msg: { subject: string; body: string }) => void;
    style?: React.CSSProperties;
    isMinimized?: boolean;
    setIsMinimized?: (value: boolean | ((prev: boolean) => boolean)) => void;
    isMaximized?: boolean;
    setIsMaximized?: (value: boolean | ((prev: boolean) => boolean)) => void;
    onMenuCommand?: () => void;
}

const NewMail = ({
    stationery,
    defaultTo = 'webmaster@alenanet.com',
    defaultSubject,
    defaultBody,
    onClose,
    onSent,
    style,
    isMinimized: isMinimizedProp,
    setIsMinimized: setIsMinimizedProp,
    isMaximized: isMaximizedProp,
    setIsMaximized: setIsMaximizedProp,
    onMenuCommand,
}:NewMailProps) => {
    const { dialogRef, draggableStyle, onMouseDown } = useDraggableDialog();

    const [isMinimizedLocal, setIsMinimizedLocal] = useState(false);
    const [isMaximizedLocal, setIsMaximizedLocal] = useState(false);
    const isMinimized = isMinimizedProp ?? isMinimizedLocal;
    const setIsMinimized = setIsMinimizedProp ?? setIsMinimizedLocal;
    const isMaximized = isMaximizedProp ?? isMaximizedLocal;
    const setIsMaximized = setIsMaximizedProp ?? setIsMaximizedLocal;
    const [subject, setSubject] = useState(defaultSubject ?? '');
    const [body, setBody] = useState(defaultBody ?? '');
    const [isBusy, setIsBusy] = useState(false);
    const [sendError, setSendError] = useState<string | null>(null);
    const [showBcc, setShowBcc] = useState(false);
    const [showSendWebPage, setShowSendWebPage] = useState(false);

    const [activeStationeryId, setActiveStationeryId] = useState(stationery ?? null);
    const activeStationery = activeStationeryId ? STATIONERY_MAP[activeStationeryId] : undefined;

    const sendMessage = async (subject: string, body: string, to?: string) => {
        await emailjs.send(
            'service_k1i50up',
            'template_hc48994',
            {
                name: 'Outlook Express Demo',
                email: to ?? defaultTo ?? '', 
                phone: '', 
                message: `Předmět: ${subject}\n\n${body}`, 
            },
            'Q5Ztx5pAS5z8gSFkK'
        );
    };

    const handleSend = async () => {
        setIsBusy(true);
        try {
            await sendMessage(subject, body, defaultTo);
            setIsBusy(false);
            onSent?.({ subject, body });
            onClose();
        } catch (err) {
            console.error('Send failed:', err);
            setIsBusy(false);
            setSendError('The message could not be sent.');
        }
    };

    const handleSendLater = async () => {
        setIsBusy(true);
        try {
            await sendMessage(subject, body, defaultTo);
            setIsBusy(false);
            onSent?.({ subject, body });
            onClose();
        } catch (err) {
            console.error('Send later failed:', err);
            setIsBusy(false);
            setSendError('The message could not be sent.');
        }
    };

    const handleInsertSignature = () => {
        setBody(prev => prev + '\n\n-- \nYour Name'); // TODO: napojit na skutečný podpis z nastavení
    };

    const handleOpenAbout = () => {
        // TODO: zobrazit About dialog
        console.log('About Microsoft Outlook Express');
    };

    const handleOpenIE = (url?: string) => {
        if (url) window.open(url, '_blank');
    };

  return (
    <div
        className={[
            'app-window',
            'new-mail-window',
            isMinimized && 'app-window--minimized',
            isMaximized && 'new-mail-window--fullscreen',
        ].filter(Boolean).join(' ')}
        style={isMaximized
            ? { zIndex: style?.zIndex }
            : { ...style, ...draggableStyle }}
        ref={dialogRef}
        tabIndex={-1}
        onMouseDown={onMouseDown}
    >
        <div
            className='title-bar'
            onMouseDown={(e) => {
                if ((e.target as HTMLElement).closest('.xp-title-control')) return;
                onMouseDown(e);
            }}
        >
            <span className='title-bar-text'>
                <img className='new-mail-title-icon' src={NewMailIcon} alt='' />
                New Message
            </span>
            <div className='title-bar-buttons xp-title-controls'>
                <button 
                    type='button' 
                    className='xp-title-control btn-minimize' 
                    aria-label='Minimize'
                    onClick={() => setIsMinimized(true)}
                    onMouseDown={(e) => e.stopPropagation()}
                >_</button>
                <button
                    type='button'
                    className={`xp-title-control ${isMaximized ? 'btn-restore' : 'btn-maximize'}`}
                    onClick={() => {
                        setIsMinimized(false);
                        setIsMaximized(prev => !prev);
                    }}
                    aria-label={isMaximized ? 'Restore' : 'Maximize'}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    {isMaximized ? '❐' : '□'}
                </button>
                <button 
                type='button' 
                    className='xp-title-control btn-close' 
                    onClick={onClose} 
                    onMouseDown={(e) => e.stopPropagation()}
                    aria-label='Close'
                >✕</button>
            </div>
        </div>
        <NewMailMenu
            onClose={onClose}
            onSend={handleSend}
            onSendLater={handleSendLater}
            onInsertSignature={handleInsertSignature}
            onOpenAbout={handleOpenAbout}
            onOpenIE={handleOpenIE}
            isBusy={isBusy}
            onMenuCommand={onMenuCommand}
            showBcc={showBcc}
            onToggleBcc={() => setShowBcc(v => !v)}
            onApplyStationery={(id) => setActiveStationeryId(id)}
            onOpenSendWebPage={() => setShowSendWebPage(true)}
        />

        <div className='new-mail-toolbar'>
            <button className='nm-btn nm-send' onClick={handleSend} disabled={isBusy}>
                <img src={SendIcon} alt='' />
                <span>Send</span>
            </button>
            <div className='nm-sep' />
            <button className='nm-btn' disabled><img src={CutIcon} alt='' /><span>Cut</span></button>
            <button className='nm-btn' disabled><img src={CopyIcon} alt='' /><span>Copy</span></button>
            <button className='nm-btn' disabled><img src={PasteIcon} alt='' /><span>Paste</span></button>
            <div className='nm-sep' />
            <button className='nm-btn' disabled><img src={UndoIcon} alt='' /><span>Undo</span></button>
            <div className='nm-sep' />
            <button className='nm-btn'><img src={CheckIcon} alt='' /><span>Check</span></button>
            <button className='nm-overflow' aria-label='More buttons'>»</button>
        </div>

        <div className='new-mail-inner'>
        <div className='new-mail-fields'>
            <div className='nm-field'>
                    <label><img className='nm-field-icon' src={WabIcon} alt='' />To:</label>
                    <input 
                        type='text' 
                        tabIndex={-1}  
                        value={defaultTo}
                        readOnly 
                        className='nm-input nm-input-readonly' 
                    />
                </div>
                <div className='nm-field'>
                    <label><img className='nm-field-icon' src={WabIcon} alt='' />Cc:</label>
                    <input 
                        type='text' 
                        readOnly 
                        tabIndex={-1}  
                        className='nm-input nm-input-readonly' 
                    />
                </div>
                {showBcc && (
                    <div className='nm-field'>
                        <label><img className='nm-field-icon' src={WabIcon} alt='' />Bcc:</label>
                        <input 
                            type='text' 
                            readOnly 
                            tabIndex={-1}  
                            className='nm-input nm-input-readonly' 
                        />
                    </div>
                )}
                <div className='nm-field'>
                    <label>Subject:</label>
                    <input
                        type='text'
                        className='nm-input'
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />
                </div>
            </div>

            {/* Format Bar*/}
            <div className='new-mail-format-bar'>
                <select className='nm-format-font' disabled>
                    <option>Arial</option>
                </select>
                <select className='nm-format-size' disabled>
                    <option>10</option>
                </select>
                <div className='nm-format-sep' />
                <button className='nm-format-btn' disabled aria-label='Format bar'><img src={AlignTools} alt='' /></button>
                <div className='nm-format-sep' />
                <button className='nm-format-btn' disabled aria-label='Text bold'><img src={Bold} alt='' /></button>
                <button className='nm-format-btn' disabled aria-label='Text italic'><img src={Italic} alt='' /></button>
                <button className='nm-format-btn' disabled aria-label='Text underline'><img src={Underline} alt='' /></button>
                <button className='nm-format-btn' disabled aria-label='Text color'><img src={color} alt='' /></button>
                <div className='nm-format-sep' />
                <button className='nm-format-btn' disabled aria-label='Ordered list'><img src={OrderedList} alt='' /></button>
                <button className='nm-format-btn' disabled aria-label='Unordered list'><img src={UnorderedList} alt='' /></button>
            </div>

            <div className='new-mail-body-wrap'>
                <div className='new-mail-body'>
                    {activeStationery?.banner && (
                        <img className='nm-banner' src={activeStationery.banner} alt='' />
                    )}
                    <textarea
                        className='nm-body-text'
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        onKeyDown={(e) => {
                            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        style={activeStationery ? { backgroundImage: `url(${activeStationery.bg})` } : undefined}
                    />
                </div>
            </div>
        </div>
        
        <div className='new-mail-status'>
            <span>{sendError}</span>
        </div>
        {showSendWebPage && createPortal(
            <SendWebPageDialog
                onClose={() => setShowSendWebPage(false)}
                onSubmit={(url) => handleOpenIE(url)}
            />,
            document.body
        )}
    </div>
  )
}

export default NewMail
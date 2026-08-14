import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import useDraggable from '../../hooks/useDraggable';
import useSound from '../../hooks/useSound';
import type { FolderKey, MailMessage } from './data/mailboxData';

import OutlookMenu from './OutlookMenu';
import OutlookToolbar from './OutlookToolbar';
import OutlookLoading from './OutlookLoading';
import OutlookApp from './OutlookApp';
import WindowLayoutDialog from './WindowsLayoutDialog';
import AboutDialog from '../AboutDialog';
import NewMail from './NewMail';
import SendWebModal from './SendWebModal';
import StationeryModal from './StationeryModal';

import WindowSystemMenu from '../WindowsSystemMenu'
import OutlookIcon from '../../img/OutlookExpress.webp'
import '../../App.css'
import './OutlookExpress.css'

interface OutlookProps {
    onClose: () => void;
    isMinimized: boolean;
    setIsMinimized: (value: boolean | ((prev: boolean) => boolean)) => void;
    isFullscreen: boolean;
    toggleFullscreen: () => void;
    onMouseDown?: () => void;
    isActive?: boolean;
    globalVolume: number;
    globalMuted: boolean;
    plusTheme?: 'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
    onOpenIE?: (url?: string) => void;
    onNewMailStateChange?: (state: {
        isOpen: boolean;
        isMinimized: boolean;
        setMinimized: (value: boolean | ((prev: boolean) => boolean)) => void;
    }) => void;
}

const OutlookExpress = ({
    onClose,
    isMinimized,
    setIsMinimized,
    isFullscreen,
    toggleFullscreen,
    onMouseDown,
    isActive,
    globalVolume = 1,
    globalMuted = false,
    plusTheme,
    onOpenIE,
    onNewMailStateChange,
}:OutlookProps) => {

    const { position, handleMouseDown } = useDraggable(400, 150);
    const sounds = useSound(globalVolume, globalMuted);
    const themeSound = plusTheme === 'aquarium' ? sounds.aquarium
    : plusTheme === 'davinci' ? sounds.daVinci
    : plusTheme === 'nature' ? sounds.nature
    : plusTheme === 'space' ? sounds.space
    : null;

    const playMenuCmdSound = () => (themeSound ? themeSound.playMenuCmd() : sounds.playStartMenu());

    const [isLoading, setIsLoading] = useState(true);
    const [openModal, setOpenModal] = useState<'about' | 'send' | 'layout' | null>(null);
    const [sendStationery, setSendStationery] = useState<string | null>(null);
    const [showFolders, setShowFolders] = useState(true);
    const [showContacts, setShowContacts] = useState(true);
    const [systemMenuOpen, setSystemMenuOpen] = useState(false);
    const [newMailMinimized, setNewMailMinimized] = useState(false);
    const [newMailMaximized, setNewMailMaximized] = useState(false);
    const [showSendWebPage, setShowSendWebPage] = useState(false);
    const [sendWebUrl, setSendWebUrl] = useState<string | null>(null);
    const [showStationeryModal, setShowStationeryModal] = useState(false);
    const [activeFolder, setActiveFolder] = useState<FolderKey | 'local-folders' | null>(null);
    const [pendingSentMessage, setPendingSentMessage] = useState<MailMessage | null>(null);
    const [mailboxSelection, setMailboxSelection] = useState<{ folder: FolderKey; id: string } | null>(null);
    const [pendingDelete, setPendingDelete] = useState<{ folder: FolderKey; id: string } | null>(null);

    const handleMailSent = ({ subject, body }: { subject: string; body: string }) => {
        const escape = (s: string) =>
            s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const bodyHtml = escape(body).replace(/\n/g, '<br>');
        setPendingSentMessage({
            id: `sent-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            to: 'webmaster@alenanet.com',
            subject: subject || '(no subject)',
            date: new Date().toLocaleString(),
            unread: false,
            bodyHtml,
        });
    };

    const isNewMailOpen = openModal === 'send';
    useEffect(() => {
        onNewMailStateChange?.({
            isOpen: isNewMailOpen,
            isMinimized: newMailMinimized,
            setMinimized: setNewMailMinimized,
        });
    }, [isNewMailOpen, newMailMinimized, onNewMailStateChange]);

    const closeNewMail = () => {
        setNewMailMinimized(false);
        setNewMailMaximized(false);
        setOpenModal(null);
        setSendWebUrl(null);
    };
    
    const outlookIconRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    return isLoading ? (
        <OutlookLoading style={{ left: position.x, top: position.y }} />
    ) : ( 
        <div
            className={[
                'app-window',
                'outlook-window',
                isActive && (!openModal || openModal === 'layout') && 'app-window--active',
                isMinimized && 'outlook--minimized',
                isMinimized && 'app-window--minimized',
                isFullscreen && 'outlook--fullscreen',
                isFullscreen && 'app-window--fullscreen',
            ].filter(Boolean).join(' ')}
            style={isFullscreen ? {} : { left: position.x, top: position.y }}
            onMouseDown={onMouseDown}
        >
            <div className='title-bar' onMouseDown={handleMouseDown}>
                <span className='title-bar-text'>
                    <img 
                        className='outlook-icon' 
                        src={OutlookIcon} 
                        alt='Outlook Express'
                        ref={outlookIconRef}
                        onClick={() => setSystemMenuOpen(prev => !prev)} 
                    />
                    {systemMenuOpen && (
                        <WindowSystemMenu
                            open={systemMenuOpen}
                            onRequestClose={() => setSystemMenuOpen(false)}
                            triggerRef={outlookIconRef}
                            isFullscreen={isFullscreen}
                            onRestore={() => toggleFullscreen()}
                            onMove={() => {}}
                            onSize={() => {}}
                            onMinimize={() => setIsMinimized(true)}
                            onMaximize={() => { setIsMinimized(false); toggleFullscreen(); }}
                            onClose={onClose}
                        />
                    )}
                    Outlook Express
                </span>
                <div className='title-bar-buttons xp-title-controls'>
                    <button
                        type='button'
                        className='xp-title-control btn-minimize'
                        onClick={() => setIsMinimized(true)}
                        aria-label='Minimize'
                    >
                        _
                    </button>
                    <button
                        type='button'
                        className={`xp-title-control ${isFullscreen ? 'btn-restore' : 'btn-maximize'}`}
                        onClick={() => {
                            setIsMinimized(false);
                            toggleFullscreen();
                        }}
                        aria-label={isFullscreen ? 'Restore' : 'Maximize'}
                    >
                        {isFullscreen ? '❐' : '□'}
                    </button>
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
            <OutlookMenu
                onClose={onClose}
                onOpenIE={onOpenIE}
                onOpenLayout={() => setOpenModal('layout')}
                onOpenAbout={() => setOpenModal('about')}
                onCreateMail={(id) => {
                    setSendStationery(id ?? null);
                    setOpenModal('send');
                }}
                onMenuCommand={playMenuCmdSound}
                onOpenSendWebPage={() => setShowSendWebPage(true)}
                onOpenSelectStationery={() => setShowStationeryModal(true)}
            />
            <OutlookToolbar
                onCreateMail={(id) => {
                    setSendStationery(id ?? null);
                    setOpenModal('send');
                }}
                onAddresses={() => {}}
                onFind={() => {}}
                onOpenSendWebPage={() => setShowSendWebPage(true)}
                showMailboxActions={activeFolder !== null}
                deleteDisabled={!mailboxSelection}
                onDelete={() => mailboxSelection && setPendingDelete(mailboxSelection)}
            />
            <OutlookApp
                onOpenIE={onOpenIE}
                showFolders={showFolders}
                showContacts={showContacts}
                onCloseFolders={() => setShowFolders(false)}
                onCloseContacts={() => setShowContacts(false)}
                onActiveFolderChange={setActiveFolder}
                pendingSentMessage={pendingSentMessage}
                onConsumePendingSent={() => setPendingSentMessage(null)}
                pendingDelete={pendingDelete}
                onConsumePendingDelete={() => {
                    setPendingDelete(null);
                    setMailboxSelection(null);
                }}
                onSelectionChange={setMailboxSelection}
                onDeleteRequest={(sel) => setPendingDelete(sel)}
            />

            {openModal === 'layout' && createPortal(
                <WindowLayoutDialog
                    showContacts={showContacts}
                    showFolders={showFolders}
                    onApply={({ contacts, folderList }) => {
                        setShowContacts(contacts);
                        setShowFolders(folderList);
                    }}
                    onClose={() => setOpenModal(null)}
                    style={{ position: 'fixed', top: position.y + 100, left: position.x + 130, zIndex: 1000 }}
                />,
                document.body
            )}

            {openModal === 'about' && createPortal (
                    <AboutDialog
                        title='Outlook Express'
                        onClose={() => setOpenModal(null)}
                        style={{
                            position: 'fixed',
                            top: position.y + 120,
                            left: position.x + 150,
                        }}
                    />,
                    document.body
            )}

            {openModal === 'send' && createPortal(
                <NewMail
                    stationery={sendStationery}
                    defaultSubject={sendWebUrl ?? undefined}
                    defaultBody={sendWebUrl ?? undefined}
                    onClose={closeNewMail}
                    onSent={handleMailSent}
                    style={{ position: 'fixed', top: position.y + 60, left: position.x + 90, zIndex: 1000 }}
                    isMinimized={newMailMinimized}
                    setIsMinimized={setNewMailMinimized}
                    isMaximized={newMailMaximized}
                    setIsMaximized={setNewMailMaximized}
                    onMenuCommand={playMenuCmdSound}
                />,
                document.body
            )}

            {showSendWebPage && createPortal(
                <SendWebModal
                    onClose={() => setShowSendWebPage(false)}
                    onSubmit={(url) => {
                        setSendStationery(null);
                        setSendWebUrl(url);
                        setOpenModal('send');
                    }}
                />,
                document.body
            )}

            {showStationeryModal && createPortal(
                <StationeryModal
                    onClose={() => setShowStationeryModal(false)}
                    onSubmit={(id) => {
                        setSendStationery(id);
                        setSendWebUrl(null);
                        setOpenModal('send');
                    }}
                />,
                document.body
            )}
        </div>
    )
}

export default OutlookExpress

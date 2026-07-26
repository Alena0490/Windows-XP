import { useState } from 'react'

import Msn from './img/MSNLINK.gif'
import LocalFolders from './img/LocalFolders.webp'
import Inbox from './img/InboxClassic.webp'
import Outbox from './img/OutboxClassic.webp'
import Sent from './img/SentClassic.webp'
import Drafts from './img/Drafts.webp'
import Deleted from './img/Deleted.webp'
import WorkOnline from './img/WorkOnline.webp'
import OEClassic from './img/OEClassic.webp'
import Wab from './img/Wab.webp'
import WabFind from './img/WabFind.webp'
import Envelope from './img/Envelope.webp'

import XPScrollbar from '../XPScrollbar';
import TipOfTheDay from './TipOfTheDay';
import OutlookMailbox from './OutlookMailbox';
import { mailboxData as initialMailboxData, FOLDER_LABELS } from './data/mailboxData';
import type { FolderKey } from './data/mailboxData';
import './OutlookExpress.css'

const FOLDER_ICONS: Record<FolderKey, string> = {
    inbox: Inbox,
    outbox: Outbox,
    sent: Sent,
    deleted: Deleted,
    drafts: Drafts,
};

interface OutlookAppProps {
    onOpenIE?: (url?: string) => void;
    showFolders: boolean;
    showContacts: boolean;
    onCloseFolders: () => void;
    onCloseContacts: () => void;
}

const OutlookApp = ({ onOpenIE, showFolders, showContacts, onCloseFolders, onCloseContacts }: OutlookAppProps) => {
    const READ_STORAGE_KEY = 'oe-read-messages';
    const GO_TO_INBOX_KEY = 'oe-go-to-inbox';

    function loadReadIds(): Set<string> {
        try {
            const raw = localStorage.getItem(READ_STORAGE_KEY);
            return raw ? new Set(JSON.parse(raw)) : new Set();
        } catch {
            return new Set();
        }
    }

    function applyReadState(
        data: Record<FolderKey, typeof initialMailboxData[FolderKey]>,
        readIds: Set<string>
    ) {
        const result = {} as typeof data;
        (Object.keys(data) as FolderKey[]).forEach(key => {
            result[key] = data[key].map(m =>
                readIds.has(m.id) ? { ...m, unread: false } : m
            );
        });
        return result;
    }

    const [showTipOfTheDay, setShowTipTipOfTheDay] = useState(true);
    const [activeFolder, setActiveFolder] = useState<FolderKey | null>(() => {
        try {
            return localStorage.getItem(GO_TO_INBOX_KEY) === 'true' ? 'inbox' : null;
        } catch {
            return null;
        }
    });
    const [identitiesOpen, setIdentitiesOpen] = useState(false);
    const [mailboxData, setMailboxData] = useState(() =>
        applyReadState(initialMailboxData, loadReadIds())
    );
    const [goToInbox, setGoToInbox] = useState(() => {
        try {
            return localStorage.getItem(GO_TO_INBOX_KEY) === 'true';
        } catch {
            return false;
        }
    });

    const handleGoToInboxChange = (checked: boolean) => {
        setGoToInbox(checked);
        try {
            localStorage.setItem(GO_TO_INBOX_KEY, String(checked));
        } catch {
            // localStorage is not available
        }
    };

    const markAsRead = (folderKey: FolderKey, messageId: string) => {
        setMailboxData(prev => {
            const updated = {
                ...prev,
                [folderKey]: prev[folderKey].map(m =>
                    m.id === messageId ? { ...m, unread: false } : m
                ),
            };

            const readIds = new Set<string>();
            (Object.keys(updated) as FolderKey[]).forEach(key => {
                updated[key].forEach(m => {
                    if (!m.unread) readIds.add(m.id);
                });
            });

            try {
                localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(Array.from(readIds)));
            } catch {
                // localStorage nedostupné (private mode apod.) — stav se prostě neuloží
            }

            return updated;
        });
    };

    const unreadInboxCount = mailboxData.inbox.filter(m => m.unread).length;

  return (
    <div className='outlook-body'>
        <div className="outlook-top-bar">

        </div>

        <XPScrollbar className="outlook-main">
            <div className="outlook-title">
                <img src={activeFolder ? FOLDER_ICONS[activeFolder] : OEClassic} alt="" />
                {activeFolder ? FOLDER_LABELS[activeFolder] : 'Outlook Express'}
            </div>
                <div className="outlook-flex">
                    <aside>
                        {showFolders && (
                            <div className="folders">
                                <div className="folders-heading">
                                    <span>Folders</span>
                                    <button 
                                        className='heading-close'
                                        aria-label='Close section'
                                        onClick={onCloseFolders}
                                    >&#x2716;</button>
                                </div>
                                <div className="folders-body">
                                    <ul className="win32-tree">
                                        {/* Root: Outlook Express */}
                                        <li className="root-node">
                                            <details open>
                                                <summary onClick={(e) => { e.preventDefault(); setActiveFolder(null); }}>
                                                    <img src={OEClassic} alt="" />
                                                    <span>Outlook Express</span>
                                                </summary>
                                                
                                                <ul>
                                                    {/* Second level: Local Folders */}
                                                    <li>
                                                        <details open>
                                                            <summary>
                                                                <img src={LocalFolders} alt="" />
                                                                <span>Local Folders</span>
                                                            </summary>
                                                            
                                                            <ul>
                                                                {/* End Folders */}
                                                                <li
                                                                    className={`local${activeFolder === 'inbox' ? ' selected' : ''}`}
                                                                    onClick={() => setActiveFolder('inbox')}
                                                                >
                                                                    <img src={Inbox} alt="" />
                                                                    <span className={unreadInboxCount > 0 ? 'unread' : ''}>Inbox</span>
                                                                    {unreadInboxCount > 0 && <span className="folder-count"> ({unreadInboxCount})</span>}
                                                                </li>

                                                                <li 
                                                                    className={`local${activeFolder === 'outbox' ? ' selected' : ''}`}
                                                                    onClick={() => setActiveFolder('outbox')}
                                                                >
                                                                    <img src={Outbox} alt="" />
                                                                    <span>Outbox</span>
                                                                </li>

                                                                <li 
                                                                    className={`local${activeFolder === 'sent' ? ' selected' : ''}`}
                                                                    onClick={() => setActiveFolder('sent')}
                                                                >
                                                                    <img src={Sent} alt="" />
                                                                    <span>Sent Items</span>
                                                                </li>

                                                                <li 
                                                                    className={`local${activeFolder === 'deleted' ? ' selected' : ''}`}
                                                                    onClick={() => setActiveFolder('deleted')}
                                                                >
                                                                    <img src={Deleted} alt="" />
                                                                    <span>Deleted Items</span>
                                                                </li>

                                                                <li 
                                                                    className={`last-node local${activeFolder === 'drafts' ? ' selected' : ''}`}
                                                                    onClick={() => setActiveFolder('drafts')}
                                                                >
                                                                    <img src={Drafts} alt="" />
                                                                    <span>Drafts</span>
                                                                </li>
                                                            </ul>
                                                        </details>
                                                    </li>
                                                </ul>
                                            </details>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {showContacts && (
                            <div className="contents">
                                <div className="contents-heading">
                                    <span><span className='mnemonic'>C</span>ontacts</span>
                                    <button 
                                        className='heading-close'
                                        aria-label='Close section'
                                        onClick={onCloseContacts}
                                    >&#x2716;</button>
                                </div>
                                <div className="contents-body">
                                    There are no contacts to display. Click on Contacts to create a new contact.
                                </div>
                            </div>
                        )}
                    </aside>
                    <div className="outlook-content">
                        {activeFolder ? (
                            <OutlookMailbox
                                folderKey={activeFolder}
                                messages={mailboxData[activeFolder]}
                                onSelectMessage={(id) => markAsRead(activeFolder, id)}
                                onOpenIE={onOpenIE}
                            />
                        ) : (
                        <div className="outlook-page">
                            <span className="white"><span className='none' onClick={() => onOpenIE?.('https://web.archive.org/web/20021130084022/http://www.msn.com/')}>Go to <img src={Msn} alt="msn" /></span></span>
                            <span className="black"></span>
                            <div className="gray-bar">
                                <a href="#" onClick={(e) => e.preventDefault()}>Find a message...</a>
                                <span
                                    className={`identities-toggle${identitiesOpen ? ' open' : ''}`}
                                    onClick={() => setIdentitiesOpen(prev => !prev)}
                                >
                                    Identities
                                    {identitiesOpen && (
                                        <ul className="identities-menu">
                                            <li>Switch Identities...</li>
                                            <li>Add New Identity...</li>
                                            <li>Manage Identities...</li>
                                            <li className="is-disabled">Log Off</li>
                                        </ul>
                                    )}
                                </span>
                            </div>
                            <div className="inner-flex">
                                <div className="e-mail page">
                                    <div className='first'>
                                        <div className="page-title">
                                            <span className='filled'>E-mail</span>
                                            <span className='empty'></span>
                                        </div>
                                        <div className="page-content">
                                            {unreadInboxCount > 0 ? (
                                                <p>
                                                    <img src={Envelope} alt="" className="unread-envelope" />
                                                    There is&nbsp;<a href="#" onClick={() => setActiveFolder('inbox')}><strong>{unreadInboxCount} unread Mail message</strong></a>&nbsp;in your <a href="#" onClick={() => setActiveFolder('inbox')}>Inbox</a>
                                                </p>
                                            ) : (
                                                <p>There are no unread messages in your <a href="#" onClick={() => setActiveFolder('inbox')}>Inbox</a></p>
                                            )}
                                            <p><a href="#" onClick={(e) => e.preventDefault()}>Set up a Mail account...</a></p>
                                        </div>
                                    </div>

                                    <div className="second">
                                        <div className="page-title">
                                            <span className='filled'>Newsgroups</span>
                                            <span className='empty'></span>
                                        </div>
                                        <div className="page-content">
                                            <p><a href="#" onClick={(e) => e.preventDefault()}>Set up a Newsgroups account...</a></p>
                                        </div>
                                    </div>

                                    <div className="third">
                                        <div className="page-title">
                                            <span className='filled'>Contacts</span>
                                            <span className='empty'></span>
                                        </div>

                                        <div className="page-content">
                                                <p><a href="#" onClick={(e) => e.preventDefault()}><img src={Wab} alt="" />Open the Address Book...</a></p>
                                                <p><a href="#" onClick={(e) => e.preventDefault()}><img src={WabFind} alt="" />Find People...</a></p>
                                        </div>
                                    </div>
                                    <label htmlFor="go-to-inbox">
                                        <input
                                            type="checkbox"
                                            id='go-to-inbox'
                                            checked={goToInbox}
                                            onChange={(e) => handleGoToInboxChange(e.target.checked)}
                                        />
                                        When Outlook Express starts, go directly to my&nbsp;<span className='mnemonic'>I</span>nbox.
                                    </label>
                                </div>
                                {showTipOfTheDay && <TipOfTheDay onClose={() => setShowTipTipOfTheDay(false)} />}
                            </div>
                        </div>
                        )}
                    </div>
                </div>
        </XPScrollbar>

        <div className="oe-status-bar">
            <span className='inbox-status'>
                {activeFolder && (
                    <>
                        {mailboxData[activeFolder].length} message(s), {mailboxData[activeFolder].filter(m => m.unread).length} unread
                    </>
                )}
            </span>
            <span><img src={WorkOnline} alt="" />Working Online</span>
            <span><img src={OEClassic} alt="" />No new messages</span>
        </div>
    </div>
  )
}

export default OutlookApp
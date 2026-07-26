import { useState, useRef, useEffect } from 'react';
import { FOLDER_LIST_COLUMN } from './data/mailboxData';
import type { FolderKey, MailMessage } from './data/mailboxData';

import Exclamation from './img/Exclam.webp';
import Attachments from './img/Attachment.webp';
import Flag from './img/Flag.webp';
import ArrowUp from './img/Less.webp';
import Envelope from './img/Envelope.webp';
import EnvelopeOpen from './img/EnvelopeOpen.webp';

import './OutlookExpress.css';
import './OutlookMailbox.css';

interface OutlookMailboxProps {
    folderKey: FolderKey;
    messages: MailMessage[];
    onSelectMessage: (id: string) => void;
    onOpenIE?: (url?: string) => void;
}

const OutlookMailbox = ({
    folderKey,
    messages,
    onSelectMessage,
    onOpenIE,
}: OutlookMailboxProps) => {
    const listColumn = FOLDER_LIST_COLUMN[folderKey];

    const [selectedId, setSelectedId] = useState<string | null>(null);

    const selectedMessage =
        messages.find(message => message.id === selectedId) ?? null;

    const showFlag =
        folderKey === 'inbox' ||
        folderKey === 'deleted';

    const dateLabel =
        folderKey === 'inbox' ||
        folderKey === 'deleted'
            ? 'Received'
            : 'Sent';

    const onOpenIERef = useRef(onOpenIE);
    useEffect(() => {
        onOpenIERef.current = onOpenIE;
    });

    const innerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = innerRef.current;
        if (!container) return;
        const handler = (e: MouseEvent) => {
            const a = (e.target as HTMLElement).closest('a');
            if (!a) return;
            const href = a.getAttribute('href');
            if (href && href.startsWith('http')) {
                e.preventDefault();
                onOpenIERef.current?.(href);
            }
        };
        container.addEventListener('mouseup', handler);
        return () => container.removeEventListener('mouseup', handler);
    }, [selectedMessage]);

    const handleRowClick = (id: string) => {
        setSelectedId(id);
        onSelectMessage(id);
    };

    return (
        <div className="outlook-mailbox">
            <div
                className={[
                    'mailbox-list',
                    showFlag
                        ? 'mailbox-list--with-flag'
                        : 'mailbox-list--without-flag',
                ].join(' ')}
            >
                <div className="mailbox-list-header">
                    <span className="col-icon">
                        <img src={Exclamation} alt="Priority" />
                    </span>

                    <span className="col-icon">
                        <img src={Attachments} alt="Attachment" />
                    </span>

                    {showFlag && (
                        <span className="col-icon">
                            <img src={Flag} alt="Flag" />
                        </span>
                    )}

                    <span className="col-person">
                        {listColumn}
                    </span>

                    <span className="col-subject">
                        Subject
                    </span>

                    <span className="col-date">
                        {dateLabel}
                        <img
                            src={ArrowUp}
                            alt=""
                            className="sort-arrow"
                        />
                    </span>
                </div>

                <div className="mailbox-list-body">
                    {messages.length === 0 ? (
                        <div className="mailbox-empty">
                            There are no items in this view.
                        </div>
                    ) : (
                        messages.map(message => (
                            <div
                                key={message.id}
                                className={[
                                    'mailbox-item',
                                    message.id === selectedId &&
                                        'selected',
                                    message.unread && 'unread',
                                ]
                                    .filter(Boolean)
                                    .join(' ')}
                                onClick={() =>
                                    handleRowClick(message.id)
                                }
                            >
                                <span className="col-icon" />

                                <span className="col-icon" />

                                {showFlag && (
                                    <span className="col-icon" />
                                )}

                                <span className="col-person">
                                    <img
                                        src={
                                            message.unread
                                                ? Envelope
                                                : EnvelopeOpen
                                        }
                                        alt=""
                                        className="row-envelope"
                                    />
                                    <span className="col-person-text">
                                    {listColumn === 'From'
                                        ? message.from
                                        : message.to}
                                    </span>
                                </span>

                                <span className="col-subject">
                                    {message.subject}
                                </span>

                                <span className="col-date">
                                    {message.date}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="mailbox-preview">
                <div className="mailbox-preview-header">
                    <div>
                        <strong>From:</strong>{' '}
                        {selectedMessage?.from ?? ''}{' '}
                        <strong>To:</strong>{' '}
                        {selectedMessage?.to ?? ''}
                    </div>

                    <div>
                        <strong>Subject:</strong>{' '}
                        {selectedMessage?.subject ?? ''}
                    </div>
                </div>

                <div className="mailbox-preview-body">
                    {selectedMessage ? (
                        <div
                            ref={innerRef}
                            className='mailbox-inner'
                            dangerouslySetInnerHTML={{
                                __html: selectedMessage.bodyHtml,
                            }}
                        />
                    ) : (
                        <div className="mailbox-empty">
                            There is no message selected.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OutlookMailbox;
export type FolderKey = 'inbox' | 'outbox' | 'sent' | 'deleted' | 'drafts';

export interface MailMessage {
    id: string;
    from?: string;
    to?: string;
    subject: string;
    date: string;
    unread?: boolean;
    bodyHtml: string;
}

export const FOLDER_LABELS: Record<FolderKey, string> = {
    inbox: 'Inbox',
    outbox: 'Outbox',
    sent: 'Sent Items',
    deleted: 'Deleted Items',
    drafts: 'Drafts',
};

export const FOLDER_LIST_COLUMN: Record<FolderKey, 'From' | 'To'> = {
    inbox: 'From',
    outbox: 'To',
    sent: 'To',
    deleted: 'From',
    drafts: 'To',
};

export const mailboxData: Record<FolderKey, MailMessage[]> = {
    inbox: [
        {
            id: 'welcome',
            from: 'Microsoft Outlook Express Team',
            to: 'New Outlook Express User',
            subject: 'Welcome to Outlook Express 6',
            date: '2/10/2026 11:58 AM',
            unread: true,
            bodyHtml: `
                <div class="oe-welcome-message">

                    <div class="white"></div>

                    <div class="black">
                        <a href="#" class="oe-get-started">The solution for all your messaging needs</a>
                    </div>

                    <div class="oe-welcome-content">

                        <div class="oe-welcome-left">

                            <div class="page-title">
                                <span class="filled">Featuring</span>
                                <span class="empty"></span>
                            </div>

                            <ul class="oe-feature-list">
                                <li>E-mail and Newsgroups</li>
                                <li>Multiple accounts and Identities</li>
                                <li>HTML message support</li>
                                <li>Address Book and directory services</li>
                                <li>Import Wizard</li>
                                <li>Easy migration from other e-mail programs</li>
                            </ul>

                        </div>

                        <div class="oe-welcome-divider"></div>

                        <div class="oe-hotmail">

                            <div class="oe-hotmail-logo"></div>

                            <p>
                                Tired of sharing your e-mail account with others
                                in your household?
                            
                                <a href="https://web.archive.org/web/20020204184251/http://lc2.law5.hotmail.passport.com/cgi-bin/login">
                                    Get a free Hotmail account!
                                </a>
                            </p>

                        </div>

                    </div>

                </div>
            `,
        },
    ],
    outbox: [],
    sent: [],
    deleted: [],
    drafts: [],
};
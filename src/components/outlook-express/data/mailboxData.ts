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

                            <div class="page-title">
                                <span class="filled">More Information</span>
                                <span class="empty"></span>
                            </div>

                            <div class="oe-more-info">
                                <p>For the most current Outlook Express information, go to the Help menu, and then click Read Me.</p>
                                <p>For Feedback, frequently asked questions, and tips visit our <a href="#">newsgroup</a>.</p>
                                <p>For updates and information about Outlook Express 6 visit <a href="#">Microsoft on the Web</a>.</p>
                                <p>For Help and troubleshooting, go to the Help menu, click Contents and Index, and then look up Troubleshooting in the Index.</p>
                                <p>Thank you for choosing Internet Explorer and Outlook Express 6.</p>
                                <p class="oe-team-signature"><strong>The Microsoft Outlook Express Team</strong></p>
                                <p class="oe-disclaimer">The links to http://www.infobeat.com and http://digitalid.verisign.com are provided as a convenience and Microsoft is not responsible for the contents or services on these sites.</p>
                            </div>

                        </div>

                        <div class="oe-welcome-divider"></div>

                        <div class="oe-welcome-sidebar">

                            <div class="oe-hotmail">

                                <div class="oe-hotmail-logo"></div>

                                <p>
                                    Tired of sharing your e-mail account with others
                                    in your household?
                                
                                    <a href="https://web.archive.org/web/20020204184251/http://lc2.law5.hotmail.passport.com/cgi-bin/login">
                                        Get a free Hotmail account!
                                    </a>
                                        Then read your mail from any place on earth.
                                        <a href="https://web.archive.org/web/20020204184251/http://lc2.law5.hotmail.passport.com/cgi-bin/login">Click here to sign up</a> right now!
                                </p>
                            </div>

                            <div class="oe-infobeat">
                                <div class="oe-infobeat-logo"></div>
                                <p>
                                    Surf, search and sift no more! <a href="#">InfoBeat</a> delivers
                                    personalized news straight to your e-mail box. And with
                                    Outlook Express, Infobeat's e-mail has never looked so
                                    good. So <a href="#">click here to sign up</a> for free!
                                </p>
                            </div>

                            <div class="oe-verisign">
                                <div class="oe-verisign-logo"></div>
                                <p>
                                    Obtain a free trial personal digital ID from
                                    <a href="#">VeriSign</a>. Use this ID to positively identify
                                    yourself when you send secure e-mail.
                                    <a href="#">Get your digital ID</a> today!
                                </p>
                            </div>
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
// Tip of the day content, sourced from the original Outlook Express 6
// STRINGTABLE resource (LANG_ENGLISH, SUBLANG_ENGLISH_US).
//
// Conversion notes:
// - <B>...</B>  -> **...**
// - <I>...</I>  -> **...** (parser doesn't yet support italics, see OutlookTip.tsx)
// - <BR><BR>    -> \n\n (rendered as separate paragraphs)
// - <A HREF=oecmd:help(...)>Click here</A> -> plain text, link stripped
//   (internal help-file links have no target in the web version)
//
// Each entry keeps its original resource ID in a comment for traceability
// back to the source stringtable, in case of future edits/corrections.

export interface TipEntry {
    id: number;
    text: string;
}

export const TIPS: TipEntry[] = [
    // ---- 6304–6319 ----
    { id: 6304, text: "A different help tip will be displayed each time you visit this page.\n\nClick **Next** or **Previous** at the bottom of this area to browse the tips more quickly." },
    { id: 6305, text: "Identities allow multiple people to use Outlook Express without sharing a common inbox.\n\nTo create an identity, click the **File** menu, click **Identities**, and then click **Add New Identity**." },
    { id: 6306, text: "You can switch identities without closing Outlook Express or losing your connection to the Internet.\n\nTo switch to another identity, click the **File** menu then click **Switch Identity**." },
    { id: 6307, text: "An identity is created by default for the first person using Outlook Express.\n\nTo edit this or any identity, click the **File** menu. Click **Identities** and then click **Manage Identities**." },
    { id: 6308, text: "Outlook Express automatically checks for new messages every 30 minutes.\n\nTo change this setting, click the **Tools** menu, then click **Options**." },
    { id: 6309, text: "Manually check for new messages by clicking **Send/Recv** on the toolbar. This also sends any messages in your **Outbox**." },
    { id: 6310, text: "When new e-mail arrives, you'll hear a sound, and an **envelope icon** will appear in the bottom right of the screen." },
    { id: 6311, text: "It's easy to read messages using the **preview pane**. Select a message, then look below to see the text of the message in the preview pane." },
    { id: 6312, text: "Compose a new e-mail message by clicking **New Mail** on the toolbar.\n\nReply to a message by selecting a message and clicking **Reply** on the toolbar.\n\nWhen you're done typing the message, select **Send** from the message toolbar." },
    { id: 6313, text: "When you compose a new message, briefly summarize what the message is about in the **subject line**. That way, the recipient will know what your message is about before they even open it up." },
    { id: 6314, text: "Use the address book to store contact information, such as e-mail addresses, home or business addresses, and phone numbers.\n\nTo create a new entry, click **Addresses** on the toolbar, click **New** on the address book toolbar, then click **New Contact**." },
    { id: 6315, text: "As you fill your address book, the contents will appear in the **Contacts** area, located at the lower left of the screen.\n\n**Double-click on a name** in the **Contacts** area to quickly start a new e-mail message." },
    { id: 6316, text: "To edit information in your address book, click **Addresses** on the toolbar, select a contact, and then click **Properties** on the address book toolbar.\n\nOr, you can **right-click on a name** in the **Contacts** area and click **Properties**." },
    { id: 6317, text: "When addressing new e-mail messages, click on the **To:** or **CC:** buttons to select names directly from your address book." },
    { id: 6318, text: "Tired of plain text e-mail messages?\n\nClick the **Message** menu, then click **New Message Using**. Select a piece of stationery, or see more choices by clicking **Select Stationery**." },
    { id: 6319, text: "Select a particular font or piece of stationery to be used every time you start a new e-mail message.\n\nClick the **Tools** menu, click **Options**, then click the **Compose** tab and make your choices from there." },

    // ---- 6320–6335 ----
    { id: 6320, text: "Insert sounds in your messages!\n\nIn a new message, click the **Format** menu, click **Background** and then click **Sound**." },
    { id: 6321, text: "Create signatures to personalize your messages.\n\nClick the **Tools** menu, then **Options**, and select the **Signatures** tab." },
    { id: 6322, text: "To insert a signature in a new message, click the **Insert** menu in the new message and then click **Signature**.\n\nIf you created multiple signatures, select the specific one you want to insert from the list." },
    { id: 6323, text: "Messages you receive with attached files will be displayed in the message list with a small **paperclip icon** next to them." },
    { id: 6324, text: "Use the preview pane to **quickly open or save file attachments**.\n\nSelect a message with an attached file. Click on the **large paperclip icon** located below the message list and on the far right. Select the filename to open it, or click **Save Attachments** to save the file to your computer." },
    { id: 6325, text: "To send a file via e-mail, click **Attach** on the toolbar of a new message.\n\nWhen done, the attached file will appear below the **subject line** of the new message." },
    { id: 6326, text: "Create folders for storing your messages.\n\nClick the **File** menu, click **Folder**, then click **New**.\n\nAfter you've created the new folder, **drag and drop** messages into it." },
    { id: 6327, text: "Select multiple messages by holding down the **Ctrl** key and then clicking the messages you want to select." },
    { id: 6328, text: "To quickly locate certain messages, click **Find** on the toolbar. Type in what to look for, such as a name in **From** or a word in **Subject**." },
    { id: 6329, text: "Does someone keep sending you junk e-mail? Or make inappropriate posts to your favorite newsgroup?\n\nSelect a message from the annoying sender, click the **Message** menu and then click **Block Sender**." },
    { id: 6330, text: "Outlook Express can automatically sort e-mail into folders based on who sent the message or words in the subject line.\n\nClick the **Tools** menu, click **Message Rules** and then click **Mail**." },
    { id: 6331, text: "Use **Message Rules** in the **Tools** menu to automatically do other things besides sort incoming e-mail into folders. You can color certain messages, automatically send a certain reply, even delete messages." },
    { id: 6332, text: "You can send and receive mail from multiple e-mail accounts.\n\nClick the **Tools** menu and then click **Accounts**. Click **Add** then click **Mail** and enter the necessary information from your Internet Service Provider." },
    { id: 6333, text: "If you receive e-mail from multiple accounts, only one is your default account for sending mail.\n\nTo send e-mail using an account other than your default, select the other account from the **From:** field at the top of the new message." },
    { id: 6334, text: "Do you regularly send e-mail to a group of people?\n\nClick **Addresses** on the toolbar, click **New** on the address book toolbar, then click **New Group**.\n\nNext time you send out e-mail to the group, click the **To:** button in the new message and select the group you created." },
    { id: 6335, text: "You can view a map of any address entered in the Address Book.\n\nClick **Addresses** on the toolbar and select either the **Home** tab or the **Business** tab. Click **View Map**, and a map of the address entered on that tab will be displayed." },

    // ---- 6336–6344 ----
    { id: 6336, text: "Need to find someone's e-mail address?\n\nClick the **Edit** menu, click **Find**, then click **People**.\n\nSelect the **Internet directory service** you want to search at the top, type in the person's name, then click **Find Now**." },
    { id: 6337, text: "Outlook Express will automatically highlight **links to web sites** in messages that you receive. Clicking on the link will open the browser and allow you to view the web site." },
    { id: 6338, text: "You can read, move and compose e-mail when disconnected from the Internet.\n\nAny e-mail you send when offline will go in the **Outbox** until you click **Send/Recv** on toolbar." },
    { id: 6339, text: "You can customize the look of Outlook Express.\n\nClick the **View** menu then click **Layout**. You can choose to hide or show the **preview pane**, the **Outlook bar**, the **Folders** list, or the **Contacts** area." },
    { id: 6340, text: "You can customize the toolbars in Outlook Express.\n\n**Right-click on any toolbar** and select **Customize**. Then choose large or small buttons, with or without text labels, even select what buttons are shown and in what order." },
    { id: 6341, text: "Sort your messages by clicking any column heading in the message list.\n\nFor example, clicking the **From** column heading will sort your messages by who sent the message." },
    { id: 6342, text: "Go quickly to your **Inbox** by pressing **Ctrl+I**, or start a new message by pressing **Ctrl+N**.\n\nClick here to view the entire list of Outlook Express keyboard shortcuts." },
    { id: 6343, text: "Outlook Express reduces the disk space used to store messages by compacting your folders in the background while you work.\n\nTo adjust these settings, click the **Tools** menu, click **Options**, and then select the **Maintenance** tab." },
    { id: 6344, text: "To share address book contacts among multiple identities, drag the contacts to the **Shared Contacts** folder in the **Address Book**." },

    // ---- 6403–6415 (Newsgroups) ----
    { id: 6403, text: "To read and post messages to newsgroups, you need to set up a news account.\n\nClick the **Tools** menu, click **Accounts**, click **Add** then click **News**. Enter the necessary information from your Internet Service Provider." },
    { id: 6404, text: "You can easily find newsgroups of interest to you.\n\nClick the **Tools** menu and then click **Newsgroups**. Type in a word or topic, and newsgroups that contain the typed word or topic will appear." },
    { id: 6405, text: "By subscribing to a newsgroup, the newsgroup will remain in your **Folders** list for easy access.\n\nClick the **Tools** menu and then click **Newsgroups**. Select a newsgroup from the list and click **Subscribe**." },
    { id: 6406, text: "You can unsubscribe to any newsgroup by right-clicking on the newsgroup in your **Folders** list and selecting **Unsubscribe**." },
    { id: 6407, text: "To post a new message to a newsgroup, select the newsgroup in the **Folders** list and click **New Post** on the toolbar." },
    { id: 6408, text: "When replying to a message in a newsgroup, first select the message to which you're replying.\n\nThen click **Reply Group** to post a reply to the entire newsgroup, or click **Reply** to send an e-mail reply to the author only." },
    { id: 6409, text: "If you see a **+** or a **-** next to a message, that means there are replies to that message.\n\nClick the **+** or **-** to show or hide the replies." },
    { id: 6410, text: "To track a specific conversation or thread, first select a message in the conversation of interest. Then click the **Message** menu and click **Watch Conversation**.\n\nMessages in a watched conversation will be highlighted in red for easy identification." },
    { id: 6411, text: "Looking for specific newsgroup messages?\n\nSelect a newsgroup, click the **Edit** menu, click **Find** and then click **Message in this Folder**. Type in what to search for, then click **Find Next**.\n\nThe first match is highlighted in the message list and clicking **Find Next** highlights the next match and so on." },
    { id: 6412, text: "You can hide newsgroup messages you have read.\n\nClick the **View** menu, click **Current View** and then click **Hide Read or Ignored Messages**." },
    { id: 6413, text: "To view an attachment spread across multiple messages in a newsgroup, select the messages while holding down the **Ctrl** key.\n\nClick the **Message** menu and click **Combine and Decode**." },
    { id: 6414, text: "To download more newsgroup messages, click the **Tools** menu and then click **Get Next 300 Headers**." },
    { id: 6415, text: "You can reduce the disk space used to store downloaded newsgroup messages.\n\nClick the **Tools** menu, then click **Options**. Select the **Maintenance** tab and click **Clean Up Now**." },

    // ---- 6416–6418 (Newsgroups, offline) ----
    { id: 6416, text: "Only the **headers** of newsgroup messages are initially downloaded. The header stores who the message is from, what the message is about, and the date it was posted.\n\nThe **body** containing the text of the newsgroup message is not downloaded until you select a specific message to read." },
    { id: 6417, text: "When reading newsgroup messages, a **torn paper icon** indicates that only the message **header** has been downloaded. A **whole paper icon** indicates that the message **body** has also been downloaded.\n\n**NOTE:** Only messages with a **whole paper icon** can be read while you are offline." },
    { id: 6418, text: "Want to read newsgroup messages offline?\n\nSelect the name of your news server in the **Folders** list, check what you want offline from the list that appears on the right, then click **Synchronize Account**." },

    // ---- 6453–6461 (IMAP) ----
    { id: 6453, text: "To adjust what IMAP folders are displayed in the **Folders** list, click the **Tools** menu then click **IMAP Folders**.\n\nIf you want a folder to appear in your **Folders** list, select it and click **Show**. If you don't want a folder to appear, select it and click **Hide**." },
    { id: 6454, text: "When using your IMAP account, does it take a while for changes made on one computer to show up on another computer?\n\nTo resynchronize the messages in a selected folder, click the **View** menu then click **Refresh**.\n\nTo resynchronize your IMAP folders, click the **Tools** menu, click **IMAP Folders** and then click **Reset List**." },
    { id: 6455, text: "Only the **header** of IMAP e-mail messages are initially downloaded. The header stores who the message is from, what the message is about, and the date it was sent.\n\nThe **body** containing the text of the message is not downloaded until you select a specific message to read." },
    { id: 6456, text: "When you delete messages from an IMAP account, they are crossed through and the envelope icon has a **red X**.\n\nTo permanently delete these messages, click the **Edit** menu and then click **Purge Deleted Messages**." },
    { id: 6457, text: "Rather have deleted messages from your IMAP account immediately disappear from the message list?\n\nClick the **View** menu, click **Current View** and then select **Show Deleted Messages** to remove the check mark." },
    { id: 6458, text: "Deleted messages from an IMAP account can be undeleted.\n\nSelect the message(s) to undelete, click the **Edit** menu and then click **Undelete**." },
    { id: 6459, text: "When reading e-mail messages from an IMAP account, a **torn envelope icon** indicates that only the message **header** has been downloaded. A **whole envelope icon** indicates that the message **body** has also been downloaded.\n\n**NOTE:** Only messages with a **whole envelope icon** can be read while you are offline." },
    { id: 6460, text: "Want to read messages from your IMAP account offline?\n\nSelect the name of your IMAP account in the **Folders** list, check what you want offline from the list that appears on the right, then click **Synchronize Account**." },
    { id: 6461, text: "Did you know that you can read, move and compose IMAP e-mail offline?\n\nWhen you reconnect, Outlook Express will automatically save your changes back to the server." },

    // ---- 6864–6873 (Hotmail; 6874–6878 excluded, those are error/status strings, not tips) ----
    { id: 6864, text: "Not only are Hotmail accounts free, they also allow you to access your e-mail from any computer with an Internet connection and a browser.\n\nTo sign up for a Hotmail account, click the **Tools** menu, click **New Account Signup** and select **Hotmail**. Try it!" },
    { id: 6865, text: "When you delete mail messages from your Hotmail account using Outlook Express, they are moved into your Hotmail **Deleted Items** folder. These messages will be permanently deleted on a regular basis." },
    { id: 6866, text: "Do you need to make room for more messages on Hotmail?\n\nSelect **Local Folders** in your **Folders** list. Click the **File** menu, click **New** and then click **Folder**. Type a name for the new folder and then drag and drop Hotmail messages into the new folder." },
    { id: 6867, text: "Every member of your household can have their **own** e-mail account, and each person can view only **their** messages and contacts.\n\nClick the **File** menu, click **Identities** and then click **Add New Identity** to create an identity for each person.\n\nClick the **Tools** menu, click **Accounts**, click **Add** then click **Mail** to set up a Hotmail account for each identity." },
    { id: 6868, text: "Did you know that you can read, move and compose Hotmail e-mail offline, using Outlook Express?\n\nWhen you reconnect, Outlook Express will automatically save your changes back to the server." },
    { id: 6869, text: "Would you like your Outlook Express address book to have the same content as your addresses stored on the Hotmail web site?\n\nThen click **Addresses** on the toolbar, click the **Tools** menu and then click **Synchronize Now**." },
    { id: 6870, text: "By synchronizing your **Windows Address Book** in Outlook Express with your Hotmail address book, you can access your contacts from any computer with an Internet connection and a Web browser.\n\nClick **Addresses** on the toolbar, click the **Tools** menu and then click **Synchronize Now**." },
    { id: 6871, text: "Only the **headers** of Hotmail e-mail messages are initially downloaded. The header stores who the message is from, what the message is about, and the date it was sent.\n\nThe **body** containing the text of the message is not downloaded until you select a specific message to read." },
    { id: 6872, text: "When reading e-mail messages from a Hotmail account, a **torn envelope icon** indicates that only the message **header** has been downloaded. A **whole envelope icon** indicates that the message **body** has also been downloaded.\n\n**NOTE:** Only messages with a **whole envelope icon** can be read while you are offline." },
    { id: 6873, text: "Want to read messages from your Hotmail account offline?\n\nSelect your Hotmail account in the **Folders** list, check what you want offline from the list that appears on the right, then click **Synchronize Account**." },
];
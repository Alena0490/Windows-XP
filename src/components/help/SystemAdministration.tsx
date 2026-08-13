import { useState } from 'react'
import { createPortal } from 'react-dom'

import useSound from '../../hooks/useSound'
import CriticalError from '../CriticalError'
import type { ErrorType } from '../CriticalError'
import XPScrollbar from '../XPScrollbar'

import AddFavourite from '../../img/AddFavorite1.webp'
import Dot from '../../img/dot.gif'
import Large from '../../img/HelpAndSupportChangeView2.webp'
import Printer from '../../img/Printer.webp'
import Question from '../../img/question.gif'
import RestoreAllItems from '../../img/RestoreAllItems.webp'
import Small from '../../img/HelpAnSupport ChangeView1.webp'

import './HelpAnsSupport.css'
import './WhatsNew.css'

type ArticleId = 'overview' | 'security' | 'passwords' | 'computer' | 'sysinfo' | 'backup' | 'diskmgmt' | 'fileencryption' | 'removablestorage' | 'remoteassistance' | 'digitalsignatures' | 'accesscontrol' | 'keepupdated';

interface SystemAdministrationProps {
    globalVolume?: number;
    globalMuted?: boolean;
    plusTheme?: 'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
    isFullscreen?: boolean;
    onToggleFullscreen?: () => void;
    isFavorite: (id: string) => boolean;
    onAddFavorite: (id: string, title: string) => void;
    initialArticle?: string;
}

const articleTitles: Record<ArticleId, string> = {
    overview: 'Security and administration',
    security: 'Security and administration tools',
    passwords: 'Passwords and user accounts',
    computer: 'Computer management',
    sysinfo: 'Getting system information',
    backup: 'Backing up files and folders',
    diskmgmt: 'Disk management',
    fileencryption: 'File encryption',
    removablestorage: 'Removable Storage',
    remoteassistance: 'Remote Assistance',
    digitalsignatures: 'Digital signatures',
    accesscontrol: 'Access Control',
    keepupdated: 'Keeping your computer up to date',
};

const SystemAdministration = ({
    globalVolume = 1,
    globalMuted = false,
    plusTheme,
    isFullscreen,
    onToggleFullscreen,
    isFavorite,
    onAddFavorite,
    initialArticle,
}: SystemAdministrationProps) => {
  const sounds = useSound(globalVolume, globalMuted);
  const themeSound = plusTheme === 'aquarium' ? sounds.aquarium
      : plusTheme === 'davinci' ? sounds.daVinci
      : plusTheme === 'nature' ? sounds.nature
      : plusTheme === 'space' ? sounds.space
      : null;
  const playExclamation = () => themeSound ? themeSound.playExclamation() : sounds.playExclamation();
  const playInfoSound = () => themeSound ? themeSound.playInfo() : sounds.playInfo();

  const [errorType, setErrorType] = useState<ErrorType | null>(null);
  const [currentArticle, setCurrentArticle] = useState<ArticleId>(
    (initialArticle as ArticleId) ?? 'overview'
    );

  const [prevInitialArticle, setPrevInitialArticle] = useState(initialArticle);
  if (initialArticle !== prevInitialArticle) {
    setPrevInitialArticle(initialArticle);
    if (initialArticle) {
      setCurrentArticle(initialArticle as ArticleId);
    }
  }

  const favoriteId = `systemadministration:${currentArticle}`;

  const openError = (type: ErrorType) => {
    playExclamation();
    setErrorType(type);
  };

  const handleAddToFavorites = () => {
    if (isFavorite(favoriteId)) {
      openError('helpFavoriteExists');
    } else {
      onAddFavorite(favoriteId, articleTitles[currentArticle]);
      playInfoSound();
      setErrorType('helpFavoriteAdded');
    }
  };

  return (
    <div className="whatsnew-page">
      <div className="whatsnew-body">
        <div className="whatsnew-tree">
          <div className="whatsnew-filter">
            <label>
              <input type="checkbox" defaultChecked />
              Search only System administration
            </label>
          </div>

          <div className="tree-box">
            <h4 onClick={() => setCurrentArticle('overview')}>System administration</h4>
            <XPScrollbar className="tree-box-scroll">
                <ul>
                    <li className={currentArticle === 'security' ? 'is-selected' : ''} onClick={() => setCurrentArticle('security')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Security and administration tools</span>
                    </li>
                    <li className={currentArticle === 'passwords' ? 'is-selected' : ''} onClick={() => setCurrentArticle('passwords')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Passwords and user accounts</span>
                    </li>
                    <li className={currentArticle === 'computer' ? 'is-selected' : ''} onClick={() => setCurrentArticle('computer')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Computer management</span>
                    </li>
                    <li className={currentArticle === 'sysinfo' ? 'is-selected' : ''} onClick={() => setCurrentArticle('sysinfo')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Getting system information</span>
                    </li>
                    <li className={currentArticle === 'backup' ? 'is-selected' : ''} onClick={() => setCurrentArticle('backup')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Backing up files and folders</span>
                    </li>
                    <li className={currentArticle === 'diskmgmt' ? 'is-selected' : ''} onClick={() => setCurrentArticle('diskmgmt')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Disk management</span>
                    </li>
                    <li className={currentArticle === 'fileencryption' ? 'is-selected' : ''} onClick={() => setCurrentArticle('fileencryption')}>
                        <span className="tree-label"><img src={Dot} alt="" /> File encryption</span>
                    </li>
                    <li className={currentArticle === 'removablestorage' ? 'is-selected' : ''} onClick={() => setCurrentArticle('removablestorage')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Removable Storage</span>
                    </li>
                    <li className={currentArticle === 'remoteassistance' ? 'is-selected' : ''} onClick={() => setCurrentArticle('remoteassistance')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Remote Assistance</span>
                    </li>
                    <li className={currentArticle === 'digitalsignatures' ? 'is-selected' : ''} onClick={() => setCurrentArticle('digitalsignatures')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Digital signatures</span>
                    </li>
                    <li className={currentArticle === 'accesscontrol' ? 'is-selected' : ''} onClick={() => setCurrentArticle('accesscontrol')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Access Control</span>
                    </li>
                    <li className={currentArticle === 'keepupdated' ? 'is-selected' : ''} onClick={() => setCurrentArticle('keepupdated')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Keeping your computer up to date</span>
                    </li>
                </ul>
            </XPScrollbar>
          </div>

          <div className="tree-box light">
                <h4>See Also</h4>
                <XPScrollbar className="tree-box-scroll">
                    <ul>
                        <li><span className="tree-label"><img src={Question} alt="" /> Windows Glossary</span></li>
                        <li><span className="tree-label"><img src={Question} alt="" /> Windows keyboard shortcuts overview</span></li>
                        <li><span className="tree-label"><img src={Question} alt="" /> Tools</span></li>
                        <li><span className="tree-label"><img src={Question} alt="" /> Go to a Windows newsgroup</span></li>
                    </ul>
                </XPScrollbar>
          </div>
        </div>

        <div className="whatsnew-content">
            <div className="whatsnew-toolbar">
                <button onClick={handleAddToFavorites}>
                <img src={AddFavourite} alt="" />
                <span>Add to <span className='mnemonic'>F</span>avorites</span>
                </button>
                <button onClick={onToggleFullscreen}>
                <img src={isFullscreen ? Small : Large} alt="" />
                <span>Change <span className='mnemonic'>V</span>iew</span>
                </button>
                <button onClick={() => openError('helpPrint')}>
                <img src={Printer} alt="" />
                <span><span className='mnemonic'>P</span>rint...</span>
                </button>
                <button onClick={() => openError('helpLocateInContents')}>
                <img src={RestoreAllItems} alt="" />
                <span>Locate in <span className='mnemonic'>C</span>ontents</span>
                </button>
            </div>

            <XPScrollbar className="article-scroll">
            {currentArticle === 'overview' && (
                <div className="whats-new-article">
                    <h2>Security and administration</h2>
                    <p>
                        Windows XP is loaded with new tools and programs that ensure the
                        privacy and security of your data, and help you operate your
                        computer at peak performance. Learn how to assign a password,
                        lock your computer, back up files and folders, and more to
                        protect the contents of your computer. Discover how to manage
                        computer components, services, and system tools; and how to
                        work with disk management and encryption features.
                    </p>
                    <p className="copyright">
                        © 1985-2001 Microsoft Corporation.<br />
                        All rights reserved.
                    </p>
                </div>
            )}

            {currentArticle === 'security' && (
                <div className="whats-new-article topics-view">
                    <h2>Security and administration tools</h2>
                    <p className="article-subheading">Help &amp; Information:</p>
                    <ul className="article-links">
                        <li>Using Windows XP Resource Kits</li>
                    </ul>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Add the Certificates snap-in to the MMC console</li>
                        <li>Start a program as an administrator</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Windows File Protection</li>
                        <li>Using Security Configuration and Analysis</li>
                        <li>Using Event Viewer</li>
                        <li>Using Services</li>
                        <li>Using Group Policy</li>
                        <li>Overview of Stored User Names and Passwords</li>
                        <li>Administration tools</li>
                        <li>Administering Internet Explorer</li>
                        <li>Administrative tool reference A-Z</li>
                        <li>WMI Command-line overview</li>
                        <li>Intellimirror</li>
                        <li>Understanding RSoP</li>
                        <li>Software restriction policies</li>
                        <li>Security Templates overview</li>
                        <li>Security Settings overview</li>
                        <li>Access control overview</li>
                        <li>Help protect against viruses and Trojan horses</li>
                        <li>Help secure your computer</li>
                        <li>Using IP Security Policy Management</li>
                        <li>Using the FrontPage Server Extensions 2000</li>
                        <li>Using Message Queuing</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'passwords' && (
                <div className="whats-new-article topics-view">
                    <h2>Passwords and user accounts</h2>
                    <p className="article-subheading">Fix a problem:</p>
                    <ul className="article-links">
                        <li>Local users and groups troubleshooting</li>
                    </ul>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Add a new user to the computer</li>
                        <li>Change the group a user belongs to</li>
                        <li>Manage passwords stored on the computer</li>
                        <li>Turn on or turn off the guest account</li>
                        <li>Hide a file or folder</li>
                        <li>Create and modify local user accounts</li>
                        <li>Create and modify user profiles</li>
                        <li>Create, add, and delete local groups</li>
                        <li>Connect to a network resource</li>
                        <li>Have the computer remember your password</li>
                        <li>Create a password reset disk in case you forget your password</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Using Local Users and Groups</li>
                        <li>Recovering a user's password</li>
                        <li>Local users and groups concepts</li>
                        <li>Users overview</li>
                        <li>Administering users and groups</li>
                        <li>Managing groups from the command line</li>
                        <li>Why you should not run your computer as an administrator</li>
                        <li>Fast User Switching</li>
                        <li>Using passwords to access network resources</li>
                        <li>Creating strong passwords</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'computer' && (
                <div className="whats-new-article topics-view">
                    <h2>Computer management</h2>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Change the size of the virtual memory paging file</li>
                        <li>Install USB 2.0 controller drivers</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Using Component Services</li>
                        <li>Computer Management</li>
                        <li>Using Services and Applications</li>
                        <li>Using Storage</li>
                        <li>Using System Tools</li>
                        <li>Using MMC snap-ins</li>
                        <li>System Properties overview</li>
                        <li>Using the Microsoft Management Console</li>
                        <li>Using the WMI Control</li>
                        <li>Using Group Policy</li>
                        <li>Using System Information</li>
                        <li>Windows Registry</li>
                        <li>Administration Tools</li>
                        <li>Using Device Manager</li>
                        <li>Computer management concepts</li>
                        <li>Using Event Viewer</li>
                        <li>Using Computer Management</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'sysinfo' && (
                <div className="whats-new-article topics-view">
                    <h2>Getting system information</h2>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Display system data</li>
                        <li>Find system data</li>
                        <li>Open a System Information file</li>
                        <li>Print system data</li>
                        <li>Run a system tool</li>
                        <li>Save system data to a text file</li>
                        <li>Save system data to a System Information file</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>System Information overview</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'backup' && (
                <div className="whats-new-article topics-view">
                    <h2>Backing up files and folders</h2>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Common tasks: Backup</li>
                        <li>Set advanced restore options</li>
                        <li>Set backup options</li>
                        <li>Back up System State data</li>
                        <li>Backup command line parameters</li>
                        <li>Add a user to the Backup Operators group</li>
                        <li>Delete a catalog</li>
                        <li>Erase a tape</li>
                        <li>Back up files to a file or a tape</li>
                        <li>Format a tape</li>
                        <li>Exclude file types from a backup</li>
                        <li>Set the backup type</li>
                        <li>Restore files from a file or a tape</li>
                        <li>Set restore options</li>
                        <li>Restore System State data</li>
                        <li>Retension a tape</li>
                        <li>Schedule a backup</li>
                        <li>System State data</li>
                        <li>Update a catalog</li>
                        <li>Restoring files and folders</li>
                        <li>Types of backup</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Using batch files to back up data</li>
                        <li>Backup command line examples</li>
                        <li>Permissions and user rights</li>
                        <li>Backup overview</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'diskmgmt' && (
                <div className="whats-new-article topics-view">
                    <h2>Disk management</h2>
                    <p className="article-subheading">Fix a problem:</p>
                    <ul className="article-links">
                        <li>Troubleshooting Disk Management</li>
                    </ul>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Disk Management: how to...</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Disk Management overview</li>
                        <li>Best practices: Disk management</li>
                        <li>Using basic disks</li>
                        <li>Windows file systems</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'fileencryption' && (
                <div className="whats-new-article topics-view">
                    <h2>File encryption</h2>
                    <p className="article-subheading">Fix a problem:</p>
                    <ul className="article-links">
                        <li>Recover files or folders</li>
                        <li>Troubleshooting file encryption</li>
                    </ul>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Add a recovery agent for the local computer</li>
                        <li>Add users to or remove users from a file or folder</li>
                        <li>Change the recovery policy for the local computer</li>
                        <li>Copy an encrypted file or folder</li>
                        <li>Decrypt a file or folder</li>
                        <li>Encrypt a file or folder</li>
                        <li>Encrypt a file or folder on a remote computer</li>
                        <li>Move an encrypted file or folder</li>
                        <li>Recover an encrypted file or folder if you are a designated recovery agent</li>
                        <li>Recover an encrypted file or folder without the file encryption certificate</li>
                        <li>Back up default recovery keys to a floppy disk</li>
                        <li>Add a recovery agent for a domain</li>
                        <li>Change the recovery policy for a domain</li>
                        <li>Copy or move encrypted files or folders</li>
                        <li>Enable a remote server for file encryption</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Managing Certificates</li>
                        <li>Encrypting File System overview</li>
                        <li>Recovering data</li>
                        <li>Best practices: File encryption</li>
                        <li>Introduction to using Encrypting File System</li>
                        <li>Encrypting and decrypting data with Encrypting File System</li>
                        <li>Backing up and recovering encrypted data</li>
                        <li>Encrypting and decrypting data</li>
                        <li>Using Encrypting File System</li>
                        <li>Storing Data More Securely</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'removablestorage' && (
                <div className="whats-new-article topics-view">
                    <h2>Removable Storage</h2>
                    <p className="article-subheading">Fix a problem:</p>
                    <ul className="article-links">
                        <li>Removable Storage troubleshooting</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Using Removable Storage</li>
                        <li>Understanding Removable Storage</li>
                        <li>Checklist: Configure Removable Storage</li>
                        <li>Removable Storage</li>
                        <li>Removable Storage resources</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'remoteassistance' && (
                <div className="whats-new-article topics-view">
                    <h2>Remote Assistance</h2>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Set the maximum amount of time all Remote Assistance invitations can remain open</li>
                        <li>Prevent remote control of this computer by someone using Remote Assistance</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Using password security in Remote Assistance</li>
                        <li>Differentiating between Remote Desktop and Remote Assistance</li>
                        <li>Providing help using Remote Assistance</li>
                        <li>Requesting help using Remote Assistance</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'digitalsignatures' && (
                <div className="whats-new-article topics-view">
                    <h2>Digital signatures</h2>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Verify that system files have a digital signature</li>
                        <li>Check the digital signatures for system or non-system files</li>
                        <li>Set file signature verification options</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Using File Signature Verification</li>
                        <li>File encryption overview</li>
                        <li>Driver signing for Windows</li>
                        <li>Using Certificates</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'accesscontrol' && (
                <div className="whats-new-article topics-view">
                    <h2>Access Control</h2>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Take ownership of a file or folder</li>
                        <li>Set, view, change, or remove file and folder permissions</li>
                        <li>View effective permissions for files and folders</li>
                        <li>Set, view, change, or remove special permissions for files and folders</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Selecting where to apply permissions</li>
                        <li>File and Folder permissions</li>
                        <li>Permissions on a file server</li>
                        <li>Changing inherited permissions</li>
                        <li>Ownership</li>
                        <li>Explicit vs. inherited permissions</li>
                        <li>How inheritance affects file and folder permissions</li>
                        <li>Permissions and security descriptors</li>
                        <li>Permissions</li>
                        <li>Security identifiers</li>
                        <li>Best practices: Access Control</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'keepupdated' && (
                <div className="whats-new-article topics-view">
                    <h2>Keeping your computer up to date</h2>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Turn on Automatic Updates</li>
                        <li>Update your system files using Windows Update</li>
                        <li>Use Windows Update with Add or Remove Programs</li>
                        <li>Download all available updates for your computer</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Using Windows Update</li>
                        <li>Using Automatic Updates</li>
                        <li>Automatic Updates: Frequently Asked Questions</li>
                    </ul>
                </div>
            )}
            </XPScrollbar>
        </div>
      </div>

      {errorType && createPortal(
        <CriticalError
          type={errorType}
          onClose={() => setErrorType(null)}
          onYes={() => setErrorType(null)}
          onNo={() => setErrorType(null)}
        />,
        document.body
      )}
    </div>
  )
}

export default SystemAdministration

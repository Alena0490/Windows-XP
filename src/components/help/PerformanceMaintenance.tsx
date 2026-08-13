import { useState } from 'react'
import { createPortal } from 'react-dom'

import useSound from '../../hooks/useSound'
import CriticalError from '../CriticalError'
import type { ErrorType } from '../CriticalError'
import XPScrollbar from '../XPScrollbar'

import AddFavourite from '../../img/AddFavorite1.webp'
import Document from './img/HCimgA08.webp'
import Dot from '../../img/dot.gif'
import Large from '../../img/HelpAndSupportChangeView2.webp'
import Link from './img/HCimgA10.webp'
import Logo from '../../img/logo.webp'
import Minus from '../../img/minus.gif'
import Note from './img/IIS_note.gif'
import Plus from '../../img/plus.gif'
import Printer from '../../img/Printer.webp'
import Question from '../../img/question.gif'
import RestoreAllItems from '../../img/RestoreAllItems.webp'
import Shortcut from './img/shortcut.webp'
import Small from '../../img/HelpAnSupport ChangeView1.webp'

import './HelpAnsSupport.css'
import './WhatsNew.css'

type ArticleId =
  | 'overview' | 'maintaining' | 'managing' | 'safe' | 'freeingspace' | 'backup'
  | 'systemrestore' | 'power' | 'scheduling' | 'advancedtools' | 'fixing' | 'keepupdated';

interface PerformanceMaintenanceProps {
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
    overview: 'Performance and maintenance',
    maintaining: 'Maintaining your computer',
    managing: "Managing your computer's performance",
    safe: 'Keeping your system safe',
    freeingspace: 'Freeing up disk space',
    backup: 'Using Backup',
    systemrestore: 'Using System Restore to undo changes',
    power: 'Conserving power on your computer',
    scheduling: 'Scheduling tasks',
    advancedtools: 'Advanced performance and maintenance tools',
    fixing: 'Fixing performance and maintenance problems',
    keepupdated: 'Keeping your computer up to date',
};

const PerformanceMaintenance = ({
    globalVolume = 1,
    globalMuted = false,
    plusTheme,
    isFullscreen,
    onToggleFullscreen,
    isFavorite,
    onAddFavorite,
    initialArticle,
}: PerformanceMaintenanceProps) => {
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
  const [backupExpanded, setBackupExpanded] = useState(false);

  const [prevInitialArticle, setPrevInitialArticle] = useState(initialArticle);
  if (initialArticle !== prevInitialArticle) {
    setPrevInitialArticle(initialArticle);
    if (initialArticle) {
      setCurrentArticle(initialArticle as ArticleId);
    }
  }

  const favoriteId = `performance:${currentArticle}`;

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
              Search only Performance and maintenance
            </label>
          </div>

          <div className="tree-box">
            <h4 onClick={() => setCurrentArticle('overview')}>Performance and maintenance</h4>
            <XPScrollbar className="tree-box-scroll">
                <ul>
                    <li className={currentArticle === 'maintaining' ? 'is-selected' : ''} onClick={() => setCurrentArticle('maintaining')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Maintaining your computer</span>
                    </li>
                    <li className={currentArticle === 'managing' ? 'is-selected' : ''} onClick={() => setCurrentArticle('managing')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Managing your computer's performance</span>
                    </li>
                    <li className={currentArticle === 'safe' ? 'is-selected' : ''} onClick={() => setCurrentArticle('safe')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Keeping your system safe</span>
                    </li>
                    <li className={currentArticle === 'freeingspace' ? 'is-selected' : ''} onClick={() => setCurrentArticle('freeingspace')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Freeing up disk space</span>
                    </li>

                    <li className={currentArticle === 'backup' ? 'is-selected' : ''} onClick={() => { setBackupExpanded(!backupExpanded); setCurrentArticle('backup'); }}>
                        <span className="tree-label">
                            <img src={backupExpanded ? Minus : Plus} alt="" /> Backing up your data
                        </span>
                        {backupExpanded && (
                            <ul className="tree-subitems">
                                <li><span className="tree-label"><img src={Dot} alt="" /> Using an Uninterruptible Power Supply server</span></li>
                            </ul>
                        )}
                    </li>

                    <li className={currentArticle === 'systemrestore' ? 'is-selected' : ''} onClick={() => setCurrentArticle('systemrestore')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Using System Restore to undo changes</span>
                    </li>
                    <li className={currentArticle === 'power' ? 'is-selected' : ''} onClick={() => setCurrentArticle('power')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Conserving power on your computer</span>
                    </li>
                    <li className={currentArticle === 'scheduling' ? 'is-selected' : ''} onClick={() => setCurrentArticle('scheduling')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Scheduling tasks</span>
                    </li>
                    <li className={currentArticle === 'advancedtools' ? 'is-selected' : ''} onClick={() => setCurrentArticle('advancedtools')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Advanced performance and maintenance tools</span>
                    </li>
                    <li className={currentArticle === 'fixing' ? 'is-selected' : ''} onClick={() => setCurrentArticle('fixing')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Fixing performance and maintenance problems</span>
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
                    <h2>Performance and maintenance</h2>
                    <p>
                        Windows XP provides tools and programs designed to keep your
                        computer safe, manage your system, and perform regularly
                        scheduled maintenance that keeps your computer running at
                        optimum performance. Learn how to free up disk space, restore
                        your system, create regularly scheduled tasks, and more.
                    </p>
                    <p className="copyright">
                        © 1985-2001 Microsoft Corporation.<br />
                        All rights reserved.
                    </p>
                </div>
            )}

            {currentArticle === 'maintaining' && (
                <div className="whats-new-article topics-view">
                    <h2>Maintaining your computer</h2>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Determine how much space is available on a disk</li>
                        <li>Remove unused desktop icons</li>
                        <li>Get information about your computer</li>
                        <li>Get advanced information about your computer</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Freeing space on your hard disk</li>
                        <li>Detecting and repairing disk errors</li>
                        <li>Defragmenting your hard disk</li>
                        <li>System Properties overview</li>
                        <li>Backing up your data</li>
                        <li>Help protect against viruses and Trojan horses</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'managing' && (
                <div className="whats-new-article topics-view">
                    <h2>Managing your computer's performance</h2>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Change the size of the virtual memory paging file</li>
                        <li>Change the performance of foreground and background programs</li>
                        <li>Specify the default operating system for startup</li>
                        <li>Specify what Windows does if the system stops unexpectedly</li>
                        <li>Setting environment variables</li>
                        <li>Add or change the values of environment variables</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Managing your computer's performance</li>
                        <li>System Properties overview</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'safe' && (
                <div className="whats-new-article topics-view">
                    <h2>Keeping your system safe</h2>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Display system data</li>
                        <li>Help protect your files with a screen saver password</li>
                        <li>Get information about your computer</li>
                        <li>Have the computer remember your password</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li className='flex'><img src={Document} alt="" id='doc-absolute' /> Walkthrough: Sharing your PC</li>
                        <li>Encrypt or decrypt files</li>
                        <li>Help secure your computer</li>
                        <li>Help protect against viruses and Trojan horses</li>
                        <li>Get advanced information about your computer</li>
                        <li>Understanding security and privacy features in Internet Explorer</li>
                        <li>Choosing between NTFS, FAT, and FAT32</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'freeingspace' && (
                <div className="whats-new-article topics-view">
                    <h2>Freeing up disk space</h2>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Compress an NTFS drive</li>
                        <li>Display encrypted or compressed NTFS files in color</li>
                        <li>Determine how much space is available on a disk</li>
                        <li>Add files to a zipped compressed folder</li>
                        <li>Create a zipped compressed folder</li>
                        <li>Compress a file or folder on an NTFS drive</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Freeing space on your hard disk</li>
                        <li>Using Disk Management</li>
                        <li>Removing unneeded files</li>
                        <li>File compression overview</li>
                        <li>Compressed (zipped) Folders overview</li>
                        <li>Defragmenting your hard disk</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'backup' && (
                <div className="whats-new-article topics-view">
                    <p className="article-subheading">Using Backup</p>
                    <img className="article-logo" src={Logo} alt="" />
                    <p className="thin glossary">
                        The Backup utility helps you create a copy of the information on your <span className="glossary-link">hard disk</span>. In the event that the
                        original data on your hard disk is accidentally erased or overwritten, or becomes inaccessible because
                        of a hard disk malfunction, you can use the copy to restore your lost or damaged data.
                    </p>
                    <p className="thin">
                        Open <img className="inline-key" src={Shortcut} alt="" /> <span className="article-link">Backup</span>.
                    </p>
                    <p className="article-subheading"><img className='subheading-img' src={Note} alt="" />Notes</p>
                    <ul className="article-links notes-list">
                        <li>To start Backup, click <strong>Start</strong>, point to <strong>All Programs</strong>, point to <strong>Accessories</strong>, point to <strong>System Tools</strong>, and then click <strong>Backup</strong>.</li>
                        <li>The Removable Storage service must be started for Backup to work properly. For more information, click <strong>Related Topics</strong>.</li>
                        <li>You can use the Automated System Recovery Wizard in the Backup utility to help you repair your system.</li>
                        <li>For information about using Backup, click the <strong>Help</strong> menu in Backup.</li>
                    </ul>
                    <p className="related-topics">Related Topics</p>
                </div>
            )}

            {currentArticle === 'systemrestore' && (
                <div className="whats-new-article topics-view">
                    <h2>Using System Restore to undo changes</h2>
                    <p className="article-subheading">Fix a problem:</p>
                    <ul className="article-links">
                        <li>Accessing System Restore</li>
                        <li>Disk Space Issues</li>
                    </ul>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Create a Restore Point</li>
                        <li>Undo the last restoration</li>
                        <li>Change System Restore settings</li>
                        <li>Exclude a non-system drive or partition</li>
                        <li>Resume System Restore monitoring of a drive or partition</li>
                        <li>Allocate more disk space for archiving Restore Points</li>
                        <li>Turn on System Restore</li>
                        <li>Run the System Restore Wizard <img src={Link} alt=""/></li>
                        <li>Turn off System Restore</li>
                        <li>Run System Restore in safe mode</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Understanding System Restore</li>
                        <li>Using the System Restore Wizard</li>
                        <li>System Restore overview</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'power' && (
                <div className="whats-new-article topics-view">
                    <h2>Conserving power on your computer</h2>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Automatically put your computer on standby</li>
                        <li>Manually put your computer on standby</li>
                        <li>Choose a power scheme</li>
                        <li>Delete a power scheme</li>
                        <li>Manually put your computer into hibernation</li>
                        <li>Set a warning alarm for a low or critical battery condition</li>
                        <li>Common tasks: Power Options</li>
                        <li>Automatically put your computer into hibernation</li>
                        <li>Password-protect your computer during standby or hibernation</li>
                        <li>Create a new power scheme</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Power Options overview</li>
                        <li>Managing power when installing a Plug and Play device</li>
                        <li>Managing power on a portable computer</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'scheduling' && (
                <div className="whats-new-article topics-view">
                    <h2>Scheduling tasks</h2>
                    <p className="article-subheading">Fix a problem:</p>
                    <ul className="article-links">
                        <li>Troubleshooting Scheduled Tasks</li>
                    </ul>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Common tasks: Scheduled Tasks</li>
                        <li>Modify a scheduled task</li>
                        <li>Remove a scheduled task</li>
                        <li>Stop a scheduled task that is running</li>
                        <li>Run a task immediately</li>
                        <li>Receive notification of missed tasks</li>
                        <li>Set power management options for a scheduled task</li>
                        <li>Run a scheduled task when the computer is idle</li>
                        <li>Stop Scheduled Tasks</li>
                        <li>Pause Scheduled Tasks</li>
                        <li>View scheduled tasks on a remote computer</li>
                        <li>View a log of past scheduled tasks</li>
                        <li>Schedule a new task</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Scheduled Tasks and the At command</li>
                        <li>Scheduled Tasks security</li>
                        <li>Scheduled Tasks overview</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'advancedtools' && (
                <div className="whats-new-article topics-view">
                    <h2>Advanced performance and maintenance tools</h2>
                    <p className="article-subheading">Fix a problem:</p>
                    <ul className="article-links">
                        <li>Troubleshooting Disk Management</li>
                    </ul>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Installing more than one operating system on your computer</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Computer Management</li>
                        <li>System Properties overview</li>
                        <li>Using Local Users and Groups</li>
                        <li>Using Performance</li>
                        <li>Using the Microsoft Management Console</li>
                        <li>Windows Registry</li>
                        <li>Disk Management overview</li>
                        <li>Using Computer Management</li>
                        <li>Getting Help from Windows Resource Kits</li>
                        <li>Using Regedit.exe</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'fixing' && (
                <div className="whats-new-article topics-view">
                    <h2>Fixing performance and maintenance problems</h2>
                    <p className="article-subheading">Fix a problem:</p>
                    <ul className="article-links">
                        <li>Troubleshooting Scheduled Tasks</li>
                        <li>Troubleshooting Disk Management</li>
                        <li>System Setup Troubleshooter</li>
                        <li>Getting older programs to run on Windows XP</li>
                        <li>Startup and Shutdown Troubleshooter</li>
                        <li>Hardware Troubleshooter</li>
                    </ul>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Diagnose device problems</li>
                        <li>Error messages</li>
                        <li>Change the size of the virtual memory paging file</li>
                        <li>Start Windows in safe mode</li>
                        <li>Command-line reference A-Z</li>
                        <li>Install USB 2.0 controller drivers</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Detecting and repairing disk errors</li>
                        <li>Windows File Protection</li>
                        <li>Using System Information</li>
                        <li>Recovery Console overview</li>
                        <li>Recording system and program failures</li>
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

export default PerformanceMaintenance

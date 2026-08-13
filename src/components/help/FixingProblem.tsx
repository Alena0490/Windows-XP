import { useState } from 'react'
import { createPortal } from 'react-dom'

import useSound from '../../hooks/useSound'
import CriticalError from '../CriticalError'
import type { ErrorType } from '../CriticalError'
import XPScrollbar from '../XPScrollbar'

import AddFavourite from '../../img/AddFavorite1.webp'
import Dot from '../../img/dot.gif'
import Large from '../../img/HelpAndSupportChangeView2.webp'
import Link from './img/HCimgA10.webp'
import Printer from '../../img/Printer.webp'
import Question from '../../img/question.gif'
import RestoreAllItems from '../../img/RestoreAllItems.webp'
import Small from '../../img/HelpAnSupport ChangeView1.webp'

import './HelpAnsSupport.css'
import './WhatsNew.css'

type ArticleId =
  | 'overview' | 'troubleshooting' | 'appsoftware' | 'games' | 'email' | 'networking'
  | 'printing' | 'performance' | 'hardware' | 'startupshutdown' | 'systemrestore' | 'keepupdated';

interface FixingProblemProps {
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
    overview: 'Fixing a problem',
    troubleshooting: 'Troubleshooting problems',
    appsoftware: 'Application and software problems',
    games: 'Games, sound, and video problems',
    email: 'E-mail and messaging problems',
    networking: 'Networking problems',
    printing: 'Printing problems',
    performance: 'Performance and maintenance problems',
    hardware: 'Hardware and system device problems',
    startupshutdown: 'Startup and Shut Down problems',
    systemrestore: 'Using System Restore to undo changes',
    keepupdated: 'Keeping your computer up to date',
};

const FixingProblem = ({
    globalVolume = 1,
    globalMuted = false,
    plusTheme,
    isFullscreen,
    onToggleFullscreen,
    isFavorite,
    onAddFavorite,
    initialArticle,
}: FixingProblemProps) => {
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

  const favoriteId = `fixingproblem:${currentArticle}`;

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
              Search only Fixing a problem
            </label>
          </div>

          <div className="tree-box">
            <h4 onClick={() => setCurrentArticle('overview')}>Fixing a problem</h4>
            <XPScrollbar className="tree-box-scroll">
                <ul>
                    <li className={currentArticle === 'troubleshooting' ? 'is-selected' : ''} onClick={() => setCurrentArticle('troubleshooting')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Troubleshooting problems</span>
                    </li>
                    <li className={currentArticle === 'appsoftware' ? 'is-selected' : ''} onClick={() => setCurrentArticle('appsoftware')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Application and software problems</span>
                    </li>
                    <li className={currentArticle === 'games' ? 'is-selected' : ''} onClick={() => setCurrentArticle('games')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Games, sound, and video problems</span>
                    </li>
                    <li className={currentArticle === 'email' ? 'is-selected' : ''} onClick={() => setCurrentArticle('email')}>
                        <span className="tree-label"><img src={Dot} alt="" /> E-mail and messaging problems</span>
                    </li>
                    <li className={currentArticle === 'networking' ? 'is-selected' : ''} onClick={() => setCurrentArticle('networking')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Networking problems</span>
                    </li>
                    <li className={currentArticle === 'printing' ? 'is-selected' : ''} onClick={() => setCurrentArticle('printing')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Printing problems</span>
                    </li>
                    <li className={currentArticle === 'performance' ? 'is-selected' : ''} onClick={() => setCurrentArticle('performance')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Performance and maintenance problems</span>
                    </li>
                    <li className={currentArticle === 'hardware' ? 'is-selected' : ''} onClick={() => setCurrentArticle('hardware')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Hardware and system device problems</span>
                    </li>
                    <li className={currentArticle === 'startupshutdown' ? 'is-selected' : ''} onClick={() => setCurrentArticle('startupshutdown')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Startup and Shut Down problems</span>
                    </li>
                    <li className={currentArticle === 'systemrestore' ? 'is-selected' : ''} onClick={() => setCurrentArticle('systemrestore')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Using System Restore to undo changes</span>
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
                    <h2>Fixing a problem</h2>
                    <p>
                        Find a fix fast! Windows XP includes excellent diagnostic and
                        troubleshooting programs that help isolate and resolve problems.
                        Select from the categories in this section to learn how to fix
                        specific problems, perform important procedures, and read useful
                        overviews and articles that help you understand more about using
                        Windows XP.
                    </p>
                    <p className="copyright">
                        © 1985-2001 Microsoft Corporation.<br />
                        All rights reserved.
                    </p>
                </div>
            )}

            {currentArticle === 'troubleshooting' && (
                <div className="whats-new-article topics-view">
                    <h2>Troubleshooting problems</h2>
                    <p className="article-subheading">Help &amp; Information:</p>
                    <ul className="article-links">
                        <li>Using Windows XP Resource Kits</li>
                    </ul>
                    <p className="article-subheading">Fix a problem:</p>
                    <ul className="article-links">
                        <li>Getting older programs to run on Windows XP</li>
                    </ul>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Dr. Watson options</li>
                        <li>Setting up Dr. Watson</li>
                        <li>Program error reporting</li>
                        <li>Specify programs for error reporting</li>
                        <li>Start the computer using the last known good configuration</li>
                        <li>Start your computer at a command prompt</li>
                        <li>Uninstall Windows XP</li>
                        <li>Locating lost files</li>
                        <li>Start Windows in safe mode</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Support overview</li>
                        <li>Dr. Watson overview</li>
                        <li>Using the Dr. Watson log file</li>
                        <li>Using password security in Remote Assistance</li>
                        <li>Automated System Recovery overview</li>
                        <li>Using troubleshooters</li>
                        <li>Using the Microsoft Personal Support Center Web site to find more information</li>
                        <li>Recovery Console overview</li>
                        <li>System and program error reporting overview</li>
                        <li>Providing help using Remote Assistance</li>
                        <li>Requesting help using Remote Assistance</li>
                        <li>Startup options</li>
                        <li>Repair overview</li>
                        <li>List of troubleshooters</li>
                        <li>Using Regedit.exe</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'appsoftware' && (
                <div className="whats-new-article topics-view">
                    <h2>Application and software problems</h2>
                    <p className="article-subheading">Fix a problem:</p>
                    <ul className="article-links">
                        <li>Games and Multimedia Troubleshooter</li>
                        <li>Print Troubleshooter</li>
                        <li>Getting older programs to run on Windows XP</li>
                    </ul>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Run software that worked with previous versions</li>
                        <li>Update your system files using Windows Update</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Using Windows Update</li>
                        <li>Products designed to work with Windows XP</li>
                        <li>Compatible Hardware and Software overview</li>
                        <li>New ways to use tools</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'games' && (
                <div className="whats-new-article topics-view">
                    <h2>Games, sound, and video problems</h2>
                    <p className="article-subheading">Fix a problem:</p>
                    <ul className="article-links">
                        <li>Diagnosing game port controller issues</li>
                        <li>Sound Troubleshooter</li>
                        <li>DVD Troubleshooter</li>
                        <li>Change the refresh frequency for your monitor</li>
                        <li>Getting older programs to run on Windows XP</li>
                        <li>Troubleshooting DirectX</li>
                        <li>Games and Multimedia Troubleshooter</li>
                        <li>Display Troubleshooter</li>
                    </ul>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Test a game controller</li>
                        <li>Install USB 2.0 controller drivers</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Resolving USB controller installation issues</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'email' && (
                <div className="whats-new-article topics-view">
                    <h2>E-mail and messaging problems</h2>
                    <p className="article-subheading">Fix a problem:</p>
                    <ul className="article-links">
                        <li>Modem Troubleshooter</li>
                        <li>E-mail Troubleshooter</li>
                        <li>Internet Explorer Troubleshooter</li>
                        <li>Troubleshooting modems</li>
                        <li>Outlook Express Troubleshooter</li>
                    </ul>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Attaining fast speeds with a 56 Kbps modem</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'networking' && (
                <div className="whats-new-article topics-view">
                    <h2>Networking problems</h2>
                    <p className="article-subheading">Fix a problem:</p>
                    <ul className="article-links">
                        <li>Modem Troubleshooter</li>
                        <li>Internet Connection Sharing Troubleshooter</li>
                        <li>Home and Small Office Networking Troubleshooter</li>
                        <li>File and Printer Troubleshooter</li>
                        <li>Drives and Network Adapters Troubleshooter</li>
                        <li>Diagnose network configuration and run automated networking tests</li>
                        <li>Bluetooth device connections are slow or stop working</li>
                        <li>Bluetooth devices cannot find each other</li>
                        <li>Bluetooth devices cannot connect to each other</li>
                        <li>Fixing connection problems</li>
                    </ul>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Test a TCP/IP configuration using the ping command</li>
                        <li>Test TCP/IP connections using the ping and net view commands</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'printing' && (
                <div className="whats-new-article topics-view">
                    <h2>Printing problems</h2>
                    <p className="article-subheading">Fix a problem:</p>
                    <ul className="article-links">
                        <li>Printing Troubleshooter</li>
                        <li>Fixing a printing problem</li>
                        <li>Fixing connection problems</li>
                    </ul>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Install new or updated printer drivers</li>
                        <li>Print a test page</li>
                        <li>Ensure that complex pages print properly</li>
                        <li>Cancel printing all documents</li>
                        <li>Pause or resume printing of a document</li>
                        <li>Install USB 2.0 controller drivers</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Getting help with printing</li>
                        <li>Settings that affect printing</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'performance' && (
                <div className="whats-new-article topics-view">
                    <h2>Performance and maintenance problems</h2>
                    <p className="article-subheading">Fix a problem:</p>
                    <ul className="article-links">
                        <li>Troubleshooting Scheduled Tasks</li>
                        <li>Troubleshooting Disk Management</li>
                        <li>Hardware Troubleshooter</li>
                        <li>System Setup Troubleshooter</li>
                        <li>Startup and shutdown Troubleshooter</li>
                        <li>Getting older programs to run on Windows XP</li>
                    </ul>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Diagnose device problems</li>
                        <li>Start Windows in safe mode</li>
                        <li>Install USB 2.0 controller drivers</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Using File Signature Verification</li>
                        <li>Windows File Protection</li>
                        <li>Detecting and repairing disk errors</li>
                        <li>Recording system and program failures</li>
                        <li>Using System Information</li>
                        <li>Recovery Console overview</li>
                        <li>Getting Help from Windows Resource Kits</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'hardware' && (
                <div className="whats-new-article topics-view">
                    <h2>Hardware and system device problems</h2>
                    <p className="article-subheading">Fix a problem:</p>
                    <ul className="article-links">
                        <li>If your monitor flickers too much</li>
                        <li>Modem Troubleshooter</li>
                        <li>Printing Troubleshooter</li>
                        <li>Hardware Troubleshooter</li>
                        <li>Sound Troubleshooter</li>
                        <li>Input device Troubleshooter (keyboard, mouse, camera, scanner)</li>
                        <li>DVD Troubleshooter</li>
                    </ul>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Activate a mouse wheel</li>
                        <li>Diagnose device problems</li>
                        <li>Test a modem</li>
                        <li>Update your keyboard driver</li>
                        <li>Revert to your previous keyboard driver</li>
                        <li>Uninstall your keyboard driver</li>
                        <li>Install USB 2.0 controller drivers</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Updating Windows</li>
                        <li>Tips for writing CDs</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'startupshutdown' && (
                <div className="whats-new-article topics-view">
                    <h2>Startup and Shut Down problems</h2>
                    <p className="article-subheading">Fix a problem:</p>
                    <ul className="article-links">
                        <li>System Setup Troubleshooter</li>
                        <li>Startup and Shutdown Troubleshooter</li>
                    </ul>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Run System Restore in Safe mode</li>
                        <li>Start Windows in safe mode</li>
                        <li>Create an MS-DOS startup disk</li>
                        <li>Start the computer using the last known good configuration</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Using System Information</li>
                        <li>Recovery Console overview</li>
                        <li>Recording system and program failures</li>
                    </ul>
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
                        <li>Run the System Restore Wizard <img src={Link} alt="" /></li>
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

export default FixingProblem

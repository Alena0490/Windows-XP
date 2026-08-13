import { useState } from 'react'
import { createPortal } from 'react-dom'

import useSound from '../../hooks/useSound'
import CriticalError from '../CriticalError'
import type { ErrorType } from '../CriticalError'
import XPScrollbar from '../XPScrollbar'

import AddFavourite from '../../img/AddFavorite1.webp'
import Dot from '../../img/dot.gif'
import Large from '../../img/HelpAndSupportChangeView2.webp'
import Logo from '../../img/logo.webp'
import Minus from '../../img/minus.gif'
import Plus from '../../img/plus.gif'
import Printer from '../../img/Printer.webp'
import Question from '../../img/question.gif'
import RestoreAllItems from '../../img/RestoreAllItems.webp'
import Small from '../../img/HelpAnSupport ChangeView1.webp'

import './HelpAnsSupport.css'
import './WhatsNew.css'

type ArticleId = 'overview' | 'offline' | 'remotedesktop' | 'laptop' | 'power' | 'powerlaptop' | 'syncmanager' | 'briefcase' | 'helpremotely' | 'connected';

interface WorkingRemotelyProps {
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
    overview: 'Working remotely',
    offline: 'Working with content offline',
    remotedesktop: 'Remote Desktop',
    laptop: 'Laptop hints',
    power: 'Power options',
    powerlaptop: 'Power options for laptops',
    syncmanager: 'Synchronizing files with Synchronization Manager',
    briefcase: 'Synchronizing files with Briefcase',
    helpremotely: 'Getting help remotely',
    connected: 'Getting connected',
};

const WorkingRemotely = ({
    globalVolume = 1,
    globalMuted = false,
    plusTheme,
    isFullscreen,
    onToggleFullscreen,
    isFavorite,
    onAddFavorite,
    initialArticle,
}: WorkingRemotelyProps) => {
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
  const [remoteDesktopExpanded, setRemoteDesktopExpanded] = useState(false);

  const [prevInitialArticle, setPrevInitialArticle] = useState(initialArticle);
  if (initialArticle !== prevInitialArticle) {
    setPrevInitialArticle(initialArticle);
    if (initialArticle) {
      setCurrentArticle(initialArticle as ArticleId);
    }
  }

  const favoriteId = `remotework:${currentArticle}`;

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
              Search only Working remotely
            </label>
          </div>

          <div className="tree-box">
            <h4 onClick={() => setCurrentArticle('overview')}>Working remotely</h4>
            <XPScrollbar className="tree-box-scroll">
                <ul>
                    <li className={currentArticle === 'offline' ? 'is-selected' : ''} onClick={() => setCurrentArticle('offline')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Working with content offline</span>
                    </li>

                    <li className={currentArticle === 'remotedesktop' ? 'is-selected' : ''} onClick={() => { setRemoteDesktopExpanded(!remoteDesktopExpanded); setCurrentArticle('remotedesktop'); }}>
                        <span className="tree-label">
                            <img src={remoteDesktopExpanded ? Minus : Plus} alt="" /> Remote Desktop
                        </span>
                        {remoteDesktopExpanded && (
                            <ul className="tree-subitems">
                                <li><span className="tree-label"><img src={Dot} alt="" /> Working from home or another location</span></li>
                                <li><span className="tree-label"><img src={Dot} alt="" /> Setting up your home computer to use Remote Desktop</span></li>
                                <li><span className="tree-label"><img src={Dot} alt="" /> Installing Remote Desktop Web Connection</span></li>
                                <li><span className="tree-label"><img src={Dot} alt="" /> Using Remote Desktop connection</span></li>
                                <li><span className="tree-label"><img src={Dot} alt="" /> Changing connection settings</span></li>
                            </ul>
                        )}
                    </li>

                    <li className={currentArticle === 'laptop' ? 'is-selected' : ''} onClick={() => setCurrentArticle('laptop')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Laptop hints</span>
                    </li>
                    <li className={currentArticle === 'power' ? 'is-selected' : ''} onClick={() => setCurrentArticle('power')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Power options</span>
                    </li>
                    <li className={currentArticle === 'powerlaptop' ? 'is-selected' : ''} onClick={() => setCurrentArticle('powerlaptop')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Power options for laptops</span>
                    </li>
                    <li className={currentArticle === 'syncmanager' ? 'is-selected' : ''} onClick={() => setCurrentArticle('syncmanager')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Synchronizing files with Synchronization Manager</span>
                    </li>
                    <li className={currentArticle === 'briefcase' ? 'is-selected' : ''} onClick={() => setCurrentArticle('briefcase')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Synchronizing files with Briefcase</span>
                    </li>
                    <li className={currentArticle === 'helpremotely' ? 'is-selected' : ''} onClick={() => setCurrentArticle('helpremotely')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Getting help remotely</span>
                    </li>
                    <li className={currentArticle === 'connected' ? 'is-selected' : ''} onClick={() => setCurrentArticle('connected')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Getting connected</span>
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

            {currentArticle === 'overview' && (
              <div className="whats-new-article">
                <h2>Working remotely</h2>
                <p>
                    You can take it with you! Discover how to make the contents of
                    your office computer available offline, so you can work away
                    from your desk on a portable computer or without being connected
                    to your office network. Learn how to use Remote Desktop to
                    connect to your office computer online - from another computer
                    anywhere in the world. Do you use a laptop? Windows XP contains
                    enhanced power management features that stretch battery life.
                    And with laptops and other PCs, find out how to get your
                    computer to use power more efficiently.
                </p>
                <p className="copyright">
                    © 1985-2001 Microsoft Corporation.<br />
                    All rights reserved.
                </p>
              </div>
            )}

            {currentArticle === 'offline' && (
              <div className="whats-new-article topics-view">
                <h2>Working with content offline</h2>
                <p className="article-subheading">Pick a task:</p>
                <ul className="article-links">
                  <li>Make a file or folder available offline</li>
                  <li>Make offline files unavailable</li>
                  <li>Set up your computer to use offline files</li>
                  <li>Change the settings for offline pages in Internet Explorer</li>
                  <li>Save a Web page on your computer</li>
                  <li>Make an existing favorite item available offline</li>
                  <li>Make Web pages available offline</li>
                  <li>View your offline files</li>
                  <li>Change offline file access for shared folders</li>
                  <li>Delete your offline files</li>
                  <li>Encrypt offline files</li>
                  <li>Synchronize files on connected computers using Briefcase</li>
                  <li>Read mail messages offline</li>
                </ul>
                <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                <ul className="article-links">
                  <li>Working offline overview</li>
                  <li>Choosing between using Briefcase or offline files</li>
                </ul>
              </div>
            )}

            {currentArticle === 'remotedesktop' && (
              <div className="whats-new-article topics-view">
                <p className="article-subheading">Remote Desktop</p>
                <img className="article-logo" src={Logo} alt="" />
                <p className="thin">
                    Whether you're telecommuting from home or traveling away from the office, Windows XP helps you
                    work where you are. Learn how to connect to your office from home or another location, and to change
                    your settings depending on where you are and what you need to do.
                </p>
              </div>
            )}

            {currentArticle === 'laptop' && (
              <div className="whats-new-article topics-view">
                <h2>Laptop hints</h2>
                <p className="article-subheading">Pick a task:</p>
                <ul className="article-links">
                  <li>Improve the visibility of the mouse pointer</li>
                  <li>Password-protect your computer during standby or hibernation</li>
                  <li>Switch between a roaming and local user profile</li>
                  <li>Use ClearType for screen fonts</li>
                </ul>
                <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                <ul className="article-links">
                  <li>Hardware profiles overview</li>
                  <li>Using a second monitor with your laptop</li>
                  <li>Getting files and settings from your old computer</li>
                </ul>
              </div>
            )}

            {currentArticle === 'power' && (
              <div className="whats-new-article topics-view">
                <h2>Power options</h2>
                <p className="article-subheading">Pick a task:</p>
                <ul className="article-links">
                  <li>Password-protect your computer during standby or hibernation</li>
                  <li>Change the elapsed time before your monitor automatically turns off</li>
                  <li>Change the elapsed time before your computer automatically goes on standby</li>
                  <li>Automatically put your computer into hibernation</li>
                  <li>Automatically put your computer on standby</li>
                  <li>Manually put your computer on standby</li>
                  <li>Manually put your computer into hibernation</li>
                  <li>Common tasks: Power Options</li>
                  <li>Change the elapsed time before your hard disk automatically turns off</li>
                </ul>
                <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                <ul className="article-links">
                  <li>Power Options overview</li>
                </ul>
              </div>
            )}

            {currentArticle === 'powerlaptop' && (
              <div className="whats-new-article topics-view">
                <h2>Power options for laptops</h2>
                <p className="article-subheading">Pick a task:</p>
                <ul className="article-links">
                  <li>Set a warning alarm for a low or critical battery condition</li>
                  <li>Automatically put your computer on standby</li>
                  <li>Choose a power scheme</li>
                  <li>Create a hardware profile</li>
                  <li>Manually put your computer into hibernation</li>
                  <li>Manually put your computer on standby</li>
                  <li>Automatically put your computer into hibernation</li>
                  <li>Password-protect your computer during standby or hibernation</li>
                </ul>
                <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                <ul className="article-links">
                  <li>Managing power on a portable computer</li>
                </ul>
              </div>
            )}

            {currentArticle === 'syncmanager' && (
              <div className="whats-new-article topics-view">
                <h2>Synchronizing files with Synchronization Manager</h2>
                <p className="article-subheading">Pick a task:</p>
                <ul className="article-links">
                  <li>Schedule offline items to synchronize</li>
                  <li>Synchronize offline items when you log on or off a computer</li>
                  <li>Synchronize offline items while your computer is idle</li>
                </ul>
                <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                <ul className="article-links">
                  <li>Synchronization Manager overview</li>
                  <li>MMC overview</li>
                </ul>
              </div>
            )}

            {currentArticle === 'briefcase' && (
              <div className="whats-new-article topics-view">
                <h2>Synchronizing files with Briefcase</h2>
                <p className="article-subheading">Pick a task:</p>
                <ul className="article-links">
                  <li>Create a new Briefcase</li>
                  <li>Synchronize files stored on a removable disk using Briefcase</li>
                  <li>Separate files stored in Briefcase from their counterparts outside Briefcase</li>
                  <li>Check the status of files in Briefcase</li>
                  <li>Synchronize files on connected computers using Briefcase</li>
                </ul>
                <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                <ul className="article-links">
                  <li>Briefcase overview</li>
                  <li>Choosing between using Briefcase or offline files</li>
                </ul>
              </div>
            )}

            {currentArticle === 'helpremotely' && (
              <div className="whats-new-article topics-view">
                <h2>Getting help remotely</h2>
                <p className="article-subheading">Pick a task:</p>
                <ul className="article-links">
                  <li>Prevent remote control of this computer via Remote Assistance</li>
                  <li>Set the maximum amount of time all Remote Assistance invitations can remain open</li>
                </ul>
                <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                <ul className="article-links">
                  <li>Using password security in Remote Assistance</li>
                  <li>Requesting help using Remote Assistance</li>
                  <li>Providing help using Remote Assistance</li>
                </ul>
              </div>
            )}

            {currentArticle === 'connected' && (
              <div className="whats-new-article topics-view">
                <h2>Getting connected</h2>
                <p className="article-subheading">Fix a problem:</p>
                <ul className="article-links">
                  <li>Troubleshooting modems</li>
                </ul>
                <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                <ul className="article-links">
                  <li>Checklist: Configuring network connections</li>
                  <li>Virtual private network (VPN) connections overview</li>
                  <li>Connecting using your modem</li>
                  <li>Using phone lines and modems</li>
                </ul>
              </div>
            )}
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

export default WorkingRemotely

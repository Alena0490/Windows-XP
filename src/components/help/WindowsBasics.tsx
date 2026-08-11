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
import Logo from '../../img/logo.webp'
import Minus from '../../img/minus.gif'
import Plus from '../../img/plus.gif'
import Printer from '../../img/Printer.webp'
import Question from '../../img/question.gif'
import RestoreAllItems from '../../img/RestoreAllItems.webp'
import Small from '../../img/HelpAnSupport ChangeView1.webp'

import './HelpAnsSupport.css'
import './WhatsNew.css'

type ArticleId = 'overview' | 'core' | 'searching' | 'protecting' | 'tips' | 'update';

interface WindowsBasicsProps {
    globalVolume?: number;
    globalMuted?: boolean;
    plusTheme?: 'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
    isFullscreen?: boolean;
    onToggleFullscreen?: () => void;
    isFavorite: (id: string) => boolean;
    onAddFavorite: (id: string, title: string) => void;
}

const articleTitles: Record<ArticleId, string> = {
    overview: 'Windows basics',
    core: 'Core Windows tasks',
    searching: 'Searching for information',
    protecting: 'Protecting your computer',
    tips: 'Tips for using Help',
    update: 'Keeping your computer up to date',
};

const WindowsBasics = ({
    globalVolume = 1,
    globalMuted = false,
    plusTheme,
    isFullscreen,
    onToggleFullscreen,
    isFavorite,
    onAddFavorite,
}: WindowsBasicsProps) => {
  const sounds = useSound(globalVolume, globalMuted);
  const themeSound = plusTheme === 'aquarium' ? sounds.aquarium
      : plusTheme === 'davinci' ? sounds.daVinci
      : plusTheme === 'nature' ? sounds.nature
      : plusTheme === 'space' ? sounds.space
      : null;
  const playExclamation = () => themeSound ? themeSound.playExclamation() : sounds.playExclamation();
  const playInfoSound = () => themeSound ? themeSound.playInfo() : sounds.playInfo();

  const [errorType, setErrorType] = useState<ErrorType | null>(null);
  const [currentArticle, setCurrentArticle] = useState<ArticleId>('overview');
  const [coreExpanded, setCoreExpanded] = useState(false);

  const favoriteId = `windowsbasics:${currentArticle}`;

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
              Search only Windows basics
            </label>
          </div>

          <div className="tree-box">
            <h4 onClick={() => setCurrentArticle('overview')}>Windows basics</h4>
            <XPScrollbar className="tree-box-scroll">
                <ul>
                  <li className={currentArticle === 'core' ? 'is-selected' : ''} onClick={() => { setCoreExpanded(!coreExpanded); setCurrentArticle('core'); }}>
                      <span className="tree-label">
                          <img src={coreExpanded ? Minus : Plus} alt="" /> Core Windows tasks
                      </span>
                      {coreExpanded && (
                          <ul className="tree-subitems">
                              <li><span className="tree-label"><img src={Dot} alt="" /> Customizing your desktop</span></li>
                              <li><span className="tree-label"><img src={Dot} alt="" /> Customizing your Start menu</span></li>
                              <li><span className="tree-label"><img src={Dot} alt="" /> Working with files and folders</span></li>
                              <li><span className="tree-label"><img src={Dot} alt="" /> Working with programs</span></li>
                              <li><span className="tree-label"><img src={Dot} alt="" /> Managing windows</span></li>
                              <li><span className="tree-label"><img src={Dot} alt="" /> Logging on and off Windows</span></li>
                          </ul>
                      )}
                  </li>
                  <li className={currentArticle === 'searching' ? 'is-selected' : ''} onClick={() => setCurrentArticle('searching')}>
                      <span className="tree-label"><img src={Dot} alt="" /> Searching for information</span>
                  </li>
                  <li className={currentArticle === 'protecting' ? 'is-selected' : ''} onClick={() => setCurrentArticle('protecting')}>
                      <span className="tree-label"><img src={Dot} alt="" /> Protecting your computer</span>
                  </li>
                  <li className={currentArticle === 'tips' ? 'is-selected' : ''} onClick={() => setCurrentArticle('tips')}>
                      <span className="tree-label"><img src={Dot} alt="" /> Tips for using Help</span>
                  </li>
                  <li className={currentArticle === 'update' ? 'is-selected' : ''} onClick={() => setCurrentArticle('update')}>
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

            {currentArticle === 'overview' && (
              <div className="whats-new-article">
                <h2>Windows basics</h2>
                <p>
                    Brush up on Windows skills and learn new ones. Whether you are a
                    beginner or an advanced computer user, you are sure to find this
                    section fascinating. It's packed with useful, easy-to-understand
                    information and clear, step-by-step instructions.
                </p>
                <p className="copyright">
                    © 1985-2001 Microsoft Corporation.<br />
                    All rights reserved.
                </p>
              </div>
            )}

            {currentArticle === 'core' && (
              <div className="whats-new-article topics-view">
                <p className="article-subheading">Core Windows tasks</p>
                <img className="article-logo" src={Logo} alt="" />
                <p className="thin">
                    Get up to speed quickly with core Windows tasks! Learn how to create, organize, and work with
                    information on your computer. Find out how to dress up your desktop with pictures, sound, and fonts.
                </p>
              </div>
            )}

            {currentArticle === 'searching' && (
              <div className="whats-new-article topics-view">
                <h2>Searching for information</h2>
                <p className="article-subheading">Pick a task:</p>
                <ul className="article-links">
                  <li>See what is on your computer</li>
                  <li>Search for a file or folder</li>
                  <li>Search for people and groups</li>
                  <li>Search for printers</li>
                  <li>Locating lost files</li>
                  <li>Search the Internet</li>
                  <li>Search for a computer on the network</li>
                  <li>Get information about your computer</li>
                </ul>
                <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                <ul className="article-links">
                  <li>Using Windows Explorer to locate files</li>
                  <li>Search overview</li>
                  <li>Searching for printers</li>
                  <li>Searching for files and folders</li>
                  <li>Using My Computer to find files and folders</li>
                </ul>
              </div>
            )}

            {currentArticle === 'protecting' && (
              <div className="whats-new-article topics-view">
                <h2>Protecting your computer</h2>
                <p className="article-subheading">Pick a task:</p>
                <ul className="article-links">
                  <li>Lock your computer</li>
                  <li>Hide a file or folder</li>
                  <li>Help protect your files with a screen saver password</li>
                  <li>Change your password</li>
                  <li>Have the computer remember your password</li>
                  <li>Create a password reset disk in case you forget your password</li>
                  <li>Make your folders private when you are on a workgroup</li>
                </ul>
                <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                <ul className="article-links">
                  <li><img src={Document} alt="" /> Walkthrough: Sharing your PC</li>
                  <li>Understanding security and privacy features in Internet Explorer</li>
                  <li>Help protect against viruses and Trojan horses</li>
                  <li>Users and Passwords overview</li>
                </ul>
              </div>
            )}

            {currentArticle === 'tips' && (
              <div className="whats-new-article topics-view">
                <h2>Tips for using Help</h2>
                <p className="article-subheading">Pick a task:</p>
                <ul className="article-links">
                  <li>Find what you need in Help and Support Center</li>
                  <li>Add a Help topic or page to the Help and Support Center Favorites list</li>
                  <li>Move through Help topics or pages you've seen</li>
                  <li>Get more out of Help and Support Center</li>
                  <li>Print a Help topic or page</li>
                  <li>Copy a Help topic or page</li>
                  <li>Change colors in Help and Support Center</li>
                  <li>Change fonts in Help and Support Center</li>
                  <li>Get Help in a dialog box</li>
                </ul>
                <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                <ul className="article-links">
                  <li>Using Help and Support Center keyboard shortcuts</li>
                  <li>Help and Support Center overview</li>
                </ul>
              </div>
            )}

            {currentArticle === 'update' && (
              <div className="whats-new-article topics-view">
                <h2>Keeping your computer up to date</h2>
                <p className="article-subheading">Pick a task:</p>
                <ul className="article-links">
                  <li>Use Windows Update with Add or Remove Programs</li>
                  <li>Turn on Automatic Updates</li>
                  <li>Update your system files using Windows Update</li>
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

export default WindowsBasics

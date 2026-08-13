import { useState } from 'react'
import { createPortal } from 'react-dom'

import useSound from '../../hooks/useSound'
import CriticalError from '../CriticalError'
import type { ErrorType } from '../CriticalError'
import XPScrollbar from '../XPScrollbar'

import AddFavourite from '../../img/AddFavorite1.webp'
import Document from './img/HCimgA08.webp'
import Dot from '../../img/dot.gif'
import GoToPage from './img/HCimgA10.webp'
import Large from '../../img/HelpAndSupportChangeView2.webp'
import Minus from '../../img/minus.gif'
import Plus from '../../img/plus.gif'
import Printer from '../../img/Printer.webp'
import Question from '../../img/question.gif'
import RestoreAllItems from '../../img/RestoreAllItems.webp'
import Small from '../../img/HelpAnSupport ChangeView1.webp'

import './HelpAnsSupport.css'
import './WhatsNew.css'

type ArticleId = 'overview' | 'topics' | 'tour' | 'walkthrough' | 'activation' | 'components' | 'whatsnew' | 'security';

interface WhatsNewProps {
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
    overview: "What's new in Windows XP",
    topics: "What's new topics",
    tour: "Taking a tour or tutorial",
    walkthrough: "Windows XP articles: Walk through ways to use your PC",
    activation: "Activation, license, and registration",
    components: "Programs included with Windows XP",
    whatsnew: "What's new",
    security: "What's new in Windows XP security",
};

const WhatsNew = ({
    globalVolume = 1,
    globalMuted = false,
    plusTheme,
    isFullscreen,
    onToggleFullscreen,
    isFavorite,
    onAddFavorite,
    initialArticle,
}: WhatsNewProps) => {
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
  const [componentsExpanded, setComponentsExpanded] = useState(false);

  const [prevInitialArticle, setPrevInitialArticle] = useState(initialArticle);
  if (initialArticle !== prevInitialArticle) {
    setPrevInitialArticle(initialArticle);
    if (initialArticle) {
      setCurrentArticle(initialArticle as ArticleId);
    }
  }

  const favoriteId = `whatsnew:${currentArticle}`;

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
              Search only What's new in Windows XP
            </label>
          </div>

          <div className="tree-box">
            <h4 onClick={() => setCurrentArticle('overview')}>What's new in Windows XP</h4>
            <XPScrollbar className="tree-box-scroll">
                <ul>
                  <li className={currentArticle === 'topics' ? 'is-selected' : ''} onClick={() => setCurrentArticle('topics')}>
                      <span className="tree-label"><img src={Dot} alt="" /> What's new topics</span>
                  </li>
                  <li className={currentArticle === 'tour' ? 'is-selected' : ''} onClick={() => setCurrentArticle('tour')}>
                      <span className="tree-label"><img src={Dot} alt="" /> Taking a tour or tutorial</span>
                  </li>
                  <li className={currentArticle === 'walkthrough' ? 'is-selected' : ''} onClick={() => setCurrentArticle('walkthrough')}>
                      <span className="tree-label"><img src={Dot} alt="" /> Windows XP articles: Walk through ways to use your PC</span>
                  </li>
                  <li className={currentArticle === 'activation' ? 'is-selected' : ''} onClick={() => setCurrentArticle('activation')}>
                      <span className="tree-label"><img src={Dot} alt="" /> Activation, license, and registration</span>
                  </li>

                  <li className={currentArticle === 'components' ? 'is-selected' : ''} onClick={() => { setComponentsExpanded(!componentsExpanded); setCurrentArticle('components'); }}>
                      <span className="tree-label">
                          <img src={componentsExpanded ? Minus : Plus} alt="" /> Windows components
                      </span>
                      {componentsExpanded && (
                          <ul className="tree-subitems">
                              <li><span className="tree-label"><img src={Dot} alt="" /> Accessories</span></li>
                              <li><span className="tree-label"><img src={Dot} alt="" /> System Tools</span></li>
                              <li><span className="tree-label"><img src={Dot} alt="" /> Communications and Entertainment</span></li>
                              <li><span className="tree-label"><img src={Dot} alt="" /> Administration and advanced tools</span></li>
                              <li><span className="tree-label"><img src={Dot} alt="" /> Accessibility</span></li>
                              <li><span className="tree-label"><img src={Dot} alt="" /> Windows Update</span></li>
                          </ul>
                      )}
                  </li>

                  <li className={currentArticle === 'whatsnew' ? 'is-selected' : ''} onClick={() => setCurrentArticle('whatsnew')}>
                      <span className="tree-label"><img src={Dot} alt="" /> What's new</span>
                  </li>
                  <li className={currentArticle === 'security' ? 'is-selected' : ''} onClick={() => setCurrentArticle('security')}>
                      <span className="tree-label"><img src={Dot} alt="" /> What's new in Windows XP Security</span>
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
                <h2>What's new in Windows XP</h2>
                <p>
                    Windows XP brims with new features, improved programs, and tools.
                    See what's new; take an entertaining tour; learn about the programs
                    Windows XP contains, including systems, accessories, and
                    communications and entertainment programs. Read articles containing
                    full descriptions for performing key tasks from start to finish.
                    Look up unfamiliar terms in the glossary. Learn the benefits of
                    registering your copy of Windows XP online.
                </p>
                <p className="copyright">
                    © 1985-2001 Microsoft Corporation.<br />
                    All rights reserved.
                </p>
              </div>
            )}

            {currentArticle === 'topics' && (
              <div className="whats-new-article topics-view">
                <h2>What's new topics</h2>
                <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                <ul className="article-links">
                  <li>What's new in Windows XP</li>
                  <li>What's new for user accounts and startup</li>
                  <li>What's new on your desktop</li>
                  <li>What's new with digital photos and video</li>
                  <li>What's new for home networking</li>
                  <li>What's new for Help and Support</li>
                  <li>What's new in other areas of Windows XP</li>
                  <li>What's new for browsing the Internet</li>
                  <li>What's new with files and folders</li>
                  <li>Personalizing your workspace</li>
                </ul>
              </div>
            )}

            {currentArticle === 'tour' && (
              <div className="whats-new-article topics-view">
                <h2>Taking a tour or tutorial</h2>
                <p className="article-subheading">Pick a task:</p>
                <ul className="article-links">
                  <li><img src={GoToPage} alt="" /> Take the Windows XP tour</li>
                </ul>
              </div>
            )}

            {currentArticle === 'walkthrough' && (
              <div className="whats-new-article topics-view">
                <h2>Windows XP articles: Walk through ways to use your PC</h2>
                <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                <ul className="article-links">
                  <li><img src={Document} alt="" /> Walkthrough: Digital photos</li>
                  <li><img src={Document} alt="" /> Walkthrough: Personalize your PC</li>
                  <li><img src={Document} alt="" /> Walkthrough: Sharing your PC</li>
                  <li><img src={Document} alt="" /> Walkthrough: Home networking</li>
                </ul>
              </div>
            )}

            {currentArticle === 'activation' && (
              <div className="whats-new-article topics-view">
                <h2>Activation, license, and registration</h2>
                <p className="article-subheading">Pick a task:</p>
                <ul className="article-links">
                  <li>Activate Windows XP with your modem</li>
                  <li>Activate Windows XP by phone</li>
                  <li>Activate Windows XP on the Internet</li>
                  <li>Questions and answers about the End User License Agreement</li>
                </ul>
                <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                <ul className="article-links">
                  <li>Do Microsoft products give me the ability to access the Internet?</li>
                  <li>Using online registration</li>
                  <li>Windows XP product activation overview</li>
                  <li>Windows XP product activation privacy policy</li>
                  <li>Understanding activation and registration</li>
                </ul>
              </div>
            )}

            {currentArticle === 'components' && (
              <div className="whats-new-article topics-view">
                <h2>Programs included with Windows XP</h2>
                <p className="thin">
                    Windows XP provides the tools you need to work and play in today's high-speed communications
                    environment. Your toolbox includes system tools that help you set and adjust system resources, users
                    and user groups, and scheduled system tasks. Accessories help you get the job done, no matter what
                    the job is. You can create documents and images, calculate figures, schedule your time, and have
                    online meetings with co-workers. When it's time to enjoy some music, browse the Internet, or play a
                    few games. Your communications and entertainment tools will help you relax.
                </p>
              </div>
            )}

            {currentArticle === 'whatsnew' && (
              <div className="whats-new-article topics-view">
                <h2>What's new</h2>
                <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                <ul className="article-links">
                  <li>What's new in Windows XP</li>
                  <li>What's new for user accounts and startup</li>
                  <li>What's new with digital photos and video</li>
                  <li>What's new for home networking</li>
                  <li>What's new in other areas of Windows XP</li>
                  <li>What's new for browsing the Internet</li>
                  <li>Personalizing your workspace</li>
                  <li>What's new for security</li>
                  <li>What's new in Windows XP: Frequently Asked Questions</li>
                  <li>What's new on your desktop</li>
                  <li>What's new for Help and Support</li>
                  <li>What's new with files and folders</li>
                </ul>
              </div>
            )}

            {currentArticle === 'security' && (
              <div className="whats-new-article topics-view">
                <h2>What's new in Windows XP security</h2>
                <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                <ul className="article-links">
                  <li>What's new for security</li>
                  <li>What's new in Windows XP: Frequently Asked Questions</li>
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

export default WhatsNew

import { useState } from 'react'
import { createPortal } from 'react-dom'

import useSound from '../../hooks/useSound'
import CriticalError from '../CriticalError'
import type { ErrorType } from '../CriticalError'
import XPScrollbar from '../XPScrollbar'

import AddFavourite from '../../img/AddFavorite1.webp'
import Dot from '../../img/dot.gif'
import Large from '../../img/HelpAndSupportChangeView2.webp'
// import Minus from '../../img/minus.gif'
import Plus from '../../img/plus.gif'
import Printer from '../../img/Printer.webp'
import Question from '../../img/question.gif'
import RestoreAllItems  from '../../img/RestoreAllItems.webp'
import Small from '../../img/HelpAnSupport ChangeView1.webp'

import './HelpAnsSupport.css'
import './WhatsNew.css'

type ArticleView = 'main' | 'topics';

interface WhatsNewProps {
    globalVolume?: number;
    globalMuted?: boolean;
    plusTheme?: 'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
    isFullscreen?: boolean;
    onToggleFullscreen?: () => void;
}

// WhatsNew.tsx

const WhatsNew = ({ 
    globalVolume = 1, 
    globalMuted = false, 
    plusTheme, 
    isFullscreen, 
    onToggleFullscreen 
}: WhatsNewProps) => {
  const sounds = useSound(globalVolume, globalMuted);
  const themeSound = plusTheme === 'aquarium' ? sounds.aquarium
      : plusTheme === 'davinci' ? sounds.daVinci
      : plusTheme === 'nature' ? sounds.nature
      : plusTheme === 'space' ? sounds.space
      : null;
  const playExclamation = () => themeSound ? themeSound.playExclamation() : sounds.playExclamation();

  const [errorType, setErrorType] = useState<ErrorType | null>(null);
  const [article, setArticle] = useState<ArticleView>('main');

  const openError = (type: ErrorType) => {
    playExclamation();
    setErrorType(type);
  };

  return (
    <div className="whatsnew-page">
      <div className="whatsnew-body">
        <div className="whatsnew-tree">
          <div className="whatsnew-filter" data-tooltip='Discover the new features in Windows XP, the components included, and activation and license information.'>
            <label>
              <input type="checkbox" defaultChecked />
              Search only What's new in Windows XP
            </label>
          </div>

          <div className="tree-box">
            <h4>What's new in Windows XP</h4>
            <XPScrollbar className="tree-box-scroll">
                <ul>
                    <li onClick={() => setArticle('topics')}><img src={Dot} alt="" /> What's new topics</li>
                    <li><img src={Dot} alt="" /> Taking a tour or tutorial</li>
                    <li><img src={Dot} alt="" /> Windows XP articles: Walk through ways to use your PC</li>
                    <li><img src={Dot} alt="" /> Activation, license, and registration</li>
                    <li><img src={Plus} alt="" /> Windows components</li>
                </ul>
            </XPScrollbar>
          </div>

          <div className="tree-box light">
                <h4>See Also</h4>
                <XPScrollbar className="tree-box-scroll">
                    <ul>
                        <li><img src={Question} alt="" /> Windows Glossary</li>
                        <li><img src={Question} alt="" /> Windows keyboard shortcuts overview</li>
                        <li><img src={Question} alt="" /> Tools</li>
                        <li><img src={Question} alt="" /> Go to a Windows newsgroup</li>
                    </ul>
                </XPScrollbar>
          </div>
        </div>

        <div className="whatsnew-content">
            <div className="whatsnew-toolbar">
                <button onClick={() => openError('helpFavoriteExists')} disabled={article === 'topics'}>
                <img src={AddFavourite} alt="" />
                <span>Add to <span className='mnemonic'>F</span>avorites</span>
                </button>
                <button onClick={onToggleFullscreen}>
                <img src={isFullscreen ? Small : Large} alt="" />
                <span>Change <span className='mnemonic'>V</span>iew</span>
                </button>
                <button onClick={() => openError('helpPrint')} disabled={article === 'topics'}>
                <img src={Printer} alt="" />
                <span><span className='mnemonic'>P</span>rint...</span>
                </button>
                <button onClick={() => openError('helpLocateInContents')}>
                <img src={RestoreAllItems} alt="" />
                <span>Locate in <span className='mnemonic'>C</span>ontents</span>
                </button>
            </div>

             {article === 'main' && (
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

            {article === 'topics' && (
              <div 
              className="whats-new-article topics-view"
              >
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
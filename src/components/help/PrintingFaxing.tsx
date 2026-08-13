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

type ArticleId = 'overview' | 'printing' | 'network' | 'fixing' | 'faxing';

interface PrintingFaxingProps {
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
    overview: 'Printing and faxing',
    printing: 'Printing',
    network: 'Network printers',
    fixing: 'Fixing a printing problem',
    faxing: 'Faxing',
};

const PrintingFaxing = ({
    globalVolume = 1,
    globalMuted = false,
    plusTheme,
    isFullscreen,
    onToggleFullscreen,
    isFavorite,
    onAddFavorite,
    initialArticle,
}: PrintingFaxingProps) => {
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
  const [printingExpanded, setPrintingExpanded] = useState(false);
  const [networkExpanded, setNetworkExpanded] = useState(false);

  const [prevInitialArticle, setPrevInitialArticle] = useState(initialArticle);
  if (initialArticle !== prevInitialArticle) {
    setPrevInitialArticle(initialArticle);
    if (initialArticle) {
      setCurrentArticle(initialArticle as ArticleId);
    }
  }

  const favoriteId = `print:${currentArticle}`;

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
              Search only Printing and faxing
            </label>
          </div>

          <div className="tree-box">
            <h4 onClick={() => setCurrentArticle('overview')}>Printing and faxing</h4>
            <XPScrollbar className="tree-box-scroll">
                <ul>
                    <li className={currentArticle === 'printing' ? 'is-selected' : ''} onClick={() => { setPrintingExpanded(!printingExpanded); setCurrentArticle('printing'); }}>
                        <span className="tree-label">
                            <img src={printingExpanded ? Minus : Plus} alt="" /> Printing
                        </span>
                        {printingExpanded && (
                            <ul className="tree-subitems">
                                <li><span className="tree-label"><img src={Dot} alt="" /> Basic printing tasks</span></li>
                                <li><span className="tree-label"><img src={Dot} alt="" /> Changing the appearance of the printed page</span></li>
                                <li><span className="tree-label"><img src={Dot} alt="" /> Pausing, resuming, restarting, or canceling print jobs</span></li>
                                <li><span className="tree-label"><img src={Plus} alt="" /> Installing, sharing, configuring, and deleting a printer</span></li>
                                <li><span className="tree-label"><img src={Plus} alt="" /> Drivers, ports, fonts, memory and other options</span></li>
                                <li><span className="tree-label"><img src={Dot} alt="" /> Matching color on your screen, printer, and other devices</span></li>
                            </ul>
                        )}
                    </li>

                    <li className={currentArticle === 'network' ? 'is-selected' : ''} onClick={() => { setNetworkExpanded(!networkExpanded); setCurrentArticle('network'); }}>
                        <span className="tree-label">
                            <img src={networkExpanded ? Minus : Plus} alt="" /> Printing on a network
                        </span>
                        {networkExpanded && (
                            <ul className="tree-subitems">
                                <li><span className="tree-label"><img src={Dot} alt="" /> Finding, installing, and deleting printers</span></li>
                                <li><span className="tree-label"><img src={Dot} alt="" /> Sharing a printer</span></li>
                                <li><span className="tree-label"><img src={Dot} alt="" /> Configuring a printer</span></li>
                            </ul>
                        )}
                    </li>

                    <li className={currentArticle === 'fixing' ? 'is-selected' : ''} onClick={() => setCurrentArticle('fixing')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Fixing a printing problem</span>
                    </li>
                    <li className={currentArticle === 'faxing' ? 'is-selected' : ''} onClick={() => setCurrentArticle('faxing')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Faxing</span>
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
                    <h2>Printing and faxing</h2>
                    <p>
                        Windows XP makes it easy to print your documents, whether your
                        computer is connected directly to a printer or linked remotely
                        on a network. Learn how to install a printer, perform basic
                        printer tasks, share a printer, and manage a shared printer.
                        Find out how to fix printer problems. This section also
                        contains information about installing and using Fax Client to
                        send and receive faxes from your computer.
                    </p>
                    <p className="copyright">
                        © 1985-2001 Microsoft Corporation.<br />
                        All rights reserved.
                    </p>
                </div>
            )}

            {currentArticle === 'printing' && (
                <div className="whats-new-article topics-view">
                    <p className="article-subheading">Printing</p>
                    <img className="article-logo" src={Logo} alt="" />
                    <p className="thin">
                        Print your masterpiece and share it with others! Learn how to install your printer and configure it to
                        manage all your print projects, from color pictures to black-and-white pages.
                    </p>
                </div>
            )}

            {currentArticle === 'network' && (
                <div className="whats-new-article topics-view">
                    <p className="article-subheading">Network printers</p>
                    <img className="article-logo" src={Logo} alt="" />
                    <p className="thin">
                        Connecting to a printer? Windows XP can help you streamline the process. Using Printers and Faxes in
                        Control Panel, you can connect a printer directly to your computer, share a network printer, and
                        manage your printer settings.
                    </p>
                </div>
            )}

            {currentArticle === 'fixing' && (
                <div className="whats-new-article topics-view">
                    <h2>Fixing a printing problem</h2>
                    <p className="article-subheading">Fix a problem:</p>
                    <ul className="article-links">
                        <li>Printing Troubleshooter</li>
                        <li>Fixing connection problems</li>
                    </ul>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Install new or updated printer drivers</li>
                        <li>Ensure that complex pages print properly</li>
                        <li>Print a test page</li>
                        <li>Cancel printing all documents</li>
                        <li>Pause or resume printing of a document</li>
                        <li>Install USB 2.0 controller drivers</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Getting printing help on the Internet</li>
                        <li>Fixing a printing problem</li>
                        <li>Settings that affect printing</li>
                        <li>How Windows Firewall affects printing</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'faxing' && (
                <div className="whats-new-article topics-view">
                    <h2>Faxing</h2>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Using Fax</li>
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

export default PrintingFaxing

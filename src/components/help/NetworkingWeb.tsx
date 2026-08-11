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

type ArticleId = 'overview' | 'email' | 'networking' | 'sharing' | 'passwords' | 'homeoffice' | 'fixing';

interface NetworkingWebProps {
    globalVolume?: number;
    globalMuted?: boolean;
    plusTheme?: 'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
    isFullscreen?: boolean;
    onToggleFullscreen?: () => void;
    isFavorite: (id: string) => boolean;
    onAddFavorite: (id: string, title: string) => void;
}

const articleTitles: Record<ArticleId, string> = {
    overview: 'Networking and the Web',
    email: 'E-mail and the Web',
    networking: 'Networking',
    sharing: 'Sharing files, printers, and other resources',
    passwords: 'Passwords and security',
    homeoffice: 'Home or small office networking',
    fixing: 'Fixing networking or Web problems',
};

const NetworkingWeb = ({
    globalVolume = 1,
    globalMuted = false,
    plusTheme,
    isFullscreen,
    onToggleFullscreen,
    isFavorite,
    onAddFavorite,
}: NetworkingWebProps) => {
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
  const [emailExpanded, setEmailExpanded] = useState(false);
  const [networkingExpanded, setNetworkingExpanded] = useState(false);
  const [homeofficeExpanded, setHomeofficeExpanded] = useState(false);

  const favoriteId = `networking:${currentArticle}`;

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
              Search only Networking and the Web
            </label>
          </div>

          <div className="tree-box">
            <h4 onClick={() => setCurrentArticle('overview')}>Networking and the Web</h4>
            <XPScrollbar className="tree-box-scroll">
                <ul>
                  <li className={currentArticle === 'email' ? 'is-selected' : ''} onClick={() => { setEmailExpanded(!emailExpanded); setCurrentArticle('email'); }}>
                      <span className="tree-label">
                          <img src={emailExpanded ? Minus : Plus} alt="" /> E-mail and the Web
                      </span>
                      {emailExpanded && (
                          <ul className="tree-subitems">
                              <li><span className="tree-label"><img src={Dot} alt="" /> Getting connected</span></li>
                              <li><span className="tree-label"><img src={Dot} alt="" /> E-mail and newsgroups</span></li>
                              <li><span className="tree-label"><img src={Dot} alt="" /> Browsing the Web</span></li>
                              <li><span className="tree-label"><img src={Dot} alt="" /> Searching the Web</span></li>
                              <li><span className="tree-label"><img src={Dot} alt="" /> Security online</span></li>
                              <li><span className="tree-label"><img src={Dot} alt="" /> Instant messaging</span></li>
                              <li><span className="tree-label"><img src={Dot} alt="" /> Putting your files on the Web</span></li>
                              <li><span className="tree-label"><img src={Dot} alt="" /> Accessibility</span></li>
                              <li><span className="tree-label"><img src={Dot} alt="" /> Internet Information Services</span></li>
                              <li><span className="tree-label"><img src={Dot} alt="" /> Music on the Web</span></li>
                              <li><span className="tree-label"><img src={Dot} alt="" /> Fixing e-mail and messaging problems</span></li>
                          </ul>
                      )}
                  </li>

                  <li className={currentArticle === 'networking' ? 'is-selected' : ''} onClick={() => { setNetworkingExpanded(!networkingExpanded); setCurrentArticle('networking'); }}>
                      <span className="tree-label">
                          <img src={networkingExpanded ? Minus : Plus} alt="" /> Networking
                      </span>
                      {networkingExpanded && (
                          <ul className="tree-subitems">
                              <li><span className="tree-label"><img src={Dot} alt="" /> Getting started</span></li>
                              <li><span className="tree-label"><img src={Dot} alt="" /> Local area connections</span></li>
                              <li><span className="tree-label"><img src={Dot} alt="" /> Dial-up connections</span></li>
                              <li><span className="tree-label"><img src={Plus} alt="" /> Virtual Private Network (VPN), incoming, direct, and ISDN connections</span></li>
                              <li><span className="tree-label"><img src={Plus} alt="" /> Internet connections</span></li>
                              <li><span className="tree-label"><img src={Plus} alt="" /> Wireless networking</span></li>
                              <li><span className="tree-label"><img src={Dot} alt="" /> Network bridge</span></li>
                              <li><span className="tree-label"><img src={Dot} alt="" /> Network components</span></li>
                              <li><span className="tree-label"><img src={Dot} alt="" /> TCP/IP</span></li>
                          </ul>
                      )}
                  </li>

                  <li className={currentArticle === 'sharing' ? 'is-selected' : ''} onClick={() => setCurrentArticle('sharing')}>
                      <span className="tree-label"><img src={Dot} alt="" /> Sharing files, printers, and other resources</span>
                  </li>
                  <li className={currentArticle === 'passwords' ? 'is-selected' : ''} onClick={() => setCurrentArticle('passwords')}>
                      <span className="tree-label"><img src={Dot} alt="" /> Passwords and security</span>
                  </li>

                  <li className={currentArticle === 'homeoffice' ? 'is-selected' : ''} onClick={() => { setHomeofficeExpanded(!homeofficeExpanded); setCurrentArticle('homeoffice'); }}>
                      <span className="tree-label">
                          <img src={homeofficeExpanded ? Minus : Plus} alt="" /> Home and small office networking
                      </span>
                      {homeofficeExpanded && (
                          <ul className="tree-subitems">
                              <li><span className="tree-label"><img src={Dot} alt="" /> Welcome to Home and Small Office Networking</span></li>
                              <li><span className="tree-label"><img src={Dot} alt="" /> Hardware requirements for home or small office networking</span></li>
                              <li><span className="tree-label"><img src={Dot} alt="" /> Network Configurations</span></li>
                              <li><span className="tree-label"><img src={Dot} alt="" /> Understanding network connections</span></li>
                              <li><span className="tree-label"><img src={Plus} alt="" /> Connecting to the Internet</span></li>
                              <li><span className="tree-label"><img src={Dot} alt="" /> Using the Network Setup Wizard</span></li>
                          </ul>
                      )}
                  </li>

                  <li className={currentArticle === 'fixing' ? 'is-selected' : ''} onClick={() => setCurrentArticle('fixing')}>
                      <span className="tree-label"><img src={Dot} alt="" /> Fixing networking or Web problems</span>
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
                <h2>Networking and the Web</h2>
                <p>
                    Windows XP provides many ways for you to communicate with friends,
                    co-workers, and with the rest of the world. Learn how to set up and
                    use e-mail, including instant messaging. Explore the World Wide Web
                    safely and in a secure environment. Unlock the powerful advantages
                    of networking - linking computers at home or in a small business.
                </p>
                <p className="copyright">
                    © 1985-2001 Microsoft Corporation.<br />
                    All rights reserved.
                </p>
              </div>
            )}

            {currentArticle === 'email' && (
              <div className="whats-new-article topics-view">
                <p className="article-subheading">E-mail and the Web</p>
                <img className="article-logo" src={Logo} alt="" />
                <p className="thin">
                    Connect with friends, family, and co-workers using e-mail, video conferencing, and the Web. Using
                    Internet Explorer and Outlook Express, you can customize the way you interact with Web content and
                    ensure a secure environment while you are working on the Internet.
                </p>
              </div>
            )}

            {currentArticle === 'networking' && (
              <div className="whats-new-article topics-view">
                <p className="article-subheading">Networking</p>
                <img className="article-logo" src={Logo} alt="" />
                <p className="thin">
                    Managing a myriad of network and Internet connections can be confusing. Empower yourself with
                    knowledge about managing network and Internet connections for local and remote users. If you have a
                    network problem, diagnose and fix it with network, Internet, and hardware troubleshooters.
                </p>
              </div>
            )}

            {currentArticle === 'sharing' && (
              <div className="whats-new-article topics-view">
                <h2>Sharing files, printers, and other resources</h2>
                <p className="article-subheading">Fix a problem:</p>
                <ul className="article-links">
                  <li>File and Printer Sharing Troubleshooter</li>
                </ul>
                <p className="article-subheading">Pick a task:</p>
                <ul className="article-links">
                  <li>Share your printer</li>
                  <li>Open a shared folder on another computer</li>
                  <li>Installing a network service</li>
                  <li>Stop sharing your printer</li>
                  <li>Share files and folders on your computer</li>
                  <li>Hide a file or folder</li>
                  <li>Lock a computer in a domain environment</li>
                  <li>Share pictures and music on your computer</li>
                  <li>Share a folder or drive on a network domain</li>
                  <li>Connect to a printer on a network</li>
                  <li>Share a drive or folder with others in your workgroup</li>
                  <li>Make your folders private when you are on a workgroup</li>
                </ul>
                <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                <ul className="article-links">
                  <li>Sharing files and folders overview</li>
                  <li>Offline files overview</li>
                  <li>Working offline overview</li>
                  <li>Network Places overview</li>
                  <li>Using the WMI Control</li>
                  <li>Using Group Policy</li>
                  <li>User profiles overview</li>
                  <li>Managing Web documents overview</li>
                  <li>Using the Shared Documents folder</li>
                </ul>
              </div>
            )}

            {currentArticle === 'passwords' && (
              <div className="whats-new-article topics-view">
                <h2>Passwords and security</h2>
                <p className="article-subheading">Pick a task:</p>
                <ul className="article-links">
                  <li>Add a new user to the computer</li>
                  <li>Change the group a user belongs to</li>
                  <li>Turn the Welcome screen on or off</li>
                  <li>Apply a unique picture to a user account</li>
                  <li>Change a user's picture</li>
                  <li>Turn the guest account on or off</li>
                  <li>Turn Fast User Switching on or off</li>
                  <li>Manage passwords stored on the computer</li>
                  <li>Store a new user name and password</li>
                  <li>Connect to a network resource</li>
                  <li>Set up your user account to use a .Net Passport</li>
                  <li>Have the computer remember your password</li>
                  <li>Create a password reset disk in case you forget your password</li>
                </ul>
                <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                <ul className="article-links">
                  <li>Using Local Users and Groups</li>
                  <li>Recovering a user's password</li>
                </ul>
              </div>
            )}

            {currentArticle === 'homeoffice' && (
              <div className="whats-new-article topics-view">
                <p className="article-subheading">Home or small office networking</p>
                <img className="article-logo" src={Logo} alt="" />
                <p className="thin">
                    Create a home or small business network to harness the power of all your computer resources, for
                    work and play. Follow step-by-step instructions for planning and setting up a secure and reliable home
                    or small business network. Save yourself time and money - read the section on <strong>Hardware
                    Requirements for Home Networking</strong> to double-check your shopping list before visiting your local
                    computer store.
                </p>
              </div>
            )}

            {currentArticle === 'fixing' && (
              <div className="whats-new-article topics-view">
                <h2>Fixing networking or Web problems</h2>
                <p className="article-subheading">Fix a problem:</p>
                <ul className="article-links">
                  <li>Modem Troubleshooter</li>
                  <li>Internet Connection Sharing Troubleshooter</li>
                  <li>Home and Small Office Networking Troubleshooter</li>
                  <li>File and Printer Troubleshooter</li>
                  <li>Drives and Network Adapters Troubleshooter</li>
                  <li>E-mail Troubleshooter</li>
                  <li>Outlook Express Troubleshooter</li>
                  <li>Internet Explorer Troubleshooter</li>
                  <li>Fixing connection problems</li>
                </ul>
                <p className="article-subheading">Pick a task:</p>
                <ul className="article-links">
                  <li>Diagnose network configuration and run automated networking tests</li>
                  <li>Test a TCP/IP configuration using the ping command</li>
                  <li>Test TCP/IP connections using the ping and net view commands</li>
                </ul>
                <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                <ul className="article-links">
                  <li>Using the Microsoft Internet Explorer 6 Resource Kit</li>
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

export default NetworkingWeb

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

type ArticleId = 'overview' | 'windows' | 'savvy' | 'securitycenter' | 'online' | 'sharing' | 'network';

interface SecurityBasicsProps {
    globalVolume?: number;
    globalMuted?: boolean;
    plusTheme?: 'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
    isFullscreen?: boolean;
    onToggleFullscreen?: () => void;
    isFavorite: (id: string) => boolean;
    onAddFavorite: (id: string, title: string) => void;
}

const articleTitles: Record<ArticleId, string> = {
    overview: 'Protecting your PC: security basics',
    windows: 'Use Windows to help keep your computer more secure',
    savvy: 'Be security savvy: what you should do',
    securitycenter: "Use the Security Center to check your computer's security settings",
    online: 'Help protect your computer online',
    sharing: 'Share your computer more safely',
    network: 'Make your home network more secure',
};

const SecurityBasics = ({
    globalVolume = 1,
    globalMuted = false,
    plusTheme,
    isFullscreen,
    onToggleFullscreen,
    isFavorite,
    onAddFavorite,
}: SecurityBasicsProps) => {
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

  const favoriteId = `securitybasics:${currentArticle}`;

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
              Search only Protecting your PC: security basics
            </label>
          </div>

          <div className="tree-box">
            <h4 onClick={() => setCurrentArticle('overview')}>Protecting your PC: security basics</h4>
            <XPScrollbar className="tree-box-scroll">
                <ul>
                    <li className={currentArticle === 'windows' ? 'is-selected' : ''} onClick={() => setCurrentArticle('windows')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Use Windows to help keep your computer more secure</span>
                    </li>
                    <li className={currentArticle === 'savvy' ? 'is-selected' : ''} onClick={() => setCurrentArticle('savvy')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Be security savvy: what you should do</span>
                    </li>
                    <li className={currentArticle === 'securitycenter' ? 'is-selected' : ''} onClick={() => setCurrentArticle('securitycenter')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Use the Security Center to check your computer's security settings</span>
                    </li>
                    <li className={currentArticle === 'online' ? 'is-selected' : ''} onClick={() => setCurrentArticle('online')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Help protect your computer online</span>
                    </li>
                    <li className={currentArticle === 'sharing' ? 'is-selected' : ''} onClick={() => setCurrentArticle('sharing')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Share your computer more safely</span>
                    </li>
                    <li className={currentArticle === 'network' ? 'is-selected' : ''} onClick={() => setCurrentArticle('network')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Make your home network more secure</span>
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
                    <h2>Protecting your PC: security basics</h2>
                    <p>
                        You can help protect your computer against security threats,
                        such as viruses that spread over the Internet and other
                        networks. Explore the topics in this section to learn the
                        safest settings for your computer, best practices you should
                        follow, and basic steps you can take to help keep your computer
                        as secure as possible.
                    </p>
                    <p>
                        <strong>Find</strong> <a href="#" onClick={(e) => { e.preventDefault(); openError('helpLocateInContents'); }}>security solutions for IT Professionals and network administrators</a> on TechNet.
                    </p>
                    <p className="copyright">
                        © 1985-2004 Microsoft Corporation.<br />
                        All rights reserved.
                    </p>
                </div>
            )}

            {currentArticle === 'windows' && (
                <div className="whats-new-article topics-view">
                    <h2>Use Windows to help keep your computer more secure</h2>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Help protect your PC</li>
                        <li>What's new for security</li>
                        <li>What's new in Windows XP: Frequently Asked Questions</li>
                        <li>Reduce security threats with Windows Firewall</li>
                        <li>Help protect your computer with Automatic Updates</li>
                        <li>Browse more safely with Internet Explorer's enhanced security settings</li>
                        <li>Microsoft Privacy Statement</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'savvy' && (
                <div className="whats-new-article topics-view">
                    <h2>Be security savvy: what you should do</h2>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Turn Windows Firewall on with no exceptions</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Antivirus software overview</li>
                        <li>What you should know about trusting Web sites</li>
                        <li>What you should know about trusting e-mail messages</li>
                        <li>Use safer e-mail settings</li>
                        <li>Finding out about your computer's security settings</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'securitycenter' && (
                <div className="whats-new-article topics-view">
                    <h2>Use the Security Center to check your computer's security settings</h2>
                    <p className="article-subheading">Help &amp; Information:</p>
                    <ul className="article-links">
                        <li>Get help for security-related issues</li>
                    </ul>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Find out if your computer has a firewall</li>
                        <li>Find out if your computer has antivirus software</li>
                        <li>Make sure your antivirus program is as effective as it can be</li>
                        <li>Use an antivirus program that Windows doesn't find</li>
                        <li>Use a firewall that Windows doesn't find</li>
                        <li>Turn off Security Center alerts</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>What to do if Security Center sends you a security alert</li>
                        <li>Security Center overview</li>
                        <li>Windows Firewall overview</li>
                        <li>Automatic Updates overview</li>
                        <li>Antivirus software overview</li>
                        <li>Which antivirus and firewall programs does the Security Center detect?</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'online' && (
                <div className="whats-new-article topics-view">
                    <h2>Help protect your computer online</h2>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Stop receiving pop-up ads that have the title "Messenger Service"</li>
                        <li>Make your folders private</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Help protect your identity on the Internet</li>
                        <li>Understanding cookies</li>
                        <li>Security and privacy features in Internet Explorer</li>
                        <li>What's a Web browser add-on?</li>
                        <li>Transfer files more safely over the Web</li>
                        <li>Store data more securely</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'sharing' && (
                <div className="whats-new-article topics-view">
                    <h2>Share your computer more safely</h2>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Set up an account for each person who uses the computer</li>
                        <li>Lock your computer</li>
                        <li>Help protect your computer with passwords</li>
                        <li>Use a screen saver password</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Sharing files and folders overview</li>
                        <li>Store data more securely</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'network' && (
                <div className="whats-new-article topics-view">
                    <h2>Make your home network more secure</h2>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Setting up a more secure network</li>
                        <li>Network configurations overview</li>
                        <li>Connecting your computers together</li>
                        <li>Use Windows Firewall to help protect your home network</li>
                        <li>Configuring wireless network client computers</li>
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

export default SecurityBasics

// Accessibility.tsx — kompletní, opravená verze

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
import MinusArticle from './img/minus.png'
import Note from './img/IIS_note.gif'
import Plus from '../../img/plus.gif'
import PlusArticle from './img/plus.png'
import Printer from '../../img/Printer.webp'
import Question from '../../img/question.gif'
import RestoreAllItems from '../../img/RestoreAllItems.webp'
import Small from '../../img/HelpAnSupport ChangeView1.webp'
import WindowsKey from './img/WinKey.webp'

import './HelpAnsSupport.css'
import './WhatsNew.css'

type ArticleId = 'overview' | 'understanding' | 'deaf' | 'blind' | 'mobility' | 'customize' | 'shortcuts' | 'handwriting';
type ShortcutHeading = 'general' | 'dialog' | 'natural' | 'accessibility' | 'explorer';

interface AccessibilityProps {
    globalVolume?: number;
    globalMuted?: boolean;
    plusTheme?: 'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
    isFullscreen?: boolean;
    onToggleFullscreen?: () => void;
    isFavorite: boolean;
    onAddFavorite: () => void;
}

const Accessibility = ({
    globalVolume = 1,
    globalMuted = false,
    plusTheme,
    isFullscreen,
    onToggleFullscreen,
    isFavorite,
    onAddFavorite,
}: AccessibilityProps) => {
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
  const [treeExpanded, setTreeExpanded] = useState({ blind: false, handwriting: false });
  const [headingsExpanded, setHeadingsExpanded] = useState<Record<ShortcutHeading, boolean>>({
      general: false,
      dialog: false,
      natural: false,
      accessibility: false,
      explorer: false,
  });

  const openError = (type: ErrorType) => {
    playExclamation();
    setErrorType(type);
  };

  const handleAddToFavorites = () => {
    if (isFavorite) {
      openError('helpFavoriteExists');
    } else {
      onAddFavorite();
      playInfoSound();
      setErrorType('helpFavoriteAdded');
    }
  };

  const toggleTree = (key: 'blind' | 'handwriting') => {
    setTreeExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleHeading = (key: ShortcutHeading) => {
    setHeadingsExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="whatsnew-page">
      <div className="whatsnew-body">
        <div className="whatsnew-tree">
          <div className="whatsnew-filter">
            <label>
              <input type="checkbox" defaultChecked />
              Search only Accessibility
            </label>
          </div>

          <div className="tree-box">
            <h4 onClick={() => setCurrentArticle('overview')}>Accessibility</h4>
            <XPScrollbar className="tree-box-scroll">
                <ul>
                    <li onClick={() => setCurrentArticle('understanding')}>
                        <span className="tree-label">
                            <img src={Dot} alt="" /> Understanding Windows XP accessibility features
                        </span>
                    </li>
                    <li onClick={() => setCurrentArticle('deaf')}>
                        <span className="tree-label">
                            <img src={Dot} alt="" /> Features for people who are deaf or hard-of-hearing
                        </span>
                    </li>
                    <li onClick={() => { toggleTree('blind'); setCurrentArticle('blind'); }}>
                        <span className="tree-label">
                            <img src={treeExpanded.blind ? Minus : Plus} alt="" /> Features for people who are blind or have impaired vision
                        </span>
                        {treeExpanded.blind && (
                            <ul className="tree-subitems">
                                <li onClick={(e) => { e.stopPropagation(); setCurrentArticle('blind'); }}><img src={Dot} alt="" /> Magnifier</li>
                                <li onClick={(e) => { e.stopPropagation(); setCurrentArticle('blind'); }}><img src={Dot} alt="" /> Narrator</li>
                            </ul>
                        )}
                    </li>
                    <li onClick={() => setCurrentArticle('mobility')}>
                        <span className="tree-label">
                            <img src={Dot} alt="" /> Features for people who have a mobility impairment
                        </span>
                    </li>
                    <li onClick={() => setCurrentArticle('customize')}>
                        <span className="tree-label">
                            <img src={Dot} alt="" /> Customizing your keyboard and mouse
                        </span>
                    </li>
                    <li onClick={() => setCurrentArticle('shortcuts')}>
                        <span className="tree-label">
                            <img src={Dot} alt="" /> Windows keyboard shortcuts overview
                        </span>
                    </li>
                    <li onClick={() => { toggleTree('handwriting'); setCurrentArticle('handwriting'); }}>
                        <span className="tree-label">
                            <img src={treeExpanded.handwriting ? Minus : Plus} alt="" /> Using handwriting or speech recognition
                        </span>
                        {treeExpanded.handwriting && (
                            <ul className="tree-subitems">
                                <li onClick={(e) => { e.stopPropagation(); setCurrentArticle('handwriting'); }}><img src={Dot} alt="" /> Using handwriting</li>
                                <li onClick={(e) => { e.stopPropagation(); setCurrentArticle('handwriting'); }}><img src={Plus} alt="" /> Using Speech</li>
                                <li onClick={(e) => { e.stopPropagation(); setCurrentArticle('handwriting'); }}><img src={Dot} alt="" /> Using Language Bar</li>
                            </ul>
                        )}
                    </li>
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
                    <h2>Accessibility</h2>
                    <img className="article-logo" src={Logo} alt="" />
                    <p>
                        Microsoft is committed to making its products and services
                        easier for everyone to use. This section provides information
                        about the accessibility options and programs included in
                        Windows XP. Learn how to adjust Windows XP, and your keyboard,
                        mouse, and display to suit your needs and preferences.
                    </p>
                    <p className="copyright">
                        © 1985-2001 Microsoft Corporation.<br />
                        All rights reserved.
                    </p>
                </div>
            )}

            {currentArticle === 'understanding' && (
                <div className="whats-new-article topics-view">
                    <h2>Understanding Windows XP accessibility features</h2>
                    <img className="article-logo" src={Logo} alt="" />
                    <p className="article-subheading">Fix a problem:</p>
                    <ul className="article-links">
                        <li>Narrator could not open</li>
                    </ul>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Common tasks: Accessibility options</li>
                        <li>Turn off accessibility features after a specified time</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Accessibility Wizard</li>
                        <li>Accessibility options overview</li>
                        <li>Control Panel accessibility options</li>
                        <li>Utilities to enhance accessibility</li>
                        <li>Information on Microsoft products and services for people with disabilities</li>
                        <li>Customizing Windows</li>
                        <li>Getting more accessibility information</li>
                        <li>Microsoft services for people who are deaf or hard-of-hearing</li>
                        <li>Microsoft documentation in alternative formats</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'deaf' && (
                <div className="whats-new-article topics-view">
                    <h2>Features for people who are deaf or hard-of-hearing</h2>
                    <img className="article-logo" src={Logo} alt="" />
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Turn on ShowSounds</li>
                        <li>Turn on SoundSentry</li>
                        <li>Create a sound scheme</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Configuring Windows for people who are deaf or hard-of-hearing</li>
                        <li>Microsoft services for people who are deaf or hard-of-hearing</li>
                        <li>Control Panel accessibility options</li>
                        <li>Understanding accessibility options</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'blind' && (
                <div className="whats-new-article topics-view">
                    <h2>Features for people who are blind or have impaired vision</h2>
                    <img className="article-logo" src={Logo} alt="" />
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Turn on High Contrast</li>
                        <li>Change High Contrast options</li>
                        <li>Turn on ToggleKeys</li>
                        <li>Change your screen resolution</li>
                        <li>Increase or decrease the size of objects and text on your screen</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Configuring Windows for people who are blind or have impaired vision</li>
                        <li>Control Panel accessibility options</li>
                        <li>Understanding accessibility options</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'mobility' && (
                <div className="whats-new-article topics-view">
                    <h2>Features for people who have a mobility impairment</h2>
                    <img className="article-logo" src={Logo} alt="" />
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Configuring Windows for people who have a mobility impairment</li>
                        <li>Move the mouse pointer using MouseKeys</li>
                        <li>Turn on MouseKeys</li>
                        <li>Change MouseKeys options</li>
                        <li>Turn on Serial Keys</li>
                        <li>Display extra keyboard Help in programs</li>
                        <li>Turn on FilterKeys</li>
                        <li>Change FilterKeys options</li>
                        <li>Turn on StickyKeys</li>
                        <li>Change StickyKeys options</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Using accessibility shortcut keys</li>
                        <li>On-Screen Keyboard overview</li>
                        <li>Control Panel accessibility options</li>
                        <li>Understanding accessibility options</li>
                        <li>Utilities to enhance accessibility</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'customize' && (
                <div className="whats-new-article topics-view">
                    <h2>Customizing your keyboard and mouse</h2>
                    <img className="article-logo" src={Logo} alt="" />
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Reverse your mouse buttons</li>
                        <li>Adjust the key repeat rate</li>
                        <li>Adjust the cursor blink rate</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Keyboard overview</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'shortcuts' && (
                <div className="whats-new-article topics-view">
                    <h3>Windows keyboard shortcuts overview</h3>
                    <img className="article-logo" src={Logo} alt="" />
                    <p className="thin">
                        Use shortcut keys as an alternative to the mouse when working
                        in Windows. You can open, close, and navigate the Start menu,
                        desktop, menus, dialog boxes, and Web pages using keyboard
                        shortcuts. Keyboard shortcuts may also make it easier for you
                        to interact with your computer.
                    </p>
                    <p className="thin">
                        Click a heading, or press TAB to highlight a heading, and then press ENTER.
                    </p>

                    <ul className="article-links">
                        <li data-heading onClick={() => toggleHeading('general')}>
                            <img src={headingsExpanded.general ? MinusArticle : PlusArticle} alt="" />
                            General keyboard shortcuts
                        </li>
                        <li data-heading onClick={() => toggleHeading('dialog')}>
                            <img src={headingsExpanded.dialog ? MinusArticle : PlusArticle} alt="" />
                            Dialog box keyboard shortcuts
                        </li>
                        <li data-heading onClick={() => toggleHeading('natural')}>
                            <img src={headingsExpanded.natural ? MinusArticle : PlusArticle} alt="" />
                            Natural keyboard shortcuts
                        </li>
                        <li data-heading onClick={() => toggleHeading('accessibility')}>
                            <img src={headingsExpanded.accessibility ? MinusArticle : PlusArticle} alt="" />
                            Accessibility keyboard shortcuts
                        </li>
                        <li data-heading onClick={() => toggleHeading('explorer')}>
                            <img src={headingsExpanded.explorer ? MinusArticle : PlusArticle} alt="" />
                            Windows Explorer keyboard shortcuts
                        </li>
                    </ul>

                    <p className="article-subheading"><img className='subheading-img' src={Note} alt="" />Notes</p>
                    <ul className="article-links notes-list">
                        <li>
                            You must associate a password with your user account to
                            secure it from unauthorized access. If you do not have a
                            password associated with your user account, pressing the 
                            <img className="inline-key" src={WindowsKey} alt="Windows key" />+L will not prevent other users from accessing your account information.
                        </li>
                        <li>
                            Some keyboard shortcuts may not work if StickyKeys is
                            turned on in Accessibility Options.
                        </li>
                        <li>
                            If you are connected to Windows through Microsoft
                            Terminal Services Client, some shortcuts have changed. For
                            more information, see the online documentation for
                            Terminal Services Client.
                        </li>
                    </ul>

                    <p className="article-link">Related Topics</p>
                </div>
            )}

            {currentArticle === 'handwriting' && (
                <div className="whats-new-article topics-view">
                    <p className="article-subheading">Using handwriting or speech recognition</p>
                    <img className="article-logo" src={Logo} alt="" />
                    <p className="thin">
                        Remember when issuing voice commands to your computer was a
                        science fiction fantasy? Windows XP lets you use your voice
                        to dictate an e-mail message, read numbers into a
                        spreadsheet, or compose a document. Learn how to train your
                        computer to recognize your voice and respond to your
                        commands. Use your handwriting instead of the keyboard to
                        write a note to yourself or sign a document.
                    </p>
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

export default Accessibility
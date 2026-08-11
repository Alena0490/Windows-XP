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
import Note from './img/IIS_note.gif'
import Plus from '../../img/plus.gif'
import Printer from '../../img/Printer.webp'
import Question from '../../img/question.gif'
import RestoreAllItems from '../../img/RestoreAllItems.webp'
import Small from '../../img/HelpAnSupport ChangeView1.webp'

import './HelpAnsSupport.css'
import './WhatsNew.css'

type ArticleId =
  | 'overview' | 'desktop' | 'desktopicons' | 'startmenu' | 'background' | 'screensaver'
  | 'files' | 'keyboard' | 'monitors' | 'fonts' | 'datetime' | 'sounds' | 'handwriting'
  | 'workway' | 'sharing' | 'fixing' | 'policy';

interface CustomizeComputerProps {
    globalVolume?: number;
    globalMuted?: boolean;
    plusTheme?: 'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
    isFullscreen?: boolean;
    onToggleFullscreen?: () => void;
    isFavorite: (id: string) => boolean;
    onAddFavorite: (id: string, title: string) => void;
}

const articleTitles: Record<ArticleId, string> = {
    overview: 'Customizing your computer',
    desktop: 'Your desktop',
    desktopicons: 'Your desktop icons',
    startmenu: 'Your Start menu',
    background: 'Background and themes',
    screensaver: 'Screen savers and screen settings',
    files: 'Files, folders, and programs',
    keyboard: 'Keyboard and mouse',
    monitors: 'Multiple monitors',
    fonts: 'Fonts and text',
    datetime: 'Date, time, region, and language',
    sounds: 'Sounds and audio devices',
    handwriting: 'Using handwriting or speech recognition',
    workway: 'Customizing the way you work',
    sharing: 'Sharing your computer',
    fixing: 'Fixing customizing problems',
    policy: 'Customizing your computer using Group Policy',
};

const CustomizeComputer = ({
    globalVolume = 1,
    globalMuted = false,
    plusTheme,
    isFullscreen,
    onToggleFullscreen,
    isFavorite,
    onAddFavorite,
}: CustomizeComputerProps) => {
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
  const [datetimeExpanded, setDatetimeExpanded] = useState(false);
  const [soundsExpanded, setSoundsExpanded] = useState(false);
  const [handwritingExpanded, setHandwritingExpanded] = useState(false);

  const favoriteId = `customize:${currentArticle}`;

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
              Search only Customizing your computer
            </label>
          </div>

          <div className="tree-box">
            <h4 onClick={() => setCurrentArticle('overview')}>Customizing your computer</h4>
            <XPScrollbar className="tree-box-scroll">
                <ul>
                    <li className={currentArticle === 'desktop' ? 'is-selected' : ''} onClick={() => setCurrentArticle('desktop')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Your desktop</span>
                    </li>
                    <li className={currentArticle === 'desktopicons' ? 'is-selected' : ''} onClick={() => setCurrentArticle('desktopicons')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Your desktop icons</span>
                    </li>
                    <li className={currentArticle === 'startmenu' ? 'is-selected' : ''} onClick={() => setCurrentArticle('startmenu')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Your Start menu</span>
                    </li>
                    <li className={currentArticle === 'background' ? 'is-selected' : ''} onClick={() => setCurrentArticle('background')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Background and themes</span>
                    </li>
                    <li className={currentArticle === 'screensaver' ? 'is-selected' : ''} onClick={() => setCurrentArticle('screensaver')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Screen savers and screen settings</span>
                    </li>
                    <li className={currentArticle === 'files' ? 'is-selected' : ''} onClick={() => setCurrentArticle('files')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Files, folders, and programs</span>
                    </li>
                    <li className={currentArticle === 'keyboard' ? 'is-selected' : ''} onClick={() => setCurrentArticle('keyboard')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Keyboard and mouse</span>
                    </li>
                    <li className={currentArticle === 'monitors' ? 'is-selected' : ''} onClick={() => setCurrentArticle('monitors')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Multiple monitors</span>
                    </li>
                    <li className={currentArticle === 'fonts' ? 'is-selected' : ''} onClick={() => setCurrentArticle('fonts')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Fonts and text</span>
                    </li>

                    <li className={currentArticle === 'datetime' ? 'is-selected' : ''} onClick={() => { setDatetimeExpanded(!datetimeExpanded); setCurrentArticle('datetime'); }}>
                        <span className="tree-label">
                            <img src={datetimeExpanded ? Minus : Plus} alt="" /> Date, time, region, and language
                        </span>
                        {datetimeExpanded && (
                            <ul className="tree-subitems">
                                <li><span className="tree-label"><img src={Dot} alt="" /> Date and time</span></li>
                                <li><span className="tree-label"><img src={Dot} alt="" /> Region and language</span></li>
                            </ul>
                        )}
                    </li>

                    <li className={currentArticle === 'sounds' ? 'is-selected' : ''} onClick={() => { setSoundsExpanded(!soundsExpanded); setCurrentArticle('sounds'); }}>
                        <span className="tree-label">
                            <img src={soundsExpanded ? Minus : Plus} alt="" /> Sounds and audio devices
                        </span>
                        {soundsExpanded && (
                            <ul className="tree-subitems">
                                <li><span className="tree-label"><img src={Plus} alt="" /> Using Speech</span></li>
                            </ul>
                        )}
                    </li>

                    <li className={currentArticle === 'handwriting' ? 'is-selected' : ''} onClick={() => { setHandwritingExpanded(!handwritingExpanded); setCurrentArticle('handwriting'); }}>
                        <span className="tree-label">
                            <img src={handwritingExpanded ? Minus : Plus} alt="" /> Using handwriting or speech recognition
                        </span>
                        {handwritingExpanded && (
                            <ul className="tree-subitems">
                                <li><span className="tree-label"><img src={Dot} alt="" /> Using handwriting</span></li>
                                <li><span className="tree-label"><img src={Dot} alt="" /> Using the Language bar</span></li>
                                <li><span className="tree-label"><img src={Plus} alt="" /> Using Speech</span></li>
                                <li><span className="tree-label"><img src={Dot} alt="" /> Adding text services</span></li>
                            </ul>
                        )}
                    </li>

                    <li className={currentArticle === 'workway' ? 'is-selected' : ''} onClick={() => setCurrentArticle('workway')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Customizing the way you work</span>
                    </li>
                    <li className={currentArticle === 'sharing' ? 'is-selected' : ''} onClick={() => setCurrentArticle('sharing')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Sharing your computer</span>
                    </li>
                    <li className={currentArticle === 'fixing' ? 'is-selected' : ''} onClick={() => setCurrentArticle('fixing')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Fixing customizing problems</span>
                    </li>
                    <li className={currentArticle === 'policy' ? 'is-selected' : ''} onClick={() => setCurrentArticle('policy')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Configuring Windows using policy</span>
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
                <h2>Customizing your computer</h2>
                <p>
                    Enjoy computing more! Tailor your computer to suit your
                    personality. Learn how to add more colors to the screen, change
                    the background to display a favorite picture, create a unique
                    screen saver, add distinctive sounds, change fonts, and more.
                    This section also shows you how to adjust the time and date, how
                    to display the contents of your screen across multiple monitors,
                    and how to "train" your computer to recognize your voice and
                    handwriting.
                </p>
                <p className="copyright">
                    © 1985-2001 Microsoft Corporation.<br />
                    All rights reserved.
                </p>
              </div>
            )}

            {currentArticle === 'desktop' && (
              <div className="whats-new-article topics-view">
                <h2>Your desktop</h2>
                <p className="article-subheading">Pick a task:</p>
                <ul className="article-links">
                  <li>Common tasks: Display settings</li>
                  <li>Use a picture as a desktop background</li>
                  <li>Put a shortcut on the desktop</li>
                  <li>Change the look of Window elements</li>
                  <li>Change your desktop fonts</li>
                  <li>Add Web content to your desktop</li>
                  <li>Add a desktop icon</li>
                  <li>Turn your monitor off automatically</li>
                  <li>Move the taskbar</li>
                  <li>Show the Quick Launch bar</li>
                </ul>
                <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                <ul className="article-links">
                  <li><img src={Document} alt="" /> Walkthrough: Personalize your PC</li>
                  <li>Display Properties overview</li>
                  <li>Personalizing your workspace</li>
                </ul>
              </div>
            )}

            {currentArticle === 'desktopicons' && (
              <div className="whats-new-article topics-view">
                <h2>Your desktop icons</h2>
                <p className="article-subheading">Pick a task:</p>
                <ul className="article-links">
                  <li>Arrange your desktop icons</li>
                  <li>Rename a desktop icon</li>
                  <li>Turn off the desktop icon grid</li>
                  <li>Remove unused desktop icons</li>
                </ul>
              </div>
            )}

            {currentArticle === 'startmenu' && (
              <div className="whats-new-article topics-view">
                <h2>Your Start menu</h2>
                <p className="article-subheading">Pick a task:</p>
                <ul className="article-links">
                  <li>Add items to the Start menu</li>
                  <li>Change the way All Programs opens from the Start menu</li>
                  <li>Show your most recently used documents on the Start menu</li>
                  <li>Display a program in the Start menu</li>
                  <li>Change the Start menu style</li>
                </ul>
              </div>
            )}

            {currentArticle === 'background' && (
              <div className="whats-new-article topics-view">
                <h2>Background and themes</h2>
                <p className="article-subheading">Pick a task:</p>
                <ul className="article-links">
                  <li>Change your desktop theme</li>
                  <li>Create your own desktop theme</li>
                  <li>Add Web content to your desktop</li>
                  <li>Use the classic Windows look</li>
                  <li>Delete a desktop theme</li>
                  <li>Change your desktop background</li>
                  <li>Use a picture as a desktop background</li>
                  <li>Use a graphic from a Web site as your background</li>
                  <li>Customize a background color</li>
                </ul>
                <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                <ul className="article-links">
                  <li>Choosing a theme</li>
                </ul>
              </div>
            )}

            {currentArticle === 'screensaver' && (
              <div className="whats-new-article topics-view">
                <h2>Screen savers and screen settings</h2>
                <p className="article-subheading">Pick a task:</p>
                <ul className="article-links">
                  <li>Set or change a screen saver</li>
                  <li>Use personal pictures as a screen saver</li>
                  <li>Increase or decrease the size of objects and text on your screen</li>
                  <li>Change the refresh frequency for your monitor</li>
                  <li>Change the number of colors displayed on a monitor</li>
                  <li>Change your screen resolution</li>
                  <li>Help protect your files with a screen saver password</li>
                </ul>
              </div>
            )}

            {currentArticle === 'files' && (
              <div className="whats-new-article topics-view">
                <h2>Files, folders, and programs</h2>
                <p className="article-subheading">Pick a task:</p>
                <ul className="article-links">
                  <li>Display simple folder view in the Windows Explorer Folders list</li>
                  <li>Display links to common tasks in folders</li>
                  <li>Show Control Panel in My Computer</li>
                  <li>Display the complete path to files and folders</li>
                  <li>Associate a file name extension with a file type</li>
                  <li>Add features from Microsoft Windows Update</li>
                  <li>Add or remove a Windows component</li>
                  <li>Display hidden files and folders</li>
                  <li>Use Windows classic folders</li>
                  <li>Change the appearance of a single folder</li>
                  <li>Change the picture that identifies a folder</li>
                  <li>Display encrypted or compressed NTFS files in color</li>
                  <li>Display the contents of system folders</li>
                  <li>Show file and folder tasks in Windows Explorer</li>
                  <li>Add a program from a CD or floppy disk</li>
                </ul>
                <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                <ul className="article-links">
                  <li>Folder Options overview</li>
                  <li>Add or remove programs overview</li>
                  <li>Getting files and settings from your old computer</li>
                  <li>Personal folders overview</li>
                </ul>
              </div>
            )}

            {currentArticle === 'keyboard' && (
              <div className="whats-new-article topics-view">
                <h2>Keyboard and mouse</h2>
                <p className="article-subheading">Pick a task:</p>
                <ul className="article-links">
                  <li>Adjust the key repeat rate</li>
                  <li>Adjust the cursor blink rate</li>
                  <li>Reverse your mouse buttons</li>
                  <li>Change the appearance of your mouse pointer</li>
                  <li>Switch languages or keyboards from the taskbar</li>
                  <li>Install East Asian language files</li>
                  <li>Customize key sequences for input languages</li>
                  <li>Adjust the double-click speed for your mouse</li>
                </ul>
                <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                <ul className="article-links">
                  <li>Mouse overview</li>
                  <li>Windows keyboard shortcuts overview</li>
                  <li>Keyboard overview</li>
                </ul>
              </div>
            )}

            {currentArticle === 'monitors' && (
              <div className="whats-new-article topics-view">
                <h2>Multiple monitors</h2>
                <p className="article-subheading">Pick a task:</p>
                <ul className="article-links">
                  <li>Arrange multiple monitors</li>
                  <li>Change the primary monitor</li>
                  <li>Move items between monitors</li>
                  <li>View the same desktop in multiple monitors</li>
                  <li>Change the number of colors on multiple monitors</li>
                  <li>Change your screen resolution when using multiple monitors</li>
                  <li>Install additional monitors</li>
                </ul>
                <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                <ul className="article-links">
                  <li>Multiple monitors overview</li>
                </ul>
              </div>
            )}

            {currentArticle === 'fonts' && (
              <div className="whats-new-article topics-view">
                <h2>Fonts and text</h2>
                <p className="article-subheading">Pick a task:</p>
                <ul className="article-links">
                  <li>View a font on your computer</li>
                  <li>Increase or decrease the size of objects and text on your screen</li>
                  <li>Add a new font to your computer</li>
                  <li>Print a font sample</li>
                  <li>Use ClearType for screen fonts</li>
                </ul>
                <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                <ul className="article-links">
                  <li>Fonts overview</li>
                </ul>
              </div>
            )}

            {currentArticle === 'datetime' && (
              <div className="whats-new-article topics-view">
                <p className="article-subheading">Date, time, region, and language</p>
                <img className="article-logo" src={Logo} alt="" />
                <p className="thin">
                    Windows XP supports you whenever and wherever you work. Do you travel? Windows XP makes it easy
                    to change your computer's clock, calendar, currency, and number settings to match your country and
                    time zone. Do you use different languages and keyboards to work with your computer files?
                    Windows XP lets you switch languages with a single click using the Language bar.
                </p>
              </div>
            )}

            {currentArticle === 'sounds' && (
              <div className="whats-new-article topics-view">
                <h2>Sounds and audio devices</h2>
                <p className="article-subheading">Pick a task:</p>
                <ul className="article-links">
                  <li>Common tasks: Sounds and Audio Devices</li>
                  <li>Adjust the volume</li>
                  <li>Create a sound scheme</li>
                  <li>Assign sounds to program events</li>
                  <li>Adjust Speaker volume</li>
                  <li>Display the volume control icon on the taskbar</li>
                  <li>Add the volume icon to notification area</li>
                </ul>
                <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                <ul className="article-links">
                  <li>Sounds and Audio Devices overview</li>
                  <li>Recording sounds on your computer</li>
                  <li>Changing the volume on your computer</li>
                </ul>
              </div>
            )}

            {currentArticle === 'handwriting' && (
              <div className="whats-new-article topics-view">
                <p className="article-subheading">Using handwriting or speech recognition</p>
                <img className="article-logo" src={Logo} alt="" />
                <p className="thin">
                    Remember when issuing voice commands to your computer was a science fiction fantasy? Windows XP
                    lets you use your voice to dictate an e-mail message, read numbers into a spreadsheet, or compose a
                    document. Learn how to train your computer to recognize your voice and respond to your commands.
                    Use your handwriting instead of the keyboard to write a note to yourself or sign a document.
                </p>
              </div>
            )}

            {currentArticle === 'workway' && (
              <div className="whats-new-article topics-view">
                <h2>Customizing the way you work</h2>
                <p className="article-subheading">Pick a task:</p>
                <ul className="article-links">
                  <li>Start a program each time you start Windows</li>
                  <li>Show or clear your recently used documents on the Start menu</li>
                  <li>Display links to common tasks in folders</li>
                  <li>Display the complete path to files and folders</li>
                  <li>Have the computer remember your password</li>
                  <li>Add a program to the Quick Launch bar</li>
                  <li>Add items to the Start menu</li>
                </ul>
                <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                <ul className="article-links">
                  <li>Personalizing your workspace</li>
                  <li>Customizing your computer with the Control Panel</li>
                </ul>
              </div>
            )}

            {currentArticle === 'sharing' && (
              <div className="whats-new-article topics-view">
                <h2>Sharing your computer</h2>
                <p className="article-subheading">Pick a task:</p>
                <ul className="article-links">
                  <li>Add a new user to the computer</li>
                  <li>Change a user's password</li>
                  <li>Change the group a user belongs to</li>
                  <li>Create a user password</li>
                  <li>Change users without logging off</li>
                  <li>Log off from the computer</li>
                  <li>Share pictures and music on your computer</li>
                  <li>Have the computer remember your password</li>
                  <li>Change your default .Net Passport using the Passport Wizard</li>
                  <li>Show or clear your recently used documents on the Start menu</li>
                  <li>Share a drive or folder with others in your workgroup</li>
                </ul>
                <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                <ul className="article-links">
                  <li>Using Personalized Menus</li>
                  <li><img src={Document} alt="" /> Walkthrough: Sharing your PC</li>
                  <li>User accounts overview</li>
                  <li>Using the Shared Documents folder</li>
                </ul>
              </div>
            )}

            {currentArticle === 'fixing' && (
              <div className="whats-new-article topics-view">
                <h2>Fixing customizing problems</h2>
                <p className="article-subheading">Fix a problem:</p>
                <ul className="article-links">
                  <li>Sound Troubleshooter</li>
                </ul>
                <p className="article-subheading">Pick a task:</p>
                <ul className="article-links">
                  <li>Finding the volume control icon</li>
                  <li>Show or hide the status bar within a program</li>
                  <li>Use Windows classic folders</li>
                  <li>Have the computer remember your password</li>
                  <li>Show or hide the toolbar in a folder window</li>
                </ul>
                <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                <ul className="article-links">
                  <li>Change the way your mouse works</li>
                </ul>
              </div>
            )}

            {currentArticle === 'policy' && (
              <div className="whats-new-article topics-view">
                <p className="article-subheading">Customizing your computer using Group Policy</p>
                <img className="article-logo" src={Logo} alt="" />
                <p className="thin glossary">
                    Windows XP provides a number of ways to customize your computer. Using items in Control Panel, you
                    can change the way your <span className="glossary-link">desktop</span> looks, change the sounds associated with program <span className="glossary-link">events</span>, and
                    change the look and speed of your mouse pointer.
                </p>
                <p className="thin glossary">
                    Another way to customize your computer is by using <span className="glossary-link">Group Policy</span>. In a network <span className="glossary-link">domain</span> environment,
                    <span className="glossary-link">administrators</span> use Group Policy to customize and configure computers on the <span className="glossary-link">network</span>. In an
                    environment where you have one stand-alone computer or several computers joined in a <span className="glossary-link">workgroup</span>,
                    you can still use Group Policy to customize your computer.
                </p>
                <p className="article-subheading">To open Group Policy</p>
                <ol className="article-steps">
                  <li>Click <strong>Start</strong>, and then click <strong>Run</strong>.</li>
                  <li>Type <strong>gpedit.msc</strong> and then click <strong>OK</strong>.</li>
                </ol>
                <p className="thin glossary">
                    When Group Policy opens, you will see two options in Local Computer Policy: <strong>Computer
                    Configuration</strong> and <strong>User Configuration</strong>. Computer Configuration allows you to set
                    policies that apply to your computer, regardless of who logs on. User Configuration allows you to set
                    policies that apply to each user who logs on to the computer.
                </p>
                <p className="article-subheading">Using Group Policy on your computer</p>
                <p className="thin glossary">
                    You can customize your desktop environment by enabling or disabling different policy settings. For
                    example, you can remove icons from your desktop, customize the <strong>Start menu</strong>, and simplify the Control
                    Panel using Group Policy. You can also add scripts that will run on your computer when it starts up or
                    shuts down and when users log on or log off, and you can even configure Internet Explorer.
                </p>
                <p className="thin glossary">
                    The following table lists the four main areas in which you can set policies to customize your computer:
                </p>
                <table className="article-table">
                  <thead>
                    <tr>
                      <th>For information about setting Group Policies for:</th>
                      <th>See Administrative Help Templates Help for:</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Windows XP operating system</td>
                      <td><span className="article-link">Windows XP</span></td>
                    </tr>
                    <tr>
                      <td>Windows Media Player</td>
                      <td><span className="article-link">Windows Media Player</span></td>
                    </tr>
                    <tr>
                      <td>Internet Explorer</td>
                      <td><span className="article-link">Internet Explorer</span></td>
                    </tr>
                    <tr>
                      <td>NetMeeting</td>
                      <td><span className="article-link">NetMeeting</span></td>
                    </tr>
                  </tbody>
                </table>
                <p className="article-subheading">Using Group Policy when your computer is joined to a network domain</p>
                <p className="thin glossary">
                    If your computer is part of a corporate network, it is possible that the network administrator will
                    configure your computer using these features of Group Policy. The Group Policy settings applied by
                    your network administrator take precedence over any of the Group Policy settings you have configured
                    on your computer.
                </p>
                <p className="thin glossary">
                    You can find more information about the Group Policy settings that have been applied to your
                    computer in Help and Support Center.
                </p>
                <p className="article-subheading">To open Help and Support Center to view policy information</p>
                <ol className="article-steps">
                  <li>Click <strong>Start</strong>, and then click <strong>Help and Support</strong>.</li>
                  <li>Under <strong>Pick a task</strong>, click <strong>Use Tools to view your computer information and diagnose problems</strong>.</li>
                  <li>In <strong>Tools Center</strong>, click <strong>Advanced System Information</strong>.</li>
                  <li>In <strong>Advanced System Information</strong>, click <strong>View policy information</strong>.</li>
                </ol>
                <p className="article-subheading"><img className='subheading-img' src={Note} alt="" />Notes</p>
                <ul className="article-links notes-list">
                  <li>For more information about using Group Policy to define policy settings that are applied to computers and computer users, see <span className="article-link">Group Policy Help</span>.</li>
                  <li>For more information about using Group Policy to define security settings that are applied to computers and computer users, see <span className="article-link">Local Security Help</span>.</li>
                  <li>You must be an administrator to add Group Policy to a <span className="glossary-link">Microsoft Management Console (MMC)</span> and to use Group Policy to customize settings on your computer.</li>
                </ul>
                <p className="article-link">Related Topics</p>
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

export default CustomizeComputer

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
import Printer from '../../img/Printer.webp'
import Question from '../../img/question.gif'
import RestoreAllItems from '../../img/RestoreAllItems.webp'
import Small from '../../img/HelpAnSupport ChangeView1.webp'

import './HelpAnsSupport.css'
import './WhatsNew.css'

type ArticleId =
  | 'overview' | 'installing' | 'scanners' | 'gamecontrollers' | 'modems' | 'monitors'
  | 'laptops' | 'cds' | 'keyboardmouse' | 'mics' | 'wirelesslink' | 'printers'
  | 'hardwareprofiles' | 'fixingproblem' | 'keepupdated' | 'bluetooth';

interface HardwareProps {
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
    overview: 'Hardware',
    installing: 'Installing and configuring hardware',
    scanners: 'Scanners and cameras',
    gamecontrollers: 'Game controllers',
    modems: 'Modems',
    monitors: 'Monitors',
    laptops: 'Laptops',
    cds: 'CDs and other storage devices',
    keyboardmouse: 'Keyboard, mouse, and pointing devices',
    mics: 'Microphones and speakers',
    wirelesslink: 'Wireless Link overview',
    printers: 'Printers',
    hardwareprofiles: 'Using hardware profiles',
    fixingproblem: 'Fixing a hardware problem',
    keepupdated: 'Keeping your computer up to date',
    bluetooth: 'Bluetooth devices (wireless)',
};

const Hardware = ({
    globalVolume = 1,
    globalMuted = false,
    plusTheme,
    isFullscreen,
    onToggleFullscreen,
    isFavorite,
    onAddFavorite,
    initialArticle,
}: HardwareProps) => {
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

  const favoriteId = `hardware:${currentArticle}`;

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
              Search only Hardware
            </label>
          </div>

          <div className="tree-box">
            <h4 onClick={() => setCurrentArticle('overview')}>Hardware</h4>
            <XPScrollbar className="tree-box-scroll">
                <ul>
                    <li className={currentArticle === 'installing' ? 'is-selected' : ''} onClick={() => setCurrentArticle('installing')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Installing and configuring hardware</span>
                    </li>
                    <li className={currentArticle === 'scanners' ? 'is-selected' : ''} onClick={() => setCurrentArticle('scanners')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Scanners and cameras</span>
                    </li>
                    <li className={currentArticle === 'gamecontrollers' ? 'is-selected' : ''} onClick={() => setCurrentArticle('gamecontrollers')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Game controllers</span>
                    </li>
                    <li className={currentArticle === 'modems' ? 'is-selected' : ''} onClick={() => setCurrentArticle('modems')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Modems</span>
                    </li>
                    <li className={currentArticle === 'monitors' ? 'is-selected' : ''} onClick={() => setCurrentArticle('monitors')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Monitors</span>
                    </li>
                    <li className={currentArticle === 'laptops' ? 'is-selected' : ''} onClick={() => setCurrentArticle('laptops')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Laptops</span>
                    </li>
                    <li className={currentArticle === 'cds' ? 'is-selected' : ''} onClick={() => setCurrentArticle('cds')}>
                        <span className="tree-label"><img src={Dot} alt="" /> CDs and other storage devices</span>
                    </li>
                    <li className={currentArticle === 'keyboardmouse' ? 'is-selected' : ''} onClick={() => setCurrentArticle('keyboardmouse')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Keyboard, mouse, and pointing devices</span>
                    </li>
                    <li className={currentArticle === 'mics' ? 'is-selected' : ''} onClick={() => setCurrentArticle('mics')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Microphones and speakers</span>
                    </li>
                    <li className={currentArticle === 'wirelesslink' ? 'is-selected' : ''} onClick={() => setCurrentArticle('wirelesslink')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Wireless link</span>
                    </li>
                    <li className={currentArticle === 'printers' ? 'is-selected' : ''} onClick={() => setCurrentArticle('printers')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Printers</span>
                    </li>
                    <li className={currentArticle === 'hardwareprofiles' ? 'is-selected' : ''} onClick={() => setCurrentArticle('hardwareprofiles')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Using hardware profiles</span>
                    </li>
                    <li className={currentArticle === 'fixingproblem' ? 'is-selected' : ''} onClick={() => setCurrentArticle('fixingproblem')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Fixing a hardware problem</span>
                    </li>
                    <li className={currentArticle === 'keepupdated' ? 'is-selected' : ''} onClick={() => setCurrentArticle('keepupdated')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Keeping your computer up to date</span>
                    </li>
                    <li className={currentArticle === 'bluetooth' ? 'is-selected' : ''} onClick={() => setCurrentArticle('bluetooth')}>
                        <span className="tree-label"><img src={Dot} alt="" /> Bluetooth devices (wireless)</span>
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
                    <h2>Hardware</h2>
                    <p>
                        The physical components of a computer, and the various accessory
                        devices that can be added, are termed hardware. This section
                        covers installing, using, and troubleshooting hardware, and
                        describes the tools and programs Windows XP contains to help you
                        keep your computer's hardware working smoothly and at peak
                        performance.
                    </p>
                    <p className="copyright">
                        © 1985-2001 Microsoft Corporation.<br />
                        All rights reserved.
                    </p>
                </div>
            )}

            {currentArticle === 'installing' && (
                <div className="whats-new-article topics-view">
                    <h2>Installing and configuring hardware</h2>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Install a device</li>
                        <li>Add a new infrared device</li>
                        <li>Install a non-Plug and Play device</li>
                        <li>Install USB 2.0 controller drivers</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Configuring devices</li>
                        <li>Hardware overview</li>
                        <li>Installing devices overview</li>
                        <li>Hardware profiles overview</li>
                        <li>Hardware types overview</li>
                        <li>Using Add Hardware</li>
                        <li>Using Device Manager</li>
                        <li>Plug and Play device driver support</li>
                        <li>Using Plug and Play with ACPI hardware</li>
                        <li>Designed for Windows logo</li>
                        <li>Plug and Play overview</li>
                        <li>Using the UPnP framework to control devices</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'scanners' && (
                <div className="whats-new-article topics-view">
                    <h2>Scanners and cameras</h2>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Install a scanner or digital camera</li>
                        <li>Link a program to a scanner or digital camera event</li>
                        <li>Test a scanner or digital camera</li>
                        <li>Print a picture from your camera</li>
                        <li>Take pictures with a digital camera</li>
                        <li>View pictures as a slideshow</li>
                        <li>Delete pictures from a digital camera</li>
                        <li>Print a picture from your computer</li>
                        <li>Get pictures from a scanner or digital camera</li>
                        <li>Install USB 2.0 controller drivers</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Printing pictures tips</li>
                        <li>Scanners and Cameras overview</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'gamecontrollers' && (
                <div className="whats-new-article topics-view">
                    <h2>Game controllers</h2>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Install a game port game controller</li>
                        <li>Assign a game controller to a different port</li>
                        <li>Activate the pedal or rudder of a game controller</li>
                        <li>Calibrate a game controller</li>
                        <li>Test a game controller</li>
                        <li>Remove a game controller</li>
                        <li>Change the preferred device</li>
                        <li>Install a USB game controller</li>
                        <li>Install USB 2.0 controller drivers</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Game Controllers overview</li>
                        <li>DirectX overview</li>
                        <li>Installing a joystick or other game controller</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'modems' && (
                <div className="whats-new-article topics-view">
                    <h2>Modems</h2>
                    <p className="article-subheading">Fix a problem:</p>
                    <ul className="article-links">
                        <li>Modem diagnostics</li>
                        <li>Troubleshooting modems</li>
                        <li>Test a modem</li>
                        <li>Attaining fast speeds with a 56 Kbps modem</li>
                    </ul>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Change hardware settings</li>
                        <li>Install a Bluetooth mobile phone and use it as a modem</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Modem overview</li>
                        <li>Installing modems overview</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'monitors' && (
                <div className="whats-new-article topics-view">
                    <h2>Monitors</h2>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Turn your monitor off automatically</li>
                        <li>Change your screen resolution</li>
                        <li>Change the number of colors displayed on a monitor</li>
                        <li>Change the refresh frequency for your monitor</li>
                        <li>Synchronize color between a monitor and printer</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'laptops' && (
                <div className="whats-new-article topics-view">
                    <h2>Laptops</h2>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Set a warning alarm for a low or critical battery condition</li>
                        <li>Improve the visibility of the mouse pointer</li>
                        <li>Manually put your computer into hibernation</li>
                        <li>Automatically put your computer on standby</li>
                        <li>Manually put your computer on standby</li>
                        <li>Automatically put your computer into hibernation</li>
                        <li>Password-protect your computer during standby or hibernation</li>
                        <li>Use ClearType for screen fonts</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Hardware profiles overview</li>
                        <li>Managing power on a portable computer</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'cds' && (
                <div className="whats-new-article topics-view">
                    <h2>CDs and other storage devices</h2>
                    <p className="article-subheading">Fix a problem:</p>
                    <ul className="article-links">
                        <li>If you do not have a DVD decoder</li>
                    </ul>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>View the contents of a CD</li>
                        <li>Delete files and folders from the CD recorder temporary storage area</li>
                        <li>Stop the CD recorder from automatically ejecting the CD</li>
                        <li>Copy files and folders to a CD</li>
                        <li>Erase files from a CD</li>
                        <li>Create multiple CDs from a set of files</li>
                        <li>Add more files to a CD</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Tips for writing CDs</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'keyboardmouse' && (
                <div className="whats-new-article topics-view">
                    <h2>Keyboard, mouse, and pointing devices</h2>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Adjust the key repeat rate</li>
                        <li>Change the appearance of your mouse pointer</li>
                        <li>Adjust the speed of your mouse pointer</li>
                        <li>Activate the mouse wheel</li>
                        <li>Reverse your mouse buttons</li>
                        <li>Adjust the cursor blink rate</li>
                        <li>Update your keyboard driver</li>
                        <li>Adjust the double-click speed for your mouse</li>
                        <li>Install a Bluetooth keyboard</li>
                        <li>Install a Bluetooth mouse</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Keyboard overview</li>
                        <li>Mouse overview</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'mics' && (
                <div className="whats-new-article topics-view">
                    <h2>Microphones and speakers</h2>
                    <p className="article-subheading">Fix a problem:</p>
                    <ul className="article-links">
                        <li>Sound Troubleshooter</li>
                    </ul>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Change speech recognition engines</li>
                        <li>Adjust speaker volume</li>
                        <li>Adjust the volume for multimedia playback devices</li>
                        <li>Adjust the volume for multimedia recording devices</li>
                        <li>Set up microphone options</li>
                        <li>Set up a microphone</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Record, mix, play, and edit sounds with Sound Recorder</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'wirelesslink' && (
                <div className="whats-new-article topics-view">
                    <p className="article-subheading">Wireless Link overview</p>
                    <img className="article-logo" src={Logo} alt="" />
                    <p className="thin">
                        After an infrared device is installed, the Wireless Link icon appears in Control Panel. You can use the
                        Wireless Link icon to configure file transfer and image transfer options and then to send files or transfer
                        images quickly and easily over an infrared link.
                    </p>
                    <p className="thin">
                        When another infrared transceiver comes in range, the Wireless Link icon appears on the desktop and
                        on the taskbar. You can then:
                    </p>
                    <ul className="article-links notes-list">
                        <li>Send files by specifying a location and one or more files in the <strong>Wireless Link</strong> dialog box. For more information, see <span className="article-link">Send files with the Wireless Link dialog box</span>.</li>
                        <li>Send files by dragging file icons to the Wireless Link icon on the desktop and dropping them there. For more information, see <span className="article-link">Drag files to an infrared link</span>.</li>
                        <li>Transfer images from a digital camera that supports the infrared image transfer (IrTran-P) protocol to your computer. For more information, see <span className="article-link">Transfer images from a digital camera to your computer</span>.</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'printers' && (
                <div className="whats-new-article topics-view">
                    <h2>Printers</h2>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Install USB 2.0 controller drivers</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'hardwareprofiles' && (
                <div className="whats-new-article topics-view">
                    <h2>Using hardware profiles</h2>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Create a hardware profile</li>
                        <li>Copy, rename, or delete a hardware profile</li>
                        <li>Specify the default hardware profile for startup</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Hardware profiles overview</li>
                    </ul>
                </div>
            )}

            {currentArticle === 'fixingproblem' && (
                <div className="whats-new-article topics-view">
                    <h2>Fixing a hardware problem</h2>
                    <p className="article-subheading">Fix a problem:</p>
                    <ul className="article-links">
                        <li>If your monitor flickers too much</li>
                        <li>Modem Troubleshooter</li>
                        <li>Troubleshooting modems</li>
                        <li>Hardware Troubleshooter</li>
                        <li>Sound Troubleshooter</li>
                        <li>Display Troubleshooter</li>
                        <li>Input device Troubleshooter (keyboard, mouse, camera, scanner)</li>
                        <li>Printing Troubleshooter</li>
                    </ul>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Diagnose device problems</li>
                        <li>Test a modem</li>
                        <li>Activate a mouse wheel</li>
                        <li>Update your keyboard driver</li>
                        <li>Uninstall your keyboard driver</li>
                        <li>Revert to your previous keyboard driver</li>
                        <li>Install USB 2.0 controller drivers</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Tips for writing CDs</li>
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

            {currentArticle === 'bluetooth' && (
                <div className="whats-new-article topics-view">
                    <h2>Bluetooth devices (wireless)</h2>
                    <p className="article-subheading">Fix a problem:</p>
                    <ul className="article-links">
                        <li>Bluetooth devices cannot connect to each other</li>
                        <li>Bluetooth devices cannot find each other</li>
                        <li>Bluetooth device connections are slow or stop working</li>
                    </ul>
                    <p className="article-subheading">Pick a task:</p>
                    <ul className="article-links">
                        <li>Install a Bluetooth mobile phone</li>
                        <li>Install a Bluetooth mobile phone and use it as a modem</li>
                        <li>Install a Bluetooth printer</li>
                        <li>Install a Bluetooth keyboard</li>
                        <li>Install a Bluetooth mouse</li>
                        <li>Install a Palm handheld computer using Bluetooth technology</li>
                        <li>Install a Pocket PC using Bluetooth technology</li>
                        <li>Install a Bluetooth device using Bluetooth Devices in Control Panel</li>
                        <li>Change Bluetooth settings</li>
                        <li>Use services with your Bluetooth device</li>
                        <li>Change the name of a Bluetooth device</li>
                        <li>Join a personal area network</li>
                        <li>Provide a name for your computer on a personal area network</li>
                        <li>Create a Bluetooth connection to the Internet using a Bluetooth mobile phone</li>
                        <li>Send and receive files to/from a Bluetooth device</li>
                    </ul>
                    <p className="article-subheading">Overviews, Articles, and Tutorials:</p>
                    <ul className="article-links">
                        <li>Bluetooth wireless technology overview</li>
                        <li>Installing Bluetooth devices</li>
                        <li>Managing Bluetooth devices and services</li>
                        <li>Bluetooth personal area networking overview</li>
                        <li>Bluetooth device dial-up networking</li>
                        <li>COM (serial) ports overview</li>
                        <li>Selecting a COM (serial) port</li>
                        <li>Bluetooth device discoverability</li>
                        <li>Using Bluetooth passkeys for security</li>
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

export default Hardware


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

interface SystemAdministrationProps {
    globalVolume?: number;
    globalMuted?: boolean;
    plusTheme?: 'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
    isFullscreen?: boolean;
    onToggleFullscreen?: () => void;
    isFavorite: boolean;
    onAddFavorite: () => void;
}

const SystemAdministration = ({
    globalVolume = 1,
    globalMuted = false,
    plusTheme,
    isFullscreen,
    onToggleFullscreen,
    isFavorite,
    onAddFavorite,
}: SystemAdministrationProps) => {
  const sounds = useSound(globalVolume, globalMuted);
  const themeSound = plusTheme === 'aquarium' ? sounds.aquarium
      : plusTheme === 'davinci' ? sounds.daVinci
      : plusTheme === 'nature' ? sounds.nature
      : plusTheme === 'space' ? sounds.space
      : null;
  const playExclamation = () => themeSound ? themeSound.playExclamation() : sounds.playExclamation();
  const playInfoSound = () => themeSound ? themeSound.playInfo() : sounds.playInfo();

  const [errorType, setErrorType] = useState<ErrorType | null>(null);

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

  return (
    <div className="whatsnew-page">
      <div className="whatsnew-body">
        <div className="whatsnew-tree">
          <div className="whatsnew-filter">
            <label>
              <input type="checkbox" defaultChecked />
              Search only System administration
            </label>
          </div>

          <div className="tree-box">
            <h4>System administration</h4>
            <XPScrollbar className="tree-box-scroll">
                <ul>
                    <li><img src={Dot} alt="" /> Security and administration tools</li>
                    <li><img src={Dot} alt="" /> Passwords and user accounts</li>
                    <li><img src={Dot} alt="" /> Computer management</li>
                    <li><img src={Dot} alt="" /> Getting system information</li>
                    <li><img src={Dot} alt="" /> Backing up files and folders</li>
                    <li><img src={Dot} alt="" /> Disk management</li>
                    <li><img src={Dot} alt="" /> File encryption</li>
                    <li><img src={Dot} alt="" /> Removable Storage</li>
                    <li><img src={Dot} alt="" /> Remote Assistance</li>
                    <li><img src={Dot} alt="" /> Digital signatures</li>
                    <li><img src={Dot} alt="" /> Access Control</li>
                    <li><img src={Dot} alt="" /> Keeping your computer up to date</li>
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

            <div className="whats-new-article">
                <h2>Security and administration</h2>
                <p>
                    Windows XP is loaded with new tools and programs that ensure the
                    privacy and security of your data, and help you operate your
                    computer at peak performance. Learn how to assign a password,
                    lock your computer, back up files and folders, and more to
                    protect the contents of your computer. Discover how to manage
                    computer components, services, and system tools; and how to
                    work with disk management and encryption features.
                </p>
                <p className="copyright">
                    © 1985-2001 Microsoft Corporation.<br />
                    All rights reserved.
                </p>
            </div>
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

export default SystemAdministration
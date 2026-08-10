
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

interface SecurityBasicsProps {
    globalVolume?: number;
    globalMuted?: boolean;
    plusTheme?: 'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
    isFullscreen?: boolean;
    onToggleFullscreen?: () => void;
    isFavorite: boolean;
    onAddFavorite: () => void;
}

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
              Search only Protecting your PC: security basics
            </label>
          </div>

          <div className="tree-box">
            <h4>Protecting your PC: security basics</h4>
            <XPScrollbar className="tree-box-scroll">
                <ul>
                    <li><img src={Dot} alt="" /> Use Windows to help keep your computer more secure</li>
                    <li><img src={Dot} alt="" /> Be security savvy: what you should do</li>
                    <li><img src={Dot} alt="" /> Use the Security Center to check your computer's security settings</li>
                    <li><img src={Dot} alt="" /> Help protect your computer online</li>
                    <li><img src={Dot} alt="" /> Share your computer more safely</li>
                    <li><img src={Dot} alt="" /> Make your home network more secure</li>
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
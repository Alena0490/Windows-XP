
import { useState } from 'react'
import { createPortal } from 'react-dom'

import useSound from '../../hooks/useSound'
import CriticalError from '../CriticalError'
import type { ErrorType } from '../CriticalError'

import AddFavourite from '../../img/AddFavorite1.webp'
import Large from '../../img/HelpAndSupportChangeView2.webp'
import Printer from '../../img/Printer.webp'
import Question from '../../img/question.gif'
import RestoreAllItems from '../../img/RestoreAllItems.webp'
import Small from '../../img/HelpAnSupport ChangeView1.webp'

import './HelpAnsSupport.css'
import './WhatsNew.css'

interface ToolsProps {
    globalVolume?: number;
    globalMuted?: boolean;
    plusTheme?: 'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
    isFullscreen?: boolean;
    onToggleFullscreen?: () => void;
}

const Tools = ({
    globalVolume = 1,
    globalMuted = false,
    plusTheme,
    isFullscreen,
    onToggleFullscreen
}: ToolsProps) => {
  const sounds = useSound(globalVolume, globalMuted);
  const themeSound = plusTheme === 'aquarium' ? sounds.aquarium
      : plusTheme === 'davinci' ? sounds.daVinci
      : plusTheme === 'nature' ? sounds.nature
      : plusTheme === 'space' ? sounds.space
      : null;
  const playExclamation = () => themeSound ? themeSound.playExclamation() : sounds.playExclamation();

  const [errorType, setErrorType] = useState<ErrorType | null>(null);

  const openError = (type: ErrorType) => {
    playExclamation();
    setErrorType(type);
  };

  return (
    <div className="whatsnew-page">
      <div className="whatsnew-body">
        <div className="whatsnew-tree">
          <div className="whatsnew-filter">
            <label>
              <input type="checkbox" defaultChecked />
              Search only Tools
            </label>
          </div>

          <div className="tree-box">
            <h4>Tools</h4>
            <ul>
                <li><img src={Question} alt="" /> My Computer Information</li>
                <li><img src={Question} alt="" /> System Restore</li>
                <li><img src={Question} alt="" /> Remote Assistance</li>
                <li><img src={Question} alt="" /> Offer Remote Assistance</li>
                <li><img src={Question} alt="" /> Network Diagnostics</li>
                <li><img src={Question} alt="" /> Disk Cleanup</li>
                <li><img src={Question} alt="" /> Disk Defragmenter</li>
                <li><img src={Question} alt="" /> Backup</li>
                <li><img src={Question} alt="" /> Advanced System Information</li>
            </ul>
          </div>

          <div className="tree-box light">
                <h4>See Also</h4>
                <ul>
                    <li><img src={Question} alt="" /> Windows Glossary</li>
                    <li><img src={Question} alt="" /> Windows keyboard shortcuts overview</li>
                    <li><img src={Question} alt="" /> Tools</li>
                    <li><img src={Question} alt="" /> Go to a Windows newsgroup</li>
                </ul>
          </div>
        </div>

        <div className="whatsnew-content">
            <div className="whatsnew-toolbar">
                <button disabled>
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
                <h2>Tools</h2>
                <p>
                    Pick from the list of tools and resources to help you manage and
                    support your Windows operating system.
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

export default Tools
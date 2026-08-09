
import { useState } from 'react'
import { createPortal } from 'react-dom'

import useSound from '../../hooks/useSound'
import CriticalError from '../CriticalError'
import type { ErrorType } from '../CriticalError'

import AddFavourite from '../../img/AddFavorite1.webp'
import Dot from '../../img/dot.gif'
import Large from '../../img/HelpAndSupportChangeView2.webp'
import Printer from '../../img/Printer.webp'
import Question from '../../img/question.gif'
import RestoreAllItems from '../../img/RestoreAllItems.webp'
import Small from '../../img/HelpAnSupport ChangeView1.webp'

import './HelpAnsSupport.css'
import './WhatsNew.css'

interface FixingProblemProps {
    globalVolume?: number;
    globalMuted?: boolean;
    plusTheme?: 'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
    isFullscreen?: boolean;
    onToggleFullscreen?: () => void;
}

const FixingProblem = ({
    globalVolume = 1,
    globalMuted = false,
    plusTheme,
    isFullscreen,
    onToggleFullscreen
}: FixingProblemProps) => {
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
              Search only Fixing a problem
            </label>
          </div>

          <div className="tree-box">
            <h4>Fixing a problem</h4>
            <ul>
                <li><img src={Dot} alt="" /> Troubleshooting problems</li>
                <li><img src={Dot} alt="" /> Application and software problems</li>
                <li><img src={Dot} alt="" /> Games, sound, and video problems</li>
                <li><img src={Dot} alt="" /> E-mail and messaging problems</li>
                <li><img src={Dot} alt="" /> Networking problems</li>
                <li><img src={Dot} alt="" /> Printing problems</li>
                <li><img src={Dot} alt="" /> Performance and maintenance problems</li>
                <li><img src={Dot} alt="" /> Hardware and system device problems</li>
                <li><img src={Dot} alt="" /> Startup and Shut Down problems</li>
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
                <button onClick={() => openError('helpFavoriteExists')}>
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
                <h2>Fixing a problem</h2>
                <p>
                    Find a fix fast! Windows XP includes excellent diagnostic and
                    troubleshooting programs that help isolate and resolve problems.
                    Select from the categories in this section to learn how to fix
                    specific problems, perform important procedures, and read useful
                    overviews and articles that help you understand more about using
                    Windows XP.
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

export default FixingProblem

import { useState } from 'react'
import { createPortal } from 'react-dom'

import useSound from '../../hooks/useSound'
import CriticalError from '../CriticalError'
import type { ErrorType } from '../CriticalError'

import AddFavourite from '../../img/AddFavorite1.webp'
import Dot from '../../img/dot.gif'
import Large from '../../img/HelpAndSupportChangeView2.webp'
import Printer from '../../img/Printer.webp'
// import Question from '../../img/question.gif'
import RestoreAllItems from '../../img/RestoreAllItems.webp'
import Small from '../../img/HelpAnSupport ChangeView1.webp'

import './HelpAnsSupport.css'
import './WhatsNew.css'

interface SupportProps {
    globalVolume?: number;
    globalMuted?: boolean;
    plusTheme?: 'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
    isFullscreen?: boolean;
    onToggleFullscreen?: () => void;
}

const Support = ({
    globalVolume = 1,
    globalMuted = false,
    plusTheme,
    isFullscreen,
    onToggleFullscreen
}: SupportProps) => {
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
          <div className="tree-box">
            <h4>Support</h4>
            <ul>
                <li><img src={Dot} alt="" /> Ask a friend to help</li>
                <li><img src={Dot} alt="" /> Get help from Microsoft</li>
                <li><img src={Dot} alt="" /> Go to a Windows Web site forum</li>
            </ul>
          </div>

          <div className="tree-box light">
                <h4>See Also</h4>
                <ul>
                    <li><img src={Dot} alt="" /> About Support</li>
                    <li><img src={Dot} alt="" /> My Computer Information</li>
                    <li><img src={Dot} alt="" /> Advanced System Information</li>
                    <li><img src={Dot} alt="" /> System Configuration Utility</li>
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
                <h2>Welcome to Support</h2>
                <p>If you are connected to the Internet, there are a variety of ways to get help.</p>
                <p>Remote Assistance enables your friends to view and work on your computer from anywhere.</p>
                <p>Microsoft Online Assisted Support enables an online support professional to answer your questions.</p>
                <p>Newsgroups provide a forum to communicate with other Windows users.</p>
                <p>To get started, click a link under <strong>Support</strong>.</p>
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

export default Support
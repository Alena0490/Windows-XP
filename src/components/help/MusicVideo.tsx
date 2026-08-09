
import { useState } from 'react'
import { createPortal } from 'react-dom'

import useSound from '../../hooks/useSound'
import CriticalError from '../CriticalError'
import type { ErrorType } from '../CriticalError'

import AddFavourite from '../../img/AddFavorite1.webp'
import Large from '../../img/HelpAndSupportChangeView2.webp'
import Plus from '../../img/plus.gif'
import Printer from '../../img/Printer.webp'
import Question from '../../img/question.gif'
import RestoreAllItems from '../../img/RestoreAllItems.webp'
import Small from '../../img/HelpAnSupport ChangeView1.webp'

import './HelpAnsSupport.css'
import './WhatsNew.css'

interface MusicVideoProps {
    globalVolume?: number;
    globalMuted?: boolean;
    plusTheme?: 'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
    isFullscreen?: boolean;
    onToggleFullscreen?: () => void;
}

const MusicVideo = ({
    globalVolume = 1,
    globalMuted = false,
    plusTheme,
    isFullscreen,
    onToggleFullscreen
}: MusicVideoProps) => {
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
              Search only Music, video, games, and photos
            </label>
          </div>

          <div className="tree-box">
            <h4>Music, video, games, and photos</h4>
            <ul>
                <li><img src={Plus} alt="" /> Music and sounds</li>
                <li><img src={Plus} alt="" /> Video</li>
                <li><img src={Plus} alt="" /> Games</li>
                <li><img src={Plus} alt="" /> Photos and other digital images</li>
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
                <h2>Music, videos, games, and photos</h2>
                <p>
                    Windows XP unlocks the world of digital media! Record your own
                    favorite tunes or find music online. View DVDs and videos. Play
                    exciting games on your own computer and on the Internet. Learn
                    how easy it is to view, organize, and store digital photos, and
                    share them in e-mail or online with family, friends, and
                    colleagues.
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

export default MusicVideo
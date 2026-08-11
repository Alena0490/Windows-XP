// MusicVideo.tsx — kompletní oprava, overview přidán do articles i renderu

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
import Plus from '../../img/plus.gif'
import Printer from '../../img/Printer.webp'
import Question from '../../img/question.gif'
import RestoreAllItems from '../../img/RestoreAllItems.webp'
import Small from '../../img/HelpAnSupport ChangeView1.webp'

import './HelpAnsSupport.css'
import './WhatsNew.css'

type ArticleId = 'overview' | 'musicsounds' | 'video' | 'games' | 'photos';

interface MusicVideoProps {
    globalVolume?: number;
    globalMuted?: boolean;
    plusTheme?: 'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
    isFullscreen?: boolean;
    onToggleFullscreen?: () => void;
    isFavorite: (id: string) => boolean;
    onAddFavorite: (id: string, title: string) => void;
}

const articleTitles: Record<ArticleId, string> = {
    overview: 'Music, videos, games, and photos',
    musicsounds: 'Music and sounds',
    video: 'Video',
    games: 'Games',
    photos: 'Photos and digital images',
};

const articles: Record<Exclude<ArticleId, 'overview'>, React.ReactNode> = {
    musicsounds: (
      <>
        <p className="article-subheading">Music and sounds</p>
        <img className="article-logo" src={Logo} alt="" />
        <p className="thin">
            Explore the flexibility and depth of the Windows music and sound
            experience. Store, play, and share music on your computer
            seamlessly - without interruption. Tickle your fancy by adding
            sounds to such routine activities as opening e-mail and sending
            items to the Recycle Bin!
        </p>
      </>
    ),
    video: (
      <>
        <p className="article-subheading">Video</p>
        <img className="article-logo" src={Logo} alt="" />
        <p className="thin">
            Playing and recording video on your computer has never been
            easier. You can copy home movies to your computer, edit them with
            video and audio clips, and share them with your friends and
            family. You can also play full-length feature films on your
            computer with a DVD-ROM drive and Windows Media Player, which is
            included in Windows XP. If you have a problem playing your DVD,
            use the Display or DVD troubleshooters to diagnose and fix your
            problem.
        </p>
      </>
    ),
    games: (
        <>
            <p className="article-subheading">Games</p>
            <img className="article-logo" src={Logo} alt="" />
            <p className="thin">
                Learn about the flexibility and power of DirectX, the robust
                new gaming platform from Microsoft. Get step-by-step
                instructions for installing, configuring, and troubleshooting
                your game devices.
            </p>
            <p className="article-subheading">Learn about:</p>
            <ul className="article-links">
                <li className='article-link'>Windows games</li>
                <li className='article-link'>Internet Zone games</li>
            </ul>
        </>
    ),
    photos: (
      <>
        <p className="article-subheading">Photos and digital images</p>
        <img className="article-logo" src={Logo} alt="" />
        <p className="thin">
            Bring your photos and digital images to life by sharing them with
            others or by using them to decorate and personalize your
            workspace. Learn about sending pictures to family members and
            friends in an e-mail message or storing them on a private and
            secure Web site. Learn how to customize your desktop or screen
            saver with your personal photos, images from a Web site, or
            Windows themes.
        </p>
      </>
    ),
};

const MusicVideo = ({
    globalVolume = 1,
    globalMuted = false,
    plusTheme,
    isFullscreen,
    onToggleFullscreen,
    isFavorite,
    onAddFavorite,
}: MusicVideoProps) => {
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
  const [expanded, setExpanded] = useState({
      musicsounds: false,
      video: false,
      games: false,
      photos: false,
  });

  const favoriteId = `musicvideo:${currentArticle}`;

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

  const toggleAndSelect = (id: Exclude<ArticleId, 'overview'>) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    setCurrentArticle(id);
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
            <h4 onClick={() => setCurrentArticle('overview')}>Music, video, games, and photos</h4>
            <XPScrollbar className="tree-box-scroll">
                <ul>
                    <li className={currentArticle === 'musicsounds' ? 'is-selected' : ''} onClick={() => toggleAndSelect('musicsounds')}>
                        <span className="tree-label">
                            <img src={expanded.musicsounds ? Minus : Plus} alt="" /> Music and sounds
                        </span>
                        {expanded.musicsounds && (
                            <ul className="tree-subitems">
                                <li><img src={Dot} alt="" /> Music on the Web</li>
                                <li><img src={Dot} alt="" /> Recording and using computer sounds</li>
                                <li><img src={Dot} alt="" /> Fixing a music or sound problem</li>
                                <li><img src={Dot} alt="" /> Playing music</li>
                                <li><img src={Plus} alt="" /> Customizing sound</li>
                                <li><img src={Plus} alt="" /> Managing music</li>
                            </ul>
                        )}
                    </li>

                    <li className={currentArticle === 'video' ? 'is-selected' : ''} onClick={() => toggleAndSelect('video')}>
                        <span className="tree-label">
                            <img src={expanded.video ? Minus : Plus} alt="" /> Video
                        </span>
                        {expanded.video && (
                            <ul className="tree-subitems">
                                <li><img src={Dot} alt="" /> Playing and recording video</li>
                                <li><img src={Dot} alt="" /> Fixing a video problem</li>
                            </ul>
                        )}
                    </li>

                    <li className={currentArticle === 'games' ? 'is-selected' : ''} onClick={() => toggleAndSelect('games')}>
                        <span className="tree-label">
                            <img src={expanded.games ? Minus : Plus} alt="" /> Games
                        </span>
                        {expanded.games && (
                            <ul className="tree-subitems">
                                <li><img src={Dot} alt="" /> Installing and configuring game controllers</li>
                                <li><img src={Dot} alt="" /> Fixing a games problem</li>
                            </ul>
                        )}
                    </li>

                    <li className={currentArticle === 'photos' ? 'is-selected' : ''} onClick={() => toggleAndSelect('photos')}>
                        <span className="tree-label">
                            <img src={expanded.photos ? Minus : Plus} alt="" /> Photos and other digital images
                        </span>
                        {expanded.photos && (
                            <ul className="tree-subitems">
                                <li><img src={Dot} alt="" /> Working with photos and graphics</li>
                                <li><img src={Dot} alt="" /> Using desktop backgrounds and themes</li>
                                <li><img src={Dot} alt="" /> Photos and graphics on the Web</li>
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

            {currentArticle === 'overview' ? (
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
            ) : (
                <div className="whats-new-article topics-view">
                    {articles[currentArticle]}
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

export default MusicVideo

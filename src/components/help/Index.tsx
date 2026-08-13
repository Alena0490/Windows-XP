import { useState, useMemo } from 'react'
import { createPortal } from 'react-dom'

import useSound from '../../hooks/useSound'
import CriticalError from '../CriticalError'
import type { ErrorType } from '../CriticalError'
import XPScrollbar from '../XPScrollbar'

import Large from '../../img/HelpAndSupportChangeView2.webp'
import Printer from '../../img/Printer.webp'
import RestoreAllItems from '../../img/RestoreAllItems.webp'
import Small from '../../img/HelpAnSupport ChangeView1.webp'
import AddFavourite from '../../img/AddFavorite1.webp'

import { helpIndex } from './data/helpIndex'

import './HelpAnsSupport.css'
import './WhatsNew.css'
import './Index.css'

interface IndexProps {
    onDisplay: (id: string) => void;
    globalVolume?: number;
    globalMuted?: boolean;
    plusTheme?: 'none' | 'aquarium' | 'davinci' | 'nature' | 'space';
    isFullscreen?: boolean;
    onToggleFullscreen?: () => void;
}

const Index = ({
    onDisplay,
    globalVolume = 1,
    globalMuted = false,
    plusTheme,
    isFullscreen,
    onToggleFullscreen
}: IndexProps) => {
  const sounds = useSound(globalVolume, globalMuted);
  const themeSound = plusTheme === 'aquarium' ? sounds.aquarium
      : plusTheme === 'davinci' ? sounds.daVinci
      : plusTheme === 'nature' ? sounds.nature
      : plusTheme === 'space' ? sounds.space
      : null;
  const playExclamation = () => themeSound ? themeSound.playExclamation() : sounds.playExclamation();

  const [errorType, setErrorType] = useState<ErrorType | null>(null);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const openError = (type: ErrorType) => {
    playExclamation();
    setErrorType(type);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sorted = [...helpIndex].sort((a, b) => a.keyword.localeCompare(b.keyword));
    if (!q) return sorted;
    return sorted.filter(entry => entry.keyword.toLowerCase().includes(q));
  }, [query]);

  const selectedEntry = helpIndex.find(e => e.id === selectedId) ?? null;

  const handleDisplay = () => {
    if (!selectedId) return;
    onDisplay(selectedId);
  };

  return (
    <div className="whatsnew-page">
      <div className="whatsnew-body">
        <div className="whatsnew-tree index">
          <div className="tree-box">
            <h4>Index</h4>
            <div className="tree-box-inner">
                <p className="thin index">Type in the keyword to find:</p>
                <input
                    type="text"
                    className="index-search-input"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <XPScrollbar className="favorites-list-scroll">
                    <ul className="favorites-list">
                        {filtered.map(entry => (
                            <li
                                key={entry.id}
                                className={selectedId === entry.id ? 'is-selected' : ''}
                                onClick={() => setSelectedId(entry.id)}
                                onDoubleClick={() => onDisplay(entry.id)}
                            >
                                {entry.keyword}
                            </li>
                        ))}
                    </ul>
                </XPScrollbar>
                <div className="favorites-actions">
                    <button className="luna-btn secondary" disabled={!selectedId} onClick={handleDisplay}>Display</button>
                </div>

            </div>
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
                {selectedEntry ? (
                    <h2>{selectedEntry.title}</h2>
                ) : (
                    <>
                        <h2>Index</h2>
                        <p>
                            Whether you know exactly what you're looking for, or want to
                            browse for what you need, the Index provides you with a fast,
                            easy way to locate topics and resources.
                        </p>
                    </>
                )}
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

export default Index

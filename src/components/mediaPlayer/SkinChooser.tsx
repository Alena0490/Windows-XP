import { useState } from 'react';

import natureThumb from './img/NatureThmb.webp'
import spaceThumb from './img/SpaceThumb.webp'
import daVinciThumb from './img/daVinciTumb.webp'
import aquariumThumb from './img/AquariumThumb.webp'
import WindowsXPThumb from './img/WindowsThumb.webp'
import headspaceThumb from './img/HeadspaceThumb.webp'
import toothyThumb from './img/ToothyThumb.webp'
import heartThumb from './img/HeartThumb.webp'
import classicThumb from './img/ClassicThumb.jpg';
import corporateThumb from './img/CorporateThumb.webp'
import professionalThumb from './img/ProfessionalThumb.webp'
import miniplayerThumb from './img/MiniplayerThumb.webp'
import './SkinChooser.css'

interface SkinChooserProps {
    onClose: () => void;
    onApplySkin: (skin: string) => void;
}

  const MS_COPYRIGHT = 'Copyright: (C)2001 Microsoft Corporation. All rights reserved.';

    const skins: Record<string, { thumb: string; title: string; author: string; copyright: string }> = {
        'Classic': { thumb: classicThumb, title: 'Classic', author: 'Microsoft Corporation', copyright: MS_COPYRIGHT },
        'Corporate': { thumb: corporateThumb, title: 'Corporate', author: 'Microsoft Corporation', copyright: MS_COPYRIGHT },
        'Headspace': { thumb: headspaceThumb, title: 'Headspace', author: 'Microsoft Corporation', copyright: MS_COPYRIGHT },
        'Heart': {thumb: heartThumb, title: 'Heart', author: 'Microsoft Corporation', copyright: MS_COPYRIGHT },
        'Miniplayer': { thumb: miniplayerThumb, title: 'Miniplayer', author: 'Microsoft Corporation', copyright: MS_COPYRIGHT },
        'Windows XP': { thumb: WindowsXPThumb, title: 'Windows XP', author: 'Microsoft Corporation', copyright: MS_COPYRIGHT },
        'Plus! Nature':   { thumb: natureThumb,   title: 'Plus! Nature',   author: 'Microsoft Corporation', copyright: MS_COPYRIGHT },
        'Plus! Space':    { thumb: spaceThumb,    title: 'Plus! Space',    author: 'Microsoft Corporation', copyright: MS_COPYRIGHT },
        'Plus! da Vinci': { thumb: daVinciThumb,  title: 'Plus! da Vinci', author: 'Microsoft Corporation', copyright: MS_COPYRIGHT },
        'Plus! Aquarium': { thumb: aquariumThumb, title: 'Plus! Aquarium', author: 'Microsoft Corporation', copyright: MS_COPYRIGHT },
        'Professional': { thumb: professionalThumb, title: 'Professional', author: 'Microsoft Corporation', copyright: MS_COPYRIGHT },
        'Toothy': {thumb: toothyThumb, title: 'Toothy', author: 'Microsoft Corporation', copyright: MS_COPYRIGHT }
    };

const SkinChooser = ({onClose, onApplySkin}:SkinChooserProps) => {
    const [selectedSkin, setSelectedSkin] = useState('Plus! Nature');
    const current = skins[selectedSkin];
    return (
        <div className='skin-chooser'>
            <div className='skin-header'>
                <div className="buttons">
                    <button 
                        type='button'
                        className='select' 
                        aria-label='Apply skin' 
                        onClick={() => onApplySkin(selectedSkin)}
                    >
                        <div className="icon apply"></div> 
                        <span className='mnemonic'>A</span>pply Skin
                    </button>
                    <button 
                        type='button'
                        className='add' 
                        disabled 
                        aria-label='More skins'
                    >
                        <div className="icon add"></div>
                        More&nbsp;<span className='mnemonic'>S</span>kins
                    </button>
                    <div className="divider"></div>
                    <button
                        type='button' 
                        className='close' 
                        aria-label='Close' 
                        onClick={onClose}
                    ></button>
                </div>
                <p>Click Apply Skin to open the skin</p>
            </div>
            <div className='skin-main'>
                <menu>
                    <ul>
                        <li className={selectedSkin === 'Corporate' ? 'selected' : ''} onClick={() => setSelectedSkin('Corporate')}>(Default Media Player)</li>
                        <li className={selectedSkin === 'Classic' ? 'selected' : ''} onClick={() => setSelectedSkin('Classic')}>Classic</li>
                        <li className={selectedSkin === 'Headspace' ? 'selected' : ''} onClick={() => setSelectedSkin('Headspace')}>Headspace</li>
                        <li className={selectedSkin === 'Heart' ? 'selected' : ''} onClick={() => setSelectedSkin('Heart')}>heart</li>
                        <li className={selectedSkin === 'Miniplayer' ? 'selected' : ''} onClick={() => setSelectedSkin('Miniplayer')}>Miniplayer</li>
                        <li className={selectedSkin === 'Plus! Nature' ? 'selected' : ''} onClick={() => setSelectedSkin('Plus! Nature')}>Plus! Nature</li>
                        <li className={selectedSkin === 'Plus! Space' ? 'selected' : ''} onClick={() => setSelectedSkin('Plus! Space')}>Plus! Space</li>
                        <li className={selectedSkin === 'Plus! da Vinci' ? 'selected' : ''} onClick={() => setSelectedSkin('Plus! da Vinci')}>Plus! da Vinci</li>
                        <li className={selectedSkin === 'Plus! Aquarium' ? 'selected' : ''} onClick={() => setSelectedSkin('Plus! Aquarium')}>Plus! Aquarium</li>
                        <li className={selectedSkin === 'Professional' ? 'selected' : ''} onClick={() => setSelectedSkin('Professional')}>Professional</li>
                        <li className={selectedSkin === 'Windows XP' ? 'selected' : ''} onClick={() => setSelectedSkin('Windows XP')}>Windows XP</li>
                        <li className={selectedSkin === 'Toothy' ? 'selected' : ''} onClick={() => setSelectedSkin('Toothy')}>Toothy</li>
                    </ul>
                </menu>
                <div className="skin-thumb">
                    {current && <img src={current.thumb} alt='' />}
                    <div className="desctiption">
                        <p className='skin-title'>Title: {current?.title}</p>
                        <p>Author: {current?.author}</p>
                        <p>Copyright: (C)2001 Microsoft Corporation. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SkinChooser
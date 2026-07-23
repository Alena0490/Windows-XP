import FolderIcon from '../../img/FolderClosed.webp';
import URLIcon from '../../img/URL.webp';
import { favourites } from './data/IEData';
import type { UserFavourite } from './AddFavourite';

import Add from '../../img/addFavorite.webp'
import Organize from '../../img/organizeFavorites.webp'
import XPScrollbar from '../XPScrollbar';
import './IEFavourites.css';

interface IEFavouritesProps {
    onNavigate: (url: string) => void;
    onClose: () => void;
    userFavourites?: UserFavourite[];
    onRemoveUserFavourite?: (url: string) => void;
    onAddFavourite: () => void;
}

const IEFavourites = ({ onNavigate, onClose, userFavourites = [], onRemoveUserFavourite, onAddFavourite }: IEFavouritesProps) => {
    return (
        <div className='ie-favourites'>
            <div className='ie-favourites-header'>
                <span>Favourites</span>
                <button
                    type='button'
                    className='ie-favourites-close'
                    onClick={onClose}
                >
                    ✕
                </button>
            </div>
            <div className='ie-favourites-toolbar'>
                <button className='manage-favorites' onClick={onAddFavourite}>
                    <img src={Add} alt='' />
                    Add...
                </button>
                <button className='manage-favorites disabled' disabled>
                    <img src={Organize} alt='' />
                    Organize...
                </button>
            </div>
            <XPScrollbar className='ie-favourites-list'>
                {userFavourites.length > 0 && (
                    <div className='ie-favourites-group'>
                        <div className='ie-favourites-folder'>
                            <img src={FolderIcon} alt='' className='ie-favourites-icon' />
                            <span>My Favorites</span>
                        </div>
                        <div className='ie-favourites-items'>
                            {userFavourites.map((item) => (
                                <div key={item.url} className='ie-favourites-item-row'>
                                    <button
                                        type='button'
                                        className='ie-favourites-item'
                                        onClick={() => onNavigate(item.url)}
                                    >
                                        <img src={URLIcon} alt='' className='ie-favourites-icon' />
                                        <span>{item.label}</span>
                                    </button>
                                    {onRemoveUserFavourite && (
                                        <button
                                            type='button'
                                            className='ie-favourites-remove'
                                            onClick={() => onRemoveUserFavourite(item.url)}
                                            aria-label={`Remove ${item.label}`}
                                            title='Remove'
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                                
                            ))}
                        </div>
                    </div>
                )}
                {favourites.map((group) => (
                    <div key={group.folder} className='ie-favourites-group'>
                        <div className='ie-favourites-folder'>
                            <img src={FolderIcon} alt='' className='ie-favourites-icon' />
                            <span>{group.folder}</span>
                        </div>
                        <div className='ie-favourites-items'>
                            {group.items.map((item) => (
                                <button
                                    key={item.url}
                                    type='button'
                                    className='ie-favourites-item'
                                    onClick={() => onNavigate(item.url)}
                                >
                                    <img src={item.icon} alt='' className='ie-favourites-icon' />
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </XPScrollbar>
        </div>
    );
};

export default IEFavourites;
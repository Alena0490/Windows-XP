import { useState } from 'react';
import { useDraggableDialog } from '../../hooks/useDraggableDialog';
import StarIcon from '../../img/Favourites.webp';
import './AddFavourite.css'
import '../../App.css'

export interface UserFavourite {
    label: string;
    url: string;
}

interface AddFavouriteProps {
    onClose: () => void;
    currentUrl: string;
    currentTitle: string;
    onSave: (fav: UserFavourite) => void;
}

const AddFavourite = ({ onClose, currentUrl, currentTitle, onSave }: AddFavouriteProps) => {
    const { dialogRef, onMouseDown, draggableStyle } = useDraggableDialog();
    const [name, setName] = useState(currentTitle);
    const [makeAvailableOffline, setMakeAvailableOffline] = useState(false);

    const handleOk = () => {
        const label = name.trim() || currentUrl;
        onSave({ label, url: currentUrl });
        onClose();
    };

    return (
        <div
                className='app-window add-favourite'
                ref={dialogRef}
                style={draggableStyle}
            >
            <div className='title-bar' onMouseDown={onMouseDown}>
                <div className='title'>
                    <span className='title-bar-text'>Add Favorite</span>
                </div>
                <div className='title-bar-buttons xp-title-controls'>
                    <button type='button' className='xp-title-control btn-help' aria-label='Help' />
                    <button type='button' className='xp-title-control btn-close' onClick={onClose} aria-label='Close' />
                </div>
            </div>

            <div className='add-favourite-body'>
                <div className='add-favourite-main'>
                    <div className='add-favourite-top'>
                        <img src={StarIcon} alt='' />
                        <p>Internet Explorer will add this page to your Favorites list.</p>
                    </div>

                <label className='add-favourite-checkbox-label'>
                    <input
                        type='checkbox'
                        checked={makeAvailableOffline}
                        onChange={e => setMakeAvailableOffline(e.target.checked)}
                    />
                    Make available offline
                    <button disabled className='add-favourite-customize'>Customize...</button>
                </label>

                    <label className='add-favourite-name-label'>
                        Name:
                        <input
                            type='text'
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className='add-favourite-input'
                        />
                    </label>
                </div>

                 <div className='add-favourite-actions'>
                    <button onClick={handleOk}>OK</button>
                    <button className='secondary' onClick={onClose}>Cancel</button>
                    <button className='secondary' >Create in &gt;&gt;</button>
                </div> 
            </div>
        </div>
    )
}

export default AddFavourite
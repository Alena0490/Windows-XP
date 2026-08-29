import { useState } from 'react';

type PanelMode = 'xp' | 'toothy' | 'heart' | 'default';

export function useExclusivePanel(mode: PanelMode, skinMode: boolean) {
    const [playlistHidden, setPlaylistHidden] = useState(skinMode);
    const [equalizerDrawerHidden, setEqualizerDrawerHidden] = useState(true);
    const [infoHidden, setInfoHidden] = useState(true);

    const togglePlaylist = () => {
        if (mode === 'xp' || mode === 'toothy') {
            setPlaylistHidden(prev => {
                const opening = prev;
                if (opening) setEqualizerDrawerHidden(true);
                return !prev;
            });
            return;
        }
        if (mode === 'heart') {
            setPlaylistHidden(prev => {
                const opening = prev;
                if (opening) {
                    setEqualizerDrawerHidden(true);
                    setInfoHidden(true);
                }
                return !prev;
            });
            return;
        }
        setPlaylistHidden(prev => !prev);
    };

    const toggleEqualizer = () => {
        if (mode === 'xp' || mode === 'toothy') {
            setEqualizerDrawerHidden(prev => {
                const opening = prev;
                if (opening) setPlaylistHidden(true);
                return !prev;
            });
            return;
        }
        if (mode === 'heart') {
            setEqualizerDrawerHidden(prev => {
                const opening = prev;
                if (opening) {
                    setPlaylistHidden(true);
                    setInfoHidden(true);
                }
                return !prev;
            });
            return;
        }
        setEqualizerDrawerHidden(prev => !prev);
    };

    const toggleInfo = () => {
        if (mode !== 'heart') return;
        setInfoHidden(prev => {
            const opening = prev;
            if (opening) {
                setPlaylistHidden(true);
                setEqualizerDrawerHidden(true);
            }
            return !prev;
        });
    };

    return {
        playlistHidden, setPlaylistHidden,
        equalizerDrawerHidden, setEqualizerDrawerHidden,
        infoHidden, setInfoHidden,
        togglePlaylist, toggleEqualizer, toggleInfo,
    };
}
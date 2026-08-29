import { useState, useEffect } from 'react';
import type { WMPTrack } from '../types/WMPTrack';

export function useTrackDurations(tracks: WMPTrack[], audioRef: React.RefObject<HTMLAudioElement | null>) {
    const [durations, setDurations] = useState<Record<number, number>>({});

    const [prevTracks, setPrevTracks] = useState(tracks);
    if (prevTracks !== tracks) {
        setPrevTracks(tracks);
        setDurations({});
    }

    useEffect(() => {
        const audios = tracks.map((track, index) => {
            const audio = new Audio();
            audio.preload = 'metadata';
            audio.onloadedmetadata = () => {
                setDurations(prev => ({ ...prev, [index]: audio.duration }));
            };
            audio.src = track.url;
            return audio;
        });
        return () => {
            audios.forEach(audio => {
                audio.onloadedmetadata = null;
                audio.removeAttribute('src');
            });
        };
    }, [tracks]);

    const handleLoadedMetadata = (index: number) => {
        const audio = audioRef.current;
        if (!audio) return;
        setDurations(prev => ({ ...prev, [index]: audio.duration }));
    };

    const totalTime = Object.values(durations).reduce((acc, dur) => acc + dur, 0);

    return { durations, handleLoadedMetadata, totalTime };
}
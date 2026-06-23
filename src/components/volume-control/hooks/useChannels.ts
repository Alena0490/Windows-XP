import { useState, useEffect } from 'react';

export type ChannelId = 'wave' | 'swSynth' | 'lineIn' | 'cdAudio';
export type Channel = { volume: number; muted: boolean };

const DEFAULTS: Record<ChannelId, Channel> = {
    wave:    { volume: 0.75, muted: false },
    swSynth: { volume: 0.75, muted: false },
    lineIn:  { volume: 0.75, muted: true  },
    cdAudio: { volume: 0.75, muted: false },
};

const useChannels = (globalVolume: number, globalMuted: boolean) => {
    const [channels, setChannels] = useState<Record<ChannelId, Channel>>(() => {
        const saved = localStorage.getItem('xp-volume-channels');
        return saved ? JSON.parse(saved) : DEFAULTS;
    });

    useEffect(() => {
        localStorage.setItem('xp-volume-channels', JSON.stringify(channels));
    }, [channels]);

    const setChannel = (id: ChannelId, patch: Partial<Channel>) =>
        setChannels(prev => ({ ...prev, [id]: { ...prev[id], ...patch } }));

    const effective = (ch: Channel) => ({
        muted: globalMuted || ch.muted,
        volume: (globalMuted || ch.muted) ? 0 : globalVolume * ch.volume,
    });

    return {
        channels,
        setChannel,
        system: effective(channels.wave),    // Wave → system sounds
        cd:     effective(channels.cdAudio),  // CD Audio → WMP
    };
};

export default useChannels;
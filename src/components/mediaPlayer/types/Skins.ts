export type SkinName = 'space' | 'nature' | 'aquarium' | 'davinci';

export type PlayPauseMode = 'toggle' | 'split';
export type VolumeOrientation = 'horizontal' | 'vertical';
export type DrawerContent = 'playlist' | 'none';

export interface SkinConfig {
    name: SkinName;

    // basic window sizes
    width: number;
    height: number;

    // play/pause
    playPauseMode: PlayPauseMode;

    // navigace
    hasNextPrev: boolean;

    // volume
    volumeOrientation: VolumeOrientation;
    hasVolumeSlider: boolean;

    // top row
    hasAsterisk: boolean;
    hasFullscreen: boolean;
    hasEqualizerToggle: boolean; // always false for now, 
    hasPlaylistToggle: boolean;

    // drawer 
    drawer: {
        content: DrawerContent;
        closedTop: number;
        openedTop: number;
        transitionMs: number;
    } | null;

    // video modes (small/320/640)
    hasVideoResize: boolean;
}

export const SKIN_CONFIGS: Record<SkinName, SkinConfig> = {
    space: {
        name: 'space',
        width: 0,   // TBD
        height: 0,  // TBD
        playPauseMode: 'toggle',
        hasNextPrev: false,
        volumeOrientation: 'vertical',
        hasVolumeSlider: true,
        hasAsterisk: true,
        hasFullscreen: false,
        hasEqualizerToggle: false,
        hasPlaylistToggle: false,
        drawer: null,
        hasVideoResize: false,
    },
    nature: {
        name: 'nature',
        width: 0,   // TBD
        height: 0,  // TBD
        playPauseMode: 'split',
        hasNextPrev: true,
        volumeOrientation: 'vertical',
        hasVolumeSlider: true,
        hasAsterisk: true,
        hasFullscreen: true,
        hasEqualizerToggle: false,
        hasPlaylistToggle: true,
        drawer: {
            content: 'playlist',
            closedTop: 0,  // TBD
            openedTop: 0,  // TBD
            transitionMs: 120,
        },
        hasVideoResize: true,
    },
    aquarium: {
        name: 'aquarium',
        width: 0,
        height: 0,
        playPauseMode: 'toggle',
        hasNextPrev: false,
        volumeOrientation: 'vertical',
        hasVolumeSlider: true,
        hasAsterisk: true,
        hasFullscreen: false,
        hasEqualizerToggle: false,
        hasPlaylistToggle: false,
        drawer: null,
        hasVideoResize: false,
    },
    davinci: {
        name: 'davinci',
        width: 0,
        height: 0,
        playPauseMode: 'toggle',
        hasNextPrev: true,
        volumeOrientation: 'vertical',
        hasVolumeSlider: true,
        hasAsterisk: true,
        hasFullscreen: false,
        hasEqualizerToggle: false,
        hasPlaylistToggle: true,
        drawer: null,
        hasVideoResize: false,
    },
};
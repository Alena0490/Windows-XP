import { useState, useRef } from 'react';
import IntertExplorer from '../img/InternetExplorer6.webp';

export type IEInstance = {
    id: string;
    url?: string;
    isMinimized: boolean;
    isFullscreen: boolean;
    title: string;
    favicon: string;
};

interface UseIEInstancesParams {
    playStart: () => void;
    playMinimize: () => void;
    bringToFront: (id: string) => void;
    removeFromOrder: (id: string) => void;
}

const useIEInstances = ({ playStart, playMinimize, bringToFront, removeFromOrder }: UseIEInstancesParams) => {
    const [ieInstances, setIeInstances] = useState<IEInstance[]>([]);
    const ieCounter = useRef(0);

    const openIE = (url?: string) => {
        const id = `ie-${ieCounter.current}`;
        ieCounter.current += 1;
        setIeInstances(ins => [...ins, {
            id,
            url,
            isMinimized: false,
            isFullscreen: false,
            title: 'Internet Explorer',
            favicon: IntertExplorer,
        }]);
        bringToFront(id);
        playStart();
    };

    const minimizeIE = (id: string, value: boolean | ((prev: boolean) => boolean)) => {
        setIeInstances(prev => prev.map(w => {
            if (w.id !== id) return w;
            const next = typeof value === 'function' ? value(w.isMinimized) : value;
            if (next) playMinimize(); else playStart();
            return { ...w, isMinimized: next };
        }));
    };

    const handleIETitleChange = (id: string, title: string) => {
        setIeInstances(prev => prev.map(w => w.id === id ? { ...w, title } : w));
    };

    const handleIEFaviconChange = (id: string, favicon: string) => {
        setIeInstances(prev => prev.map(w => w.id === id ? { ...w, favicon } : w));
    };

    const onCloseIE = (id: string) => {
        playMinimize();
        setIeInstances(prev => prev.filter(w => w.id !== id));
        removeFromOrder(id);
    };

    return {
        ieInstances,
        openIE,
        minimizeIE,
        handleIETitleChange,
        handleIEFaviconChange,
        onCloseIE,
    };
};

export default useIEInstances;
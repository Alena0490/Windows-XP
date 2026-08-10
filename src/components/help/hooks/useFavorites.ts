
import { useState, useCallback } from 'react';

export interface FavoriteItem {
    id: string;
    title: string;
}

const STORAGE_KEY = 'help-support-favorites';

const loadFavorites = (): FavoriteItem[] => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [{ id: 'whatsnew', title: "What's new in Windows XP" }];
    } catch {
        return [{ id: 'whatsnew', title: "What's new in Windows XP" }];
    }
};

const saveFavorites = (items: FavoriteItem[]) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
        // ignore write errors
    }
};

export const useFavorites = () => {
    const [favorites, setFavorites] = useState<FavoriteItem[]>(loadFavorites);

    const isFavorite = useCallback(
        (id: string) => favorites.some(f => f.id === id),
        [favorites]
    );

    const addFavorite = useCallback((item: FavoriteItem) => {
        setFavorites(prev => {
            if (prev.some(f => f.id === item.id)) return prev;
            const next = [...prev, item];
            saveFavorites(next);
            return next;
        });
    }, []);

    const removeFavorite = useCallback((id: string) => {
        setFavorites(prev => {
            const next = prev.filter(f => f.id !== id);
            saveFavorites(next);
            return next;
        });
    }, []);

    const renameFavorite = useCallback((id: string, title: string) => {
        setFavorites(prev => {
            const next = prev.map(f => f.id === id ? { ...f, title } : f);
            saveFavorites(next);
            return next;
        });
    }, []);

    return { favorites, isFavorite, addFavorite, removeFavorite, renameFavorite };
};
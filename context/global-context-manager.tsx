"use client"
import { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { Emotion, MirrorType, LocationType, GlobalContextType } from './global-context-type'; // types import

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalContextProvider({ children }: { children: ReactNode }) {
    const [totalMirrorCount, setTotalMirrorCount] = useState(0);
    const [totalFaceCount, setTotalFaceCount] = useState(0);
    const [topEmotion, setTopEmotion] = useState<Emotion | null>(null);
    const [locations, setLocations] = useState<LocationType[]>([]);
    const [mirrors, setMirrors] = useState<MirrorType[]>([]);

    const addLocation = useCallback((location: LocationType) => {
        setLocations(prev => [...prev, location]);
    }, []);

    const updateLocation = useCallback((place: string, updated: Partial<LocationType>) => {
        setLocations(prev => prev.map(loc => loc.place === place ? { ...loc, ...updated } : loc));
    }, []);

    const addMirror = useCallback((mirror: MirrorType) => {
        setMirrors(prev => [...prev, mirror]);
        setTotalMirrorCount(prev => prev + 1);
    }, [locations]);

    const updateMirror = useCallback((id: string, updated: Partial<MirrorType>) => {
        setMirrors(prev => prev.map(m => m.id === id ? { ...m, ...updated } : m));
    }, []);

    const value: GlobalContextType = {
        totalMirrorCount,
        totalFaceCount,
        topEmotion,
        locations,
        setTotalMirrorCount,
        setTotalFaceCount,
        setTopEmotion,
        addLocation,
        updateLocation,
        addMirror,
        updateMirror,
    };

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    );
}

export function useGlobalContext() {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error('useGlobalContext must be used within a GlobalContextProvider');
    }
    return context;
}

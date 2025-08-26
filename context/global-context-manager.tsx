"use client"
import { createContext, useContext, ReactNode, useState, useCallback } from 'react';

interface MirrorType {
    id: string;
    location: string;
    cpuUsage: number;
    memoryUsage: number;
}

interface LocationType {
    place: string;
    description: string;
    mirrorCount: number;
    mirrors: MirrorType[];
}

type Emotion = "happy" | "sad" | "neutral" | "angry" | "surprised" | "disgusted";

interface GlobalContextType {
    totalMirrorCount: number;
    totalFaceCount: number;
    topEmotion: Emotion | null;
    locations: LocationType[];

    // Functions to update context
    setTotalMirrorCount: (count: number) => void;
    setTotalFaceCount: (count: number) => void;
    setTopEmotion: (emotion: Emotion) => void;
    addLocation: (location: LocationType) => void;
    updateLocation: (place: string, updated: Partial<LocationType>) => void;
    addMirror: (mirror: MirrorType) => void;
    updateMirror: (id: string, updated: Partial<MirrorType>) => void;
}

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
        updateLocation(mirror.location, { mirrorCount: (locations.find(loc => loc.place === mirror.location)?.mirrorCount || 0) + 1 });
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

"use client"
import { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { Emotion, MirrorType, LocationType, GlobalContextType } from './global-context-type';

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalContextProvider({ children }: { children: ReactNode }) {
    const [totalMirrorCount, setTotalMirrorCount] = useState(0);
    const [totalFaceCount, setTotalFaceCount] = useState(0);
    const [topEmotion, setTopEmotion] = useState<Emotion | null>(null);
    const [locations, setLocations] = useState<LocationType[]>([]);
    const [mirrors, setMirrors] = useState<MirrorType[]>([]);

    // Stats states
    const [totalLocations, setTotalLocations] = useState(0);
    const [activeMirrors, setActiveMirrors] = useState(0);
    const [offlineMirrors, setOfflineMirrors] = useState(0);
    const [avgOccupancy, setAvgOccupancy] = useState(0);
    const [performanceScore, setPerformanceScore] = useState(0);

    const addLocation = useCallback((location: LocationType) => {
        setLocations(prev => [...prev, location]);
        setTotalLocations(prev => prev + 1);
        setTotalMirrorCount(prev => prev + location.mirrorCount);

        // Update active/offline mirrors count
        const onlineCount = location.mirrors.filter(m => m.status === "online").length;
        setActiveMirrors(prev => prev + onlineCount);
        setOfflineMirrors(prev => prev + (location.mirrorCount - onlineCount));

        // Update total face count based on mirrors in the new location
        const newFaces = location.mirrors.reduce((sum, mirror) => sum + mirror.totalFaceDetected, 0);
        setTotalFaceCount(prev => prev + newFaces);
    }, []);

    const updateLocation = useCallback((id: number, updated: Partial<LocationType>) => {
        setLocations(prev => prev.map(loc => loc.id === id ? { ...loc, ...updated } : loc));
    }, []);

    const addMirror = useCallback((mirror: MirrorType) => {
        setMirrors(prev => {
            if (prev.find(m => m.id === mirror.id)) return prev;
            return [...prev, mirror];
        });

        setTotalMirrorCount(prev => prev + 1);

        if (mirror.status === "online") {
            setActiveMirrors(prev => prev + 1);
        } else {
            setOfflineMirrors(prev => prev + 1);
        }

        setTotalFaceCount(prev => prev + mirror.totalFaceDetected);
    }, []);

    const updateMirror = useCallback((id: string, updated: Partial<MirrorType>) => {
        setMirrors(prev => prev.map(m => m.id === id ? { ...m, ...updated } : m));

        // Update active/offline counts if status changed
        if (updated.status) {
            if (updated.status === "online") {
                setActiveMirrors(prev => prev + 1);
                setOfflineMirrors(prev => prev - 1);
            } else {
                setActiveMirrors(prev => prev - 1);
                setOfflineMirrors(prev => prev + 1);
            }
        }
    }, []);

    const removeMirror = useCallback((id: string) => {
        setMirrors(prev => {
            const mirrorToRemove = prev.find(m => m.id === id);
            if (mirrorToRemove) {
                setTotalFaceCount(prev => prev - mirrorToRemove.totalFaceDetected);

                if (mirrorToRemove.status === "online") {
                    setActiveMirrors(prev => prev - 1);
                } else {
                    setOfflineMirrors(prev => prev - 1);
                }
            }
            return prev.filter(m => m.id !== id);
        });
        setTotalMirrorCount(prev => prev - 1);
    }, []);

    const value: GlobalContextType = {
        totalMirrorCount,
        totalFaceCount,
        topEmotion,
        locations,
        mirrors,
        totalLocations,
        activeMirrors,
        offlineMirrors,
        avgOccupancy,
        performanceScore,
        setTotalMirrorCount,
        setTotalFaceCount,
        setTopEmotion,
        addLocation,
        updateLocation,
        addMirror,
        updateMirror,
        removeMirror,
        setTotalLocations,
        setActiveMirrors,
        setOfflineMirrors,
        setAvgOccupancy,
        setPerformanceScore,
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
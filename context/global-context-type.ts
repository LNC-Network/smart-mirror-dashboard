interface MirrorType {
    id: string;
    ipAddress: string;
    description: string;
    cpuUsage: number;
    memoryUsage: number;
    storageUsage: number;
    emotion: Emotion;
    avgBodyTemperature: number;
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

export type { MirrorType, LocationType, Emotion, GlobalContextType }
interface MirrorType {
    id: string;
    ipAddress: string;
    description: string;
    cpuUsage: number;
    memoryUsage: number;
    storageUsage: number;
    emotion: Emotion;
    avgBodyTemperature: number;
    totalFaceDetected: number;
    status: "online" | "offline" | "warning";
    lastUpdate: string;
    name: string;
    location: string;
    uptime: number;
    sentiment: number;
    responseTime: number;
    lastSeen: string;
}

interface LocationType {
    id: number;
    name: string;
    description: string;
    mirrorCount: number;
    onlineMirrors: number;
    capacity: number;
    currentOccupancy: number;
    sentiment: number;
    facesToday: number;
    status: "active" | "warning" | "offline";
    lastUpdate: string;
    mirrors: MirrorType[];
}

type Emotion = "happy" | "sad" | "neutral" | "angry" | "surprised" | "disgusted";

interface GlobalContextType {
    totalMirrorCount: number;
    totalFaceCount: number;
    topEmotion: Emotion | null;
    locations: LocationType[];
    mirrors: MirrorType[];

    // Stats
    totalLocations: number;
    activeMirrors: number;
    offlineMirrors: number;
    avgOccupancy: number;
    performanceScore: number;

    // Functions to update context
    setTotalMirrorCount: (count: number) => void;
    setTotalFaceCount: (count: number) => void;
    setTopEmotion: (emotion: Emotion) => void;
    addLocation: (location: LocationType) => void;
    updateLocation: (id: number, updated: Partial<LocationType>) => void;
    addMirror: (mirror: MirrorType) => void;
    updateMirror: (id: string, updated: Partial<MirrorType>) => void;
    removeMirror: (id: string) => void;

    // Stats update functions
    setTotalLocations: (count: number) => void;
    setActiveMirrors: (count: number) => void;
    setOfflineMirrors: (count: number) => void;
    setAvgOccupancy: (percentage: number) => void;
    setPerformanceScore: (score: number) => void;
}

export type { MirrorType, LocationType, Emotion, GlobalContextType }
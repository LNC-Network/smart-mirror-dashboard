import sqlite3 from "sqlite3";
import { MirrorType } from "@/context/global-context-type";
export function checkMirrorId(mirrorId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database("./database/data.db", (err) => {
            if (err) {
                console.error("Error opening database:", err);
                return reject(err);
            }

            db.get("SELECT * FROM mirrors WHERE id = ?", [mirrorId], (err, row) => {
                if (err) {
                    console.error("Error querying database:", err);
                    return reject(err);
                }

                resolve(row !== undefined);
            });
        });
    });
}

export function addMirror({ id, ipAddress }: MirrorType): Promise<void> {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database("./database/data.db", (err) => {
            if (err) {
                console.error("Error opening database:", err);
                return reject(err);
            }

            db.run("INSERT INTO mirrors (id, ipAddress) VALUES (?, ?)",
                [id, ipAddress],
                (err) => {
                    if (err) {
                        console.error("Error inserting into database:", err);
                        return reject(err);
                    }

                    resolve();
                });
        });
    });
}

export function getAllMirrorsIpAddress(): Promise<string[]> {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database("./database/data.db", (err) => {
            if (err) {
                console.error("Error opening database:", err);
                return reject(err);
            }

            db.all("SELECT ipAddress FROM mirrors", [], (err, rows) => {
                if (err) {
                    console.error("Error querying database:", err);
                    return reject(err);
                }

                const ipAddresses = rows.map(row => row.ipAddress);
                resolve(ipAddresses);
            });
        });
    });
}
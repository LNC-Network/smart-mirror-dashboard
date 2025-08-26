import { Server } from "socket.io";
import type { NextApiRequest, NextApiResponse } from "next";
import { MirrorType } from "@/context/global-context-type";
import { addMirror, checkMirrorId } from "@/lib/MirrorOps";

// eslint-disable @typescript-eslint/no-explicit-any
export default function handler(req, res) {
    if (res.socket && !res.socket.server.io) {
        const io = new Server(res.socket.server, {
            path: "/api/socket_io",
        });

        res.socket.server.io = io;

        io.on("connection", (socket) => {
            console.log("Client connected:", socket.id);

            socket.on("addMirror", async (mirror: MirrorType) => {
                if (await checkMirrorId(mirror.id)) {
                    console.info(`Connected mirror ${mirror.id} already exists`);
                    return;
                }

                console.log("Adding new mirror:", mirror.id);
                try {
                    await addMirror(mirror);
                    // Optionally notify dashboards
                    io.emit("mirrorAdded", mirror);
                } catch (err) {
                    console.error("Error adding mirror:", err);
                }
            });

            socket.on("mirrorResponse", (data: MirrorType) => {
                io.emit("mirrorUpdate", data); // broadcast to dashboards
            });

            socket.on("disconnect", () => {
                console.log("Client disconnected:", socket.id);
            });
        });

        console.log("Socket.IO server created");
    }

    res.end();
}

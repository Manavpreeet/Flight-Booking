import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join-flight", (flight_leg_id) => {
        socket.join(flight_leg_id);
        console.log(`Client ${socket.id} joined flight room ${flight_leg_id}`);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

export { server, io };

import { Server, Socket } from "socket.io";
import express from 'express';
import { createServer } from 'node:http';
import { ConfigureRoutes } from "./routes/configure_routes.ts";
import cors from 'cors';
import { ChatServer } from "./models/ChatServer.ts";

const port = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json());
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const chatServer = new ChatServer(io);
ConfigureRoutes(app, chatServer);
chatServer.Start();

server.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
});
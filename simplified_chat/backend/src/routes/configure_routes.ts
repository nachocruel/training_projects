import { Router, type Application } from "express";
import { ChatServer } from "../models/ChatServer.ts";
import { ChatUser } from "../models/ChatUser.ts";

const ConfigureRoutes = (app: Application, chatServer: ChatServer) => {
    const router = Router();

    router.get('/api/health', (_, res) => {
        res.json({ status: 'ok' });
    });

    router.get('/api/chatrooms', (_, res) => {
        res.json({ data: chatServer.ListChatRooms() });
    });

    router.post('/api/chatrooms/:id/join', (req, res) => {
        const chatRoomId = req.params.id;
        const { userId, username, email } = req.body;
        chatServer.AddUserToChatRoom(chatRoomId, new ChatUser(userId, username, email));
        res.json({ status: 'joined' });
    });

    router.post('/api/chatrooms/:id/leave', (req, res) => {
        const chatRoomId = req.params.id;
        const { userId, username, email } = req.body;
        chatServer.RemoveUserFromChatRoom(chatRoomId, new ChatUser(userId, username, email));
        res.json({ status: 'left' });
    });

    router.post('/api/chatrooms/:id/message', (req, res) => {
        const chatRoomId = req.params.id;
        const { username, message } = req.body;
        const chatRoom = chatServer.GetChatRoomById(chatRoomId);
        if (chatRoom) {
            chatRoom.BroadcastMessage(username, message);
            res.json({ status: 'message sent' });
        } else {
            res.status(404).json({ status: 'chat room not found' });
        }
    });

    router.get('/api/chatrooms/:id/users', (req, res) => {
        const chatRoomId = req.params.id;
        const chatRoom = chatServer.GetChatRoomById(chatRoomId);
        if (chatRoom) {
            res.json({ data: chatRoom.ListUsers() });
        }
        else {
            res.status(404).json({ status: 'chat room not found' });
        }
    });

    router.post('/api/chatrooms/broadcast', (req, res) => {
        const { username, message } = req.body
        for (let chatRoom of chatServer.chatRooms)
            chatRoom.BroadcastMessage(username, message)
        res.status(204).send()
    })

    app.use(router);
}

export { ConfigureRoutes };
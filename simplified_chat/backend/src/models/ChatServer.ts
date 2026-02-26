import type { Server, Socket } from "socket.io";
import { ChatRoom } from "./ChatRoom.ts";
import type { ChatUser } from "./ChatUser.ts";

export class ChatServer {
    chatRooms: ChatRoom[] = []; // Array of chat rooms
    io: Server;
    constructor(io: Server) {
        console.log("ChatServer initialized");
        this.io = io;
        this.CreateChatRoom("1", "General", "General chat room for all users");
        this.CreateChatRoom("2", "Tech Talk", "Chat room for technology discussions");
    }

    Start() {
        this.io.on('connection', (socket: Socket) => {
            console.log('a user connected');
            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
            socket.on('broadcast', (data) => {
                this.io.emit('broadcast', data);
            });

            socket.on('joinRoom', (data) => {
                const roomId = data.roomId;
                const userId = data.userId;
                const chatRoom = this.GetChatRoomById(roomId) as ChatRoom;
                //socket.join(roomId);
                if (chatRoom) {
                    const user = chatRoom.chatUsers.find(x => x.id == userId);
                    if (user)
                        user.socket = socket;
                }
                console.log(`User ${userId} joined room ${roomId}`);
            });

            socket.on('leaveRoom', (roomId) => {
                //socket.leave(roomId);
                console.log(`User left room ${roomId}`);
            });
        });
    }

    CreateChatRoom(id: string, name: string, description: string) {
        const newChatRoom = new ChatRoom(id, name, description, new Date(), new Date());
        this.chatRooms.push(newChatRoom);
        console.log(`Chat room ${name} created`);
    }

    GetChatRoomById(id: string = "1"): ChatRoom | undefined {
        return this.chatRooms.find(room => room.id === id);
    }

    ListChatRooms(): ChatRoom[] {
        console.log("Available chat rooms:");
        this.chatRooms.forEach(room => console.log(`- ${room.name} (ID: ${room.id})`));
        return this.chatRooms;
    }

    AddUserToChatRoom(chatRoomId: string = "1", user: ChatUser) {
        const chatRoom = this.GetChatRoomById(chatRoomId);
        if (chatRoom) {
            chatRoom.AddUser(user);
            this.io.to(chatRoomId).emit('userJoined', { user, roomId: chatRoomId, message: `${user.username} joined this room.` });
        }
    }

    RemoveUserFromChatRoom(chatRoomId: string = "1", user: ChatUser) {
        const chatRoom = this.GetChatRoomById(chatRoomId);
        if (chatRoom) {
            chatRoom.RemoveUser(user);
            this.io.to(chatRoomId).emit('userLeft', { user, roomId: chatRoomId, message: `${user.username} left this room.` });
        }
    }
}
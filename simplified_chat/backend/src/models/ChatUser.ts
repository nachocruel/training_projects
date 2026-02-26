import type { Socket } from "socket.io";

export class ChatUser {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
    updatedAt: Date | null;
    socket: Socket | null;
    constructor(id: string, username: string, email: string, socket: Socket | null = null) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.createdAt = new Date();
        this.updatedAt = null;
        this.socket = socket;
    }

    ReceiveMessage(username:string, message: string) {
        if (this.socket)
            this.socket.send({ username, message })
    }

    ReceiveMessageFromUser(sender: ChatUser, message: string) {
        if (this.socket)
            this.socket.send({ username: sender.username, message })
    }
}
import type { ChatUser } from "./ChatUser.ts";

export class ChatRoom {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    chatUsers: ChatUser[] = []; // Array of user IDs
    constructor(id: string, name: string, description: string, createdAt: Date, updatedAt: Date) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    AddUser(user: ChatUser) {
        this.chatUsers.push(user);
        console.log(`User ${user.username} added to chat room ${this.name}`);
    }

    RemoveUser(user: ChatUser) {
        this.chatUsers = this.chatUsers.filter(u => u.id !== user.id);
        console.log(`User ${user.username} removed from chat room ${this.name}`);
    }

    BroadcastMessage(username: string, message: string) {
        console.log(`Broadcasting message to chat room ${this.name}: ${message}`);
        this.chatUsers.forEach(user => user.ReceiveMessage(username, message));
    }

    SendMessageToUser(user: ChatUser, message: string) {
        console.log(`Sending message to user ${user.username} in chat room ${this.name}: ${message}`);
        user.ReceiveMessageFromUser(user, message);
    }

    ListUsers(): ChatUser[] {
        console.log(`Users in chat room ${this.name}:`);
        this.chatUsers.forEach(user => console.log(`- ${user.username}`));
        return this.chatUsers;
    }
}
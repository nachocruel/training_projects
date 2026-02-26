export class ChatUser {
    constructor(username: string, email: string) {
        this.id = crypto.randomUUID();
        this.username = username;
        this.email = email;
    }

    id: string;
    username: string;
    email: string;
}
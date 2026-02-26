import { use, useEffect, useState } from "react";
import type { ChatRoom } from "../models/chat_room";
import './chat.css';
import { RoomUsers } from "./room.users";
import { ChatUser } from "../models/chat_user";
import { io, Socket } from "socket.io-client";

type Props = {
    currentRoom: ChatRoom | null;
}

const Chat = ({ currentRoom }: Props) => {

    const [users, setUsers] = useState<ChatUser[]>([]);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessage] = useState<any[]>([]);
    const [user, setUser] = useState<ChatUser | null>(null);

    useEffect(() => {
        const newSocket = io('http://localhost:3001');
        setSocket(newSocket);
        newSocket.on('broadcast', (data: any) => {
            setMessage((prevMessages) => [...prevMessages, data]);
        });

        newSocket.on('userJoined',  (data: any) => {
            setMessage((prevMessages) => [...prevMessages, data]);
        });

        return () => {
            newSocket.disconnect();
        }
    }, []);

    useEffect(() => {
        var user = JSON.parse(localStorage.getItem(sessionStorage.getItem('tabId') ?? '{}') ?? '{}') as ChatUser;
        if (user)
            setUser(user);

        if (currentRoom) {
            fetch(`http://localhost:3001/api/chatrooms/${currentRoom.id}/users`)
                .then(response => response.json())
                .then(data => {
                    setUsers(data.data)
                });
        }
    }, [currentRoom]);

    const sendMessage = (message: string) => {
        if (currentRoom) {
            socket?.emit('broadcast', { roomId: currentRoom.id, message, user });
        }
    }

    return (<div>
        <div className="chat-header">
            <h1>You are in room '<span style={{ color: "#663399" }}>{currentRoom?.name}</span>'  <span>{user?.username}</span></h1>
        </div>
        <div className="chat-messages">
            <div id="messages">
                {messages.map((message, index) => (
                    currentRoom?.id === message.roomId && <div key={index} className="card">
                        {message.user?.username}: {message.message}
                    </div>
                ))}
            </div>
        </div>
        <form id="form" action="">
            <input id="input" /><button onClick={(e) => {
                e.preventDefault();
                const input = document.getElementById("input") as HTMLInputElement;
                if (input) {
                    sendMessage(input.value);
                    input.value = "";
                }
            }}>Send</button>
        </form>
        <RoomUsers users={users} />
    </div>);
}

export default Chat;
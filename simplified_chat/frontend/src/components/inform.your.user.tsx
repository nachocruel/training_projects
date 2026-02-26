import React, { useEffect } from 'react';
import ReactDom from 'react-dom';
import type { ChatRoom } from '../models/chat_room';
import { ChatUser } from '../models/chat_user';
import { Socket } from 'socket.io-client';
import { SocketFactory } from '../models/SocketFactory';

type Props = {
    setShowModal: (show: boolean) => void;
    selectRoom: (chatRoom: ChatRoom) => void
}
const InformYourUser = ({ setShowModal, selectRoom }: Props) => {
    const [username, setUsername] = React.useState('');
    const [chatRooms, setChatRoom] = React.useState<ChatRoom[]>([]);
    const [selectedRoom, setSelectedRoom] = React.useState<ChatRoom | null>(null);
    const [socket, setSocket] = React.useState<Socket | null>(null);

    useEffect(() => {
        fetch('http://localhost:3001/api/chatrooms')
            .then(response => response.json())
            .then(data => {
                setChatRoom(data.data);
            })
            .catch(error => console.error('Error fetching rooms:', error));
    }, []);

    const JoinRoom = async () => {
        if (!username || !selectedRoom) {
            alert('Please enter a username and select a chat room.');
            return;
        }

        const user = new ChatUser(username, `${username.toLowerCase()}@example.com`);
        const result = await fetch(`http://localhost:3001/api/chatrooms/${selectedRoom?.id}/join`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });

        if (result.ok) {
            localStorage.setItem(sessionStorage.getItem('tabId') ?? '', JSON.stringify(user));
            setSocket(SocketFactory.GetSocket(user.id));
            setShowModal(false);
            selectRoom(selectedRoom)
            socket?.emit('joinRoom', { roomId: selectedRoom.id, userId: user.id });
        } else {
            alert('Failed to join the room. Please try again.');
        }
    }

    return ReactDom.createPortal(
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
        }}>
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'gray',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
            }}>
                <h2>Welcome to the Chat App!</h2>
                <p>Join a chat room to start chatting with others.</p>
                <form>
                    <input type="text" placeholder="Enter your username" style={{ padding: '10px', width: '80%', marginBottom: '10px' }} value={username} onChange={(e) => setUsername(e.target.value)} />
                    <br />
                    <select style={{ padding: '10px', width: '80%', marginBottom: '10px' }} value={selectedRoom?.id || ''} onChange={(e) => {
                        const roomId = parseInt(e.target.value);
                        const room = chatRooms.find(r => r.id === roomId.toString()) || null;
                        console.warn('Selected room:', room);
                        setSelectedRoom(room);
                    }}>
                        <option value="">Select a chat room</option>
                        {chatRooms.map(room => (
                            <option key={room.id} value={room.id} selected={selectedRoom?.id === room.id}>{room.name}</option>
                        ))}
                    </select>
                    <br />
                    <button type="button" style={{ padding: '10px 20px' }} onClick={JoinRoom}>Join Chat</button>
                </form>
            </div>
        </div>,
        document.getElementById('main-modal') as HTMLElement
    );
}

export default InformYourUser;
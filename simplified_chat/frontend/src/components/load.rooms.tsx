import { useEffect, useState } from 'react';
import './load.rooms.css';
import type { ChatRoom } from '../models/chat_room';
type Props = {
    setSelectedRoom: (room: ChatRoom) => void;
}

const LoadRooms = ({ setSelectedRoom }: Props) => {
    const [rooms, setRooms] = useState<ChatRoom[]>([]);

    const loadRooms = () => {
        fetch('http://localhost:3001/api/chatrooms')
            .then(response => response.json())
            .then(data => {
                setRooms(data.data);
            })
            .catch(error => console.error('Error fetching rooms:', error));
    }

    const selectRoom = (room: ChatRoom) => {
        rooms.forEach(r => r.selected = false);
        room.selected = true;
        setSelectedRoom(room);
    }

    useEffect(() => {
        loadRooms();
    }, []);

    return (<div className='load-room'>
        <div className='load-room-header'>
            Chat rooms
        </div>
        <div>
            <ul>
                {rooms.map(room => (
                    <li key={room.id} onClick={() => selectRoom(room)} className={room.selected ? 'selected' : ''}>{room.name}</li>
                ))}
            </ul>
        </div>
    </div>);
}

export default LoadRooms;
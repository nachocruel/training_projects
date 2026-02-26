import { useEffect, useState } from 'react'
import './App.css'
import LoadRooms from './components/load.rooms'
import Chat from './components/chat'
import { type ChatRoom } from './models/chat_room'
import InformYourUser from './components/inform.your.user';
import { Socket } from 'socket.io-client';
import { SocketFactory } from './models/SocketFactory';
import type { ChatUser } from './models/chat_user'


function App() {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  useEffect(() => {

    const uniqueTabId = window.name = window.name || `${Date.now()}`;
    if (!sessionStorage.getItem('tabId')) {
      sessionStorage.setItem('tabId', uniqueTabId);
    }

    if (!localStorage.getItem(sessionStorage.getItem('tabId') ?? ""))
      setShowModal(true);
    else {
      const user = JSON.parse(localStorage.getItem(sessionStorage.getItem('tabId') ?? '') ?? '{}') as ChatUser
      if (user?.id) {
        setSocket(SocketFactory.GetSocket(user.id));
      }
    }
  }, [])

  const selectRoom = (room: ChatRoom) => {
    const user = JSON.parse(localStorage.getItem(sessionStorage.getItem('tabId') ?? '') ?? '{}') as ChatUser
    if (user?.id) {
      setSocket(SocketFactory.GetSocket(user.id));
      socket?.emit('joinRoom', { roomId: room.id, userId: user.id })
    }
    setSelectedRoom(room);
  }

  return (
    <>
      <div style={{ flexGrow: 1 }}>
        <LoadRooms setSelectedRoom={selectRoom} />
      </div>
      <div style={{ flexGrow: 4 }}>
        <Chat currentRoom={selectedRoom} />
      </div>
      {showModal && <InformYourUser setShowModal={setShowModal} selectRoom={selectRoom} />}
    </>
  )
}

export default App

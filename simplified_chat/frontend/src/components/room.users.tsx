
import type { ChatUser } from '../models/chat_user';
import './room.users.css'

type Props = {
    users: ChatUser[];
}
export const RoomUsers = ({ users }: Props) => {
    return (<div className="room-users">
        <div className="room-users-header">
            Users in this room
        </div>
        <div className="room-users-list">
            <ul>
                {users?.map(user => <li key={user.id}>{user.username}</li>)}
            </ul>
        </div>
    </div>);
}
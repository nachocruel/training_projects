

import { io, Socket } from 'socket.io-client';
export class SocketFactory {
    private static socketsMap: Map<string, Socket> = new Map<string, Socket>();
    static GetSocket(id: string): Socket {
        let socket = this.socketsMap.get(id);
        if (socket == null)
            socket = io('http://localhost:3001')
        return socket;
    }
}
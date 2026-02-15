import { io, Socket } from 'socket.io-client';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';

class SocketClient {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io(WS_URL);
      
      this.socket.on('connect', () => {
        console.log('WebSocket connected');
      });

      this.socket.on('disconnect', () => {
        console.log('WebSocket disconnected');
      });
    }

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinGame(gameId: string) {
    if (this.socket) {
      this.socket.emit('join_game', gameId);
    }
  }

  leaveGame(gameId: string) {
    if (this.socket) {
      this.socket.emit('leave_game', gameId);
    }
  }

  sendMessage(gameId: string, message: string) {
    if (this.socket) {
      this.socket.emit('chat_message', { gameId, message });
    }
  }

  sendPlayerAction(gameId: string, action: any) {
    if (this.socket) {
      this.socket.emit('player_action', { gameId, action });
    }
  }

  onMessage(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('chat_message', callback);
    }
  }

  onPlayerAction(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('player_action', callback);
    }
  }

  getSocket() {
    return this.socket;
  }
}

export const socketClient = new SocketClient();

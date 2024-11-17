import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnModuleInit {
  @WebSocketServer()
  public server: Server;

  constructor(private readonly chatService: ChatService) {}

  onModuleInit() {
    this.server.on('connection', (socket: Socket) => {
      const { name, token } = socket.handshake.auth;
      console.log({ name, token });

      if (!name) {
        socket.disconnect();
        return;
      }

      this.chatService.onClientConnected({ id: socket.id, name: name });
      this.server.emit('on-clients-changed', this.chatService.getClients());

      socket.on('disconnect', () => {
        this.chatService.onClientDisconnected(socket.id);
        this.server.emit('on-clients-changed', this.chatService.getClients());
      });
    });
  }

  @SubscribeMessage('send-message')
  async handleMessage(
    @MessageBody()
    payload: { message: string; imageUrl?: string; videoUrl: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { name } = client.handshake.auth;
    const { message, imageUrl, videoUrl } = payload;

    if (!message && !imageUrl && !videoUrl) {
      return;
    }

    await this.chatService.saveMessage(
      client.id,
      name,
      message,
      undefined,
      imageUrl,
      videoUrl,
    );

    this.server.emit('on-message', {
      userId: client.id,
      message: message,
      name: name,
      imageUrl: imageUrl,
      videoUrl: videoUrl,
    });
  }

  @SubscribeMessage('send-private-message')
  async handlePrivateMessage(
    @MessageBody()
    {
      message,
      to,
      imageUrl,
    }: { message: string; to: string; imageUrl?: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { name } = client.handshake.auth;

    if (!message && !imageUrl) {
      return;
    }

    await this.chatService.saveMessage(client.id, name, message, to, imageUrl);

    client.to(to).emit('on-private-message', {
      userId: client.id,
      message: message,
      name: name,
      imageUrl: imageUrl,
    });
  }

  @SubscribeMessage('start-stream')
  handleStartStream(@ConnectedSocket() client: Socket) {
    const { name } = client.handshake.auth;
    if (!name) return;

    client.broadcast.emit('on-user-streaming', { userId: client.id, name });
  }

  @SubscribeMessage('webrtc-signal')
  handleWebRTCSignal(
    @MessageBody() { to, signal }: { to: string; signal: any },
    @ConnectedSocket() client: Socket,
  ) {
    client.to(to).emit('webrtc-signal', { from: client.id, signal });
  }
}

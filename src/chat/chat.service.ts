import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './shema/message.shema';

interface Client {
  id: string;
  name: string;
}

@Injectable()
export class ChatService {
  private clients: Record<string, Client> = {};

  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  onClientConnected(client: Client) {
    this.clients[client.id] = client;
  }

  onClientDisconnected(id: string) {
    delete this.clients[id];
  }

  getClients() {
    return Object.values(this.clients);
  }

  async saveMessage(
    userId: string,
    name: string,
    message: string,
    recipientId?: string,
    imageUrl?: string,
    videoUrl?: string,
  ) {
    const newMessage = new this.messageModel({
      userId,
      name,
      message,
      recipientId,
      imageUrl,
      videoUrl,
    });
    return newMessage.save();
  }
}

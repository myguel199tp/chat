import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: false })
  recipientId?: string;

  @Prop({ required: false })
  imageUrl?: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

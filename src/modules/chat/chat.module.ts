import { Module } from '@nestjs/common';
import { ChatController } from '@chat/controllers/chat.controller';
import { ChatRepository } from '@chat/repositories/chat.repository';
import { ChatService } from '@chat/services/chat.service';
import { ChatSerializer } from '@chat/serializer/chat.serializer';

@Module({
  controllers: [ChatController],
  providers: [ChatRepository, ChatService, ChatSerializer],
})
export class ChatModule {}

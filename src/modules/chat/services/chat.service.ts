import { Injectable } from '@nestjs/common';

import { ChatRepository } from '@chat/repositories/chat.repository';
import { SessionInfoType } from '@core/types/sessionInfo.type';
import { Prisma } from '@prisma/client';
import { ChatSerializer } from '@chat/serializer/chat.serializer';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly chatSerializer: ChatSerializer,
  ) {}

  public async getChatMessages(
    userReceiverId: number,
    sessionInfo: SessionInfoType,
  ) {
    const findOptions: Prisma.messagesFindManyArgs = {
      where: {
        OR: [
          {
            customerSenderId: sessionInfo.id,
            customerReceiverId: userReceiverId,
          },
          {
            customerSenderId: userReceiverId,
            customerReceiverId: sessionInfo.id,
          },
        ],
      },
      select: {
        id: true,
        message: true,
        sentDate: true,
        readDate: true,
        customerSenderId: true,
      },
      take: 1000,
      orderBy: { sentDate: 'asc' },
    };

    const messages = await this.chatRepository.findManyMessages(findOptions);

    return this.chatSerializer.serializeChatInformation(
      messages,
      sessionInfo.id,
    );
  }
}

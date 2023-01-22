import { Injectable } from '@nestjs/common';
import { messages } from '@prisma/client';

@Injectable()
export class ChatSerializer {
  public serializeChatInformation(
    chatInformation: Array<messages>,
    senderId: number,
  ) {
    const finalResponse: Array<{
      id: bigint;
      sentDate: Date;
      readDate: Date | null;
      message: string;
      type: string;
    }> = [];
    for (const chat of chatInformation) {
      const type: string =
        chat.customerSenderId === BigInt(senderId) ? 'sent' : 'received';

      finalResponse.push({
        id: chat.id,
        readDate: chat.readDate,
        sentDate: chat.sentDate,
        message: chat.message,
        type,
      });
    }

    return finalResponse;
  }
}

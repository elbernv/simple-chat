import { Controller, Get, Query } from '@nestjs/common';

import { SessionInfo } from '@core/decorators/sessionInfo.decorator';
import { SessionInfoType } from '@core/types/sessionInfo.type';
import { ROUTES } from '@core/enums/routes.enum';
import { ChatService } from '@chat/services/chat.service';
import { ChatMessagesQuery } from '@chat/dtos/chatMessagesQuery.dto';

@Controller(ROUTES.CHAT)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('messages')
  public async getChatMessages(
    @Query() queryParams: ChatMessagesQuery,
    @SessionInfo() sessionInfo: SessionInfoType,
  ) {
    return this.chatService.getChatMessages(
      queryParams.userReceiverId,
      sessionInfo,
    );
  }
}

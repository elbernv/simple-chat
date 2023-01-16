import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import { SessionInfoType } from '@core/types/sessionInfo.type';
import { SessionInfo } from '@core/decorators/sessionInfo.decorator';
import { ROUTES } from '@core/enums/routes.enum';
import { imageFileFilter } from '@utils/file-upload.utils';
import { MeService } from '@me/services/me.service';
import { UpdateCustomerDto } from '@customer/dtos/updateCustomer.dto';

@ApiTags(ROUTES.ME.toUpperCase())
@Controller(ROUTES.ME)
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Get('customer')
  public async getCustomerMyInfo(@SessionInfo() sessionInfo: SessionInfoType) {
    return await this.meService.getCustomerMyInfo(sessionInfo);
  }

  @Get('user')
  public async getUserMyInfo(@SessionInfo() sessionInfo: SessionInfoType) {
    return await this.meService.getUserMyInfo(sessionInfo);
  }

  @Patch('customer')
  public async updateCustomer(
    @SessionInfo() sessionInfo: SessionInfoType,
    @Body() body: UpdateCustomerDto,
  ) {
    return await this.meService.updateCustomer(sessionInfo.id, body);
  }

  @Post('customer/picture')
  @UseInterceptors(FileInterceptor('picture', { fileFilter: imageFileFilter }))
  public async saveCustomerPicture(
    @UploadedFile() file: Express.Multer.File,
    @SessionInfo() sessionInfo: SessionInfoType,
  ) {
    return this.meService.saveCustomerPicture(file, sessionInfo);
  }
}

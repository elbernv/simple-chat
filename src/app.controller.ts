import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
  Response,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { extname } from 'path';
import { nanoid } from 'nanoid';
import { diskStorage } from 'multer';

export const editFileName = (req, file, callback) => {
  const fileExtName = extname(file.originalname);
  callback(null, `${nanoid(64)}${fileExtName}`);
};

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('check-if-user-has-profile')
  checkIfUserHasProfile(@Query('name') name: string) {
    return this.appService.checkIfUserHasProfile(name);
  }

  @Post('create-profile')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
    }),
  )
  createProfile(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
    @Req() request: any,
  ) {
    return this.appService.createProfile(body, file, request);
  }

  @Get('me-profile')
  getMeProfile(@Query('name') name: string) {
    return this.appService.getMeProfile(name);
  }

  @Get('active-users')
  getAllActiveUsers() {
    return this.appService.getAllActiveUsers();
  }

  @Get('/image/:name')
  serveImage(
    @Param('name') imageName: string,
    @Response({ passthrough: true }) response: any,
  ) {
    return this.appService.serveImage(imageName, response);
  }
}

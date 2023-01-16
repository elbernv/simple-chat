import {
  BadRequestException,
  Injectable,
  StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class ImagesService {
  constructor() {}

  public async serveImage(
    folder: string,
    fileName: string,
    response: Response,
  ): Promise<StreamableFile | BadRequestException> {
    const fileExists = existsSync(join(process.cwd(), folder, fileName));

    if (!fileExists) {
      throw new BadRequestException('Image not found');
    }

    const file = createReadStream(join(process.cwd(), folder, fileName));

    this.setFileHeaders(fileName, response);

    return new StreamableFile(file);
  }

  private setFileHeaders(name: string, response: Response) {
    const fileExtesion = name.slice(name.indexOf('.') + 1);
    switch (fileExtesion) {
      case 'pdf':
        response.setHeader('Content-Type', 'application/pdf');
        response.setHeader('Content-Disposition', `inline; filename="${name}"`);

        return response;

      case 'docx':
        response.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        );
        response.setHeader(
          'Content-Disposition',
          `attachment; filename="${name}"`,
        );

        return response;

      case 'xlsx':
        response.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        response.setHeader(
          'Content-Disposition',
          `attachment; filename="${name}"`,
        );

        return response;

      case 'png':
        response.setHeader('Content-Type', 'image/png');
        response.setHeader('Content-Disposition', `inline; filename="${name}"`);

        return response;

      case 'jpg':
      case 'jpeg':
        response.setHeader('Content-Type', 'image/jpeg');
        response.setHeader('Content-Disposition', `inline; filename="${name}"`);

        return response;
    }
  }
}

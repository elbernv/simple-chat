import { Injectable, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Response } from 'express';

export const clients = {};

@Injectable()
export class AppService {
  checkIfUserHasProfile(request: any) {
    return Boolean(clients[request.ip]);
  }

  createProfile(body: any, file: Express.Multer.File, request: any) {
    clients[request.ip] = {
      name: body.name,
      image: `http://192.168.2.229:3001/image/${file.filename}`,
    };

    return { message: 'ok bro' };
  }

  getMeProfile(request: any) {
    return clients[request.ip] || {};
  }

  serveImage(name: string, response: any) {
    const file = createReadStream(join(process.cwd(), './files', name));

    this.setHeaders(name, response);

    return new StreamableFile(file);
  }

  getAllActiveUsers() {
    let response = [];

    for (const client in clients) {
      response.push(clients[client]);
    }
    return response;
  }

  private setHeaders(name: string, response: Response) {
    const fileExtesion = name.slice(name.indexOf('.') + 1);
    switch (fileExtesion) {
      case 'pdf':
        response.setHeader('Content-Type', 'application/pdf');
        response.setHeader('Content-Disposition', `inline; filename="${name}"`);

        break;

      case 'docx':
        response.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        );
        response.setHeader(
          'Content-Disposition',
          `attachment; filename="${name}"`,
        );

        break;

      case 'xlsx':
        response.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        response.setHeader(
          'Content-Disposition',
          `attachment; filename="${name}"`,
        );

        break;

      case 'png':
        response.setHeader('Content-Type', 'image/png');
        response.setHeader('Content-Disposition', `inline; filename="${name}"`);

        break;

      case 'jpg':
      case 'jpeg':
        response.setHeader('Content-Type', 'image/jpeg');
        response.setHeader('Content-Disposition', `inline; filename="${name}"`);

        break;
    }
  }
}

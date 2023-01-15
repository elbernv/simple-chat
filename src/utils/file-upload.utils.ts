import { extname } from 'path';
import { nanoid } from 'nanoid';
import { Request } from 'express';
import { BadRequestException } from '@nestjs/common';

export const editFileName = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error, filename: string) => void,
) => {
  const fileExtName = extname(file.originalname);
  callback(null, `${nanoid(64)}${fileExtName}`);
};

export const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error, acceptFile: boolean) => void,
) => {
  if (!file.originalname.match(/\.(png|jpeg|jpg)$/)) {
    return callback(
      new BadRequestException('Solo se permiten archivos imagenes'),
      false,
    );
  }

  callback(null, true);
};

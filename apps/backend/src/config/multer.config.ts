import { BadRequestException } from '@nestjs/common';
import { Options } from 'multer';

export const MAX_PHOTO_ALLOWED = 10;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB limit per file we can do it in need in environment variable
export const imageFileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
    return callback(
      new BadRequestException([
        {
          property: 'photos',
          message: 'Only image files are allowed!',
        },
      ]),
      false,
    );
  }
  callback(null, true);
};

export const multerOptionsPhoto: Options = {
  fileFilter: imageFileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
};

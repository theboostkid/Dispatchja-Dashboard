import { BadRequestException } from '@nestjs/common';

export const fileFilter = (fileRegex: RegExp) => (req, file, cb) => {
  const isValidExtension = fileRegex.test(file.originalname.split('.').pop());
  const isValidMime = fileRegex.test(file.mimetype);
 
  if (isValidExtension && isValidMime) {
    cb(null, true);
  } else {
    cb(new BadRequestException(['File format is not valid']), false);
  }
};

import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

@Injectable()
export class FileshareService {
  constructor() {
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR);
    }
  }

  getFiles() {
    try {
      const files = fs.readdirSync(UPLOAD_DIR);
      return files.map((file) => ({ name: file }));
    } catch (error) {
      throw new InternalServerErrorException('Unable to read file directory.');
    }
  }

  getFile(fileName: string) {
    const filePath = path.join(UPLOAD_DIR, fileName);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found.');
    }
    return filePath;
  }

  deleteFile(fileName: string) {
    const filePath = path.join(UPLOAD_DIR, fileName);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found.');
    }
    try {
      fs.unlinkSync(filePath);
      return { message: 'File deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Could not delete file.');
    }
  }
}

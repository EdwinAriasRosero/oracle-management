import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Res,
  UploadedFile,
  UseInterceptors,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { FileshareService } from '../services/fileshare.service';
import 'multer';

@Controller('files')
export class FileController {
  constructor(private readonly fileshareService: FileshareService) {}

  @Get()
  getFiles() {
    return this.fileshareService.getFiles();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new InternalServerErrorException('File upload failed.');
    }
    return {
      message: 'File uploaded successfully',
      fileName: file.originalname,
    };
  }

  @Get('download/:fileName')
  downloadFile(@Param('fileName') fileName: string, @Res() res: Response) {
    try {
      const filePath = this.fileshareService.getFile(fileName);
      res.download(filePath, fileName);
    } catch (error) {
      if (error instanceof NotFoundException) {
        res.status(404).send(error.message);
      } else {
        res.status(500).send((<any>error).message);
      }
    }
  }

  @Delete(':fileName')
  deleteFile(@Param('fileName') fileName: string) {
    return this.fileshareService.deleteFile(fileName);
  }
}

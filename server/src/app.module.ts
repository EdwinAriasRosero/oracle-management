import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsGateway } from './events/events.gateway';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { FileshareService } from './services/fileshare.service';
import { FileController } from './controllers/files.controller';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from './multer.config';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    MulterModule.register(multerConfig),
  ],
  controllers: [AppController, FileController],
  providers: [AppService, EventsGateway, FileshareService],
})
export class AppModule {}

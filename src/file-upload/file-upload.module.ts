import { Module } from '@nestjs/common';
import { UploadController } from './file-upload.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
    imports: [
        MulterModule.register({
            dest: './files',
          }),
    ],

    controllers: [UploadController],

  })


export class UploadModule {}
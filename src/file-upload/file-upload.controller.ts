import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import {
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { BufferedFile } from 'src/minio-client/file.model';

@Controller('file-upload')
export class FileUploadController {
  constructor(private fileUploadService: FileUploadService) {}

  @Post('single')
  @UseInterceptors(FileInterceptor('image'))
  async uploadSingle(@UploadedFile() image: BufferedFile) {
    return await this.fileUploadService.uploadSingle(image);
  }

  @Post('many')
  @UseInterceptors(FilesInterceptor('images', 5))
  async uploadMultipleFiles(@UploadedFiles() images: { [key: string]: BufferedFile[] }) {
    const uploadedImagesResponse = await this.fileUploadService.uploadMany(images);
    return uploadedImagesResponse;
  }
}

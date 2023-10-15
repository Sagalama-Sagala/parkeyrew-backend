import { Injectable } from '@nestjs/common';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import { BufferedFile } from 'src/minio-client/file.model';
import { HttpException,HttpStatus } from '@nestjs/common';
@Injectable()
export class FileUploadService {
  constructor(private minioClientService: MinioClientService) {}

  async uploadSingle(image: BufferedFile): Promise<string> {
    let uploaded_image = await this.minioClientService.upload(image);
    console.log(uploaded_image);

    return uploaded_image.url.toString();
  }

  async uploadMany(images: { [key: string]: BufferedFile[] }): Promise<string[]> {
    const uploadedImageUrls = [];

    for (let i = 1; i <= 5; i++) {
      const fieldName = `image${i}`;

      if (images[fieldName] && images[fieldName].length > 0) {
        const image = images[fieldName][0];
        const uploadedImage = await this.minioClientService.upload(image);
        uploadedImageUrls.push(uploadedImage.url);
      }
    }

    if (Object.keys(uploadedImageUrls).length === 0) {
      
      throw new HttpException(
        'No image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return uploadedImageUrls
    
  }
}

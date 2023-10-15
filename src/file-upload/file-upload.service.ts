import { Injectable } from '@nestjs/common';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import { BufferedFile } from 'src/minio-client/file.model';

@Injectable()
export class FileUploadService {
  constructor(private minioClientService: MinioClientService) {}

  async uploadSingle(image: BufferedFile): Promise<string> {
    let uploaded_image = await this.minioClientService.upload(image);
    console.log(uploaded_image);

    return uploaded_image.url.toString();
  }

  async uploadMany(files: BufferedFile) {
    let image1 = files['image1'][0];
    let uploaded_image1 = await this.minioClientService.upload(image1);

    let image2 = files['image2'][0];
    let uploaded_image2 = await this.minioClientService.upload(image2);

    return {
      image1_url: uploaded_image1.url,
      image2_url: uploaded_image2.url,
      message: 'Successfully uploaded mutiple image on MinioS3',
    };
  }
}

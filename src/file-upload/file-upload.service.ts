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

  // async uploadMany(files: BufferedFile) {
  //   let image1 = files['image1'][0];
  //   let uploaded_image1 = await this.minioClientService.upload(image1);
  //
  //   let image2 = files['image2'][0];
  //   let uploaded_image2 = await this.minioClientService.upload(image2);
  //
  //   return {
  //     image1_url: uploaded_image1.url,
  //     image2_url: uploaded_image2.url,
  //     message: 'Successfully uploaded mutiple image on MinioS3',
  //   };
  // }

  async uploadMany(files: { [key: string]: BufferedFile[] }) {
    const uploadedImageUrls = {};

    for (let i = 1; i <= 5; i++) {
      const fieldName = `image${i}`;

      if (files[fieldName] && files[fieldName].length > 0) {
        const image = files[fieldName][0];
        const uploadedImage = await this.minioClientService.upload(image);
        uploadedImageUrls[`${fieldName}_url`] = uploadedImage.url;
      }
    }

    if (Object.keys(uploadedImageUrls).length === 0) {
      return {
        message: 'No images were uploaded.',
      };
    }

    return {
      ...uploadedImageUrls,
      message: 'Successfully uploaded multiple images on MinioS3',
    };
  }
}

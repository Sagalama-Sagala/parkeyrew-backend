import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { BufferedFile } from './file.model';
import * as crypto from 'crypto';
import { config } from './config';

@Injectable()
export class MinioClientService {
  constructor(private readonly minio: MinioService) {
    this.logger = new Logger('MinioService');
    // THIS IS THE POLICY
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: {
            AWS: ['*'],
          },
          Action: [
            's3:ListBucketMultipartUploads',
            's3:GetBucketLocation',
            's3:ListBucket',
          ],
          Resource: ['arn:aws:s3:::picture'], // Change this according to your bucket name
        },
        {
          Effect: 'Allow',
          Principal: {
            AWS: ['*'],
          },
          Action: [
            's3:PutObject',
            's3:AbortMultipartUpload',
            's3:DeleteObject',
            's3:GetObject',
            's3:ListMultipartUploadParts',
          ],
          Resource: ['arn:aws:s3:::picture/*'], // Change this according to your bucket name
        },
      ],
    };
    this.client.setBucketPolicy(
      config.MINIO_BUCKET_NAME,
      JSON.stringify(policy),
      function (err) {
        if (err) throw err;

        console.log('Bucket policy set');
      },
    );
  }

  private readonly logger: Logger;
  private readonly bucketName = config.MINIO_BUCKET_NAME;

  public get client() {
    return this.minio.client;
  }

  public async upload(
    file: BufferedFile,
    bucketName: string = this.bucketName,
  ) {
    if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png')||file.mimetype.includes('JPG')||file.mimetype.includes('jpg'))) {
      throw new HttpException(
        'File type not supported',
        HttpStatus.BAD_REQUEST,
      );
    }
    const timestamp = Date.now().toString();
    const hashedFileName = crypto
      .createHash('md5')
      .update(timestamp)
      .digest('hex');
    const extension = file.originalname.substring(
      file.originalname.lastIndexOf('.'),
      file.originalname.length,
    );
    const metaData = {
      'Content-Type': file.mimetype,
    };

    // We need to append the extension at the end otherwise Minio will save it as a generic file
    const fileName = hashedFileName + extension;

    this.client.putObject(
      bucketName,
      fileName,
      file.buffer,
      metaData,
      function (err, res) {
        if (err) {
          throw new HttpException(
            'Error uploading file',
            HttpStatus.BAD_REQUEST,
          );
        }
      },
    );

    return {
      url: `https://parkeyrew-minio.chompukyrc.com/${config.MINIO_BUCKET_NAME}/${fileName}`,
    };
  }

  async delete(objetName: string, bucketName: string = this.bucketName) {
    this.client.removeObject(bucketName, objetName, function (err, res) {
      if (err)
        throw new HttpException(
          'An error occured when deleting!',
          HttpStatus.BAD_REQUEST,
        );
    });
  }
}

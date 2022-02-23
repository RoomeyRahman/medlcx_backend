import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import 'dotenv/config';
import { StorageFile } from '../storage/storage-file';

@Injectable()
export class MediaService {
  constructor(private readonly storageService: StorageService) {}

  /**
   * uploadMedia file
   * @param {Express.Multer.File} file
   * @param {string} mediaId
   * @returns
   */
  async uploadMedia(file: Express.Multer.File, mediaId: string) {
    try {
      return await this.storageService.save(
        process.env.FOLDER + mediaId,
        file.mimetype,
        file.buffer,
        [{ mediaId: mediaId }],
      );
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * downloadMedia file
   * @param {string} publicKey
   * @returns
   */
  async downloadMedia(publicKey: string) {
    try {
      return await this.storageService.get(process.env.FOLDER + publicKey);
    } catch (e) {
      if (e.message.toString().includes('No such object')) {
        throw new NotFoundException('file not found');
      } else {
        throw new ServiceUnavailableException('Service Unavailable');
      }
    }
  }

  /**
   * delete file
   * @param {string} privateKey
   * @returns
   */
  async deleteMedia(privateKey: string) {
    try {
      return await this.storageService.delete(process.env.FOLDER + privateKey);
    } catch (e) {
      if (e.message.toString().includes('No such object')) {
        throw new NotFoundException('file not found');
      } else {
        throw new ServiceUnavailableException('Service Unavailable');
      }
    }
  }
}

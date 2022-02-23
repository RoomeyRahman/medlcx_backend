import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  MethodNotAllowedException,
  Param,
  Patch,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { StorageFile } from '../storage/storage-file';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private mediaService: MediaService) {}

  /**
   * upload files
   * @param {Express.Multer.File} file
   * @param {string} mediaId
   * @returns
   */
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        files: 1,
        fileSize: 1024 * 1024,
      },
    }),
  )
  async uploadMedia(
    @UploadedFile() file: Express.Multer.File,
    @Body('mediaId') mediaId: string,
  ) {
    try {
      return this.mediaService.uploadMedia(file, mediaId);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @Get('files')
  public getUploadFile() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @Put('files')
  public putUploadFile() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @Patch('files')
  public patchUploadFile() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @Delete('files')
  public deleteUploadFile() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  /**
   * download files
   * @param {string} publicKey
   * @param {Response} res
   * @returns
   */
  @Get('/:publicKey')
  async downloadMedia(
    @Param('publicKey') publicKey: string,
    @Res() res: Response,
  ) {
    try {
      const storageFile: StorageFile = await this.mediaService.downloadMedia(
        publicKey,
      );
      res.setHeader('Content-Type', storageFile.contentType);
      res.setHeader('Cache-Control', 'max-age=60d');
      res.end(storageFile.buffer);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * delete files
   * @param {string} privateKey
   * @returns
   */
  @HttpCode(204)
  @Delete(':privateKey')
  removeFile(@Param('privateKey') privateKey: string) {
    try {
      return this.mediaService.deleteMedia(privateKey);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @Post(':key')
  public postFile() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @Put(':key')
  public putFile() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @Patch(':key')
  public patchFile() {
    throw new MethodNotAllowedException('Method not allowed');
  }
}

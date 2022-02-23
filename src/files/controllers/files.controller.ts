import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  MethodNotAllowedException,
  HttpCode,
  Patch,
  Post,
  Put,
  Param,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from '../services/files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  /**
   * upload files
   * @param {Express.Multer.File} file
   * @returns
   */
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      return this.filesService.upload(file);
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
   * read files
   * @param {string} publicKey
   * @param {Response} res
   * @returns
   */
  @Get(':publicKey')
  async getFile(@Param('publicKey') publicKey: string, @Res() res) {
    try {
      const file = await this.filesService.getFile(publicKey);
      return file.pipe(res);
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
      return this.filesService.delete(privateKey);
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

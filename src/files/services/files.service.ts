import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { join } from 'path';
import 'dotenv/config';
const fs = require('fs');

@Injectable()
export class FilesService {
  private readonly password = 'oS1H+dKX1+OkXUu3jABIKqThi5/BJJtB0OCo';
  /**
   * @param token
   * @returns
   */
  async encodeToken(token) {
    const iv = randomBytes(16);
    const key = (await promisify(scrypt)(this.password, 'salt', 32)) as Buffer;
    const cipher = createCipheriv('aes-256-ctr', key, iv);
    const encryptedToken = Buffer.concat([
      cipher.update(JSON.stringify(token)),
      cipher.final(),
    ]);
    return encryptedToken.toString('hex') + 'ILN' + iv.toString('hex');
  }

  /**
   * @param {string} token
   * @returns
   */
  async decodeToken(token: string) {
    const tokenSplit = token.split('ILN');
    const iv = Buffer.from(tokenSplit[1], 'hex');
    const tokenBuff = Buffer.from(tokenSplit[0], 'hex');
    const key = (await promisify(scrypt)(this.password, 'salt', 32)) as Buffer;
    const decipher = createDecipheriv('aes-256-ctr', key, iv);
    const decrypted = Buffer.concat([
      decipher.update(tokenBuff),
      decipher.final(),
    ]);
    return JSON.parse(decrypted.toString());
  }

  /**
   * Upload File
   * @param {Express.Multer.File} file
   * @returns {Promise<Object>}
   */
  async upload(file: Express.Multer.File) {
    try {
      const privateKey = await this.encodeToken({ privateKey: file.filename });
      const publicKey = await this.encodeToken({ publicKey: file.filename });
      return {
        publicKey: publicKey,
        privateKey: privateKey,
      };
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Get File
   * @param {string} publicKey
   * @returns
   */
  async getFile(publicKey: string) {
    try {
      const decodePublic = await this.decodeToken(publicKey);
      if (!(decodePublic && decodePublic.hasOwnProperty('publicKey'))) {
        return Promise.reject(new BadRequestException('Invalid publicKey'));
      }
      const key = decodePublic.publicKey;
      const filePath = join(process.env.FOLDER, key);
      const isExist = fs.existsSync(filePath);
      if (!isExist)
        return Promise.reject(new NotFoundException('file does not exits'));
      return fs.createReadStream(filePath);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * delete File
   * @param {string} privateKey
   * @returns
   */
  async delete(privateKey: string) {
    try {
      const decodePrivate = await this.decodeToken(privateKey);
      if (!(decodePrivate && decodePrivate.hasOwnProperty('privateKey'))) {
        return Promise.reject(new BadRequestException('Invalid privateKey'));
      }
      const key = decodePrivate.privateKey;
      const filePath = join(process.env.FOLDER, key);
      const isExist = fs.existsSync(filePath);
      if (!isExist)
        return Promise.reject(new NotFoundException('file does not exits'));
      fs.unlinkSync(filePath);
      return {
        message: 'Successfully deleted the file.',
      };
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }
}

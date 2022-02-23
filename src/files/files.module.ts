import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FilesController } from './controllers/files.controller';
import { FilesService } from './services/files.service';
import { MulterModule } from '@nestjs/platform-express';
import 'dotenv/config';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dest: configService.get('FOLDER'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}

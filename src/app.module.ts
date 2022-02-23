import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpErrorFilter } from './common/http-error.filter';
import { LoggingInterceptor } from './common/logging.interceptor';
import { FilesModule } from './files/files.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { StorageModule } from './storage/storage.module';
import { MediaModule } from './media/media.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    FilesModule,
    StorageModule,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

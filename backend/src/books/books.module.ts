import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { MulterModule } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useClass: FileUploadService,
    }),
  ],
  controllers: [BooksController],
  providers: [BooksService, FileUploadService],
  exports: [BooksService],
})
export class BooksModule {}

import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { diskStorage, StorageEngine } from 'multer';
import { extname } from 'path';
import { Request } from 'express';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';

@Injectable()
export class FileUploadService implements MulterOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: this.getStorageConfig(),
      fileFilter: this.validateImageFile.bind(this),
      limits: {
        fileSize: this.getMaxFileSize(),
      },
    };
  }

  /**
   * Get multer storage configuration for file uploads
   */
  getStorageConfig(): StorageEngine {
    return diskStorage({
      destination: this.getUploadDestination(),
      filename: this.generateFileName,
    });
  }

  /**
   * Get upload destination path from config or use default
   */
  private getUploadDestination(): string {
    return this.configService.get<string>('UPLOAD_DESTINATION', './uploads/covers');
  }

  /**
   * Generate unique filename for uploaded file
   */
  private generateFileName(
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void,
  ): void {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }

  /**
   * Validate if uploaded file is an allowed image type
   */
  validateImageFile(
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ): void {
    const allowedImageTypes = /\.(jpg|jpeg|png|gif|webp)$/i;
    
    if (!file.originalname.match(allowedImageTypes)) {
      return callback(
        new BadRequestException('Only image files (jpg, jpeg, png, gif, webp) are allowed'),
        false
      );
    }
    
    callback(null, true);
  }

  /**
   * Get maximum allowed file size from config
   */
  getMaxFileSize(): number {
    return this.configService.get<number>('MAX_FILE_SIZE', 5 * 1024 * 1024); // Default 5MB
  }
}

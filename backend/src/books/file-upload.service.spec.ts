import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';

describe('FileUploadService', () => {
  let service: FileUploadService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileUploadService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, defaultValue?: any) => {
              const config = {
                UPLOAD_DESTINATION: './uploads/covers',
                MAX_FILE_SIZE: 5 * 1024 * 1024,
              };
              return config[key] || defaultValue;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<FileUploadService>(FileUploadService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getStorageConfig', () => {
    it('should return multer storage configuration', () => {
      const storage = service.getStorageConfig();
      expect(storage).toBeDefined();
    });
  });

  describe('getMaxFileSize', () => {
    it('should return max file size from config', () => {
      const maxSize = service.getMaxFileSize();
      expect(maxSize).toBe(5 * 1024 * 1024);
    });

    it('should return default value when config is not set', () => {
      jest.spyOn(configService, 'get').mockReturnValue(undefined);
      const maxSize = service.getMaxFileSize();
      expect(maxSize).toBe(5 * 1024 * 1024);
    });
  });

  describe('validateImageFile', () => {
    it('should accept valid image files', (done) => {
      const mockFile = {
        originalname: 'test.jpg',
      } as Express.Multer.File;

      service.validateImageFile(null, mockFile, (error, acceptFile) => {
        expect(error).toBeNull();
        expect(acceptFile).toBe(true);
        done();
      });
    });

    it('should accept webp files', (done) => {
      const mockFile = {
        originalname: 'test.webp',
      } as Express.Multer.File;

      service.validateImageFile(null, mockFile, (error, acceptFile) => {
        expect(error).toBeNull();
        expect(acceptFile).toBe(true);
        done();
      });
    });

    it('should reject non-image files', (done) => {
      const mockFile = {
        originalname: 'test.pdf',
      } as Express.Multer.File;

      service.validateImageFile(null, mockFile, (error, acceptFile) => {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toContain('Only image files');
        expect(acceptFile).toBe(false);
        done();
      });
    });

    it('should reject files without extension', (done) => {
      const mockFile = {
        originalname: 'testfile',
      } as Express.Multer.File;

      service.validateImageFile(null, mockFile, (error, acceptFile) => {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(acceptFile).toBe(false);
        done();
      });
    });
  });
});

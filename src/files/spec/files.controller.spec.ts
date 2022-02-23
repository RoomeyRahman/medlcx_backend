import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from '../controllers/files.controller';
import { FilesService } from '../services/files.service';
import { response } from 'express';

describe('ApiController', () => {
  let controller: FilesController;
  let service: FilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [
        {
          provide: FilesService,
          useValue: {
            uploadFile: jest.fn(() => []),
            getFile: jest.fn(() => []),
            removeFile: jest.fn(() => []),
          },
        },
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
    controller = module.get<FilesController>(FilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

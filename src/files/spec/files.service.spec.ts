import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from '../services/files.service';
const fs = require('fs');

describe('FilesService', () => {
  let service: FilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilesService],
    }).compile();

    service = module.get<FilesService>(FilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Read file', async () => {
    jest.spyOn(service, 'getFile');
    const publicKey =
      'ae0c114c6d1979c4aeb264d73c2b31b09f4f6cdf4608fa58c0dfa1213b7100cea3fde13ff8cd418f3e1a9dba391f74edILN61b76e420d64ec5893855be58c1908b3';
    const file = await service.getFile(publicKey);
    expect(typeof file).toBe('object');
  });

  it('Delete file', async () => {
    jest.spyOn(service, 'delete');
    const privateKey =
      'c9db54f197d5377e332626e76318ba9db1169fd51bf28d281121811e5778f9f4861d1412d377eed1855d4b46093c408ec2ILNacee169eef8aafd5215b4bcbd8bd7fd1';
    const file = await service.delete(privateKey);
    expect(typeof file).toBe('object');
  });
});

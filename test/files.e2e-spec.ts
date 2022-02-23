import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { FilesModule } from '../src/files/files.module';
import { FilesService } from '../src/files/services/files.service';

describe('ApiController (e2e)', () => {
  let app: INestApplication;
  let service: FilesService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [FilesModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    service = moduleFixture.get<FilesService>(FilesService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/files (POST)', () => {
    return request(app.getHttpServer())
      .post('/files')
      .set('Content-Type', 'multipart/form-data')
      .attach(
        'file',
        'D:\\OfficeProjects\\ilafe\\ilafe-frontend-v2\\public\\sample\\sample-21.png',
      )
      .expect(201);
  });

  it('/files/:publicKey (GET)', () => {
    return request(app.getHttpServer())
      .get(
        '/files/19c91a44665b3bbc688bff1fbba802fd6d462fe2fb597167efb38b111be539abe5dfd39b5dc4a2d3a21a9a1f5b23e7e0ILNd4878745b8969d24bd65a950a0ed6bb3',
      )
      .expect(200);
  });

  it('/files/:privateKey (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(
        '/files/e39c9c9ed63b67debe838d1598802f83e5f396e23a20f0ecaa09fd74ab0ff6a2011d0aef5a0e1546bc632cae5bd2242a94ILNa0b8fdcdd18a075af1fc3db863355bc5',
      )
      .expect(204);
  });
});

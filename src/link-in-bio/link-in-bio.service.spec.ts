import { Test, TestingModule } from '@nestjs/testing';
import { LinkInBioService } from './link-in-bio.service';

describe('LinkInBioService', () => {
  let service: LinkInBioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LinkInBioService],
    }).compile();

    service = module.get<LinkInBioService>(LinkInBioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

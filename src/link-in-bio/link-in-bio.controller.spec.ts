import { Test, TestingModule } from '@nestjs/testing';
import { LinkInBioController } from './link-in-bio.controller';

describe('LinkInBioController', () => {
  let controller: LinkInBioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LinkInBioController],
    }).compile();

    controller = module.get<LinkInBioController>(LinkInBioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

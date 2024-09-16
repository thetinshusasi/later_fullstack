import { Module } from '@nestjs/common';
import { LinkInBioController } from './link-in-bio.controller';
import { LinkInBioService } from './link-in-bio.service';

@Module({
  controllers: [LinkInBioController],
  providers: [LinkInBioService]
})
export class LinkInBioModule {}

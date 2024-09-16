import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { LinkInBioModule } from './link-in-bio/link-in-bio.module';


@Module({


  imports: [UserModule, LinkInBioModule]
})
export class AppModule { }

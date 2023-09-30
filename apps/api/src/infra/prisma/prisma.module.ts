import { Global, Module } from '@nestjs/common';
import { EnvModule } from '#api/common/service/env/env.module';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  imports: [EnvModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}

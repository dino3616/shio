import { Inject, Injectable, Logger, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import type { LogLevel } from '@prisma/client/runtime/library';
import { match } from 'ts-pattern';
import { EnvService } from '@/common/service/env/env.service';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor(@Inject(EnvService) readonly envService: EnvService) {
    const log = match<(typeof envService)['NodeEnv'], LogLevel[]>(envService.NodeEnv)
      .with('development', () => ['query', 'info', 'warn', 'error'])
      .with('production', () => ['query', 'info', 'warn', 'error'])
      .with('test', () => ['info', 'warn', 'error'])
      .otherwise(() => ['query', 'info', 'warn', 'error']);

    super({ log });

    this.logger.debug(`${PrismaService.name} constructed`);
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

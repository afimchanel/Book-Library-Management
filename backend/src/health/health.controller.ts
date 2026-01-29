import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, MemoryHealthIndicator, DiskHealthIndicator } from '@nestjs/terminus';
import { TypeOrmHealthIndicator } from './indicators/typeorm.health';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // Database check
      () => this.db.isHealthy('database'),
      // Memory heap check (max 300MB)
      () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024),
      // Memory RSS check (max 500MB)  
      () => this.memory.checkRSS('memory_rss', 500 * 1024 * 1024),
      // Disk check (max 90% usage)
      () => this.disk.checkStorage('disk', { 
        path: process.platform === 'win32' ? 'C:\\' : '/',
        thresholdPercent: 0.9,
      }),
    ]);
  }

  @Get('live')
  @HealthCheck()
  liveness() {
    return this.health.check([]);
  }

  @Get('ready')
  @HealthCheck()
  readiness() {
    return this.health.check([
      () => this.db.isHealthy('database'),
    ]);
  }
}

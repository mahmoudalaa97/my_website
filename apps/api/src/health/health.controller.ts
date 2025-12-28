import { Controller, Get } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('health')
export class HealthController {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  @Get()
  async check() {
    const status = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks: {
        database: 'unknown',
      },
    };

    // Check database connection
    try {
      await this.dataSource.query('SELECT 1');
      status.checks.database = 'ok';
    } catch (error) {
      status.checks.database = 'error';
      status.status = 'degraded';
    }

    return status;
  }

  @Get('live')
  live() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('ready')
  async ready() {
    try {
      await this.dataSource.query('SELECT 1');
      return { status: 'ok', timestamp: new Date().toISOString() };
    } catch (error) {
      return { status: 'error', timestamp: new Date().toISOString() };
    }
  }
}


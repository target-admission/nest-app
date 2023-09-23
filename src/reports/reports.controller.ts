import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}
  @Get('dashboard/users-graph')
  @ApiQuery({
    name: 'start_date',
    required: true,
    description: 'Start date',
  })
  @ApiQuery({
    name: 'end_date',
    required: true,
    description: 'End date',
  })
  async getUserReports(
    @Query('start_date') start_date?: string,
    @Query('end_date') end_date?: string,
  ) {
    return this.reportsService.getUserReports({
      start_date,
      end_date,
    });
  }

  @Get('dashboard/stats')
  @ApiQuery({
    name: 'start_date',
    required: true,
    description: 'Start date',
  })
  @ApiQuery({
    name: 'end_date',
    required: true,
    description: 'End date',
  })
  async getDashboardStats(
    @Query('start_date') start_date?: string,
    @Query('end_date') end_date?: string,
  ) {
    return this.reportsService.getDashboardStats({
      start_date,
      end_date,
    });
  }

  @Get('users/stats')
  @ApiQuery({
    name: 'start_date',
    required: true,
    description: 'Start date',
  })
  @ApiQuery({
    name: 'end_date',
    required: true,
    description: 'End date',
  })
  async getUsersStats(
    @Query('start_date') start_date?: string,
    @Query('end_date') end_date?: string,
  ) {
    return this.reportsService.getUsersStats({
      start_date,
      end_date,
    });
  }
}

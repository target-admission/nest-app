import { Controller, Get, Put, Param, Delete, Query } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  IPaginationQuery,
  LimitQuery,
  PageQuery,
  SearchQuery,
  ShowParanoidQuery,
  SortQuery,
} from 'src/utils/Pagination/dto/query.dto';

@ApiTags('Sessions')
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get()
  // Filter Queries
  @ApiQuery({
    name: 'employee',
    type: 'number',
    required: false,
  })
  // Pagination Queries
  @ApiQuery(ShowParanoidQuery)
  @ApiQuery(SortQuery)
  @ApiQuery(PageQuery)
  @ApiQuery(LimitQuery)
  @ApiQuery(SearchQuery)
  findAll(
    @Query() query: IPaginationQuery,
    @Query('employee') employee?: number,
  ) {
    return this.sessionsService.findAll(query, employee);
  }

  @Put(':id')
  forceSessionOut(@Param('id') id: string) {
    return this.sessionsService.forceSessionOut(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sessionsService.remove(+id);
  }
}

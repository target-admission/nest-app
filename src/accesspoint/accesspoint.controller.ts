import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
} from '@nestjs/common';
import { AccesspointService } from './accesspoint.service';
import { CreateAccesspointDto } from './dto/create-accesspoint.dto';
import { UpdateAccesspointDto } from './dto/update-accesspoint.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  IPaginationQuery,
  LimitQuery,
  PageQuery,
  SearchQuery,
  ShowParanoidQuery,
  SortQuery,
} from 'src/utils/Pagination/dto/query.dto';

@ApiTags('Access Points')
@Controller('accesspoint')
export class AccesspointController {
  constructor(private readonly accesspointService: AccesspointService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createAccesspointDto: CreateAccesspointDto) {
    return this.accesspointService.create(createAccesspointDto);
  }

  @Get()
  // Pagination Queries
  @ApiQuery(ShowParanoidQuery)
  @ApiQuery(SortQuery)
  @ApiQuery(PageQuery)
  @ApiQuery(LimitQuery)
  @ApiQuery(SearchQuery)
  findAll(@Query() query: IPaginationQuery) {
    return this.accesspointService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accesspointService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAccesspointDto: UpdateAccesspointDto,
  ) {
    return this.accesspointService.update(+id, updateAccesspointDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accesspointService.remove(+id);
  }
}

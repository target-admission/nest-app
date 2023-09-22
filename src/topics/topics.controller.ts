import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Query,
} from '@nestjs/common';
import { TopicsService } from './topics.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import {
  IPaginationQuery,
  LimitQuery,
  PageQuery,
  SearchQuery,
  ShowParanoidQuery,
  SortQuery,
  TrashQuery,
} from 'src/utils/Pagination/dto/query.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Topics')
@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createTopicDto: CreateTopicDto) {
    return this.topicsService.create(createTopicDto);
  }

  @Get()
  @ApiQuery({
    name: 'chapter_id',
    type: 'number',
    required: false,
  })
  @ApiQuery(TrashQuery)
  @ApiQuery(ShowParanoidQuery)
  @ApiQuery(SortQuery)
  @ApiQuery(PageQuery)
  @ApiQuery(LimitQuery)
  @ApiQuery(SearchQuery)
  findAll(
    @Query() query: IPaginationQuery,
    @Query('chapter_id') chapter_id?: number,
  ) {
    return this.topicsService.findAll(query, chapter_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.topicsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTopicDto: UpdateTopicDto) {
    return this.topicsService.update(+id, updateTopicDto);
  }

  @Delete(':id')
  @ApiQuery({
    name: 'permanent',
    type: 'boolean',
    required: false,
  })
  @ApiQuery({
    name: 'restore',
    type: 'boolean',
    required: false,
  })
  remove(
    @Param('id') id: string,
    @Query('permanent') permanent?: boolean,
    @Query('restore') restore?: boolean,
  ) {
    return this.topicsService.remove(+id, permanent, restore);
  }
}

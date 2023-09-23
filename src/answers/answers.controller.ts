import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AnswersService } from './answers.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
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

@ApiTags('Answers')
@Controller('answers')
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  @Post()
  create(@Body() createAnswerDto: CreateAnswerDto) {
    return this.answersService.create(createAnswerDto);
  }

  @Get()
  @ApiQuery({
    name: 'question_id',
    type: 'number',
    required: false,
  })

  // Pagination Queries
  @ApiQuery(TrashQuery)
  @ApiQuery(ShowParanoidQuery)
  @ApiQuery(SortQuery)
  @ApiQuery(PageQuery)
  @ApiQuery(LimitQuery)
  @ApiQuery(SearchQuery)
  findAll(
    @Query() query: IPaginationQuery,
    @Query('question_id') question_id?: number,
  ) {
    return this.answersService.findAll(query, question_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.answersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAnswerDto: UpdateAnswerDto) {
    return this.answersService.update(+id, updateAnswerDto);
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
    return this.answersService.remove(+id, permanent, restore);
  }
}

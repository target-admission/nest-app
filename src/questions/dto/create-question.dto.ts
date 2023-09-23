import { ApiProperty } from '@nestjs/swagger';
// import { CreateAnswerDto } from 'src/answers/dto/create-answer.dto';

export class CreateQuestionDto {
  @ApiProperty({
    required: true,
  })
  'question': string;

  @ApiProperty()
  'explaination': string;

  @ApiProperty({
    default: 'MCQ',
    enum: ['MCQ', 'WRITTEN'],
  })
  'type': string;

  @ApiProperty()
  solution_id: number;

  @ApiProperty()
  topic_id: number;

  @ApiProperty()
  exam_id: number;

  @ApiProperty()
  category_id: number;

  // @ApiProperty({
  //   isArray: true,
  //   type: CreateAnswerDto,
  // })
  // answers: {
  //   title?: string;
  //   attachment?: string;
  //   question_id: number;
  // }[];
}

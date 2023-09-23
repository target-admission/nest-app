import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateQuestionDto } from './create-question.dto';

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {
  @ApiProperty()
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
  category_id: number;
}

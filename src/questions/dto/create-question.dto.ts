import { ApiProperty } from '@nestjs/swagger';

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
}

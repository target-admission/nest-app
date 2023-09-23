import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateAnswerDto } from './create-answer.dto';

export class UpdateAnswerDto extends PartialType(CreateAnswerDto) {
  @ApiProperty()
  title: string;

  @ApiProperty()
  attachment: string;

  @ApiProperty()
  question_id: number;
}

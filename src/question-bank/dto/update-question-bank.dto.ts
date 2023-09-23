import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateQuestionBankDto } from './create-question-bank.dto';

export class UpdateQuestionBankDto extends PartialType(CreateQuestionBankDto) {
  @ApiProperty()
  'name': string;

  @ApiProperty()
  'description': string;

  @ApiProperty()
  'cover_image_url': string;
}

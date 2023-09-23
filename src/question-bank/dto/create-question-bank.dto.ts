import { ApiProperty } from '@nestjs/swagger';

export class CreateQuestionBankDto {
  @ApiProperty({
    required: true,
  })
  'name': string;

  @ApiProperty()
  'description': string;

  @ApiProperty()
  'cover_image_url': string;
}

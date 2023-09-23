import { ApiProperty } from '@nestjs/swagger';

export class CreateAnswerDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  attachment: string;

  @ApiProperty({
    required: true,
  })
  question_id: number;
}

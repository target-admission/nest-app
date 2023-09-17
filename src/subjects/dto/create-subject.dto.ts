import { ApiProperty } from '@nestjs/swagger';

export class CreateSubjectDto {
  @ApiProperty({
    required: true,
  })
  'subject_name': string;

  @ApiProperty()
  'description': string;

  @ApiProperty()
  'cover_picture': string;
}

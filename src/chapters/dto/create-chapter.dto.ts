import { ApiProperty } from '@nestjs/swagger';

export class CreateChapterDto {
  @ApiProperty({
    required: true,
  })
  'name': string;

  @ApiProperty()
  'description': string;

  @ApiProperty()
  'subject_id': number;
}

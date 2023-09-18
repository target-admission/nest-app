import { ApiProperty } from '@nestjs/swagger';

export class CreateChapterDto {
  @ApiProperty({
    required: true,
  })
  chapter_name: string;

  @ApiProperty()
  description: string;
}

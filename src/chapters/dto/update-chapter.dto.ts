import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateChapterDto } from './create-chapter.dto';

export class UpdateChapterDto extends PartialType(CreateChapterDto) {
  @ApiProperty({
    required: true,
  })
  chapter_name: string;

  @ApiProperty()
  description: string;
}

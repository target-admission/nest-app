import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateChapterDto } from './create-chapter.dto';

export class UpdateChapterDto extends PartialType(CreateChapterDto) {
  @ApiProperty()
  'name': string;

  @ApiProperty()
  'description': string;

  @ApiProperty()
  'subject_id': number;
}

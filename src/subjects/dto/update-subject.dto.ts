import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSubjectDto } from './create-subject.dto';

export class UpdateSubjectDto extends PartialType(CreateSubjectDto) {
  @ApiProperty()
  'subject_name': string;

  @ApiProperty()
  'description': string;

  @ApiProperty()
  'cover_picture': string;
}

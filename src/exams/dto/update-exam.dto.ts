import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateExamDto } from './create-exam.dto';

export class UpdateExamDto extends PartialType(CreateExamDto) {
  @ApiProperty()
  'name': string;

  @ApiProperty()
  'description': string;

  @ApiProperty()
  'duration': number;

  @ApiProperty()
  'negative_mark': number;

  @ApiProperty({
    enum: ['model', 'quick', 'mock', 'user-defined'],
  })
  'type': string;

  @ApiProperty({
    enum: ['premium', 'free'],
  })
  'attendee_type': string;

  @ApiProperty({
    default: false,
  })
  'is_archivable': boolean;

  @ApiProperty()
  'live_datetime': Date;

  @ApiProperty()
  'question_bank_id': number;
}

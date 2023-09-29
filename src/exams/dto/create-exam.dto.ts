import { ApiProperty } from '@nestjs/swagger';

export class CreateExamDto {
  @ApiProperty({
    required: true,
  })
  'name': string;

  @ApiProperty()
  'description': string;

  @ApiProperty()
  'duration': number;

  @ApiProperty()
  'negative_mark': number;

  @ApiProperty()
  'positive_mark': number;

  @ApiProperty({
    required: true,
    enum: ['model', 'quick', 'mock', 'user-defined'],
  })
  'type': string;

  @ApiProperty({
    required: true,
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

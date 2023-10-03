import { ApiProperty } from '@nestjs/swagger';

export class CreatePackageDto {
  @ApiProperty({
    required: true,
  })
  'title': string;

  @ApiProperty()
  'description': string;

  @ApiProperty()
  'price': number;

  @ApiProperty()
  'cover_pic': string;

  @ApiProperty({
    default: null,
    required: false,
  })
  'start_date': Date;

  @ApiProperty({
    default: null,
    required: false,
  })
  'end_date': Date;
}

import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreatePackageDto } from './create-package.dto';

export class UpdatePackageDto extends PartialType(CreatePackageDto) {
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

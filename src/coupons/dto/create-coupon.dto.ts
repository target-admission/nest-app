import { ApiProperty } from '@nestjs/swagger';

export class CreateCouponDto {
  @ApiProperty({
    required: true,
  })
  'title': string;

  @ApiProperty()
  'description': string;

  @ApiProperty()
  'amount': number;

  @ApiProperty()
  'max_ussage': number;

  @ApiProperty({
    required: true,
    enum: ['amount', 'percentage'],
  })
  'type': string;
}

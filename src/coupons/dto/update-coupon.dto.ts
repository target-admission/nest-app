import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCouponDto } from './create-coupon.dto';

export class UpdateCouponDto extends PartialType(CreateCouponDto) {
  @ApiProperty({
    required: true,
  })
  'title': string;

  @ApiProperty()
  'description': string;

  @ApiProperty()
  'amount': number;

  @ApiProperty()
  'max_usage': number;

  @ApiProperty({
    required: true,
    enum: ['amount', 'percentage'],
  })
  'type': string;
}

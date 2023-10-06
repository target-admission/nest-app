import { ApiProperty } from '@nestjs/swagger';

export class UpdateWalletDto {
  @ApiProperty({
    required: true,
    enum: ['in', 'out'],
  })
  'type': string;

  @ApiProperty()
  'amount': number;

  @ApiProperty()
  'message': string;
}

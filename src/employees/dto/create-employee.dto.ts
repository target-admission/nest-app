import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  gender?: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  display_picture: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  dob: Date;

  @ApiProperty()
  hired_date: Date;

  @ApiProperty()
  work_hour: number;

  @ApiProperty()
  salary: number;

  @ApiProperty()
  bank: string;

  @ApiProperty()
  address: string;
}

import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyDto } from './dto/verify.dto';
import { ResetPassDto } from './dto/reset-pass.dto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const geoip = require('geoip-lite');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');

import { JwtService } from '@nestjs/jwt';
import { Op } from 'sequelize';
import { RegisterDto } from './dto/register.dto';
import User from 'src/users/entities/user.entity';
import UserSession from 'src/users-sessions/entities/user-session.entity';
import { nanoid } from 'nanoid';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  async create_username(name: string) {
    const id = (await User.findOne({
      where: { username: name },
      paranoid: false,
    }))
      ? `.${nanoid(3)}`
      : '';

    const username = `${name.toLowerCase().replace(/\s/g, '')}${id}`;
    while (await User.findOne({ where: { username } })) {
      return this.create_username(name);
    }
    return username;
  }

  async signup(registerDto: RegisterDto) {
    try {
      await User.create(
        {
          ...registerDto,
          username: await this.create_username(registerDto.last_name),
        },
        {
          fields: [
            'first_name',
            'last_name',
            'username',
            'password',
            'gender',
            'email',
            'phone',
            'dob',
            'address',
          ],
        },
      );
      return {
        message: `An OTP sent to ${registerDto.phone}. Please verify to continue.`,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Failed to create employee',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }

  // Store Session
  async storeSession(jwt: string, id: number, ip?: string) {
    // find geo location for ip address
    const geo = geoip.lookup(ip);
    await UserSession.create({
      jwt,
      user_id: id,
      address_details:
        Array.from(new Set([geo?.city, geo?.country]))?.join(', ') || null,
      device_details: null,
      user_agent: null,
      ip_address: ip,
      latitude: geo?.ll?.[0] || null,
      longitude: geo?.ll?.[1] || null,
      last_login: new Date(),
    });
  }

  // Login Employee
  async login(loginDto: LoginDto, ip: string) {
    const employee = await User.findOne({
      where: {
        phone: loginDto.phone,
      },
      paranoid: false,
    });

    // Search if employee does exists
    if (!employee)
      throw new NotFoundException('No user found with the phone number.');

    // If account is archived
    if (employee.deleted_at)
      throw new UnauthorizedException(
        `Your account was archived on ${employee.deleted_at.toDateString()}. Contact with administration.`,
      );

    // check if employee is suspended
    if (!employee.is_active)
      throw new UnauthorizedException(
        'Your account is temporarily suspended. Contact with administration.',
      );

    // Compare password
    if (
      !(await bcrypt.compare(
        loginDto.password,
        employee.getDataValue('password'),
      ))
    )
      throw new UnauthorizedException('Incorrect password! Please try again.');

    // Check total device the employee is signed in
    if (
      (await employee.$count('sessions', {
        where: {
          logged_out_at: {
            [Op.eq]: null,
          },
        },
      })) >= employee.getDataValue('max_session')
    )
      throw new UnauthorizedException(
        'You have already reached the maximum logged in devices.',
      );

    // Create jwt token
    const jwt = await this.jwtService.signAsync(
      { sub: employee.id, username: employee.username },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRE,
      },
    );

    // Store session and device
    await this.storeSession(jwt, employee.id, ip);

    return {
      jwt,
      message: `Welcome ${employee.first_name} ${employee.last_name}!`,
    };
  }

  // Validate User and Get Information
  validate(user: any) {
    return user;
  }

  verify(verifyDto: VerifyDto) {
    console.log(verifyDto);
    return 'This action adds a new auth';
  }

  // Update employee information
  async update(user: any, updateAuthDto: UpdateAuthDto) {
    // Find employee
    const employee = await User.findByPk(user.id);

    // Check if employee exists
    if (!employee)
      throw new UnauthorizedException(
        `Your account was archived. Contact with administration.`,
      );

    // Update info
    employee.update(updateAuthDto);
    employee.save();

    return {
      message: `Information updated successfully.`,
    };
  }

  async resetpass(user: any, resetPassDto: ResetPassDto) {
    // Find employee
    const employee = await User.findByPk(user.id);

    // Compare password
    if (
      !(await bcrypt.compare(
        resetPassDto.current_password,
        employee.getDataValue('password'),
      ))
    )
      throw new UnauthorizedException('Incorrect password! Please try again.');

    employee.password = resetPassDto.new_password;
    employee.save();

    return {
      message: `Password updated successfully.`,
    };
  }

  // Signout
  async signout(jwt_token: string) {
    // find session
    const session = await UserSession.findOne({
      where: {
        jwt: jwt_token,
      },
    });

    // check if already logged out
    if (session?.logged_out_at !== null)
      throw new UnauthorizedException('This session is already signed out.');

    // logout session
    session.logged_out_at = new Date();
    session.save();

    return {
      message: `Logged out successfully.`,
    };
  }
}

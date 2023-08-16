import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import Employee from './entities/employee.entity';
import Pagination from 'src/utils/Pagination';
import Role from 'src/roles/entities/role.entity';
import { Op } from 'sequelize';
import { IPaginationQuery } from 'src/utils/Pagination/dto/query.dto';

@Injectable()
export class EmployeesService {
  async create(data: CreateEmployeeDto) {
    try {
      await Employee.create(
        {
          ...data,
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
            'hired_date',
            'work_hour',
            'salary',
            'bank',
            'address',
          ],
        },
      );
      return {
        statusCode: 201,
        message: `${data.first_name} registered as an employee successfully`,
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

  async findAll(query: IPaginationQuery, role?: number) {
    const pagination = new Pagination(query);

    // get query props
    const { limit, offset, paranoid } = pagination.get_attributes();

    // get search object
    const search_ops = pagination.get_search_ops([
      'first_name',
      'last_name',
      'username',
      'phone',
    ]);

    // get filter props
    const filters = pagination.format_filters({
      role_id: role,
    });

    return pagination.arrange(
      await Employee.findAndCountAll({
        where: {
          [Op.or]: search_ops,
          ...filters,
        },
        include: {
          model: Role,
          as: 'role',
          attributes: ['id', 'name'],
        },
        attributes: {
          exclude: ['password', 'role_id'],
        },
        limit,
        offset,
        paranoid,
      }),
    );
  }

  async findOne(id: number) {
    const employee = await Employee.findByPk(id, {
      attributes: {
        exclude: ['password'],
      },
    });

    if (!employee) {
      throw new NotFoundException(`Employee not found`);
    }

    return {
      message: 'Information fetched successfully',
      data: employee,
    };
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    const {
      first_name,
      last_name,
      username,
      gender,
      email,
      dob,
      hired_date,
      role_id,
      work_hour,
      salary,
      bank,
      address,
    } = updateEmployeeDto;

    const employee = await Employee.findByPk(id, {});

    if (!employee) {
      throw new NotFoundException(`Employee not found`);
    }

    await employee.update({
      first_name,
      last_name,
      username,
      gender,
      email,
      dob,
      hired_date,
      work_hour,
      salary,
      role_id,
      bank,
      address,
    });

    return {
      message: 'Information updated successfully',
    };
  }

  public async activeInactive(id: number) {
    {
      const employee = await Employee.findByPk(id, {});

      if (!employee) {
        throw new NotFoundException('No employee found!');
      }

      await employee.update({
        is_active: !employee.is_active,
      });
      await employee.save();

      return {
        message: `Employee ${
          !employee.is_active ? 'suspended' : 'activated'
        } successfully`,
      };
    }
  }

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }
}

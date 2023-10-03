import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import Package from './entities/package.entity';
import { IPaginationQuery } from 'src/utils/Pagination/dto/query.dto';
import Pagination from 'src/utils/Pagination';

@Injectable()
export class PackagesService {
  async create(createPackageDto: CreatePackageDto) {
    const { title, description, price, start_date, end_date } =
      createPackageDto;

    await Package.create({
      title,
      description,
      price,
      start_date,
      end_date,
    });
    return {
      statusCode: 201,
      message: `${title} registered as a Package successfully`,
    };
  }

  async findAll(query: IPaginationQuery, is_active?: boolean) {
    const pagination = new Pagination(query);
    const { limit, offset, paranoid, trash_query, order } =
      pagination.get_attributes();

    const filters = pagination.format_filters({
      is_active: pagination.toBoolean(is_active),
    });
    return pagination.arrange(
      await Package.findAndCountAll({
        where: {
          ...filters,
          ...trash_query,
        },
        order,
        paranoid,
        limit,
        offset,
      }),
    );
  }

  async findOne(id: number) {
    const package1 = await Package.findByPk(id, {
      paranoid: false,
    });

    if (!package1) {
      throw new NotFoundException(`Package not found`);
    }
    return {
      message: 'Package fetched successfully',
      data: package1,
    };
  }

  async update(id: number, updatePackageDto: UpdatePackageDto) {
    const { title, description, price, start_date, end_date } =
      updatePackageDto;

    const package1 = await Package.findByPk(id);
    if (!package1) {
      throw new NotFoundException(`Package not found`);
    }
    await package1.update({
      title,
      description,
      price,
      start_date,
      end_date,
    });
    return {
      message: 'Package Updated Successfully',
    };
  }

  async remove(id: number, permanent?: boolean, restore?: boolean) {
    const package1 = await Package.findByPk(id, {
      paranoid: false,
    });

    if (!package1) {
      throw new NotFoundException(`Package not found`);
    }

    if (permanent) {
      await package1.destroy({ force: true });
      return {
        message: 'Package deleted permanently',
      };
    } else if (restore) {
      if (package1.deleted_at === null) {
        throw new BadRequestException(`Package not deleted`);
      }
      package1.restore();
      return {
        message: 'Package restored successfully',
      };
    }

    await package1.destroy();

    return {
      message: 'Package deleted successfully',
    };
  }
}

import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  AllowNull,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  Default,
} from 'sequelize-typescript';

@Table({
  tableName: 'package',
})
class Package extends Model<Package> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  'id': number;

  @AllowNull(false)
  @Column
  'title': string;

  @AllowNull
  @Column
  'description': string;

  @AllowNull(false)
  @Column(DataType.FLOAT)
  'price': number;

  @AllowNull
  @Column
  'cover_pic': string;

  @Default(true)
  @Column
  'is_active': boolean;

  @AllowNull
  @Default(null)
  @Column
  'start_date': Date;

  @AllowNull
  @Default(null)
  @Column
  'end_date': Date;

  @CreatedAt
  @Column({ field: 'created_at' })
  'created_at': Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  'updated_at': Date;

  @DeletedAt
  @Column({ field: 'deleted_at' })
  'deleted_at': Date;
}

export default Package;

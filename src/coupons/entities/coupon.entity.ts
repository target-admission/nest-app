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
  HasMany,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import User from 'src/users/entities/user.entity';

@Table({
  tableName: 'coupon',
})
class Coupon extends Model<Coupon> {
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
  'amount': number;

  @AllowNull(false)
  @Column(DataType.ENUM('amount', 'percentage'))
  'type': string;

  @HasMany(() => User)
  'users': User[];

  @ForeignKey(() => User)
  @AllowNull
  @Column(DataType.BIGINT)
  'user_id': number;

  @BelongsTo(() => User)
  'user': User;

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

export default Coupon;

import {
  Model,
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
  DataType,
  AllowNull,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import User from 'src/users/entities/user.entity';

@Table({
  tableName: 'wallet',
})
class Wallet extends Model<Wallet> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  'id': number;

  @AllowNull
  @Column
  'message': string;

  @AllowNull(false)
  @Column(DataType.FLOAT)
  'amount': number;

  @AllowNull(false)
  @Column(DataType.ENUM('in', 'out'))
  'type': string;

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

export default Wallet;

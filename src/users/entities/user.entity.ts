import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  AllowNull,
  IsEmail,
  Default,
  BeforeUpdate,
  BeforeCreate,
  Unique,
  HasMany,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');
import Session from 'src/users-sessions/entities/user-session.entity';

@Table({
  tableName: 'user',
})
class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  'id': number;

  @Column
  'first_name': string;

  @Column
  'last_name': string;

  @Unique
  @Column
  'username': string;

  @AllowNull
  @Column
  'password': string;

  @Column(DataType.ENUM('Male', 'Female', 'Non Binary'))
  'gender': string;

  @AllowNull
  @Column
  'display_picture': string;

  @AllowNull
  @IsEmail
  @Column
  'email': string;

  @Unique
  @Column
  'phone': string;

  @Column
  'dob': Date;

  @AllowNull
  @Column
  'address': string;

  @AllowNull
  @Column
  'referral_code': string;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column(DataType.BIGINT)
  'referred_by_id': number;

  @BelongsTo(() => User)
  'referred_by': User;

  @HasMany(() => User, {
    foreignKey: 'referred_by_id',
    as: 'referred_to',
  })
  'referred_to': User[];

  @Default(4)
  @Column
  'max_session': number;

  @Default(true)
  @Column
  'is_active': boolean;

  @AllowNull
  @Column
  'verified_at': Date;

  // Relations

  @HasMany(() => Session)
  'sessions': Session[];

  @CreatedAt
  @Column({ field: 'created_at' })
  'created_at': Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  'updated_at': Date;

  @DeletedAt
  @Column({ field: 'deleted_at' })
  'deleted_at': Date;

  //hooks
  @BeforeUpdate
  @BeforeCreate
  static async hashPassword(instance: User) {
    if (instance.changed('password')) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(instance.password, salt);
      instance.password = hashedPassword;
    }
  }
}

export default User;

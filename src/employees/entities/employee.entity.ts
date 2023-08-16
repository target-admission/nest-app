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
  ForeignKey,
  BelongsTo,
  BeforeUpdate,
  BeforeCreate,
  Unique,
  HasMany,
} from 'sequelize-typescript';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');
import Role from 'src/roles/entities/role.entity';
import Session from 'src/sessions/entities/session.entity';

@Table({
  tableName: 'employee',
})
class Employee extends Model<Employee> {
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

  @Column
  'hired_date': Date;

  @Default(8)
  @Column
  'work_hour': number;

  @Default(0)
  @Column
  'salary': number;

  @Column
  'bank': string;

  @AllowNull
  @Column
  'address': string;

  @Default(2)
  @Column
  'max_session': number;

  @Default(true)
  @Column
  'is_active': boolean;

  @AllowNull
  @Column
  'verified_at': Date;

  // Relations
  @ForeignKey(() => Role)
  @AllowNull
  @Column(DataType.BIGINT)
  'role_id': number;

  @BelongsTo(() => Role)
  'role': Role;

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
  static async hashPassword(instance: Employee) {
    if (instance.changed('password')) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(instance.password, salt);
      instance.password = hashedPassword;
    }
  }
}

export default Employee;

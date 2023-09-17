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
} from 'sequelize-typescript';

@Table({
  tableName: 'subject',
})
class Subject extends Model<Subject> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  'id': number;

  @Column
  'subject_name': string;

  @AllowNull
  @Column
  'description': string;

  @AllowNull
  @Column
  'cover_picture': string;

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

export default Subject;

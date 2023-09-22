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
} from 'sequelize-typescript';
import Chapter from 'src/chapters/entities/chapter.entity';

@Table({
  tableName: 'subject',
})
class Subject extends Model<Subject> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  'id': number;

  @Column
  'name': string;

  @AllowNull
  @Column
  'description': string;

  @AllowNull
  @Column
  'cover_picture': string;

  @HasMany(() => Chapter)
  'chapters': Chapter[];

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

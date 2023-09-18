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
import Subject from 'src/subjects/entities/subject.entity';

@Table({
  tableName: 'chapter',
})
class Chapter extends Model<Chapter> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  'id': number;

  @Column
  'chapter_name': string;

  @AllowNull
  @Column
  'description': string;

  @ForeignKey(() => Subject)
  @AllowNull
  @Column(DataType.BIGINT)
  'subject_id': number;

  @BelongsTo(() => Subject)
  'subject': Subject;

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

export default Chapter;

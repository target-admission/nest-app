import {
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
  DataType,
  DeletedAt,
  UpdatedAt,
  CreatedAt,
  BelongsTo,
  AllowNull,
  ForeignKey,
  Model,
  HasMany,
} from 'sequelize-typescript';
import Chapter from 'src/chapters/entities/chapter.entity';
import Question from 'src/questions/entities/question.entity';

@Table({
  tableName: 'topic',
})
class Topic extends Model<Topic> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  'id': number;

  @Column
  'name': string;

  @AllowNull
  @Column
  'description': string;

  @ForeignKey(() => Chapter)
  @AllowNull
  @Column(DataType.BIGINT)
  'chapter_id': number;

  @BelongsTo(() => Chapter)
  'chapter': Chapter;

  @HasMany(() => Question)
  'questions': Question[];

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

export default Topic;

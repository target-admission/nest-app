import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import Question from 'src/questions/entities/question.entity';

@Table({
  tableName: 'answer',
})
class Answer extends Model<Answer> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  'id': number;

  @Column
  'title': string;

  @AllowNull
  @Column
  'attachment': string;

  @ForeignKey(() => Question)
  @AllowNull(false)
  @Column(DataType.BIGINT)
  'question_id': number;

  @BelongsTo(() => Question)
  'question': Question;

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

export default Answer;

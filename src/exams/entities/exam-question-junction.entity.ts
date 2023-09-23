import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';
import Exam from './exam.entity';
import Question from 'src/questions/entities/question.entity';

@Table({
  tableName: 'exam_question_junction',
})
class ExamQuestionJunction extends Model<ExamQuestionJunction> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  'id': number;

  @Unique(false)
  @ForeignKey(() => Exam)
  @Column(DataType.BIGINT)
  'exam_id': number;

  @Unique(false)
  @ForeignKey(() => Question)
  @Column(DataType.BIGINT)
  'question_id': number;

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

export default ExamQuestionJunction;

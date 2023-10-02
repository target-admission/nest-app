import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  Default,
  DeletedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import QuestionBank from 'src/question-bank/entities/question-bank.entity';
import Question from 'src/questions/entities/question.entity';
import ExamQuestionJunction from './exam-question-junction.entity';

@Table({
  tableName: 'exam',
})
class Exam extends Model<Exam> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  'id': number;

  @AllowNull(false)
  @Column
  'name': string;

  @AllowNull
  @Column
  'description': string;

  @AllowNull
  @Column
  'duration': number;

  @AllowNull
  @Column(DataType.FLOAT)
  'negative_mark': number;

  @AllowNull
  @Default(1)
  @Column(DataType.FLOAT)
  'positive_mark': number;

  @AllowNull(false)
  @Column(DataType.ENUM('model', 'quick', 'mock', 'user-defined'))
  'type': string;

  @AllowNull(false)
  @Column(DataType.ENUM('premium', 'free'))
  'attendee_type': string;

  @Default(false)
  @Column
  'is_archivable': boolean;

  @AllowNull
  @Column
  'live_datetime': Date;

  @ForeignKey(() => QuestionBank)
  @AllowNull
  @Column(DataType.BIGINT)
  'question_bank_id': number;

  @BelongsTo(() => QuestionBank)
  'question_bank': QuestionBank;

  @BelongsToMany(() => Question, () => ExamQuestionJunction)
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

export default Exam;

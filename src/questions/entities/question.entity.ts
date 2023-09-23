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
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import Answer from 'src/answers/entities/answer.entity';
import Category from 'src/category/entities/category.entity';
import ExamQuestionJunction from 'src/exams/entities/exam-question-junction.entity';
import Exam from 'src/exams/entities/exam.entity';
import Topic from 'src/topics/entities/topic.entity';

@Table({
  tableName: 'question',
})
class Question extends Model<Question> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  'id': number;

  @AllowNull(false)
  @Column
  'question': string;

  @AllowNull
  @Column
  'explaination': string;

  @AllowNull(false)
  @Default('MCQ')
  @Column(DataType.ENUM('MCQ', 'WRITTEN'))
  'type': string;

  @HasMany(() => Answer, {
    foreignKey: 'question_id',
    as: 'answers',
  })
  'answers': Answer[];

  @ForeignKey(() => Topic)
  @AllowNull
  @Column(DataType.BIGINT)
  'topic_id': number;

  @BelongsTo(() => Topic)
  'topic': Topic;

  @ForeignKey(() => Category)
  @AllowNull
  @Column(DataType.BIGINT)
  'category_id': number;

  @BelongsTo(() => Category)
  'category': Category;

  @ForeignKey(() => Answer)
  @AllowNull
  @Column(DataType.BIGINT)
  'solution_id': number;

  @BelongsToMany(() => Exam, () => ExamQuestionJunction)
  'linked_exams': Exam[];

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

export default Question;

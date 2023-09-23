import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';
import Exam from 'src/exams/entities/exam.entity';
import Question from 'src/questions/entities/question.entity';
import Topic from 'src/topics/entities/topic.entity';
import UserSession from 'src/users-sessions/entities/user-session.entity';
import User from 'src/users/entities/user.entity';

@Injectable()
export class ReportsService {
  async getUserReports({
    start_date,
    end_date,
  }: {
    start_date: string;
    end_date: string;
  }) {
    return await User.findAll({
      where: {
        created_at: {
          [Op.between]: [start_date, end_date], // Filter by date range
        },
      },
      attributes: [
        [Sequelize.fn('DATE', Sequelize.col('created_at')), 'date'], // Extract the date part of created_at
        [Sequelize.fn('COUNT', Sequelize.col('*')), 'count'], // Count new users
      ],
      group: ['date'],
      order: [['date', 'ASC']], // Order by date
      paranoid: false,
    });
  }

  async getDashboardStats({
    start_date,
    end_date,
  }: {
    start_date: string;
    end_date: string;
  }) {
    return {
      total_users: await User.count({
        paranoid: false,
      }),
      new_users: await User.count({
        where: {
          created_at: {
            [Op.between]: [start_date, end_date], // Filter by date range
          },
        },
        paranoid: false,
      }),
      new_subscriptions: 0,
      deleted_users: await User.count({
        where: {
          deleted_at: {
            [Op.between]: [start_date, end_date], // Filter by date range
          },
        },
        paranoid: false,
      }),
      new_questions: await Question.count({
        where: {
          created_at: {
            [Op.between]: [start_date, end_date], // Filter by date range
          },
        },
        paranoid: false,
      }),
      new_topics: await Topic.count({
        where: {
          created_at: {
            [Op.between]: [start_date, end_date], // Filter by date range
          },
        },
        paranoid: false,
      }),
      new_exams: await Exam.count({
        where: {
          created_at: {
            [Op.between]: [start_date, end_date], // Filter by date range
          },
        },
        paranoid: false,
      }),
      skipped_exams: 0,
    };
  }

  async getUsersStats({
    start_date,
    end_date,
  }: {
    start_date: string;
    end_date: string;
  }) {
    return {
      total_users: await User.count({
        paranoid: false,
      }),
      new_users: await User.count({
        where: {
          created_at: {
            [Op.between]: [start_date, end_date], // Filter by date range
          },
        },
        paranoid: false,
      }),
      new_subscriptions: 0,
      deleted_users: await User.count({
        where: {
          deleted_at: {
            [Op.between]: [start_date, end_date], // Filter by date range
          },
        },
        paranoid: false,
      }),
      total_subscription_requests: 0,
      new_reffered_users: 0,
      total_active_users: await UserSession.count({
        where: {
          last_login: {
            [Op.between]: [start_date, end_date], // Filter by date range
          },
        },
        paranoid: false,
      }),
      total_suspended_accounts: await User.count({
        where: {
          is_active: false,
        },
        paranoid: false,
      }),
      skipped_exams: 0,
    };
  }
}

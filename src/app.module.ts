import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { EmployeesModule } from './employees/employees.module';
import { ConfigModule } from '@nestjs/config';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { AccesspointModule } from './accesspoint/accesspoint.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { SessionsModule as EmployeeSessionsModule } from './employees-sessions/sessions.module';
import { UsersModule } from './users/users.module';
import { SessionsModule as UserSessionsModule } from './users-sessions/sessions.module';
// import { GraphQLModule } from '@nestjs/graphql';
// import { ApolloDriver } from '@nestjs/apollo';
// import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // GraphQLModule.forRoot({
    //   driver: ApolloDriver,
    //   playground: true,
    //   autoSchemaFile: join(process.cwd(), 'src/graph.schema.gql'), // Automatically Generate GraphQL File
    //   definitions: {
    //     path: join(process.cwd(), 'src/graph.interface.ts'),
    //     // additionalHeader: '/* eslint-disable prettier/prettier */',
    //   },
    //   // typePaths: ['./**/*.graphql'], // Manually Read GraphQL File
    // }),
    DatabaseModule,
    AuthModule,
    AdminModule,
    UsersModule,
    UserSessionsModule,
    EmployeesModule,
    EmployeeSessionsModule,
    AccesspointModule,
    RolesModule,
    PermissionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

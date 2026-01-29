import { DynamicModule, Global, Module, Type } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from '../config/database.config';
import { BookEntity } from './entities/book.entity';
import { UserEntity } from './entities/user.entity';
import { BorrowRecordEntity } from './entities/borrow-record.entity';

import * as repositories from './repositories';

export interface DatabaseModuleOptions {
  skipRepository: boolean;
}


@Global()
@Module({})
export class DatabaseModule {
  static forRoot(
    options: DatabaseModuleOptions = {
      skipRepository: false,
    },
  ): DynamicModule {
    const allRepositories: Type[] =
      options?.skipRepository === true
        ? []
        : Object.keys(repositories).map(
            (k) => repositories[k as keyof typeof repositories],
          );

    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRoot(databaseConfig()),
        TypeOrmModule.forFeature([BookEntity, UserEntity, BorrowRecordEntity])
      ],
      providers: [...allRepositories],
      exports: [TypeOrmModule, ...allRepositories],
    };
  }
}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: +process.env.MYSQL_PORT,
      database: process.env.MYSQL_DATABASE,
      username: process.env.MYSQL_USER,
      password:  process.env.MYSQL_PASSWORD,
      autoLoadEntities: true,
      synchronize: true
    }),
    UsersModule,
    CommonModule,
    RolesModule,
    AuthModule
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UsersModule]
}
)
export class AuthModule { }

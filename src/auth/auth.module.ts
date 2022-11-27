import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
    // JwtModule.register({
    //   secret: process.env.JWT_SECRET,
    //   signOptions: {
    //     expiresIn: '2h'
    //   }
    // })
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '2h'
          }
        }
      }
    })
  ],
  // exports: [AuthService, JwtStrategy]
}
)
export class AuthModule { }

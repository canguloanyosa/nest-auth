import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ValidRoles } from './interfaces/valid-roles';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) { }

  @Post('login')
  loginUser(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.loginUser(loginAuthDto);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @GetUser('username') user: User
  ) {

    return {
      ok: true,
      message: 'Hola mundo Private',
      user
    }
  }

  @Get('private2')
  //@SetMetadata('roles', ['admin'])
  // @Auth(ValidRoles.admin)
  @Auth()
  PrivateRoute(
    @GetUser('username') user: User
  ) {
    return {
      ok: true,
      message: 'Hola mundo Private',
      user
    }
  }

  getValidRoles() {
    return ValidRoles.admin;
  }


}

import { Injectable, Logger, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { compareSync } from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly jwtService: JwtService
  ) { }

  private readonly logger = new Logger('UsersService');

  async loginUser(loginAuthDto: LoginAuthDto) {

    const { password, username } = loginAuthDto;

    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException('Credentials are not valid (username)');
    }

    if (!compareSync(password, user.password)) {
      throw new UnauthorizedException('Credentials are not valid (password)');
    }

    return {
      ...user,
      token: this.getJwtToken({
        username: user.username
      })
    };
  }

  private handleDbErrors(error: any): never {
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, please check server logs');
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async getAllRoles() {
    const roles = await this.rolesService.getRoles();

    if (!roles) {
      throw new UnauthorizedException('No roles in the database');
    }

    return {
      roles
    }

  }

}


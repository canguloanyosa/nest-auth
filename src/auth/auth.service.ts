import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService,
  ) { }
  
  private readonly logger = new Logger('UsersService');

  async loginUser(loginAuthDto: LoginAuthDto) {

    const { password, username } = loginAuthDto;

    try {
      const user = await this.usersService.findByUsername(username);
      console.log(user);
    }

    catch (error) {
      this.handleDbErrors(error);
    }

    return 'This action adds a new auth';
  }

  private handleDbErrors(error: any): never {
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, please check server logs');
  }

}


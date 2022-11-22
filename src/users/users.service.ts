import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { hashSync } from 'bcrypt';

@Injectable()
export class UsersService {

  private readonly logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const {password, ...userData } = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: hashSync( password, 10)
      });
      console.log(user.password);
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

  // TODO: paginar
  async findAll(paginationDto: PaginationDto): Promise<User[]> {

    const { limit = 10, offset = 0 } = paginationDto;
    return await this.userRepository.find({
      take: limit,
      skip: offset
    });
  }

  async findOne(id: number): Promise<User> {

    const user = await this.userRepository.findOneBy({ id: id });
    console.log(user);
    if (!user)
      throw new NotFoundException(`User with id ${id} not found`);

    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {username}
    });
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id: id,
      ...updateUserDto
    });

    if(!user) {
      throw new NotFoundException(`User with userid: ${id} not found`);
    }
    
    return await this.userRepository.save(user);

  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  private handleDbExceptions(error: any): never {
    if (error.errno === 1062) {
      throw new BadRequestException(error.sqlMessage);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, please check server logs');

  }

}



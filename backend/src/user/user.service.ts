import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { compare, hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async validateCredentials(email: string, password: string) {
    const user = await this.findByEmail(email);

    if (user && (await compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async create(createUserDto: CreateUserDto) {
    const existing = await this.findByEmail(createUserDto.email);

    if (existing) {
      throw new UnprocessableEntityException('Email already in use');
    }

    const hashedPassword = await hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  findById(id: number) {
    return this.userRepository.findOne(id);
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({ email });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}

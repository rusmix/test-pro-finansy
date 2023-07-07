import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { HashService } from 'src/hash';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    await this.checkCredentials(createUserDto.username, createUserDto.email);

    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: await this.hashService.hashPass(createUserDto.password),
    });
    return this.usersRepository.save(newUser);
  }

  async checkCredentials(username: string, email: string) {
    const userWithSameUsername = await this.usersRepository.findOne({
      where: { username: username },
    });

    if (userWithSameUsername) {
      throw new HttpException('Username is already taken', HttpStatus.CONFLICT);
    }

    const userWithSameEmail = await this.usersRepository.findOne({
      where: { email: email },
    });

    if (userWithSameEmail) {
      throw new HttpException('Email is already taken', HttpStatus.CONFLICT);
    }

    return true;
  }

  public async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  public async findByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<User> {
    const credentials = await this.usersRepository.findOne({
      where: { email },
    });

    if (!credentials) {
      throw new HttpException('Invalid email', HttpStatus.NOT_FOUND);
    }

    const isRightPassword = await this.hashService.compare(
      password,
      credentials.password,
    );

    if (!isRightPassword) {
      throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
    }

    return credentials;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return user;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return this.usersRepository.update({ id }, { id, ...updateUserDto });
  }

  async remove(id: number): Promise<DeleteResult> {
    return this.usersRepository.delete(id);
  }
}

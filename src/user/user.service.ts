import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { Repository } from "typeorm";

const bcrypt = require("bcrypt");

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {
  }

  async create(createUserDto: CreateUserDto) {
    const userByEmail = await this.userRepository.findOne({ email: createUserDto.email });
    const userByUsername = await this.userRepository.findOne({ username: createUserDto.username });

    if (userByEmail) {
      throw new HttpException("Email is taken", HttpStatus.UNPROCESSABLE_ENTITY);
    }

    if (userByUsername) {
      throw new HttpException("Username is taken", HttpStatus.UNPROCESSABLE_ENTITY);
    }


    const hashPass = await  bcrypt.hash(createUserDto.password, 7);
    console.log(hashPass);
    const user = await this.userRepository.save({
      email: createUserDto.email,
      username: createUserDto.username,
      password: hashPass,
      fullName: createUserDto.fullName,
      dob: createUserDto.dob
    });

    return {
      id: user.id,
      username: user.username
    };
  }

  findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);
    return await this.userRepository.findOne(id);
  }

}

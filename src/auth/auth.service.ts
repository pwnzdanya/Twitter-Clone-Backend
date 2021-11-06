import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../user/entities/user.entity";
import {Repository} from "typeorm";
import {JWT_SECRET} from "../config";
import {IShortUserResponse, UserAuth} from "../user/types/user.types";

import {LoginUserDto} from "../user/dto/login-user.dto";
import {sign} from "jsonwebtoken";

const bcrypt = require("bcrypt");

@Injectable()
export class AuthService {
  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {
  }

  generateJWT(user: UserAuth): string {
    return sign({id: user.id, username: user.username}, JWT_SECRET);
  }

  buildAuthUserRes(user: UserAuth | UserEntity): IShortUserResponse {
    return {
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        avatar: user.avatar || '',
        token: this.generateJWT(user)
      }
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const userByEmail = await this.userRepository.findOne({email: loginUserDto.email},
      {select: ["id", "username", "password", "fullName", "avatar"]});

    if (!userByEmail) {
      throw new HttpException("Invalid email", HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const isCompare = await bcrypt.compare(loginUserDto.password, userByEmail.password);

    if (!isCompare) {
      throw new HttpException("Invalid pass", HttpStatus.UNPROCESSABLE_ENTITY);
    }
    console.log(userByEmail)
    return {
      id: userByEmail.id,
      username: userByEmail.username,
      fullName: userByEmail.fullName,
      avatar: userByEmail.avatar
    };
  }
}

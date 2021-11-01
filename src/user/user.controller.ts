import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { IUserResponse } from "./types/user.types";
import { LoginUserDto } from "./dto/login-user.dto";
import { User } from "./decorators/user.decorator";
import { UserEntity } from "./entities/user.entity";
import { AuthGuard } from "./guards/auth.guard";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  update(@Param("id") id: string, @Body("user") updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }


}

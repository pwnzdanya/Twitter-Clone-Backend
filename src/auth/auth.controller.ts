import {Body, Controller, Get, Post, UseGuards} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {LoginUserDto} from "../user/dto/login-user.dto";
import {IShortUserResponse} from "../user/types/user.types";
import {UserService} from "../user/user.service";
import {CreateUserDto} from "../user/dto/create-user.dto";
import {AuthGuard} from "../user/guards/auth.guard";
import {User} from "../user/decorators/user.decorator";
import {UserEntity} from "../user/entities/user.entity";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {
  }

  @Post("/login")
  async login(@Body() loginUserDto: LoginUserDto): Promise<IShortUserResponse> {
    const user = await this.authService.login(loginUserDto);
    return this.authService.buildAuthUserRes(user);
  }

  @Post("/register")
  async create(@Body("user") createUserDto: CreateUserDto): Promise<IShortUserResponse> {
    const user = await this.userService.create(createUserDto);
    return this.authService.buildAuthUserRes(user);
  }

  @Get("/me")
  @UseGuards(AuthGuard)
  currentUser(@User() currentUser: UserEntity) {
    return {
      user: {
        id: currentUser.id,
        username: currentUser.username,
        fullName: currentUser.fullName,
        avatar: currentUser.avatar,
      }
    }
  }
}

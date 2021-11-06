import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from "@nestjs/common";
import {UserService} from "./user.service";

import {UpdateUserDto} from "./dto/update-user.dto";

import {AuthGuard} from "./guards/auth.guard";
import {User} from "./decorators/user.decorator";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Get(":username")
  @UseGuards(AuthGuard)
  async get(@Param("username") username: string, @User('id') currentUserId: number) {

    const user = await this.userService.get(username)

    return await this.userService.buildFullUserRes(user, currentUserId)
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  update(@Param("id") id: string, @Body("user") updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }


  @Post(':username/follow')
  @UseGuards(AuthGuard)
  async follow(@Param('username') username: string, @User('id') currentUserId: number) {
    return await this.userService.follow(currentUserId, username)
  }

  @Delete(':username/follow')
  @UseGuards(AuthGuard)
  async unfollow(@Param('username') username: string, @User('id') currentUserId: number) {
    return await this.userService.unfollow(currentUserId, username)
  }

}

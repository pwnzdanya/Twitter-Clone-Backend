import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { TweetService } from "./tweet.service";
import { CreateTweetDto } from "./dto/create-tweet.dto";
import { User } from "../user/decorators/user.decorator";
import { AuthGuard } from "../user/guards/auth.guard";
import { UserEntity } from "../user/entities/user.entity";
import { TweetEntity } from "./entities/tweet.entity";

@Controller("tweet")
export class TweetController {
  constructor(private readonly tweetService: TweetService) {
  }

  @Post()
  @UseGuards(AuthGuard)
  create(@User() user: UserEntity, @Body() createTweetDto: CreateTweetDto): Promise<TweetEntity> {
    return this.tweetService.create(user, createTweetDto);
  }


  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.tweetService.findOne(+id);
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  async remove(@Param("id") id: string, @User('id') currentUserId: number) {
    return await  this.tweetService.remove(+id, currentUserId);
  }
}

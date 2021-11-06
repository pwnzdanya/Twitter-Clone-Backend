import { Module } from '@nestjs/common';
import { TweetService } from './tweet.service';
import { TweetController } from './tweet.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { TweetEntity } from "./entities/tweet.entity";
import {UserEntity} from "../user/entities/user.entity";
import {UserService} from "../user/user.service";

@Module({
  imports: [TypeOrmModule.forFeature([TweetEntity, UserEntity])],
  controllers: [TweetController],
  providers: [TweetService, UserService]
})
export class TweetModule {}

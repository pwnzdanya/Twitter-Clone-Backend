import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateTweetDto } from "./dto/create-tweet.dto";
import { UserEntity } from "../user/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { TweetEntity } from "./entities/tweet.entity";
import { DeleteResult, Repository } from "typeorm";

@Injectable()
export class TweetService {
  constructor(@InjectRepository(TweetEntity) private tweetRepository: Repository<TweetEntity>) {
  }

  async create(user: UserEntity, createTweetDto: CreateTweetDto): Promise<TweetEntity> {
    const tweet = {
      author: {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        avatar: user.avatar
      },
      text: createTweetDto.text,
      isLiked: false
    };
    return await this.tweetRepository.save(tweet);
  }



  findOne(id: number) {
    return `This action returns a #${id} tweet`;
  }

  async remove(id: number, currentUserId: number): Promise<DeleteResult> {
    const tweet = await this.tweetRepository.findOne(id);
    if (!tweet) {
      throw new HttpException(`Tweet doesn't exist`, HttpStatus.NOT_FOUND);
    }

    if (tweet.author.id !== currentUserId) {
      throw new HttpException(`You are not an author`, HttpStatus.FORBIDDEN);
    }

    return await this.tweetRepository.delete(id);
  }
}

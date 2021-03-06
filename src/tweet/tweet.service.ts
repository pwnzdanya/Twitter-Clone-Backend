import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {CreateTweetDto} from "./dto/create-tweet.dto";
import {UserEntity} from "../user/entities/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {TweetEntity} from "./entities/tweet.entity";
import {DeleteResult, getRepository, Repository} from "typeorm";

@Injectable()
export class TweetService {
  constructor(
    @InjectRepository(TweetEntity) private tweetRepository: Repository<TweetEntity>,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
  ) {
  }

  async create(user: UserEntity, createTweetDto: CreateTweetDto): Promise<TweetEntity> {
    const tweet = {
      author: {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        avatar: user.avatar,
      },
      text: createTweetDto.text,
      isLiked: false
    };
    return await this.tweetRepository.save(tweet);
  }

  async findAllHome(currentUserId: number) {

    const queryBuilder = getRepository(TweetEntity)
      .createQueryBuilder('tweet')
      .leftJoinAndSelect('tweet.author', 'author')

    const author = await this.userRepository.findOne(currentUserId, {
      relations: ['following']
    })
    const ids = author.following.map(f => f.id)
    let allTweets;
    if (ids.length > 0) {
      queryBuilder.andWhere('tweet.authorId IN (:...ids)', {ids})

      const currentAuthorTweets = await this.findAllProfile(currentUserId)

      const tweets = await queryBuilder.getMany()
      allTweets = [...currentAuthorTweets, tweets]
      allTweets.sort((a: TweetEntity, b: TweetEntity) => +(b.createdAt) - +(a.createdAt))

      return {allTweets, tweetsCount: allTweets.length}
    }
    return {allTweets: [], tweetsCount: 0}
  }

  async findAllProfile(currentUserId: number): Promise<TweetEntity[]> {
    const queryBuilder = getRepository(TweetEntity)
      .createQueryBuilder('tweet')
      .leftJoinAndSelect('tweet.author', 'author')

    queryBuilder.andWhere('tweet.author = :id', {id: currentUserId})

    return await queryBuilder.getMany()
  }

  async findOne(id: number): Promise<TweetEntity> {
    return await this.tweetRepository.findOne(id)
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

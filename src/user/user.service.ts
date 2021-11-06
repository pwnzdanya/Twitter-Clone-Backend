import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {CreateUserDto} from "./dto/create-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "./entities/user.entity";
import {Repository} from "typeorm";

const bcrypt = require("bcrypt");

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {
  }

  async buildFullUserRes(user: UserEntity, currentUserId: number) {
    const userFollow = await this.userRepository.findOne(user.id, {
      relations: ['followers', 'following']
    })
    const followingsIds = userFollow.followers.map(follow => follow.id)
    const isFollowing = followingsIds.includes(currentUserId)

    return {
      ...user,
      isFollowing,
      followersCount: userFollow.followers.length,
      followingCount: userFollow.following.length,
    }
  }

  async get(username: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({username})
    if (!user) {
      throw new HttpException('user does not exist', HttpStatus.NOT_FOUND)
    }
    return user
  }


  async create(createUserDto: CreateUserDto) {
    const userByEmail = await this.userRepository.findOne({email: createUserDto.email});
    const userByUsername = await this.userRepository.findOne({username: createUserDto.username});

    if (userByEmail) {
      throw new HttpException("Email is taken", HttpStatus.UNPROCESSABLE_ENTITY);
    }

    if (userByUsername) {
      throw new HttpException("Username is taken", HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const hashPass = await bcrypt.hash(createUserDto.password, 7);
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
      username: user.username,
      fullName: user.fullName,
      avatar: user.avatar
    };
  }

  findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);
    return await this.userRepository.findOne(id);
  }

  async follow(currentUserId: number, username: string) {
    const userNeedToFollowFull = await this.userRepository.findOne({username}, {
      relations: ['followers']
    })
    const userWantToFollowFull = await this.userRepository.findOne(currentUserId, {
      relations: ['following']
    })

    if (!userNeedToFollowFull) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND)
    }

    if (currentUserId === userNeedToFollowFull.id) {
      throw new HttpException('you cant follow yourself', HttpStatus.BAD_REQUEST)
    }

    const isNotFollowing = userWantToFollowFull.following.findIndex(followings => followings.id === userNeedToFollowFull.id) === -1

    if (isNotFollowing) {
      userWantToFollowFull.following.push(userNeedToFollowFull)
      await this.userRepository.save(userWantToFollowFull)

      userNeedToFollowFull.followers.push(userWantToFollowFull)
      await this.userRepository.save(userNeedToFollowFull)
    }
    delete userNeedToFollowFull.followers
    return this.buildFullUserRes(userNeedToFollowFull, currentUserId)
  }

  async unfollow(currentUserId: number, username: string) {

    const userNeedToUnfollowFull = await this.userRepository.findOne({username}, {
      relations: ['followers']
    })
    const userWantToUnfollowFull = await this.userRepository.findOne(currentUserId, {
      relations: ['following']
    })

    if (!userNeedToUnfollowFull) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND)
    }

    if (currentUserId === userNeedToUnfollowFull.id) {
      throw new HttpException('you cant unfollow yourself', HttpStatus.BAD_REQUEST)
    }

    const indexFollower = userNeedToUnfollowFull.followers.findIndex(follower => follower.id === currentUserId)
    const indexFollowing = userWantToUnfollowFull.following.findIndex(followings => followings.id === userNeedToUnfollowFull.id)

    if (indexFollower >= 0) {
      userNeedToUnfollowFull.followers.splice(indexFollower, 1)
      await this.userRepository.save(userNeedToUnfollowFull)

      userWantToUnfollowFull.following.splice(indexFollowing, 1)
      await this.userRepository.save(userWantToUnfollowFull)
    }
    delete userNeedToUnfollowFull.followers
    return this.buildFullUserRes(userNeedToUnfollowFull, currentUserId)
  }
}

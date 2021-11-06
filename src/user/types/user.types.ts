import {Request} from 'express'
import {UserEntity} from "../entities/user.entity";

export type UserAuth = {
  id: number,
  username: string,
  fullName: string,
  avatar: string
}
export type UserResponse = Omit<UserAuth, 'hashPass'>

export interface IShortUserResponse {
  user: UserResponse & { token: string }
}

export interface IExpressRequest extends Request {
  user?: UserEntity
}

import  {Request} from 'express'
import { UserEntity } from "../entities/user.entity";

export type UserAuth = { id: number, username: string }
export type UserType = Omit<UserAuth, 'hashPass'>
export  interface IUserResponse  {
  user: UserType & {token: string}
}

export interface IExpressRequest extends Request{
  user?: UserEntity
}
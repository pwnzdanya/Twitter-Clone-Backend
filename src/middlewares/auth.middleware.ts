import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { UserService } from "../user/user.service";
import { IExpressRequest } from "../user/types/user.types";

@Injectable()
export class AuthMiddleware implements NestMiddleware {

  constructor(private readonly userService: UserService) {
  }

  async use(req: IExpressRequest, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }

    const tokenFromHeaders = req.headers.authorization.split(" ")[1];

    try {
      const tokenDecode = verify(tokenFromHeaders, JWT_SECRET);
      const { id } = tokenDecode;
      req.user = await this.userService.findById(id)
      next();
    } catch (err) {
      req.user = null;
      next();
    }
  }
}
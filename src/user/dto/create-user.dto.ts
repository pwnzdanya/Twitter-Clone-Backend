import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class CreateUserDto {

  @IsNotEmpty()
  @Length(4, 20)
  readonly username: string;

  @IsNotEmpty()
  @Length(2, 40)
  readonly fullName: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  readonly dob: string;

  @Length(6)
  readonly password: string;
}

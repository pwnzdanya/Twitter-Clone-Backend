import { IsEmpty, IsNotEmpty, Length } from "class-validator";

export class CreateTweetDto {
  @IsNotEmpty()
  @Length(1, 280)
  text: string
}

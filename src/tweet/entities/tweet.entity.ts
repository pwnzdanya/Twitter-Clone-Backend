import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../../user/entities/user.entity";
import { AuthorType } from "../types";

@Entity("tweets")
export class TweetEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ default: 0 })
  favouritesCount: number;

  @Column({ default: 0 })
  retweetsCount: number;

  @Column({default: false})
  isLiked: boolean

  @ManyToOne(() => UserEntity, (user) => user.tweets, { eager: true })
  author: AuthorType;
}

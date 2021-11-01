import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { hash } from "bcrypt";
import { TweetEntity } from "../../tweet/entities/tweet.entity";

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, select: false })
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  fullName: string;

  @Column({ unique: true })
  username: string;

  @Column()
  dob: string;

  @Column("simple-array", { nullable: true })
  following: number[];

  @Column("simple-array", { nullable: true })
  followers: number[];

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  location: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ nullable: true })
  avatar: string


  @OneToMany(() => TweetEntity, (tweet) => tweet.author)
  tweets: TweetEntity[];

}
import { ConnectionOptions } from "typeorm";

export const ormConfig: ConnectionOptions = {
    type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '32211781b',
  database: 'twitter_clone',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
}
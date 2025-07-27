import { DataSource } from "typeorm";
import { User } from "./user.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'concierge',
  synchronize: process.env.NODE_ENV !== 'production', // Only sync in development
  logging: true,
  entities: [User],
  migrations: [__dirname + '/migrations/*.js'],
  subscribers: [],
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
}); 
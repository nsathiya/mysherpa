import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SuggestionsController } from './suggestions.controller';
import { OpenAIService } from './openai.service';
import { EmailService } from './email.service';
import { GeocodingService } from './geocoding.service';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.POSTGRES_DB || 'concierge',
      autoLoadEntities: true,
      synchronize: true, // set to false in production
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AppController, SuggestionsController, UserController],
  providers: [AppService, OpenAIService, EmailService, GeocodingService, UserService],
})
export class AppModule {}

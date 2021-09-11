import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as ormconfig from '../ormconfig';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Users } from './entities/Users';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventsModule,
    TypeOrmModule.forRoot(ormconfig),
    TypeOrmModule.forFeature([Users])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

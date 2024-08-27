import { Module } from '@nestjs/common';
import { BoardsResolver } from './boards.resolver';
import { BoardsService } from './boards.service';

@Module({
  imports: [],

  providers: [
    BoardsResolver, //
    BoardsService,
  ], // new AppController(AppService)
})
export class BoardsModule {}

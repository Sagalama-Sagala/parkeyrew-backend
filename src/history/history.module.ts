import { Module } from '@nestjs/common';
import { HistorySchema } from './schema/history.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'History', schema: HistorySchema }])
    ],
    controllers: [HistoryController],
    providers: [HistoryService],
    exports: [HistoryService]
})
export class HistoryModule {}

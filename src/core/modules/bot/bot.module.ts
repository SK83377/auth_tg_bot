import { Module } from '@nestjs/common';
import { BotService } from 'src/core/services/bot/bot.service';
import { DataValidateService } from 'src/core/services/dataValidate/dataValidate.service';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [HttpModule],
    controllers: [],
    providers: [
        BotService,
        DataValidateService
    ]
})
export class BotModule {}
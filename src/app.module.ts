import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BotModule } from './core/modules/bot/bot.module';
import { DataValidateService } from './core/services/dataValidate/dataValidate.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    BotModule,
  ],
  controllers: [],
  providers: [DataValidateService],
})
export class AppModule {}

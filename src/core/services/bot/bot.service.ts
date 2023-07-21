import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { DataValidateService } from '../dataValidate/dataValidate.service';
import { HttpService } from '@nestjs/axios';
import { Axios, AxiosResponse } from 'axios';

// @bot receives messages from user. If message accord to dynamic code parameteres, it will be sent to main application for comparing with issued code and it's timing expiration requirements.
@Injectable()
export class BotService {
    private readonly bot: any;
    constructor (
        private readonly dataValidateService: DataValidateService,
        private readonly httpService: HttpService

    ) {
        this.bot = new TelegramBot(process.env.TOKEN, {polling: true});
        this.bot.on("polling_error", (msg) => console.log(msg));
        this.bot.onText(/\/start/, this.askCode);
        this.bot.onText(/[a-zA-Z0-9]{8}/, this.authorizeUser);
    }
    askCode = async (msg: any) => {
        const checkDataResult = await this.dataValidateService.checkData(msg);
        if (!checkDataResult) await this.bot.sendMessage(msg.from.id, 'enter your code');
    }
    authorizeUser = async (msg: any) => {
        const checkDataResult = await this.dataValidateService.checkData(msg);
        const resultVerifyTG = await this.verifyTG({chatId: msg.from.id.toString(), code: msg.text});
        if (resultVerifyTG) await this.bot.sendMessage(msg.from.id, resultVerifyTG);
        else await this.bot.sendMessage(msg.from.id, 'Something went wrong, try else on the web-site');
    }
    verifyTG = async (toSendObj: ToSendObjInterface) => {
        try {
            const reqToMain = await this.httpService.post(`${process.env.MAIN_API}authentication/verifyTG`, toSendObj).toPromise();
            return reqToMain.data;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}


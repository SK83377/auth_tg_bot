import { Injectable, HttpException, HttpStatus, Type } from '@nestjs/common';
import { detectionList } from './detectionList';

// @check data API inner data for sql-injections and js-operators. If data consists nested objects or arrays, search methods will be called recursively. Detection list array can be expanded with needed search parameteres.
@Injectable()
export class DataValidateService {
    public async checkData (toCheck: object | string) {
        if (typeof toCheck == 'string') {
            await this.sqlInjCheck(toCheck);
        } else {
            const toCheckArr = Object.values(toCheck);
            for (let i=0;i<toCheckArr.length;i++) {
                if (typeof toCheckArr[i] == 'string') {
                    let sqlInjCheckResult = await this.sqlInjCheck(toCheckArr[i]);
                    if (sqlInjCheckResult) return true;
                }
                if (typeof toCheckArr[i] == 'object') {
                    const toCheckInnerArr = await Array.isArray(toCheckArr[i]) ? toCheckArr[i] : Object.values(toCheckArr[i]);
                    let checkDataResult = await this.checkData(toCheckArr[i]);
                    if (checkDataResult) return true;
                }
            }
        }
        return false;
    }
    private async sqlInjCheck (toCheck: any) {
        for (let i=0;i<detectionList.length;i++) {
            if (toCheck.indexOf(detectionList[i]) != -1) {
                return true;
            }
        }
        return false;
    }
}
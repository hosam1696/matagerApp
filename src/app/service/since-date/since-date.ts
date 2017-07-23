import { Pipe, PipeTransform } from '@angular/core';
import { ArDTimeId, ArLttTimeId, ArTimeId} from '../interfaces';

@Pipe({
  name: 'sincedate',
  pure:false
})
export class SinceDatePipe implements PipeTransform {
  transformed: string;

  transform(value: string, ...args) {
    return this.getDateSince(value);
  }

  getDateSince(date, dNow?:any) {

    let dTimeStamp = this.getTime(date);
    dNow = Date.now();
    let diff = (dNow - dTimeStamp) / 1000; // get time difference in seconds --pareseInt() 

    console.log(date, dTimeStamp,dNow, diff);
    for (let i in this.unitsId) {
      let tDivider = this.unitsId[i],
      sinceTime = Math.floor(diff / tDivider);
      if (sinceTime > 0) {
        //console.log(i,sinceTime, this.timeId[i]);
        let [arTime, doubleArTime, lessThanTenTime] = [ArTimeId[this.timeId[i]], ArDTimeId[this.timeId[i]], ArLttTimeId[this.timeId[i]]];
        
        if (sinceTime == 1)
          return ' ' + arTime;
        else if (sinceTime == 2)
          return ' ' + doubleArTime;
        else if (sinceTime > 2 && sinceTime <= 10)
          return sinceTime + ' ' + lessThanTenTime
        else
          return sinceTime + ' ' + arTime
      }
    }
    //console.log(timeUnits.unitsId[i])
  }

  private getTime(date) {
    return (this.isDate(new Date(date)))?new Date(date).getTime(): Date.now();
  }

  private type(obj: any): string {
    return Object.prototype.toString.call(obj).match(/\S+\w+/g)[1].toLowerCase();
  }

  private isDate(obj: any): boolean {
    return (this.type(obj) == 'date') ? true : false;
  }

  private get timeId():string[] {
    return ['year', 'month', 'day', 'hour', 'minute', 'second'];
  }

  private get unitsId():number[] {
    return [(60 * 60 * 24 * 30*12),(60 * 60 * 24 * 30), (60 * 60 * 24), (60 * 60), 60, 1]
  }

}

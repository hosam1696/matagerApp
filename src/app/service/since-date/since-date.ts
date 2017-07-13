import { Pipe, PipeTransform } from '@angular/core';
import { ArDTimeId, ArLttTimeId, ArTimeId} from '../interfaces';

@Pipe({
  name: 'sincedate',
})
export class SinceDatePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) {
    return this.getDateSince(value);
  }

  getDateSince(date) {
    if (!date) 
      return null

    let timeUnits = {
      timeId: ['year', 'month', 'day', 'hour', 'minute', 'second'],
      unitsId: [(60 * 60 * 24 * 30*12),(60 * 60 * 24 * 30), (60 * 60 * 24), (60 * 60), 60, 1]
    };
    let dNow = Date.now();

    let dTimeStamp = new Date(date).getTime();
    let diff = (dNow - dTimeStamp) / 1000; // pareseInt()

    for (let i in timeUnits.unitsId) {
      let tDivider = timeUnits.unitsId[i];
      let sinceTime = Math.floor(diff / tDivider);
      if (sinceTime > 0) {
        //console.log(i,sinceTime, timeUnits.timeId[i]);
        let arTime = ArTimeId[timeUnits.timeId[i]];
        let doubleArTime = ArDTimeId[timeUnits.timeId[i]];
        let lessThanTenTime = ArLttTimeId[timeUnits.timeId[i]];
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


}

import { Pipe,ChangeDetectorRef, PipeTransform, NgZone } from '@angular/core';
import { ArDTimeId, ArLttTimeId, ArTimeId} from '../interfaces';

@Pipe({
  name: 'sincedate',
  pure:false
})
export class SinceDatePipe implements PipeTransform {
  transformed: string;
  constructor(public ngZone: NgZone,public chRef:ChangeDetectorRef){}
  transform(value: string, ...args) {
      this.transformed = this.getDateSince(value);


    this.ngZone.runOutsideAngular(()=>{
      setTimeout(()=> {
        this.transformed = this.getDateSince(value);
        //console.log(value, this.transformed);
        this.ngZone.run(()=>{
          this.chRef.markForCheck()
        });
      }, 10000);
    });

    return this.transformed;
  }

  getDateSince(date, dNow= Date.now()) {

    let dTimeStamp = this.getTime(date);
    let diff = (dNow - dTimeStamp) / 1000; // get time difference in seconds --pareseInt()

  //  console.log(date, dTimeStamp,dNow, diff);
    for (let i in this.unitsId) {
      let tDivider = this.unitsId[i],
      sinceTime = Math.floor(diff / tDivider);
      if (sinceTime > 0) {
        //console.log(i,sinceTime, this.timeId[i]);
        let [arTime, doubleArTime, lessThanTenTime] = [ArTimeId[this.timeId[i]], ArDTimeId[this.timeId[i]], ArLttTimeId[this.timeId[i]]];
        if(sinceTime == 0)
          return 'الان';
        else if (sinceTime == 1)
          return ' ' + arTime;
        else if (sinceTime == 2)
          return ' ' + doubleArTime;
        else if (sinceTime > 2 && sinceTime <= 10)
          return sinceTime + ' ' + lessThanTenTime;
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

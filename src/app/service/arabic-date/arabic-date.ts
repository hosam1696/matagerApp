import { Pipe, PipeTransform } from '@angular/core';
import {ArMonths} from "../interfaces";

/**
 * Generated class for the ArabicDatePipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'arabicdate',
})
export class ArabicDatePipe implements PipeTransform {

  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) {


    //let string = 'August 15, 2017';
    let replaceFunc = (matched, g1, g2, g3, index, all)=> {console.log(`\
   first match is  : ${g1}
  second match is : ${g2}
  third match is  : ${g3}
  the desired date is [ ${g2} ${ArMonths[g1]} ${g3} ]
 `);return `${g2} ${ArMonths[g1]} ${g3}`};
    let filtered = value.replace(/([A-z]*) ?([0-9]*,) ?([0-9]*)/g, replaceFunc);
    console.log(filtered);

    return filtered;
  }
}

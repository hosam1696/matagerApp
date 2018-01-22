import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the GenderPipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'gender',
})
export class GenderPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) {
    return value == 'male' ? 'ذكر': 'انثى';
  }
}

import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

export class CommonCheck {
  static dateGreaterThanNow(control: FormControl) {
    let dt = DatePipe.transform(new Date);
    if (dt >= control.value && control.value != "") {
      return {'incorrectDay': true};
    }
    return null;
  }

  static integerFormat(control: FormControl) {
    var INTEGER_REGEXP = /^(\d){1,5}$/;
    if (control.value != '' && !INTEGER_REGEXP.test(control.value)) {
      return { 'incorrectIntegerFormat': true };
    }
    return null;
  }
}

    @Pipe({
   name: 'formatDate'
})
export class DatePipe {
   static transform(date: any, args?: any): any {
     let d = new Date(date);
     return moment(d).format('YYYY-MM-DD');

   }
}
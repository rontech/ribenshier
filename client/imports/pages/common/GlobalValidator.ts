import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

export class GlobalValidator {
  static positiveIntegerCheck(control: FormControl) {
    var NUMBER_REGEXP = /^\+?[1-9]\d*$/i;
    if (control.value != '' && (!NUMBER_REGEXP.test(control.value))) {
      return { 'incorrectNumberFormat': true };
    }
    return null;
  }

  static earlierThanCurrentTime(control: FormControl) {
    let nowDate = DatePipe.transform(new Date());
    if(control.value != "" && control.value <= nowDate) {
      return { 'incorrectTime': true};
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
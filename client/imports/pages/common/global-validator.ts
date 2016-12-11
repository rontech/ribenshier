import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import * as moment from 'moment';

export class GlobalValidator {
  static mailFormat(control: FormControl) {
    let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    if (control.value != '' && (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))) {
      return { 'incorrectMailFormat': true };
    }
    return null;
  }

  static numberCheck(control: FormControl) {
    let NUMBER_REGEXP = /^\d+$/;
    if (control.value != '' && (!NUMBER_REGEXP.test(control.value))) {
      return { 'incorrectNumberFormat': true };
    }
    return null;
  }

  static maxValueCheck(maxValue) {
    return function(control: FormControl) {
      if (control.value != '' && control.value > maxValue) {
       return { 'overMaxValue': true };
      }
      return null;
    }
  }

  static futureTimeCheck(control: FormControl) {
    let nowDate = GlobalValidator.transform(new Date());
    if(control.value != '' && control.value <= nowDate) {
      return { 'notFutureTime': true};
    }
    return null;
  }

  static floatCheck(demical) {
    return function(control: FormControl) {
      let NUMBER_REGEXP = new RegExp('^\\d+(\\.\\d{1,' + demical + '2})?$');
      if (control.value != '' && (!NUMBER_REGEXP.test(control.value))) {
        return { 'incorrectFloatFormat': true };
      }
      return null;
    }
  }

  static transform(date: any, args?: any): any {
    let d = new Date(date);
    if(args)
      return moment(d).format(args);
    else
      return moment(d).format('YYYY-MM-DD');
  }
}

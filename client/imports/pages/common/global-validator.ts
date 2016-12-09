import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import * as moment from 'moment';

export class GlobalValidator {
  static mailFormat(control: FormControl) {
    var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    if (control.value != '' && (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))) {
      return { 'incorrectMailFormat': true };
    }
    return null;
  }

  static numberCheck(control: FormControl) {
    var NUMBER_REGEXP = /^\+?[1-9]\d*$/i;
    if (control.value != '' && (!NUMBER_REGEXP.test(control.value))) {
      return { 'incorrectNumberFormat': true };
    }
    return null;
  }

  static futureTimeCheck(control: FormControl) {
    let nowDate = GlobalValidator.transform(new Date());
    if(control.value != '' && control.value <= nowDate) {
      return { 'notFutureTime': true};
    }
    return null;
  }

  static transform(date: any, args?: any): any {
    let d = new Date(date);
    return moment(d).format('YYYY-MM-DD');
  }
}

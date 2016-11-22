import { Pipe, PipeTransform } from '@angular/core';

/*
 * Format the ago time to chinese.
 * Takes none arguments.
 * Usage:
 *   string | chineseCalendar
 * Example:
 *   {{ 9/17/2016 |  chineseCalendar }}
 *   formats to: 2016年9月17日 
 *   {{ Last Friday at 11:40 AM |  chineseCalendar }}
 *   formats to: 上周五上午11:40
*/
@Pipe({name: 'chineseCalendar'})
export class ChineseCalendarPipe implements PipeTransform {
  transform(value: string): string {
    if(!value) return value;
    let exp = value;
    let arr = value.split('/');
    if(arr.length == 3) {
      exp = arr[2] + '年' + arr[0] + '月' + arr[1] + '日';
    } else {
      let target = {Last: '上', Monday: '周一',
                       Tuesday: '周二', Wednesday: '周三', Thursday: '周三',
                       Friday: '周五', Saturday: '周六', Sunday: '周日', 
                       Today: '今天', Yesterday: '昨天'};
      Object.keys(target).forEach(key => {
        exp = exp.replace(key, target[key]);
      });
      if(value.indexOf('AM') != -1) {
        exp = exp.replace('at', '上午');
        exp = exp.replace('AM', '');
      } else {
        exp = exp.replace('at', '下午');
        exp = exp.replace('PM', '');
      }
      exp = exp.replace(' ', '');
    }
    return exp;
  }
}

import { Pipe, PipeTransform } from '@angular/core';

/*
 * Format the ago time to chinese.
 * Takes none arguments.
 * Usage:
 *   string | chineseTimeAgo
 * Example:
 *   {{ 2 hours ago |  chineseTimeAgo}}
 *   formats to: 2小时前
*/
@Pipe({name: 'chineseTimeAgo'})
export class ChineseTimeAgoPipe implements PipeTransform {
  transform(value: string): string {
    if(!value) return value;
    console.log("value=", value);
    let exp = value.replace('a few seconds ago', '刚刚');
    exp = exp.replace('a day ago', '昨天');
    exp = exp.replace('a year ago', '去年');
    exp = exp.replace('a month ago', '上个月');
    exp = exp.replace('a year ago', '去年');
    exp = exp.replace('^2 days ago', '前天');
    exp = exp.replace('^2 years ago', '前年');
    exp = exp.replace('years', '年');
    exp = exp.replace('year', '年');
    exp = exp.replace('months', '月');
    exp = exp.replace('month', '月');
    exp = exp.replace('days', '日');
    exp = exp.replace('day', '日');
    exp = exp.replace('hours', '小时');
    exp = exp.replace('hour', '小时');
    exp = exp.replace('minutes', '分钟');
    exp = exp.replace('minute', '分钟');
    exp = exp.replace('seconds', '秒');
    exp = exp.replace('ago', '前');
    exp = exp.replace('an', '1');
    exp = exp.replace('a', '1');
    exp = exp.replace(' ', '');
    exp = exp.replace(' ', '');
    return exp;
  }
}

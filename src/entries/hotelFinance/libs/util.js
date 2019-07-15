/*
 * @Author: huangchao 
 * @Date: 2019-01-09 12:25:30 
 * @Last Modified by: huangchao
 * @Last Modified time: 2019-01-09 12:26:36
 */

 /**
 * 月份转成具体日期
 * @return arr
 * @month 当前月份 （01）
 * @year 当前年 （）
 */
export function  switchMonthToDay (month, year) {
    switch (month) {
        case '01' : return ['01-01', '01-31']; 
        break
        case '02' : return whatYear(year); //平闰年
        break 
        case '03' : return ['03-01', '03-31']; 
        break 
        case '04' : return ['04-01', '04-30']; 
        break 
        case '05' : return ['05-01', '05-31']; 
        break 
        case '06' : return ['06-01', '06-30']; 
        break 
        case '07' : return ['07-01', '07-31']; 
        break 
        case '08' : return ['08-01', '08-31']; 
        break 
        case '09' : return ['09-01', '09-30']; 
        break 
        case '10' : return ['10-01', '10-31']; 
        break 
        case '11' : return ['11-01', '11-30']; 
        break
        case '12' : return ['12-01', '12-31']; 
        break  
    }
    function whatYear (date) {
        if ( (date%4 == 0 && date%100 != 0) || (date%400 == 0) ) {
            return ['2-01', '2-29']
        } else {
            return ['2-01', '2-28']
        }
    }
}

/* 获取星期几
 * weekdays: 星期，字符串， 如： 1,2
 */
export default function getWeekdaysFormat(weekdays) {
  // weekday[0]="Sunday"
  // weekday[1]="Monday"
  // weekday[2]="Tuesday"
  // weekday[3]="Wednesday"
  // weekday[4]="Thursday"
  // weekday[5]="Friday"
  // weekday[6]="Saturday"

  if(!weekdays) return []

  let weekdayArr = typeof weekdays === 'number' ? [weekdays] : weekdays.split(',')
  let weekdayFormatArr = []

  weekdayArr.map(item=>{
    if(item == 0) {
      weekdayFormatArr.push('周日')
    }else if(item == 1) {
      weekdayFormatArr.push('周一')
    }else if(item == 2) {
      weekdayFormatArr.push('周二')
    }else if(item == 3) {
      weekdayFormatArr.push('周三')
    }else if(item == 4) {
      weekdayFormatArr.push('周四')
    }else if(item == 5) {
      weekdayFormatArr.push('周五')
    }else if(item == 6) {
      weekdayFormatArr.push('周六')
    }
  })

  return weekdayFormatArr
}


import is_int from './is_int'

export default function fixedNumber(number, num, fixInt = false) {
  if(fixInt) {
    return number.toFixed(num)
  }else{
    if(is_int(number)) {
      return number
    }else{
      return number.toFixed(num)
    }
  }
}


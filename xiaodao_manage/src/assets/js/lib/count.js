export default function count (mixedVar, mode) {
  //   example 1: count([[0,0],[0,-4]], 'COUNT_RECURSIVE')
  //   returns 1: 6
  //   example 2: count({'one' : [1,2,3,4,5]}, 'COUNT_RECURSIVE')
  //   returns 2: 6

  var key
  var cnt = 0

  if (mixedVar === null || typeof mixedVar === 'undefined') {
    return 0
  } else if (mixedVar.constructor !== Array && mixedVar.constructor !== Object) {
    return 1
  }

  if (mode === 'COUNT_RECURSIVE') {
    mode = 1
  }
  if (mode !== 1) {
    mode = 0
  }

  for (key in mixedVar) {
    if (mixedVar.hasOwnProperty(key)) {
      cnt++
      if (mode === 1 && mixedVar[key] &&
        (mixedVar[key].constructor === Array ||
          mixedVar[key].constructor === Object)) {
        cnt += count(mixedVar[key], 1)
      }
    }
  }

  return cnt
}
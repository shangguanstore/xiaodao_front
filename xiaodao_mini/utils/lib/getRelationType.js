module.exports = function getRelationType(relationStr) { 
  if (relationStr == '本人') {
    return 0
  }else if(relationStr == '母亲') {
    return 1
  }else if(relationStr == '父亲') {
    return 2
  }else if(relationStr == '其他') {
    return 3
  }else{
    return false
  }
}
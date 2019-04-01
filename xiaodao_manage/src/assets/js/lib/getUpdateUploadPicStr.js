export default function getUploadPicStr(list) {
    let picArr = []
    let picStr = ''
    for(var key in list) {
        if(list[key].response) {
          picArr.push(list[key].response.key)
        }else{
          picArr.push(list[key].name)
        }
    }
    for(var key in picArr) {
        picStr += picArr[key] + '|'
    }

    return picStr
}

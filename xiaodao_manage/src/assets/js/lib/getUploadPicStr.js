export default function getUploadPicStr(list) {
    let picArr = []
    let picStr = ''
    for(var key in list) {
        picArr.push(list[key].response.key)
    }
    for(var key in picArr) {
        picStr += picArr[key] + '|'
    }

    return picStr
}
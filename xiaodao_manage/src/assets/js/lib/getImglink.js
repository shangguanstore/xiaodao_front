import empty from './empty'
import config from '../config/index'

export default function getImglink(picStr,addExternal = true) {
    if(picStr) {
        var picArr = picStr.split('|')
        picArr = picArr.filter(function(item){
            if(!empty(item)) {
                return item
            }
        })
        if(addExternal) {
            picArr = picArr.map(function (item) {
                return config.Qiniu.EXTERNAL_LINK + item
            })
        }

        return picArr
    }else{
        return false
    }
}
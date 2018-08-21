export default function getRequestUrl (url, params) {
    console.log('get请求'+url+'的参数为：', JSON.stringify(params))
    for(var key in params) {
        if(url.indexOf('?') > -1) {
            url += '&' + key + '=' + params[key]
        }else{
            url += '?' + key + '=' + params[key]
        }
    }

    return url
}
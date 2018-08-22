export default function getRequestUrl (url, params) {
    console.log('get请求'+url+'的参数为：', JSON.stringify(params))
    params.XDEBUG_SESSION_START = 'PHPSTORM'
    for(var key in params) {
        if(url.indexOf('?') > -1) {
            url += '&' + key + '=' + params[key]
        }else{
            url += '?' + key + '=' + params[key]
        }
    }

    return url
}
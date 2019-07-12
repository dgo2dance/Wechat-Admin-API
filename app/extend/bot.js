const md5 = require('md5');

function txAiSign(params, appkey){
    let str = ''
    let keys = [];
     for(let key in params){
        keys.push(key);
     }
     keys.sort((a, b) => {
        return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
    });
    console.log(keys);
    keys.forEach((item)=>{
        if (params[item] !== ''){
            str = `${str}${item}=${encodeURI(params[item])}&`
        }
    })
    console.log(str);
	str = str + "app_key=" + appkey
	let sign = md5(str).toUpperCase()
	return sign
}

const  app_key  = "cf2rk3HHzm1nLRPA";
let params = {
	"app_id":"2117405317",
	"time_stamp": parseInt(new Date().getTime() / 1000),
	"nonce_str":"fa577ce340859f9fe",
    "session":"10000",
    "question":"你叫啥"
}


params.sign = txAiSign(params,app_key)
module.exports =  params
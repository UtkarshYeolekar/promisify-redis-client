let redis = require("./redis.js");

redis.initRedisClient();
redis.subscribeChannel('deployment',(channel,message)=>{
             console.log(message);
});
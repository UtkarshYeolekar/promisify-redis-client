//Updating redis key and publishing it to a channel
let redis = require('./update-redis.js');

//subscribing the channel.
let subs = require('./subscriber.js');

redis.updateRedis().then((res)=>{
    console.log("res",res);
})
.catch((err)=>{
    console.log("eree",err);
});

let redis = require('./update-redis.js');


redis.updateRedis().then((res)=>{
    console.log("res",res);
})
.catch((err)=>{
    console.log("eree",err);
});

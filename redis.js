let bluebird = require("bluebird"),
    redis = require('redis'),
    logger = require("./logger"),
    redisConfig = require("./config.js").redisConfig,
    maxReconnectingTry = 4,
    tryReconnecting  = 0,
    // subscriber will pass a callback function and when the redis client 
    // will recieve a message, it will call that callback function.
    callback    
bluebird.promisifyAll(redis.RedisClient.prototype);


let redisClient = null;
module.exports = {

        initRedisClient : () =>{
            redisClient =  redis.createClient(redisConfig().port,redisConfig().host)
            logger.debug("Initalizing Redis Client");

            redisClient.on('ready',function() {
            logger.debug(" subs Redis is ready");
            });

            redisClient.on('connect',function(){
                logger.debug('subs connected to redis');
                isRedisConnected = true;
            });

            redisClient.on("message", function(channel, message) {
                logger.info("message recieved on channel :", channel);
                callback(channel,message);
            });

            redisClient.on("error", function (err) {
                logger.debug("Error occurred while connecting to redis " + err);
                isRedisConnected = false;
            });

            redisClient.on('reconnecting',function(err){
                    tryReconnecting++;
                    logger.warn('reconnecting');
                    if(tryReconnecting >= maxReconnectingTry)
                    {
                        logger.error(err);
                        redisClient.quit();
                    }
            });
        },

        //redisClient: redisClient,

        getKeyValue: (key) => {
            return redisClient.getAsync(key)
                .then((res, err) => err ? Promise.reject("getKeyValue : "+err) : Promise.resolve(res));
        },

        setKeyValue: (key, value) => {
            return redisClient.setAsync(key, value)
                .then((res, err) => err ? Promise.reject("setkeyvalue : "+ err) : Promise.resolve(res));
        },

        doesKeyExist: key => {
            return redisClient.existsAsync(key)
                .then((res, err) => !res || err ? Promise.resolve(false) : Promise.resolve(res));
        },

        deleteKey: key => {
            return redisClient.delAsync(key)
                .then((res, err) => res ? Promise.resolve(res) : Promise.reject("deleteKey :"+err));
        },

        publishMessage: (channel,message) => redisClient.publish(channel,message),
        
        endConnection: () => redisClient.quit(),

        subscribeChannel: (channel,cb) => {
             redisClient.subscribe(channel)
             callback = cb; 
        }
    }



let redis = require("./redis.js"),
    logger = require("./logger.js"),
    _baseVersion = 1,
    _currentVersion , _deploymentVersion , _previousDeployedVersion = null;

const versionLabel = "v";
const key = "_deploymentVersion";
const channel = "deployment";


/*redis().deleteKey(key)
.then((res) => redis().doesKeyExist(key))*/
module.exports = {
    updateRedis: () => {
    redis.initRedisClient();
      return redis.doesKeyExist(key)
        .then((res) => res ? redis.getKeyValue(key) : null)
        .then((res) => {
            if (res != null) {
                logger.info("Current Deployed Version", res);
                _previousDeployedVersion = res;
                _currentVersion = parseInt(_previousDeployedVersion.split(versionLabel)[1]) + 1;
                _deploymentVersion = versionLabel + _currentVersion;
            }
            else
                _deploymentVersion = versionLabel + _baseVersion;
            redis.setKeyValue(key, _deploymentVersion)
        })
        .then((res) => {
            logger.info("version updated to : ", _deploymentVersion);
            let message = JSON.stringify({ "_deploymentVersion": _deploymentVersion });
            return redis.publishMessage(channel, message);
        }).then((res) => {
            logger.info("message published to channel :", channel);
            redis.endConnection();
            return Promise.resolve("Redis Updated and message published");
        })
        .catch((res) => {
            logger.error("catch block :->", res);
            redis.endConnection();
            return Promise.reject("Error in updating redis",res);
        });

    }
}
    
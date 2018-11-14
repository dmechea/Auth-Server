// redisDemo.js
const Promise = require("bluebird");

module.exports = class Whitelist {
  constructor(redis) {
    this.redis = Promise.promisifyAll(redis);
    this.client = redis.createClient();

    // this.client.on("connect", () => {
    //   console.log("Redis client connected");
    // });

    this.client.on("error", err => {
      console.log("Something went wrong " + err);
    });
  }

  async addToken(token, value) {
    return await this.client.setAsync(token, value);
  }

  async removeToken(token) {
    return await this.client.delAsync(token);
  }

  async lookUpToken(token) {
    if (!token) return null;
    return await this.client.getAsync(token);
  }

  // Will wipe out the whole whitelist
  async flushTokens() {
    return this.client.flushdbAsync();
  }

  shutdown() {
    this.flushTokens();
    this.client.quit();
  }
};

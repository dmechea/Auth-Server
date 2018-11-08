// redisDemo.js
const Promise = require("bluebird");

const redis = Promise.promisifyAll(require("redis"));

// bluebird.promisifyAll(redis);
const client = redis.createClient(); // this creates a new client

client.on("connect", () => {
  console.log("Redis client connected");
});

client.on("error", err => {
  console.log("Something went wrong " + err);
});

const addToken = async (token, value) => {
  return await client.setAsync(token, value);
};

const removeToken = async token => {
  return await client.delAsync(token);
};

const lookUpToken = async token => {
  if (!token) return null;
  return await client.getAsync(token);
};

// Will wipe out the whole whitelist
const flushTokens = async () => {
  return client.flushdbAsync();
};

module.exports = { addToken, removeToken, lookUpToken, flushTokens, client };

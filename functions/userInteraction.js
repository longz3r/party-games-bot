const config = require("../config.json")
const redisDB = require('redis');
const redis = redisDB.createClient({
    url: config.redisURL
});
var executed = false;
async function connectRedisDB() {
        if (!executed) {
            executed = true;
            await redis.connect()
        }
}
connectRedisDB()

async function createUser(userID, preBal) {
    const data = {
        exp: 0,
        language: "en",
        rtmBalance: preBal,
        coinBalance: 0,
        totalWinning: 0,
        totalBet: 0,
    }
    await redis.HSET(userID, data);
}

async function naptien(userID, amount) {
    await redis.HINCRBY(userID, "rtmBalance", amount)
}

async function getBalance(userID) {
    return await redis.HGET(userID, "rtmBalance");
}

async function getLanguage(userID) {
    return await redis.HGET(userID, "language");
}

async function setLanguage(userID, language) {
    await redis.HSET(userID, "language", language);
}

module.exports = { createUser, naptien, getBalance, getLanguage, setLanguage }
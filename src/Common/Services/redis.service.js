import { redisClient } from "../Clients/redis.client.js";

// Set
export const set = async (key, value, options) => {
    await redisClient.set(key, value, options);
};

// Get
export const get = async (key) => {
    return await redisClient.get(key);
};

// Delete
export const del = async (key) => {
    await redisClient.del(key);
};

// TTL
export const ttl = async (key) => {
    return await redisClient.ttl(key);
};

// Expiration "Seconds"
export const expire = async (key, expiration) => {
    await redisClient.expire(key, expiration);
};

// Clear
export const clear = async () => {
    await redisClient.flushAll();
};

// Close
export const close = async () => {
    await redisClient.quit();
};

// Calculating TTL
export const calculateTTL = (expiration) => {
    // expiration - currentTime
    const currentTime = Math.floor(Date.now() / 1000); // in seconds
    return expiration - currentTime;
}

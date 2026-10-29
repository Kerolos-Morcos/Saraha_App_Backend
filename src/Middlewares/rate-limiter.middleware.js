import rateLimit, { ipKeyGenerator } from "express-rate-limit"
import { TooManyRequestsException } from "../Common/Utils/Errors/exception.error.js"
import axios from "axios"
import RedisStore from "rate-limit-redis"
import { redisClient } from "../Common/Clients/redis.client.js"

function getIPDetails(ip) {
    return axios.get(`http://ip-api.com/json/${ip}`)
}

// console.log(await getIPDetails("38.0.101.76"));

export const createRateLimiter = () => rateLimit({
    windowMs: 1 * 60 * 1000,
    // limit: 2,
    limit: async (req) => {
        if (!req.headers['x-forwarded-for']) return 2;
        const { data } = await getIPDetails(req.headers['x-forwarded-for']);
        // console.log({ Ip_data: data, countryCode: data.countryCode });
        let max;
        switch (data.countryCode) {
            case 'EG':
                max = 10;
                break;
            case 'US':
                max = 5;
                break;
            default:
                max = 2;
                break;
        }
        return max;
        // return data;
    },
    standardHeaders: true,
    legacyHeaders: false,
    // ipv6Subnet: 56, 
    // message: new TooManyRequestsException("Too Many Requests", {}, "TOO_MANY_REQUESTS")
    // statusCode: 429
    requestPropertyName: "rateLimitInfo",
    skipFailedRequests: true,
    handler: (req, res, next) => {
        next(new TooManyRequestsException("Too Many Requests", {}, "TOO_MANY_REQUESTS"))
    },
    keyGenerator: (req) => {
        const ip = ipKeyGenerator(req.headers['x-forwarded-for'] ?? req.ip);
        // console.log({ ip: ip, url: req.url });
        return `${ip}_${req.url}`
    },
    store: new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
    })
})
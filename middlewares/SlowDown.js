import slowDown from "express-slow-down";

const speedLimiter = slowDown({
  windowMs: 15 * 1000, // 15 seconds
  delayAfter: 3, // allow 1 requests per 15 seconds, then...
  delayMs: 3000, // begin adding 500ms of delay per request above 100:
});

export default speedLimiter;

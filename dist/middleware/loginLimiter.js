"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginLimiter = void 0;
var express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.loginLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 5,
    message: {
        message: "Too many login attempts from this IP, please try again after a 60 second pause",
    },
    handler: function (req, res, next, options) {
        res.status(options.statusCode).send(options.message);
    },
    standardHeaders: true,
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

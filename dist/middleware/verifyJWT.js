"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "";
var verifyJWT = function (req, res, next) {
    var authHeader = req.headers.authorization || req.headers.Authorization;
    if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer "))) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    var token = authHeader.split(" ")[1];
    jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET, function (err) {
        if (err)
            return res.status(403).json({ message: "Forbidden" });
        next();
    });
};
exports.default = verifyJWT;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bcrypt_1 = __importDefault(require("bcrypt"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var client_1 = require("@prisma/client");
var ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "";
var REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "";
var prisma = new client_1.PrismaClient();
var register = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, firstName, lastName, foundUser, hashedPassword, user, accessToken, refreshToken;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password, firstName = _a.firstName, lastName = _a.lastName;
                if (!email || !password || !firstName || !lastName) {
                    return [2 /*return*/, res.status(400).json({ message: "All fields are required" })];
                }
                return [4 /*yield*/, prisma.user.findUnique({
                        where: {
                            email: email,
                        },
                    })];
            case 1:
                foundUser = _b.sent();
                if (foundUser) {
                    return [2 /*return*/, res.status(401).json({ message: "User Already exist" })];
                }
                if (password.length < 8) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ message: "Password must be at least 8 character" })];
                }
                return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
            case 2:
                hashedPassword = _b.sent();
                return [4 /*yield*/, prisma.user.create({
                        data: {
                            firstName: firstName,
                            lastName: lastName,
                            email: email,
                            password: hashedPassword,
                        },
                    })];
            case 3:
                user = _b.sent();
                accessToken = jsonwebtoken_1.default.sign({
                    UserInfo: {
                        id: user.id,
                    },
                }, ACCESS_TOKEN_SECRET, { expiresIn: "5" });
                refreshToken = jsonwebtoken_1.default.sign({ id: user.id }, REFRESH_TOKEN_SECRET, {
                    expiresIn: "7d",
                });
                // Create secure cookie with refresh token
                res.cookie("jwt", refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
                });
                // Send accessToken containing email and roles
                res.json({
                    message: "User registered successfully",
                    accessToken: accessToken,
                });
                return [2 /*return*/];
        }
    });
}); };
var login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, foundUser, match, accessToken, refreshToken;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                if (!email || !password) {
                    return [2 /*return*/, res.status(400).json({ message: "All fields are required" })];
                }
                return [4 /*yield*/, prisma.user.findUnique({
                        where: {
                            email: email,
                        },
                    })];
            case 1:
                foundUser = _b.sent();
                if (!foundUser) {
                    return [2 /*return*/, res.status(401).json({ message: "User Not exist" })];
                }
                return [4 /*yield*/, bcrypt_1.default.compare(password, foundUser.password)];
            case 2:
                match = _b.sent();
                if (!match)
                    return [2 /*return*/, res.status(401).json({ message: "Password Wrong" })];
                try {
                    accessToken = jsonwebtoken_1.default.sign({
                        UserInfo: {
                            id: foundUser.id,
                        },
                    }, ACCESS_TOKEN_SECRET, { expiresIn: "5" });
                    refreshToken = jsonwebtoken_1.default.sign({ id: foundUser.id }, REFRESH_TOKEN_SECRET, {
                        expiresIn: "7d",
                    });
                    // Create secure cookie with refresh token
                    res.cookie("jwt", refreshToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "none",
                        maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
                    });
                    // Send accessToken containing id
                    res.json({
                        message: "User Logged in successfully",
                        accessToken: accessToken,
                    });
                }
                catch (_c) {
                    return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                }
                return [2 /*return*/];
        }
    });
}); };
// @desc Refresh
// @route GET /auth/refresh
// @access Public -because access token has expired
var refresh = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var cookies, refreshToken, decoded, userInfo, foundUser, accessToken, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                cookies = req.cookies;
                if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt))
                    return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                refreshToken = cookies.jwt;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                decoded = jsonwebtoken_1.default.verify(refreshToken, REFRESH_TOKEN_SECRET);
                userInfo = decoded.userInfo;
                return [4 /*yield*/, prisma.user.findUnique({
                        where: {
                            id: userInfo.id,
                        },
                    })];
            case 2:
                foundUser = _b.sent();
                if (!foundUser)
                    return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                accessToken = jsonwebtoken_1.default.sign({
                    UserInfo: {
                        id: foundUser.id,
                    },
                }, ACCESS_TOKEN_SECRET, { expiresIn: "5" });
                res.json({ accessToken: accessToken });
                return [3 /*break*/, 4];
            case 3:
                _a = _b.sent();
                return [2 /*return*/, res.status(403).json({ message: "Forbidden" })];
            case 4: return [2 /*return*/];
        }
    });
}); };
// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
var logout = function (req, res) {
    var cookies = req.cookies;
    if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt))
        return res.sendStatus(204); //No content
    res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "none" });
    res.json({ message: "User logged out" });
};
exports.default = {
    login: login,
    refresh: refresh,
    logout: logout,
    register: register,
};

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
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
var getAllUsers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.user.findMany()];
            case 1:
                users = _a.sent();
                if (!(users === null || users === void 0 ? void 0 : users.length)) {
                    return [2 /*return*/, res.status(400).json({ message: "No users found" })];
                }
                res.json(users);
                return [2 /*return*/];
        }
    });
}); };
// @desc Create new user
// @route POST /users
// @access Private
var createNewUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, firstName, lastName, duplicate, hashedPwd, user;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password, firstName = _a.firstName, lastName = _a.lastName;
                // Confirm data
                if (!email || !password || !firstName || !lastName) {
                    return [2 /*return*/, res.status(400).json({ message: "All fields are required" })];
                }
                return [4 /*yield*/, prisma.user.findUnique({
                        where: {
                            email: email,
                        },
                    })];
            case 1:
                duplicate = _b.sent();
                if (duplicate) {
                    return [2 /*return*/, res.status(409).json({ message: "Duplicate User" })];
                }
                return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
            case 2:
                hashedPwd = _b.sent();
                return [4 /*yield*/, prisma.user.create({
                        data: {
                            firstName: firstName,
                            lastName: lastName,
                            email: email,
                            password: hashedPwd,
                        },
                    })];
            case 3:
                user = _b.sent();
                if (user) {
                    //created
                    res
                        .status(201)
                        .json({ message: "New user ".concat(firstName, " ").concat(lastName, " created") });
                }
                else {
                    res.status(400).json({ message: "Invalid user data received" });
                }
                return [2 /*return*/];
        }
    });
}); };
// @desc Update a user
// @route PATCH /users
// @access Private
var updateUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, email, password, firstName, lastName, user, hashedPassword, updatedUser;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, id = _a.id, email = _a.email, password = _a.password, firstName = _a.firstName, lastName = _a.lastName;
                // Confirm data
                if (!id || !email || !firstName || !lastName) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ message: "All fields except password are required" })];
                }
                return [4 /*yield*/, prisma.user.findUnique({
                        where: {
                            id: id,
                        },
                    })];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(400).json({ message: "User not found" })];
                }
                // Allow updates to the original user
                if (user && user.email === email && user.id === id) {
                    return [2 /*return*/, res.status(409).json({ message: "Duplicate username" })];
                }
                if (!password) return [3 /*break*/, 3];
                return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
            case 2:
                // Hash password
                hashedPassword = _b.sent(); // salt rounds
                _b.label = 3;
            case 3: return [4 /*yield*/, prisma.user.update({
                    where: {
                        id: id,
                    },
                    data: {
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        password: password && hashedPassword,
                    },
                })];
            case 4:
                updatedUser = _b.sent();
                res.json({
                    message: "".concat(updatedUser.firstName, " ").concat(updatedUser.lastName, " updated"),
                });
                return [2 /*return*/];
        }
    });
}); };
// @desc Delete a user
// @route DELETE /users
// @access Private
var deleteUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, todo, user, result, reply;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.body.id;
                // Confirm data
                if (!id) {
                    return [2 /*return*/, res.status(400).json({ message: "User ID Required" })];
                }
                return [4 /*yield*/, prisma.todo.findFirst({
                        where: {
                            userId: id,
                        },
                    })];
            case 1:
                todo = _a.sent();
                if (todo) {
                    return [2 /*return*/, res.status(400).json({ message: "User has assigned todos" })];
                }
                return [4 /*yield*/, prisma.user.findUnique({
                        where: {
                            id: id,
                        },
                    })];
            case 2:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(400).json({ message: "User not found" })];
                }
                return [4 /*yield*/, prisma.user.delete({
                        where: {
                            id: id,
                        },
                        select: {
                            firstName: true,
                            lastName: true,
                        },
                    })];
            case 3:
                result = _a.sent();
                reply = "User ".concat(result.firstName, " ").concat(result.lastName, " deleted");
                res.json(reply);
                return [2 /*return*/];
        }
    });
}); };
exports.default = {
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
};

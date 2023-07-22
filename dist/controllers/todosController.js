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
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
var getAllTodos = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, todos;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = (_a = req.query) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ message: "Please provide userId to get user Todos" })];
                }
                return [4 /*yield*/, prisma.todo.findMany({
                        where: {
                            userId: userId,
                        },
                    })];
            case 1:
                todos = _b.sent();
                if (!(todos === null || todos === void 0 ? void 0 : todos.length)) {
                    return [2 /*return*/, res.status(400).json({ message: "No todos found" })];
                }
                res.json(todos);
                return [2 /*return*/];
        }
    });
}); };
var createNewTodo = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, userId, duplicate, todo;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, name = _a.name, userId = _a.userId;
                if (!name || !userId) {
                    return [2 /*return*/, res.status(400).json({ message: "All fields are required" })];
                }
                if (typeof name !== "string")
                    return [2 /*return*/, res.status(400).json({ message: "Invalid todo data received" })];
                return [4 /*yield*/, prisma.todo.findUnique({
                        where: {
                            userId: userId,
                            name: name,
                        },
                    })];
            case 1:
                duplicate = _b.sent();
                if (duplicate) {
                    return [2 /*return*/, res.status(409).json({ message: "Todo already exist" })];
                }
                return [4 /*yield*/, prisma.todo.create({
                        data: {
                            name: name,
                            userId: userId,
                        },
                    })];
            case 2:
                todo = _b.sent();
                if (todo) {
                    return [2 /*return*/, res.status(201).json({ message: "New Todo created" })];
                }
                else {
                    return [2 /*return*/, res.status(400).json({ message: "Invalid todo data received" })];
                }
                return [2 /*return*/];
        }
    });
}); };
var updateTodo = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, completed, todo, updatedTodo;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, id = _a.id, completed = _a.completed;
                if (!id) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ message: "Please provide userId to update Todo" })];
                }
                return [4 /*yield*/, prisma.todo.findUnique({
                        where: {
                            id: id,
                        },
                    })];
            case 1:
                todo = _b.sent();
                if (!todo) {
                    return [2 /*return*/, res.status(400).json({ message: "Todo not found" })];
                }
                return [4 /*yield*/, prisma.todo.update({
                        where: {
                            id: id,
                        },
                        data: { completed: completed, updatedAt: new Date() },
                    })];
            case 2:
                updatedTodo = _b.sent();
                res.json({ message: "Todo '".concat(updatedTodo.name, "' updated") });
                return [2 /*return*/];
        }
    });
}); };
var deleteTodo = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, existedTodo, todo;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                id = (_a = req.params) === null || _a === void 0 ? void 0 : _a.id;
                return [4 /*yield*/, prisma.todo.findUnique({
                        where: {
                            id: id,
                        },
                    })];
            case 1:
                existedTodo = _b.sent();
                if (!existedTodo) {
                    return [2 /*return*/, res.status(400).json({ message: "Todo not found" })];
                }
                return [4 /*yield*/, prisma.todo.delete({
                        where: {
                            id: id,
                        },
                        select: {
                            name: true,
                        },
                    })];
            case 2:
                todo = _b.sent();
                res.json({ message: "Todo '".concat(todo.name, "' deleted") });
                return [2 /*return*/];
        }
    });
}); };
var deleteAllTodo = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, existedTodos;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.body.userId;
                return [4 /*yield*/, prisma.todo.findMany({
                        where: {
                            userId: userId,
                        },
                    })];
            case 1:
                existedTodos = _a.sent();
                if (!(existedTodos === null || existedTodos === void 0 ? void 0 : existedTodos.length)) {
                    return [2 /*return*/, res.status(400).json({ message: "Todo not found" })];
                }
                return [4 /*yield*/, prisma.todo.deleteMany({
                        where: {
                            userId: userId,
                        },
                    })];
            case 2:
                _a.sent();
                res.json({ message: "All Todo deleted successfully" });
                return [2 /*return*/];
        }
    });
}); };
exports.default = {
    getAllTodos: getAllTodos,
    createNewTodo: createNewTodo,
    updateTodo: updateTodo,
    deleteTodo: deleteTodo,
    deleteAllTodo: deleteAllTodo,
};

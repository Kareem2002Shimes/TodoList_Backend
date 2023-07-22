"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
var todosController_1 = __importDefault(require("../controllers/todosController"));
var verifyJWT_1 = __importDefault(require("../middleware/verifyJWT"));
router.use(verifyJWT_1.default);
router
    .route("/")
    .get(todosController_1.default.getAllTodos)
    .post(todosController_1.default.createNewTodo)
    .patch(todosController_1.default.updateTodo)
    .delete(todosController_1.default.deleteAllTodo);
router.delete("/:id", todosController_1.default.deleteTodo);
exports.default = router;

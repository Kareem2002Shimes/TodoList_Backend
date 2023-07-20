"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
var usersController_1 = __importDefault(require("../controllers/usersController"));
var verifyJWT_1 = __importDefault(require("../middleware/verifyJWT"));
router.use(verifyJWT_1.default);
router
    .route("/")
    .get(usersController_1.default.getAllUsers)
    .post(usersController_1.default.createNewUser)
    .patch(usersController_1.default.updateUser)
    .delete(usersController_1.default.deleteUser);
exports.default = router;

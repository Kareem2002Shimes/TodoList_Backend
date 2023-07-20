"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
var authController_1 = __importDefault(require("../controllers/authController"));
var loginLimiter_1 = require("../middleware/loginLimiter");
router.route("/register").post(loginLimiter_1.loginLimiter, authController_1.default.register);
router.route("/login").post(loginLimiter_1.loginLimiter, authController_1.default.login);
router.route("/refresh").get(authController_1.default.refresh);
router.route("/logout").post(authController_1.default.logout);
exports.default = router;

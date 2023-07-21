import express from "express";
const router = express.Router();
import todosController from "../controllers/todosController";
import verifyJWT from "../middleware/verifyJWT";
router.use(verifyJWT);
router
  .route("/")
  .get(todosController.getAllTodos)
  .post(todosController.createNewTodo)
  .patch(todosController.updateTodo)
  .delete(todosController.deleteTodo);

export default router;

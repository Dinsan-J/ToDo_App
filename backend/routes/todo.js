import express from "express";
import {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
  toggleTodo,
} from "../controllers/todoController.js";

import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticateToken);

router.post("/addtodo", createTodo);
router.get("/fetchTodos", getTodos);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);
router.patch("/toggle/:id", toggleTodo);

export default router;

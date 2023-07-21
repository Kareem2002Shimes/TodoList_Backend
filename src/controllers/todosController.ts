import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllTodos = async (req: Request, res: Response) => {
  const todos = await prisma.todo.findMany();

  if (!todos?.length) {
    return res.status(400).json({ message: "No todos found" });
  }

  res.json(todos);
};

const createNewTodo = async (req: Request, res: Response) => {
  const { name, userId } = req.body;

  if (!name || !userId) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (typeof name !== "string")
    return res.status(400).json({ message: "Invalid todo data received" });

  const duplicate = await prisma.todo.findUnique({
    where: {
      userId,
      name,
    },
  });

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate Todo" });
  }

  const todo = await prisma.todo.create({
    data: {
      name,
      userId,
    },
  });

  if (todo) {
    return res.status(201).json({ message: "New Todo created" });
  } else {
    return res.status(400).json({ message: "Invalid todo data received" });
  }
};

const updateTodo = async (req: Request, res: Response) => {
  const { id, completed } = req.body;
  if (!id || !completed) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const todo = await prisma.todo.findUnique({
    where: {
      id,
    },
  });

  if (!todo) {
    return res.status(400).json({ message: "Todo not found" });
  }

  const updatedTodo = await prisma.todo.update({
    where: {
      id,
    },
    data: { completed },
  });

  res.json({ message: `Todo '${updatedTodo.name}' updated` });
};

const deleteTodo = async (req: Request, res: Response) => {
  const { id } = req.body;

  if (!id) {
    return res
      .status(400)
      .json({ message: "Todo does not belong to the user" });
  }

  const todo = await prisma.todo.delete({
    where: {
      id,
    },
    select: {
      name: true,
    },
  });

  if (!todo) {
    return res.status(400).json({ message: "Todo not found" });
  }

  res.json({ message: `Todo '${todo.name}' deleted` });
};
const deleteAllTodo = async (req: Request, res: Response) => {
  const { id } = req.body;
  const data = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      todos: true,
    },
  });

  if (!data?.todos) {
    return res.status(400).json({ message: "No todos found" });
  }
  await prisma.todo.deleteMany({
    where: {
      userId: id,
    },
  });
  res.json({ message: "All Todo deleted successfully" });
};

export default {
  getAllTodos,
  createNewTodo,
  updateTodo,
  deleteTodo,
  deleteAllTodo,
};

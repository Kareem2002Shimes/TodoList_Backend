import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllTodos = async (req: Request, res: Response) => {
  const userId: any = req.query?.userId;
  if (!userId) {
    return res
      .status(400)
      .json({ message: "Please provide userId to get user Todos" });
  }
  const todos = await prisma.todo.findMany({
    where: {
      userId,
    },
  });

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
    return res.status(409).json({ message: "Todo already exist" });
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
  if (!id) {
    return res
      .status(400)
      .json({ message: "Please provide userId to update Todo" });
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
    data: { completed, updatedAt: new Date() },
  });

  res.json({ message: `Todo '${updatedTodo.name}' updated` });
};

const deleteTodo = async (req: Request, res: Response) => {
  const id: any = req.params?.id;
  const existedTodo = await prisma.todo.findUnique({
    where: {
      id,
    },
  });
  if (!existedTodo) {
    return res.status(400).json({ message: "Todo not found" });
  }

  const todo = await prisma.todo.delete({
    where: {
      id,
    },
    select: {
      name: true,
    },
  });

  res.json({ message: `Todo '${todo.name}' deleted` });
};
const deleteAllTodo = async (req: Request, res: Response) => {
  const { userId } = req.body;
  const existedTodos = await prisma.todo.findMany({
    where: {
      userId,
    },
  });
  if (!existedTodos?.length) {
    return res.status(400).json({ message: "Todo not found" });
  }

  await prisma.todo.deleteMany({
    where: {
      userId,
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

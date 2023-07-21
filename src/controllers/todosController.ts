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
  const { completed, id } = req.body;
  if (!completed || !id) {
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

  if (todo && todo.id === id) {
    return res.status(409).json({ message: "Duplicate Todo Name" });
  }
  const updatedTodo = await prisma.todo.update({
    where: {
      id,
    },
    data: { completed },
  });

  res.json(`'${updatedTodo.name}' updated`);
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
      id: true,
    },
  });

  if (!todo) {
    return res.status(400).json({ message: "Todo not found" });
  }

  const reply = `Todo deleted successfully`;

  res.json(reply);
};

export default {
  getAllTodos,
  createNewTodo,
  updateTodo,
  deleteTodo,
};

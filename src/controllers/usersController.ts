import { Request, Response } from "express";

import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const getAllUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();

  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }

  res.json(users);
};

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;

  // Confirm data
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for duplicate username
  const duplicate = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate User" });
  }

  // Hash password
  const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

  // Create and store new user
  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPwd,
    },
  });

  if (user) {
    //created
    res
      .status(201)
      .json({ message: `New user ${firstName} ${lastName} created` });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
};

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = async (req: Request, res: Response) => {
  const { id, email, password, firstName, lastName } = req.body;

  // Confirm data
  if (!id || !email || !firstName || !lastName) {
    return res
      .status(400)
      .json({ message: "All fields except password are required" });
  }

  // Does the user exist to update?
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // Allow updates to the original user
  if (user && user.email === email && user.id === id) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  let hashedPassword;
  if (password) {
    // Hash password
    hashedPassword = await bcrypt.hash(password, 10); // salt rounds
  }
  const updatedUser = await prisma.user.update({
    where: {
      id,
    },
    data: {
      firstName,
      lastName,
      email,
      password: password && hashedPassword,
    },
  });

  res.json({
    message: `${updatedUser.firstName} ${updatedUser.lastName} updated`,
  });
};

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "User ID Required" });
  }

  // Does the user still have assigned notes?
  const todo = await prisma.todo.findFirst({
    where: {
      userId: id,
    },
  });
  if (todo) {
    return res.status(400).json({ message: "User has assigned todos" });
  }

  // Does the user exist to delete?
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const result = await prisma.user.delete({
    where: {
      id,
    },
    select: {
      firstName: true,
      lastName: true,
    },
  });

  const reply = `User ${result.firstName} ${result.lastName} deleted`;

  res.json(reply);
};

export default {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

// @desc Login
// @route POST /auth
// @access Public

interface TokenInterface {
  userInfo: {
    id: string;
  };
}
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "";
const prisma = new PrismaClient();

const register = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const foundUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (foundUser) {
    return res.status(401).json({ message: "User Already exist" });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be greater than 8" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
    },
  });
  const accessToken = jwt.sign(
    {
      UserInfo: {
        id: user.id,
      },
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  // Create secure cookie with refresh token
  res.cookie("jwt", refreshToken, {
    httpOnly: true, //accessible only by web server
    secure: true, //https
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
  });

  // Send accessToken containing email and roles
  res.json({
    message: "User registered successfully",
    accessToken,
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  });
};
const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const foundUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!foundUser) {
    return res.status(401).json({ message: "User Not exist" });
  }

  const match = await bcrypt.compare(password, foundUser.password);

  if (!match) return res.status(401).json({ message: "Password Wrong" });

  try {
    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: foundUser.id,
        },
      },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign({ id: foundUser.id }, REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });
    // Create secure cookie with refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: true, //https
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
    });

    // Send accessToken containing email and roles
    res.json({ accessToken });
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = async (req: Request, res: Response) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

    const { userInfo } = decoded as TokenInterface;

    const foundUser = await prisma.user.findUnique({
      where: {
        id: userInfo.id,
      },
    });
    if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: foundUser.id,
        },
      },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken });
  } catch {
    return res.status(403).json({ message: "Forbidden" });
  }
};

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "none" });
  res.json({ message: "User logged out" });
};

export default {
  login,
  refresh,
  logout,
  register,
};

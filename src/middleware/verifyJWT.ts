import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "";
const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!(authHeader as string)?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = (authHeader as string).split(" ")[1];

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err: any) => {
    if (err) return res.status(403).json({ message: "Forbidden" });

    next();
  });
};

export default verifyJWT;

import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();

import cors from "cors";
import { corsOptions } from "./config/corsOptions";
import authRouter from "./routes/authRoutes";
import todoRouter from "./routes/todoRoutes";
import userRouter from "./routes/userRoutes";
const PORT = process.env.PORT || 5000;

app.use(cors(corsOptions));
app.use(express.json());

// app.use("/", express.static(path.join(__dirname, "public")));

// app.use("/", require("./routes/root"));
app.use("/auth", authRouter);
app.use("/todos", todoRouter);
app.use("/users", userRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

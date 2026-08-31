import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import projectRoutes from "./routes/projectRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import cookieParser from 'cookie-parser';

const PORT = process.env.PORT || 5000;
dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Mini PAIMANA API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

app.use(notFound);
app.use(errorHandler);

app.get(/.*/, (req, res) => {                  // in order to handle random api calls
       return res.json({message : "not found"})
    });

app.listen(PORT, () =>{
  connectDB();
  console.log("server is running")
});

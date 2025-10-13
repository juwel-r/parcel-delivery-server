import express, { Request, Response } from "express";
import { router } from "./app/router";
import { globalError } from "./app/middlewares/globalErrorHandler";
import { routeNotFound } from "./app/middlewares/routeNotFount";
import cookieParser from 'cookie-parser'
import cors from 'cors';

const app = express();
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin:"http://localhost:3000",
  credentials:true
}))

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to Parcel Delivery System.",
  });
});

app.use(globalError);

app.use(routeNotFound);

export default app;

/**
 * 
 * Will you allow search/filter by status or delivery time?
 * Can admins access all records with filters?
 */
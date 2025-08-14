import express, { Request, Response } from "express";
import { router } from "./app/router";
import { globalError } from "./app/middlewares/globalErrorHandler";
import { routeNotFound } from "./app/middlewares/routeNotFount";

const app = express();
app.use(express.json())

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to Parcel Delivery System.",
  });
});

app.use(globalError);

app.use(routeNotFound);

export default app;

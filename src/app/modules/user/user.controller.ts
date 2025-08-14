import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.service";

const userCreate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await UserServices.createUser(req.body);

    res.status(201).json({
      success: true,
      message: "User created",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const UserController = {
  userCreate,
};

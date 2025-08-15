import { Router } from "express";
import { UserController } from "./user.controller";
import { zodValidation } from "../../middlewares/zodValidation";
import { createUserZodSchema } from "./user.validation";

const router = Router();

router.post(
  "/register",
  // zodValidation(createUserZodSchema),
  UserController.createUser
);

router.get("/all-user", UserController.getAllUser);

export const UserRoutes = router;

import { Router } from "express";
import { UserController } from "./user.controller";
import { zodValidation } from "../../middlewares/zodValidation";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();

router.post(
  "/register",
  zodValidation(createUserZodSchema),
  UserController.createUser
);

router.get("/all-user", UserController.getAllUser);

router.patch("/:id",zodValidation(updateUserZodSchema), checkAuth(...Object.values(Role)), UserController.updateUser);

export const UserRoutes = router;

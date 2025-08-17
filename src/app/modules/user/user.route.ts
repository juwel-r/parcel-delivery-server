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

router.get("/all-user",checkAuth(Role.ADMIN), UserController.getAllUser);

router.patch('/swap-role/:id', checkAuth(Role.RECEIVER, Role.SENDER), UserController.swapRole)

router.patch("/update/:id",zodValidation(updateUserZodSchema), checkAuth(...Object.values(Role)), UserController.updateUser);


export const UserRoutes = router;

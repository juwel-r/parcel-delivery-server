import { Router } from "express";
import { UserController } from "./user.controller";
import { zodValidation } from "../../middlewares/zodValidation";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();

router.post("/register",zodValidation(createUserZodSchema),UserController.createUser);
router.get("/", checkAuth(Role.ADMIN), UserController.getAllUser);
router.get("/receivers", UserController.getReceivers);
router.get("/me", checkAuth(...Object.values(Role)), UserController.getMe);
router.get("/:id",checkAuth(...Object.values(Role)),UserController.getSingleUser);
router.patch("/:id/role",checkAuth(Role.RECEIVER, Role.SENDER),UserController.swapRole);
router.patch("/:id",checkAuth(...Object.values(Role)), zodValidation(updateUserZodSchema),UserController.updateUser);
router.delete("/:id",checkAuth(...Object.values(Role)), UserController.deleteUser);

export const UserRoutes = router;

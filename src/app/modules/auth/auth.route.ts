import { Router } from "express";
import { AuthController } from "./auth.controller";
import { zodValidation } from "../../middlewares/zodValidation";
import { updateUserZodSchema } from "../user/user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.post("/login", AuthController.credentialLogin);

router.post(
  "/refresh-token",
  checkAuth(...Object.values(Role)),
  AuthController.refreshToken
);

router.post("/logout", AuthController.logout);

router.post(
  "/reset-password",
  checkAuth(...Object.values(Role)),
  zodValidation(updateUserZodSchema),
  AuthController.resetPassword
);

export const AuthRouter = router;

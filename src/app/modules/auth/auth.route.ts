import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router()

router.post('/login', AuthController.credentialLogin)
router.post('/refresh-token', AuthController.refreshToken)
router.post('/logout', AuthController.logout)
router.post('/reset-password', AuthController.resetPassword)

export const AuthRouter = router
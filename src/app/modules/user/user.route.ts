import { Router } from "express";
import { UserController } from "./user.controller";

const router = Router()

router.post('/register', UserController.userCreate)

export const UserRoutes = router;
import { Router } from "express";
import { ParcelController } from "./parcel.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.post("/create",checkAuth(...Object.values(Role)), ParcelController.createParcel);

router.get('/all-parcel', checkAuth(Role.ADMIN), ParcelController.allParcel)

router.get('/my-parcel/:id', checkAuth(...Object.values(Role)), ParcelController.myParcel)

router.patch('/update-status/:id',checkAuth(...Object.values(Role)), ParcelController.updateParcelStatus)

router.patch('/cancel/:id',checkAuth(...Object.values(Role)), ParcelController.updateParcelStatus)

export const ParcelRouter = router;

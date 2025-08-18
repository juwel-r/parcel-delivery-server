import { Router } from "express";
import { ParcelController } from "./parcel.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { zodValidation } from "../../middlewares/zodValidation";
import { updateStatusLog } from "./parcel.validation";

const router = Router();

router.post("/create",checkAuth(...Object.values(Role)), ParcelController.createParcel);

router.get('/all-parcel', checkAuth(Role.ADMIN), ParcelController.allParcel)

router.get('/sender-parcel/:id', checkAuth(...Object.values(Role)), ParcelController.senderParcel)

router.get('/receiver-parcel/:id', checkAuth(...Object.values(Role)), ParcelController.receiverParcel)

router.patch('/update-status/:id',checkAuth(Role.ADMIN), zodValidation(updateStatusLog), ParcelController.updateParcelStatus)

router.patch('/cancel/:id',checkAuth(Role.SENDER, Role.RECEIVER), zodValidation(updateStatusLog), ParcelController.cancelParcel)

router.patch('/delivery/:id',checkAuth(Role.RECEIVER, Role.SENDER), zodValidation(updateStatusLog), ParcelController.deliveredParcel)

export const ParcelRouter = router;

import { Router } from "express";
import { ParcelController } from "./parcel.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { zodValidation } from "../../middlewares/zodValidation";
import { updateStatusLog } from "./parcel.validation";

const router = Router();

router.post("/create",checkAuth(...Object.values(Role)), ParcelController.createParcel);
router.get('/', checkAuth(Role.ADMIN), ParcelController.getAllParcel)
router.get('/:id', checkAuth(...Object.values(Role)), ParcelController.getSingleParcel)
router.get('/sender/:id', checkAuth(...Object.values(Role)), ParcelController.senderAllParcel)
router.get('/receiver/:id', checkAuth(...Object.values(Role)), ParcelController.receiverAllParcel)
router.get('/receiver/:id/delivered', checkAuth(...Object.values(Role)), ParcelController.receiverDeliveredParcel)
router.get('/receiver/:id/upcoming', checkAuth(...Object.values(Role)), ParcelController.receiverUpcomingParcel)
router.get('/:trackingId/history', ParcelController.deliveryHistory)
router.patch('/:id/update',checkAuth(Role.ADMIN), zodValidation(updateStatusLog), ParcelController.updateParcelStatus)
router.patch('/:id/cancel',checkAuth(Role.SENDER, Role.RECEIVER), zodValidation(updateStatusLog), ParcelController.cancelParcel)
router.patch('/:id/deliver',checkAuth(Role.RECEIVER, Role.SENDER), zodValidation(updateStatusLog), ParcelController.deliverParcel)
router.patch('/:id/block',checkAuth(Role.ADMIN),  ParcelController.blockParcel)


export const ParcelRouter = router;

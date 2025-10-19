import { Router } from "express";
import { ParcelController } from "./parcel.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { zodValidation } from "../../middlewares/zodValidation";
import { parcelZodSchema, updateStatusLog } from "./parcel.validation";

const router = Router();

router.post('/create',checkAuth(...Object.values(Role)),zodValidation(parcelZodSchema), ParcelController.createParcel);
router.get('/', checkAuth(Role.ADMIN), ParcelController.getAllParcel)
router.get('/dashboard-overview', checkAuth(Role.ADMIN), ParcelController.getDashboardOverview)
router.get('/my-parcels', checkAuth(...Object.values(Role)), ParcelController.myAllParcel)
router.get('/sender/:id', checkAuth(...Object.values(Role)), ParcelController.senderAllParcel)
router.get('/receiver/upcoming-parcel', checkAuth(...Object.values(Role)), ParcelController.receiverUpcomingParcel)
router.get('/receiver/delivered', checkAuth(...Object.values(Role)), ParcelController.receiverDeliveredParcel)
router.get('/receiver/:id', checkAuth(...Object.values(Role)), ParcelController.receiverAllParcel)
router.get('/:trackingId/history', ParcelController.deliveryHistory)
router.patch('/:id/update',checkAuth(Role.ADMIN), zodValidation(updateStatusLog), ParcelController.updateParcelStatus)
router.patch('/:id/cancel',checkAuth(Role.SENDER, Role.RECEIVER), ParcelController.cancelParcel)
router.patch('/:id/confirm-delivery',checkAuth(Role.RECEIVER, Role.SENDER), ParcelController.confirmDelivery)
router.patch('/:id/block',checkAuth(Role.ADMIN),  ParcelController.blockParcel)
router.get('/:id', checkAuth(...Object.values(Role)), ParcelController.getSingleParcel)


export const ParcelRouter = router;

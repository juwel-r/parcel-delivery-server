import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRouter } from "../modules/auth/auth.route";
import { ParcelRouter } from "../modules/parcel/parcel.route";
export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRouter,
  },
  {
    path: "/parcel",
    route: ParcelRouter,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

import { Router } from "express";
import UtilsController from "../controllers/utils.controller.js";
import { utilsService } from "../services/index.js";
import { userPassJwt } from "../middlewares/userPassJwt.js";
import { handlePolicies } from "../middlewares/handlePolicies.js";

const utilsController = new UtilsController(utilsService);

const router = Router();

router.get("/notifications", userPassJwt(), handlePolicies(["ADMIN"]), utilsController.getAdminNotifications);
router.get("/daytotalpayments/:day", userPassJwt(), handlePolicies(["ADMIN"]), utilsController.getDayTotalPayments);
router.get("/getqr", userPassJwt(), handlePolicies(["ADMIN"]), utilsController.getQr);

export default router;
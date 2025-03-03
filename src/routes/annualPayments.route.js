import { Router } from "express";
import AnnualPaymentsController from "../controllers/annualPayments.controller.js";
import { annualPaymentsService, usersService } from "../services/index.js";
import { handlePolicies } from "../middlewares/handlePolicies.js";
import { userPassJwt } from "../middlewares/userPassJwt.js";

const annualPaymentsController = new AnnualPaymentsController(annualPaymentsService, usersService)
const router = Router();

router.get("/:uid", userPassJwt(), handlePolicies(["PUBLIC"]), annualPaymentsController.getHistoryPayments);
router.get("/debtorshistory/:year", userPassJwt(), handlePolicies(["ADMIN"]), annualPaymentsController.getDebtorsHistory);
router.post("/", userPassJwt(), handlePolicies(["ADMIN"]), annualPaymentsController.addPayment);
router.get("/userdebthistory/:uid", userPassJwt(), handlePolicies(["ADMIN"]), annualPaymentsController.getUserDebtHistory);
router.get("/notifydebtor/:uid/:date", userPassJwt(), handlePolicies(["ADMIN"]), annualPaymentsController.notifyDebtor);
router.post("/notifyallannualdebtors", userPassJwt(), handlePolicies(["ADMIN"]), annualPaymentsController.notifyAllDebtors);

export default router;
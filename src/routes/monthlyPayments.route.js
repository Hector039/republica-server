import { Router } from "express";
import MothlyPaymentsController from "../controllers/mothlyPayments.controller.js";
import { monthlyPaymentsService, usersService } from "../services/index.js";
import { handlePolicies } from "../middlewares/handlePolicies.js";
import { userPassJwt } from "../middlewares/userPassJwt.js";

const mothlyPaymentsController = new MothlyPaymentsController(monthlyPaymentsService, usersService)
const router = Router();

router.get("/:month/:year", userPassJwt(), handlePolicies(["ADMIN"]), mothlyPaymentsController.getDebtorsHistory);
router.get("/:uid", userPassJwt(), handlePolicies(["PUBLIC"]), mothlyPaymentsController.getHistoryPayments);
router.post("/", userPassJwt(), handlePolicies(["ADMIN"]), mothlyPaymentsController.addPayment);

router.get("/notifydebtor/:uid/:date", userPassJwt(), handlePolicies(["ADMIN"]), mothlyPaymentsController.notifyDebtor);
router.post("/notifyallmonthlydebtors", userPassJwt(), handlePolicies(["ADMIN"]), mothlyPaymentsController.notifyAllDebtors);
router.get("/userdebthistory/:uid", userPassJwt(), handlePolicies(["ADMIN"]), mothlyPaymentsController.getUserDebtHistory);

export default router;
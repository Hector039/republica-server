import { Router } from "express";
import UtilsController from "../controllers/utils.controller.js";
import { utilsService } from "../services/index.js";
import { userPassJwt } from "../middlewares/userPassJwt.js";
import { handlePolicies } from "../middlewares/handlePolicies.js";

const utilsController = new UtilsController(utilsService);

const router = Router();

router.get("/notifications", userPassJwt(), handlePolicies(["ADMIN"]), utilsController.getAdminNotifications);
router.get("/fees", userPassJwt(), handlePolicies(["ADMIN"]), utilsController.getFees);
router.post("/updatefees", userPassJwt(), handlePolicies(["ADMIN"]), utilsController.updateFees);
router.post("/expenditures", userPassJwt(), handlePolicies(["ADMIN"]), utilsController.newExpenditures);

router.get("/dailyclub/:day", userPassJwt(), handlePolicies(["ADMIN"]), utilsController.getDailyClub);
router.get("/dailymonthly/:day", userPassJwt(), handlePolicies(["ADMIN"]), utilsController.dailyMonthly);
router.get("/dailyannual/:day", userPassJwt(), handlePolicies(["ADMIN"]), utilsController.dailyAnnual);
router.get("/dailyinscriptions/:day", userPassJwt(), handlePolicies(["ADMIN"]), utilsController.dailyInscriptions);
router.get("/dailyrequests/:day", userPassJwt(), handlePolicies(["ADMIN"]), utilsController.dailyRequests);
router.get("/dailyexpenditures/:day", userPassJwt(), handlePolicies(["ADMIN"]), utilsController.dailyExpenditures);

router.get("/monthlyclub/:month", userPassJwt(), handlePolicies(["ADMIN"]), utilsController.monthlyClub);
router.get("/monthly/:month", userPassJwt(), handlePolicies(["ADMIN"]), utilsController.monthly);
router.get("/monthlyannual/:month", userPassJwt(), handlePolicies(["ADMIN"]), utilsController.monthlyAnnual);
router.get("/monthlyinscriptions/:month", userPassJwt(), handlePolicies(["ADMIN"]), utilsController.monthlyInscriptions);
router.get("/monthlyrequests/:month", userPassJwt(), handlePolicies(["ADMIN"]), utilsController.monthlyRequests);
router.get("/monthlyexpenditures/:month", userPassJwt(), handlePolicies(["ADMIN"]), utilsController.getExpenditures);
router.get("/getmonthgridinfo/:month", userPassJwt(), handlePolicies(["ADMIN"]), utilsController.getMonthGridInfo);

router.put("/openclosefeatures/:fid/:pos", userPassJwt(), handlePolicies(["ADMIN"]), utilsController.openCloseFeatures);
router.get("/openclosefeatures", userPassJwt(), handlePolicies(["ADMIN"]), utilsController.getPositionFeatures);

export default router;
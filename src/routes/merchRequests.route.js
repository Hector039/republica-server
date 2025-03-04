import { Router } from "express";
import MerchRequestsController from "../controllers/merchRequests.controller.js";
import { merchRequestsService, usersService } from "../services/index.js";
import { handlePolicies } from "../middlewares/handlePolicies.js";
import { userPassJwt } from "../middlewares/userPassJwt.js";

const merchRequestsController = new MerchRequestsController(merchRequestsService, usersService)
const router = Router();

router.param("uid", merchRequestsController.param);
router.get("/newrequests", userPassJwt(), handlePolicies(["ADMIN"]), merchRequestsController.getNewMerchRequests);
router.get("/updatenewrequests", userPassJwt(), handlePolicies(["ADMIN"]), merchRequestsController.updateSeenNewMerchRequests);
router.get("/", userPassJwt(), handlePolicies(["PUBLIC"]), merchRequestsController.getMerchRequests);
router.get("/allusermerch", userPassJwt(), handlePolicies(["PUBLIC"]), merchRequestsController.getAllUserMerchRequest);
router.get("/getdebtorshistory/:day", userPassJwt(), handlePolicies(["ADMIN"]), merchRequestsController.getDebtorsHistory);
router.get("/merchrequestbyid/:mid", userPassJwt(), handlePolicies(["ADMIN"]), merchRequestsController.getMerchRequestById);
router.put("/updatepaymentstatus/", userPassJwt(), handlePolicies(["ADMIN"]), merchRequestsController.updateMerchPayment);
router.put("/:mid", userPassJwt(), handlePolicies(["PUBLIC"]), merchRequestsController.updateMerchRequest);
router.delete("/:mid", userPassJwt(), handlePolicies(["PUBLIC"]), merchRequestsController.deleteMerchRequest);
router.post("/:uid", userPassJwt(), handlePolicies(["PUBLIC"]), merchRequestsController.addMerchRequest);
router.get("/:uid", userPassJwt(), handlePolicies(["PUBLIC"]), merchRequestsController.getUserMerchRequest);

export default router;
import { Router } from "express";
import InscriptionsRequestsController from "../controllers/inscriptionsRequests.controller.js";
import { inscriptionsRequestsService, usersService, eventsService } from "../services/index.js";
import { handlePolicies } from "../middlewares/handlePolicies.js";
import { userPassJwt } from "../middlewares/userPassJwt.js";

const inscriptionRequestController = new InscriptionsRequestsController(inscriptionsRequestsService, usersService, eventsService)
const router = Router();

router.param("iid", inscriptionRequestController.param);
router.get("/newrequests", userPassJwt(), handlePolicies(["ADMIN"]), inscriptionRequestController.getNewInscriptionRequests);
router.get("/", userPassJwt(), handlePolicies(["PUBLIC"]), inscriptionRequestController.getInscriptionsRequests);
router.get("/:uid", userPassJwt(), handlePolicies(["PUBLIC"]), inscriptionRequestController.getUserInscriptionRequest);
router.get("/alluserinscriptions/:uid", userPassJwt(), handlePolicies(["PUBLIC"]), inscriptionRequestController.getAllUserInscriptions);
router.get("/getdebtorshistory/:day", userPassJwt(), handlePolicies(["ADMIN"]), inscriptionRequestController.getDebtorsHistory);
router.put("/", userPassJwt(), handlePolicies(["ADMIN"]), inscriptionRequestController.updateInscriptionRequest);
router.post("/:eid/:uid", userPassJwt(), handlePolicies(["PUBLIC"]), inscriptionRequestController.addInscriptionRequest);
router.delete("/:iid", userPassJwt(), handlePolicies(["PUBLIC"]), inscriptionRequestController.deleteInscriptionRequest);

export default router;
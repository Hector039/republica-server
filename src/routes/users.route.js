import { Router } from "express";
import UsersController from "../controllers/users.controller.js"
import { usersService } from "../services/index.js";
import { passportCall } from "../middlewares/passportCall.js";
import { handlePolicies } from "../middlewares/handlePolicies.js";
import { isSessionOn } from "../middlewares/isSessionOn.js";
import { userPassJwt } from "../middlewares/userPassJwt.js";

const usersController = new UsersController(usersService);
const router = Router();

router.post("/login", isSessionOn(), passportCall("login"), handlePolicies(["PUBLIC"]), usersController.userLogin);
router.post("/signin", isSessionOn(), passportCall("signin"), handlePolicies(["PUBLIC"]), usersController.userSignIn);
router.post("/passrestoration", isSessionOn(), handlePolicies(["PUBLIC"]), usersController.passRestoration);
router.post("/changeorforgot", handlePolicies(["PUBLIC"]), usersController.userChangePass);
router.get("/logout", handlePolicies(["PUBLIC"]), usersController.userLogout);
router.post("/monthlywithunpaid", userPassJwt(), handlePolicies(["ADMIN"]), usersController.getUsersWithUnpaidMonth);
router.post("/annualwithunpaid", userPassJwt(), handlePolicies(["ADMIN"]), usersController.getUsersWithUnpaidAnnual);
router.post("/", userPassJwt(), handlePolicies(["ADMIN"]), usersController.getUsers);
router.get("/", userPassJwt(), handlePolicies(["PUBLIC"]), usersController.getUser);
router.put("/updateuser", userPassJwt(), handlePolicies(["PUBLIC"]), usersController.updateUser);
router.post("/changeuserstatus", userPassJwt(), handlePolicies(["ADMIN"]), usersController.changeUserStatus);
router.post("/changeusergroup", userPassJwt(), handlePolicies(["ADMIN"]), usersController.changeUserGroup);
router.post("/changeuserfee", userPassJwt(), handlePolicies(["ADMIN"]), usersController.changeUserFee);


export default router;
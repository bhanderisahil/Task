const express = require('express')
const router = express.Router();
const userController = require("../controller/usercontroller");
const { authUser } = require("../middleware/auth")

router.post("/Register", userController.Register);
router.post("/login", userController.login);

router.post("/create_post", authUser, userController.create_post);
router.get("/get_post", authUser, userController.get_post);
router.delete("/delete_post/:id", authUser, userController.delete_post);
router.post("/update_post/:id", authUser, userController.update_post);


router.get("/dashboard_user", authUser, userController.dashboard_user);
router.get("/dashboard_alluser", authUser, userController.dashboard);

module.exports = router



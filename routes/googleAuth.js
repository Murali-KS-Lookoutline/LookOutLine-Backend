const express = require("express");
const passport = require("passport");
const { googleCallback } = require("../controllers/googleAuthController");

const router = express.Router();

router.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  googleCallback
);

module.exports = router;

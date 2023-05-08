const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const secrate = process.env.JWT_SECRATE;
require('dotenv').config()
let success = false;
//route 1 create user
router.post(
  "/create-user",
  //some validation of user info input
  body("username")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 chars long"),
  body("email").isEmail().withMessage("enter valid email id "),
  body("password")
    .isLength({ min: 5 })
    .withMessage("must be at least 3 chars long"),
  async (req, res) => {
    //check validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      success = false
      return res.status(400).json({ success, errors: errors.array() });
    }
    //check if the email id is already exist or not
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        success=false
        return res
          .status(400)
          .json({success, error: "sorry user with this email is alrady exist " });
      }
      //encrypt the password
      const salt = bcrypt.genSaltSync(10);
      const secPass = bcrypt.hashSync(req.body.password, salt);
      //create a new user if new info
      user = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: secPass,
      });

      const data = {
        user: {
          id: user._id,
        },
      };

      const authToken = jwt.sign(data, secrate);
      success=true;
      res.json({ success, authToken });
    } catch (error) {
      console.log(error.massage);
    }
  }
);

//route 2 login of user
router.post(
  "/login",
  //some validation of user info input
  body("email").isEmail().withMessage("enter valid email id "),
  body("password")
    .isLength({ min: 5 })
    .withMessage("can not be blank")
    .exists(),
  async (req, res) => {
    //check errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    const { password, email } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        res
          .status(400)
          .json({ success, error: "please login with correct credentials" });
      }
      const passwordCompare = bcrypt.compareSync(password, user.password);
      if (!passwordCompare) {
        res
          .status(400)
          .json({ success, error: "please login with correct credentials" });
      }

      const data = {
        user: {
          id: user._id,
        },
      };
      const authToken = jwt.sign(data, secrate);
      res.json({ authToken });
    } catch (error) {
      console.log(error.massage);
      res.status(400).send("internal server error occure");
    }
  }
);

//route 3 get user details

router.post("/getuser", fetchuser, async (req, res) => {
  try {
    let userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    success=true
    return res.json({ success, user });
  } catch (error) {
    return res.status(400).send(error);
  }
});

module.exports = router;

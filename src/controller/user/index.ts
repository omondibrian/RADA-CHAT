import Joi from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Router } from "express";

import User from "../../model/userModel";

const userRoutes = Router();

userRoutes.post("/login", async (req, res, next) => {
  try {
    // validate the user input
    const { error } = loginValidation(req.body);
    if (error) {
      throw new Error(`${error.details[0].message}`);
    }
    //check if the email doesn't exists
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(400)
        .send({ error: "Error authenticating please try again" });

    //check if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass)
      return res
        .status(422)
        .send({ error: "Error authenticating please try again" });

    console.log(user);
    //create and assing an authentification token
    const userToken = jwt.sign(
      { _id: user._id },
      process.env.SECREATE_TOKEN as string,
      {
        expiresIn: "1h",
        issuer: "Rada Chat",
      }
    );

    const refreshtoken = jwt.sign(
      { _id: user._id },
      process.env.REFRESH_SECREATE_TOKEN as string,
      {
        expiresIn: "30d",
        issuer: "Rada Chat",
      }
    );
   
    res.json({
      token:userToken,
      refreshtoken,
      msg: "Login Successfull",
    });
  } catch (err: any) {
    next(err);
  }
});

userRoutes.post("/register", async (req, res, next) => {
  try {
    const { error } = registrationValidation(req.body);
    if (error) {
      throw new Error(`${error.details[0].message}`);
    }

    //check if the email already exists
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) return res.status(422).send("email already exists");

    //encrpte the password
    const salt = await bcrypt.genSalt(10);
    const encrptedPass = await bcrypt.hash(req.body.password, salt);
    //create a new user
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: encrptedPass,
    });
    //save the user
    const { _id } = await user.save();
    res.status(200).send({ message: "Registration SuccessFull", id: _id });
  } catch (err: any) {
    next(err);
  }
});

export default userRoutes;

const loginValidation = (_entityBody: {
  email: string;
  password: string;
}): Joi.ValidationResult => {
  const schema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
  });

  const result = schema.validate(_entityBody);
  return result;
};

const registrationValidation = (_entityBody: any): Joi.ValidationResult => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    profilePic: Joi.any(),
    BackGroundImg: Joi.any(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
  });

  const result = schema.validate(_entityBody);
  return result;
};

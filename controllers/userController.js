const { UserModel } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.create = async (req, res) => {
  const { firstName, lastName, email, companyName, password, confirmPassword } =
    req.body;

  const URL = req.protocol + "://" + req.get("host");
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

  if (
    !(
      firstName &&
      lastName &&
      email &&
      companyName &&
      password &&
      confirmPassword &&
      req.file
    )
  ) {
    return res.status(404).json({ error: "required fields not provided" });
  } else if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  } else if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error: "Invalid password",
      message:
        "Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters",
    });
  } else if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match." });
  }

  try {
    const userExist = await UserModel.findOne({ email });
    const imageData = URL + "/userProfiles/" + req.file.filename;
    if (userExist) {
      return res.status(422).json({ error: "email already exist" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const data = new UserModel({
        ...req.body,
        profile: imageData,
        password: hashedPassword,
      });
      const response = await data.save();
      res.status(201).json({
        response: "Success",
        message: "User registered successfully",
        data: response,
      });
    }
  } catch (err) {
    res.status(500).json({ response: "failed", error: err.message });
  }
};

exports.get = async (req, res) => {
  try {
    const data = await UserModel.find();
    const totalRecord = await UserModel.countDocuments();
    res.status(200).json({ total: totalRecord, data: data });
  } catch (err) {
    res.status(500).json({ response: "failed", error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await UserModel.findById(req.params.id);
    if (data) {
      res.status(200).json({ status: "success", data: data });
    } else {
      res.status(404).json({ status: "failed", message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ response: "failed", error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    if (req.body.email) {
      const isEmailExist = await UserModel.findById(req.params.id);
      if (isEmailExist) {
        return res.status(422).json({ error: "email already exist" });
      } else if (!emailRegex.test(req.body.email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }
    }

    const url = req.protocol + "://" + req.get("host");

    let imageData;
    if (req.file) {
      imageData = url + "/userProfiles/" + req.file.filename;
    }

    let hashedPassword;
    if (req.body.password) {
      hashedPassword = await bcrypt.hash(req.body.password, 10);
    }

    const data = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        ...(!!hashedPassword ? { password: hashedPassword } : {}),
        ...(imageData ? { profile: imageData } : {}),
      },
      { new: true }
    );

    if (!data) {
      return res
        .status(404)
        .json({ status: "failed", message: "User not found" });
    }

    res.status(200).json({
      response: "Success",
      message: "User updated successfully",
      data: data,
    });
  } catch (err) {
    res.status(500).json({ response: "failed", error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const data = await UserModel.findByIdAndDelete(req.params.id);

    if (!data) {
      return res
        .status(404)
        .json({ status: "failed", message: "User not found" });
    }

    res.status(200).json({
      response: "Success",
      message: "User deleted successfully",
      data: data,
    });
  } catch (err) {
    res.status(500).json({ response: "failed", error: err.message });
  }
};

// signin
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).json({ message: "All input is required" });
    }

    const user = await UserModel.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const userInfo = {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        profile: user.profile,
      };
      const token = jwt.sign(userInfo, process.env.COOKIE_SECRET, {
        expiresIn: "5m",
      });
      user.token = token;
      return res.status(200).json({
        message: "Login successful",
        user: { ...userInfo, token: user.token },
        loggedInAt: new Date().toISOString(),
      });
    }
    return res.status(400).json({ message: "Invalid Credentials" });
  } catch (err) {
    res.status(500).json({ response: "failed", error: err.message });
  }
};

const userModel = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
	try {
		const newUser = req.body;
		const user = await userModel.create(newUser);
		res.status(201).json(user);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({ message: "Email and password are required" });
		}
		const user = await userModel.findOne({ email });
		if (!user) {
			return res.status(401).json({ message: "Invalid email or password" });
		}
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(401).json({ message: "Invalid email or password" });
		}
		// Generate JWT token
		const token = jwt.sign({ uname: user.userName, email: user.email, role: user.role }, "this is secret", { expiresIn: "1d" });
		res.status(200).json({ message: "Login successful", data: token });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

module.exports = {
	createUser,
	loginUser
};
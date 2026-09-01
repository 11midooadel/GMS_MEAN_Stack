const User = require('../models/users');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "Member",
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const normalizedRole =
      user.role?.trim().toLowerCase() === "admin"
        ? "Admin"
        : user.role;

    const token = jwt.sign(
      {
        userId: user._id,
        role: normalizedRole,
      },
      process.env.JWT_SECRET || "gym-management-secret",
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: normalizedRole,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Create User
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Name, email, password and role are required"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await user.save();

    res.status(201).json({
      message: "User created successfully",
      user
    });

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Get User by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Update User
const updateUser = async (req, res) => {
  try {
    const requesterRole = String(req.user.role || "").toLowerCase();

    if (
      requesterRole !== "admin" &&
      requesterRole !== "super admin" &&
      req.user.userId.toString() !== req.params.id
    ) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    const updates = {};

    if (req.body.name !== undefined) {
      updates.name = req.body.name;
    }

    if (req.body.email !== undefined) {
      updates.email = req.body.email;
    }

    if (req.body.password !== undefined) {
      updates.password = await bcrypt.hash(req.body.password, 10);
    }

    if (
      requesterRole === "admin" ||
      requesterRole === "super admin"
    ) {
      if (req.body.role !== undefined) {
        updates.role = req.body.role;
      }

      if (req.body.assignedTrainer !== undefined) {
        updates.assignedTrainer = req.body.assignedTrainer;
      }
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json(user);

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    const requesterRole = String(req.user.role || "").toLowerCase();

    if (
      requesterRole !== "admin" &&
      requesterRole !== "super admin" &&
      req.user.userId.toString() !== req.params.id
    ) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      message: "User deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const assignTrainer = async (req, res) => {
  try {
    const { memberId, trainerId } = req.body;

    const member = await User.findOne({
      _id: memberId,
      role: "Member"
    });

    const trainer = await User.findOne({
      _id: trainerId,
      role: "Trainer"
    });

    if (!member) {
      return res.status(404).json({
        message: "Member not found"
      });
    }

    if (!trainer) {
      return res.status(404).json({
        message: "Trainer not found"
      });
    }

    member.assignedTrainer = trainer._id;

    await member.save();

    res.status(200).json({
      message: "Trainer assigned successfully",
      member: {
        id: member._id,
        name: member.name,
        email: member.email
      },
      trainer: {
        id: trainer._id,
        name: trainer.name,
        email: trainer.email
      }
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  assignTrainer,
};
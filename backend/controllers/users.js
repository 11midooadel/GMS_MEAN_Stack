const User = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper to standardize role to match schema convention
const normalizeRole = (role) => {
  if (!role) return 'member';
  const r = role.toString().toLowerCase().replace(/\s+/g, '_');
  if (r === 'super_admin') return 'super_admin';
  if (r === 'admin') return 'admin';
  if (r === 'trainer') return 'trainer';
  return 'member';
};

// Helper to check for Super Admin or Admin authorization
const isSuperOrAdmin = (role) => {
  if (!role) return false;
  const normalized = normalizeRole(role);
  return normalized === 'admin' || normalized === 'super_admin';
};

// 1. REGISTER USER (Public)
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'member', // Default registration role
    });

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

// 2. LOGIN USER (Public)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    // const normalizedRole =
    //   user.role?.trim().toLowerCase() === "admin"
    //     ? "Admin"
    //     : user.role;

    const token = jwt.sign(
      {
        userId: user._id,
        role: normalizeRole(user.role),
      },
      process.env.JWT_SECRET || 'this-is-the-secret-key',
      {
        expiresIn: '1d',
      }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: normalizeRole(user.role),
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

// 3. GET PROFILE
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password')
      .populate('assignedTrainer', 'name email phone');

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

// 4. CREATE USER (Admin / Super Admin)
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, assignedTrainer } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists"
      });
      return res.status(400).json({ message: 'Email already exists' });
    }


    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: normalizeRole(role),
      phone: phone || '',
      assignedTrainer: assignedTrainer || null,
    });

    await user.save();
    const result = user.toObject();
    delete result.password;
   // res.status(201).json({ message: "User created successfully", user });


  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// 5. GET ALL USERS (Supports ?role=trainer or ?role=member query params)
const getAllUsers = async (req, res) => {
  try {
    const filter = {};
    if (req.query.role) {
      filter.role = new RegExp(`^${req.query.role.trim()}$`, 'i');
    }

    const users = await User.find(filter)
      .select('-password')
      .populate('assignedTrainer', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// 6. GET USER BY ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('assignedTrainer', 'name email phone');

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// 7. UPDATE USER (Allows updating Role, Name, Phone, Email, Password, Trainer)
const updateUser = async (req, res) => {
  try {
    const isAuthorized =
      isSuperOrAdmin(req.user?.role) ||
      req.user?.userId?.toString() === req.params.id;

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updates = {};
    if (req.body.name !== undefined) updates.name = req.body.name.trim();
    if (req.body.email !== undefined) updates.email = req.body.email.toLowerCase().trim();
    if (req.body.phone !== undefined) updates.phone = req.body.phone;

    // Only hash & update password if a non-empty string is provided
    if (req.body.password && req.body.password.trim() !== '') {
      updates.password = await bcrypt.hash(req.body.password, 10);
    }

    // Role and Assigned Trainer modifications restricted to Admin / Super Admin
    if (isSuperOrAdmin(req.user?.role)) {
      if (req.body.role !== undefined) {
        updates.role = normalizeRole(req.body.role);
      }
      if (req.body.assignedTrainer !== undefined) {
        updates.assignedTrainer = req.body.assignedTrainer || null;
      }
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    )
      .select('-password')
      .populate('assignedTrainer', 'name email phone');

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

// 8. DELETE USER
const deleteUser = async (req, res) => {
  try {
 const isAuthorized = isSuperOrAdmin(req.user?.role) || req.user?.userId?.toString() === req.params.id;

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Access denied' });
    }


    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// 9. ASSIGN TRAINER
const assignTrainer = async (req, res) => {
  try {
    const { memberId, trainerId } = req.body;

    const member = await User.findOne({ _id: memberId, role: /^member$/i });
    const trainer = await User.findOne({ _id: trainerId, role: /^trainer$/i });

    if (!member) return res.status(404).json({ message: 'Member not found' });
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });

    member.assignedTrainer = trainer._id;

    await member.save();

    res.status(200).json({
      message: 'Trainer assigned successfully',
      member: {
        id: member._id,
        name: member.name,
        email: member.email,
        assignedTrainer: trainer._id,
      },
      trainer: {
        id: trainer._id,
        name: trainer.name,
        email: trainer.email,
      },
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
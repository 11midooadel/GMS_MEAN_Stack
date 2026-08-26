const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// MongoDB connection string (local instance or MongoDB Atlas)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gms_db';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Routes setup
const userRoutes = require('./routes/users');
const memberRoutes = require('./routes/members');
const trainerRoutes = require('./routes/trainers');

app.use('/api/users', userRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/trainers', trainerRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


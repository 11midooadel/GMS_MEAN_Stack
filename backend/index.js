const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

// 1. Load environment variables
dotenv.config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 5000;

// 2. Global Middleware
app.use(cors()); // Allows Angular frontend to make requests
app.use(express.json()); // Parse JSON request bodies

// 3. API Routes
app.use("/users", require("./routes/users"));
app.use("/payments", require("./routes/payments"));
app.use("/classes", require("./routes/classes"));
app.use("/enrollments", require("./routes/ClassEnrollment"));
app.use("/attendance", require("./routes/attendance"));
app.use("/plans", require("./routes/plans"));
app.use("/subscriptions", require("./routes/subscriptions"));
app.use("/healthRecord", require("./routes/healthRecord"));
app.use("/workoutPlans", require("./routes/workoutPlans"));

// 4. Database Connection & Server Initialization
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
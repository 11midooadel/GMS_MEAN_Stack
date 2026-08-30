const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
	.then(() => {
		console.log("Connected to MongoDB");
	})
	.catch((err) => {
		console.log(err);
	});

app.listen(process.env.PORT, () => {
	console.log(`Server is running on port ${process.env.PORT}`);
});

app.use(express.json());
app.use("/users", require("./routes/users"));
app.use("/payments", require("./routes/payments"));
app.use("/classes", require("./routes/classes"));
app.use("/enrollments", require("./routes/ClassEnrollment"));
app.use("/attendance", require("./routes/attendance"));
app.use("/plans", require("./routes/plans"));
app.use("/subscriptions", require("./routes/subscriptions"));
// app.use("/members", require("./routes/members"));
// app.use("/trainers", require("./routes/trainers"));
app.use("/healthRecord", require("./routes/healthRecord"));
const express = require("express");
const mongoose = require("mongoose");
const testAuth = require("./auth/auth");

const app = express();

app.use(express.json());

mongoose.connect("mongodb://localhost:27017/gms")
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log(err);
    });

app.use("/users", require("./routes/users"));
app.use("/classes", require("./routes/classes"));
app.use("/enrollments", require("./routes/ClassEnrollment"));
app.use("/attendance", require("./routes/attendance"));

const port = 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
const express = require("express");
const app = express();

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/gms").then(() => {
	console.log("Connected to MongoDB");
}).catch((err) => {
	console.log(err);
})

const port = 3000;

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

app.use(express.json());
app.use("/users", require("./routes/users"));
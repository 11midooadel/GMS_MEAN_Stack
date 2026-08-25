const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({

	userName: {
		type: String,
		required: [true, "userName is required"],
		minlength: [3, "userName must be more than 3"],
		maxlength: [20, "userName must be less than 10"]
	},

	password: {
		type: String,
		required: [true, "password is required"],
		minlength: [3, "password must be more than 3"]
	},

	email: {
		type: String,
		required: [true, "email is required"],
		unique: [true, "email must be unique"]
	},

	address: {
		city: {
			type: String,
			minlength: [3, "city must be more than 3"]
		},

		country: {
			type: String,
			minlength: [3, "country must be more than 3"]
		},

		street: {
			type: String,
			minlength: [3, "street must be more than 3"]
		}
	},

	role: {
		type: String,
		enum: ["admin", "coach", "member"],
		required: [true, "role is required"]
	}
})

userSchema.pre("save", async function () {
	let salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
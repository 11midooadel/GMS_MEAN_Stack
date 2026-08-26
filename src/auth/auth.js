const User = require("../models/users");

const testAuth = async (req, res, next) => {
    try {
        const userId = req.header("userid");

        if (!userId) {
            return res.status(401).json({
                message: "userid header is required"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        req.user = user;

        next();

    } catch (error) {
        res.status(500).json({
            message: "Test authentication error",
            error: error.message
        });
    }
};

module.exports = testAuth;
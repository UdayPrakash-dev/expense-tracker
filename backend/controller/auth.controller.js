const argon2 = require("argon2");
const User = require("../models/users.model")
const jwt = require("jsonwebtoken");

async function signup(req, res) {
    try {
        const { name, email, pass } = req.body;

        if (!name || !email || !pass) {
            return res.status(400).json({
                message: "Name, Email and Password are required"
            });
        }

        if (typeof pass !== 'string' || pass.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const normalizedName = name.trim();

        const exists = await User.findOne({ email: normalizedEmail });

        if (exists) {
            return res.status(409).json({
                message: "Email already registered!"
            });
        }

        const passwordHash = await argon2.hash(pass);
        const user = await User.create({
            name: normalizedName,
            email: normalizedEmail,
            passwordHash
        });

        console.log(`User Added Successfully: ${user.name}`);

        return res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email
        });
    }
    catch (error) {
        console.log(error);
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Email already registered!"
            });
        }
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

async function login(req, res) {
    try {
        const { email, pass } = req.body;

        if (!email || !pass) {
            return res.status(400).json({
                message: "email and password are required for login!!"
            });
        }
        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(401).json({
                message: "Invalid Email or Password"
            });
        }
        const validPass = await argon2.verify(
            user.passwordHash,
            pass
        );

        if (!validPass) {
            return res.status(401).json({
                message: "Invalid Email or Password"
            });
        }
        const secret = process.env.JWT_SECRET;
        const token = jwt.sign(
            { id: user._id },
            secret,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

module.exports = {
    signup,
    login
};
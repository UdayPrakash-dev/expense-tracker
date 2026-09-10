const jwt = require("jsonwebtoken");

function authMiddleWare(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                error: "Authorization token required!!"
            });
        }

        const [scheme, token] = authHeader.split(" ");

        if (scheme !== "Bearer" || !token) {
            return res.status(401).json({
                message: "Invalid authorisation token"
            });
        }

        const secret = process.env.JWT_SECRET || "super_secret_jwt_key_expense_tracker_2026_dev";
        const decoded = jwt.verify(
            token,
            secret
        );

        req.user = decoded;

        next();


    }
    catch (error) {
        console.log(error);
        return res.status(401).json({
            message: "Invalid or expired token!"
        });
    }
}

module.exports = authMiddleWare;
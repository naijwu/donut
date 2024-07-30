import jwt from 'jsonwebtoken'

export const auth = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({
            message: "Unauthorized"
        })
        jwt.verify(token, process.env.TOKEN_SECRET);
        return next();
    } catch (err) {
        console.error("Auth middleware error: ", err);
        res.status(401).json({
            message: "Unauthorized"
        })
    }
}
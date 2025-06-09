import jwt from 'jsonwebtoken';
import authController from "../modules/auth/authController.js";

const Authorization = (req, res, next) => {
    const authToken = req.headers['authorization'];
    if (!authToken) return res.status(401).json({ err: "Token não fornecido" });

    const parts = authToken.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ err: "Token inválido" });
    }

    const token = parts[1];
    jwt.verify(token, authController.JWTSecret, (err, data) => {
        if (err) return res.status(401).json({ err: "Token inválido ou expirado" });

        req.token = token;
        req.loggedUser = {
            id: data.id,
            email: data.email
        };
        next();
    });
};

export default { Authorization };

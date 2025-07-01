import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import authController from "../modules/auth/auth.controller.js";

// Estendendo a interface Request do Express
declare global {
  namespace Express {
    export interface Request {
      token?: string;
      loggedUser?: {
        id: string;
        email: string;
      };
    }
  }
}

/**
 * @description Middleware para verificar a autenticação via token JWT.
 */
const Authorization = (req: Request, res: Response, next: NextFunction): void => {
    const authToken = req.headers['authorization'];
    if (!authToken) {
        res.status(401).json({ error: "Token not provided" });
        return;
    }

    const parts = authToken.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        res.status(401).json({ error: "Invalid token format" });
        return;
    }

    const token = parts[1];

    jwt.verify(token, authController.JWTSecret, (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
        if (err) {
            res.status(401).json({ error: "Token invalid or expired" });
            return;
        }

        if (typeof decoded === 'object' && decoded?.id && decoded?.email) {
            req.token = token;
            req.loggedUser = {
                id: decoded.id,
                email: decoded.email
            };
            next(); // Passa para a próxima função no pipeline
        } else {
            res.status(401).json({ error: "Malformed token payload" });
        }
    });
};

export default { Authorization };
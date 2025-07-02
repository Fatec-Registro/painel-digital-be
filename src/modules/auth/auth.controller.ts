import { Request, Response } from 'express';
import userService from "../user/user.service.js";
import User from '../user/user.model.js';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';

const JWTSecret: string = 'apipainelsecret';
const JWTRefreshSecret: string = 'apipainelrefreshsecret'; 

/**
 * @description Realiza o login do usuário, gerando access e refresh tokens.
 */
const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: "Email and password are required" });
            return;
        }

        const user = await userService.getOne(email);
        if (!user) {
            res.status(404).json({ error: "User not found." });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.senha);
        if (!isPasswordValid) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }

        const payload = { id: user._id, email: user.email };
        const accessToken = jwt.sign(payload, JWTSecret, { expiresIn: '15m' });
        const refreshToken = jwt.sign(payload, JWTRefreshSecret, { expiresIn: '7d' });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({ accessToken });
    } catch (error: unknown) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * @description Gera um novo access token usando o refresh token do cookie.
 */
const refreshToken = (req: Request, res: Response): void => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            res.status(401).json({ error: "Refresh token not found" });
            return;
        }

        jwt.verify(token, JWTRefreshSecret, (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
            if (err) {
                res.status(403).json({ error: "Refresh token is invalid or has expired." });
                return;
            }

            if (typeof decoded === 'object' && decoded?.id && decoded?.email) {
                const payload = { id: decoded.id, email: decoded.email };
                const newAccessToken = jwt.sign(payload, JWTSecret, { expiresIn: '15m' });
                res.status(200).json({ accessToken: newAccessToken });
            } else {
                res.status(403).json({ error: "Invalid token payload." });
            }
        });
    } catch (error: unknown) {
        console.error("Erro no refresh token:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * @description Retorna os dados do usuário logado.
 */
const me = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.loggedUser?.id;
        if (!userId) {
            res.status(401).json({ error: "Authentication details not found." });
            return;
        }

        const user = await User.findById(userId).select('-senha');
        if (!user) {
            res.status(404).json({ error: "User not Found" });
            return;
        }

        res.status(200).json({
            id: user._id,
            email: user.email,
        });
    } catch (error: unknown) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export default {
    loginUser,
    refreshToken,
    me,
    JWTSecret
};
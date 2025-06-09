import userService from "../user/userService.js";
import User from '../user/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWTSecret = 'apipainelsecret';
const JWTRefreshSecret = 'apipainelrefreshsecret'; 

// Login do usuário - com access e refresh tokens
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) return res.status(400).json({ err: "E-mail invalid" });

        const user = await userService.getOne(email);
        if (!user) return res.status(404).json({ err: "E-mail not found." });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ err: "Credential invalid!" });

        const accessToken = jwt.sign({ id: user._id, email: user.email }, JWTSecret, { expiresIn: '15m' });

        const refreshToken = jwt.sign({ id: user._id, email: user.email }, JWTRefreshSecret, { expiresIn: '7d' });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({ accessToken });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const refreshToken = (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            return res.status(401).json({ err: "Refresh token not found" });
        }

        jwt.verify(token, JWTRefreshSecret, (err, data) => {
            if (err) {
                return res.status(403).json({ err: "Refresh token invalid." });
            }

            const newAccessToken = jwt.sign(
                { id: data.id, email: data.email },
                JWTSecret,
                { expiresIn: '15m' }
            );

            return res.status(200).json({ accessToken: newAccessToken });
        });
    } catch (error) {
        console.error("Erro no refresh token:", error);
        return res.status(500).json({ err: "Internal Server Error" });
    }
};


const me = async (req, res) => {
    try {
        const user = await User.findById(req.loggedUser.id);
        if (!user) return res.status(404).json({ err: "User not Found" });
        // Colocar as informações que devem ser retornadas
        return res.status(200).json({
            id: user._id,
            email: user.email,
        });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export default {
    loginUser,
    refreshToken,
    me,
    JWTSecret
};

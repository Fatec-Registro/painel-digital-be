import authController from "../modules/auth/authController.js";
import jwt from 'jsonwebtoken';


const Authorization = (req, res, next) => {
    const authToken = req.headers['authorization']
    if(authToken != undefined){
        const bearer = authToken.split(' ');
        var token = bearer[1]
        jwt.verify(token, authController.JWTSecret,(err,data) => {
            if(err){
                res.status(401)
                res.json({err:"invalid Token!"})
            }else{
                req.token = token
                req.loggedUser = {
                    id: data.id,
                    email: data.email
                }
                next()
            }
        })
    }else{
        res.status(401)
        res.json({err:"invalid Token"})
    }
}
export default { Authorization }
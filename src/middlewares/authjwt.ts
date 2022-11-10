import { config } from './../config/config';
import * as jwt from 'jsonwebtoken'
import { Request, Response,NextFunction } from 'express';

const verifyToken= (req: Request,res:Response,next:NextFunction)=>{
    
    try {
        const token= <string> req.headers["x-access-token"];
        let jwtPayload = jwt.verify(token,config.SECRET);
        res.locals.jwtPayload = jwtPayload;
    } catch (error) {
        return res.status(401).json ({message:"Unauthorized"});
    }
    const {user_id,email}=req.body;
    const newToken = jwt.sign({user_id,email},config.SECRET,{expiresIn:'1h'});
    res.setHeader('token',newToken);
    next();
}

export {verifyToken}
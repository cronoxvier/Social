import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken'
import { AuthRequest } from '../interfaces/token';
import { Pharmacy } from '../models/Pharmacy'

const validarJWT = async (req: AuthRequest, res: Response, next: NextFunction) => {

    const token = <string>req.headers["x-access-token"];

    if (!token) {
        return res.status(401).send({
            msg: "Unauthorized"
        })
    }
    try {
        const apyload = Object.values(jwt.verify(token, process.env.SECRET))
        // console.log(apyload[0].id)
        const pharmacy = await Pharmacy.findOne({
            where: {
                id: apyload[0].id
            }
        })
        if (!pharmacy) {
            return res.status(400).json({
                message: "No existe esta farmacia"
            })
        }


        req.user = pharmacy

        next();
    } catch (error) {
        console.log(error, 'aqui esta el error')
    }

}





export { validarJWT }
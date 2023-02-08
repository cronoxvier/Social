import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import { User } from '../models/user';
import { Role } from '../models/role';
import { Pharmacy } from '../models/Pharmacy';
import { Driver } from '../models/driver';

import { generarJWT } from '../helper/create-jwt'



const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({
            where: { email },
            include: [
                {
                    model: Role,
                    as: 'role'
                },
            ]

        })
        if (!user) {
            return res.status(400).send({
                ok: false,
                message: 'Wrong Credentials',
                mensaje: 'Email incorrecto',
                status: 404
            })
        }

        if (user.role_id !== 1) {
            return res.status(400).send({
                ok: false,
                mensage: 'Wrong Credentials',
                mensaje: 'Usuario no valido'
            })
        }

        /**
         * Password verification
         */

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(400).json({
                ok: false,
                message: 'Wrong Credentials',
                mensaje: 'Contraseña incorrecta',
                status: 409
            })
        }
        console.log('aqui')
        if (user.isDeleted) {
            return res.status(400).send({
                ok: false,
                message: 'This user was deleted contact an administrator',
                mensaje: 'Usuario Eliminado'
            })
        }

        const token = await generarJWT(user)
        res.status(200).send({
            ok: true,
            message: "Welcome",
            mensaje: "Bienvenido",
            id: user.id,
            user: user.email,
            firstname: user.first_name,
            lastname: user.last_name,
            phone: user.phone,
            password: user.password,
            role: user.role_id,
            img: user.img,
            token
        })
    } catch (error) {
        res.status(500).send({
            mensaje: 'Error desconocido',
            message: 'Unknow error',
            error
        })

        // throw error
    }
}
const loginPanel = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        if (!(email && password)) {
            return res.status(204).json({
                mensaje: "Id invalido",
                message: "Id invalid"
            })
        }
        const pharmacy = await Pharmacy.findOne({ where: { email } })
        if (!pharmacy) {
            return res.status(400).send({
                message: 'Wrong email',
                mensaje: 'Email incorrecto',
                status: 404
            })
        }
        if (pharmacy.role_id !== 2 && pharmacy.role_id !== 4&&pharmacy.role_id !== 5) {
            return res.status(200).send({
                mensage: 'User not valid',
                mensaje: 'Usuario no valido'
            })
        }

        const passwordMatch = await bcrypt.compare(password, pharmacy.password);
        if (!passwordMatch) {
            return res.status(400).json({
                message: 'Wrong password',
                mensaje: 'Contraseña incorrecta',
                status: 409
            })
        }

        const token = await generarJWT(pharmacy)

        res.status(200).send({
            ok: true,
            message: 'Login',
            mensaje: 'Seccion Iniciada',
            pharmacy,
            token
        })
    } catch (error) {
        res.status(500).send({
            mensaje: 'Error desconocido',
            message: 'Unknow error',
            error
        })

        // throw error
    }
}
const loginDriver = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        console.log(email, password)
        const user = await Driver.findOne({
            where: { email }
        })
       

        if (user.active == false) {
            return res.status(200).send({
                mensage: 'User not active',
                mensaje: 'Usuario no activo'
            })
        }
        if (user.role_id !== 3) {
           
            return res.status(200).send({
                mensage: 'User not valid',
                mensaje: 'Usuario no valido'
            })
        }

        if (!user) {
            console.log('email')
            return res.status(400).send({
                ok: false,
                message: 'Wrong email',
                mensaje: 'Email incorrecto',
                status: 404
            })
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log('password', passwordMatch)
        if (!passwordMatch) {
            return res.status(400).json({
                message: 'Wrong password',
                mensaje: 'Contraseña incorrecta',
                status: 409
            })
        }


        res.status(200).send({
            ok: true,
            message: "Welcome",
            mensaje: "Bienvenido",
            user
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false,
            mensaje: 'Error desconocido',
            message: 'Unknow error',
            error
        })

        // throw error
    }
}
const loginToken = async (req: Request, res: Response) => {
    try {
        const { token } = req.body;
        const user = await User.findOne({
            where: { token },
            include: [
                {
                    model: Role,
                    as: 'role'
                },
            ]
        })
        if (user.role_id !== 1) {
            return res.status(200).send({
                mensage: 'User not valid',
                mensaje: 'Usuario no valido'
            })
        }

        if (!user) {
            return res.status(400).send({
                message: 'Wrong email',
                mensaje: 'Email incorrecto',
                status: 404
            })
        }


        /**
         * Password verification
         */


        if (!token) {
            return res.status(400).json({
                message: 'Token not valid',
                mensaje: 'Token no valido',
                status: 409
            })
        }


        res.status(200).send({
            message: "Welcome",
            mensaje: "Bienvenido",
            id: user.id,
            user: user.email,
            firstname: user.first_name,
            lastname: user.last_name,
            phone: user.phone,
            password: user.password,
            role: user.role_id
        })
    } catch (error) {
        res.status(500).send({
            mensaje: 'Error desconocido',
            message: 'Unknow error',
            error
        })

        // throw error
    }
}


const loginCode = async (req: Request, res: Response) => {
    try {
        const { code } = req.body;

        const user = await User.findOne({
            where: { access_code: code },
           
        })
 
       
        const token = await generarJWT(user)
        res.status(200).send({
            ok: true,
            message: "Welcome",
            mensaje: "Bienvenido",
            id: user.id,
            user: user.email,
            firstname: user.first_name,
            lastname: user.last_name,
            phone: user.phone,
            password: user.password,
            role: user.role_id,
            img: user.img,
            token
        })
    } catch (error) {
        res.status(500).send({
            mensaje: 'Error desconocido',
            message: 'Unknow error',
            error
        })

        // throw error
    }
}

export {
    login,
    loginPanel,
    loginDriver,
    loginToken,
    loginCode
}
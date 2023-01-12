import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { uploadImg, deletFile } from './image.controller'
import { dbf, firebase } from '../config/firebase';

import { forgotPassEmail } from './email.controller';
import { ClientDirection } from '../models/client-direction';
import { config } from '../config/config';
import * as jwt from 'jsonwebtoken'

import { User } from '../models/user';
import { Driver } from '../models/driver';
import { DriverDocuments } from '../models/driver_documents';


const getUsers = async (req: Request, res: Response) => {
    try {
        console.log("test")
        const user = await User.findAll()
        if (!user.length) {
            return res.status(204).json({
                mensaje: "No hay usuario",
                message: "There are not users"
            })
        }
        res.status(200).json({
            mensaje: "Retorna los usuarios",
            message: "Returns the users",
            user
        })
    } catch (error) {
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })


    }

}
const createClient = async (req: Request, res: Response) => {
    try {
        const password = req.body.password;
        const passwordHash = await bcrypt.hash(password, 8);

        const {
            email,
            firstName,
            lastName,
            phone
        } = req.body

        const client = {
            email: email,
            first_name: firstName,
            last_name: lastName,
            phone: phone,
            password: passwordHash,
            role_id: 1
        }


        const user = await User.findOne({
            where: { email: email }

        })


        if (user) {
            return res.status(400).send({
                ok: false,
                message: 'That email is taken. Try another',
                mensaje: 'Ese email está tomado. Prueba otro',

            })
        }
        const createUser = await User.create(client)
        if (!createUser) {
            return res.status(204).send()
        }
        res.status(200).send({
            ok: true,
            mensaje: 'El usuario ha sido creado',
            message: 'The user has been created',
            createUser
        })
    } catch (error) {
        console.log("error creating user", error)
        res.status(500).json({
            ok: false,
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })


    }

}
const getClientsTotal = async (req: Request, res: Response) => {

    try {
        const user = await User.findAll({
            where: { role_id: 1 }
        })
        if (!user.length) {
            return res.status(200).json({
                mensaje: "No hay usuarios",
                message: "There are not users"
            })
        }
        res.status(200).send({
            mensaje: 'Retorna los usuarios',
            message: 'Retrieve the users',
            user
        })
    } catch (error) {
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })


    }

}
const getUserById = async (req: Request, res: Response) => {

    try {
        const { user_id } = req.body;

        if (!user_id) {
            return res.status(204).json({
                mensaje: "Id invalido",
                message: "Id invalid"
            })
        }
        const user = await User.findOne({
            where: { id: user_id },
            attributes: [
                'id', 'first_name', 'last_name',
                'role_id', 'email', 'img', 'card_id', 'client_direction_id',
                'stripe_customer_id', 'phone'
            ]
        });

        if (!user) {
            return res.status(204).send({
                message: 'User not found',
                mensaje: 'Usuario no encontrado'
            });
        }



        res.status(200).send({
            message: 'User found',
            user
        })
    } catch (error) {
        res.status(400).send({
            mensaje: 'Error desconocido',
            messaje: 'Unknow error',
            error
        })

            ;
    }
}
const updateClient = (req: Request, res: Response) => {

    try {
        const {
            user_id,
            email,
            first_name,
            last_name,
            card_id,
            client_direction_id,
            img
        } = req.body

        User.update(
            {
                email,
                first_name: first_name,
                last_name: last_name,
                client_direction_id,
                card_id, img
            },
            {
                where: { id: user_id }
            })
        res.status(200).json({
            mensaje: "Usuario actualizado",
            message: "User update"
        })
    } catch (error) {
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })


    }

}


// driver
const updateDriverUser = async (req: Request, res: Response) => {

    try {

        const {
            driver_id,
            email,
            first_name,
            last_name,
            address_1,
            city,
            phone,
            zip_code } = req.body
        const params = {
            zip_code,
            email,
            first_name,
            last_name,
            address_1,
            city,
            phone
        }
        const driver = await Driver.update(params, { where: { id: driver_id } })

        if (!driver.length) {
            return res.status(204).send()
        }

        res.status(200).send({
            message: 'Driver updated',
            mensaje: 'Driver actualizado',
            driver
        })

    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })


    }

}
const createDriverUser = async (req: Request, res: Response) => {
    try {

        const { password, email } = req.body;
        const passwordHash = await bcrypt.hash(password, 8);

        const {
            first_name,
            last_name,
            address_1,
            city,
            zip_code,
            phone,
            img,
            pharmacy_id
        } = req.body
        const params = {
            email,
            first_name,
            last_name,
            address_1,
            city,
            zip_code,
            phone,
            img,
            password: passwordHash,
            pharmacy_id,
            role_id: 3,
            active: 0
        }
        const user = await Driver.findOne({
            where: { email }
        })
        console.log(user)
        if (user) {
            return res.status(400).send({
                ok: false,
                message: 'That email is taken. Try another',
                mensaje: 'Ese email está tomado. Prueba otra',
                status: 409
            })
        }
        const createUser = await Driver.create(params)
        res.status(200).send({
            ok: true,
            mensaje: 'El usuario ha sido creado',
            message: 'The user has been created',
            createUser
        })
    } catch (error) {
        res.status(400).json({
            ok: false,
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })


    }
}
const createDriverDocuments = async (req: Request, res: Response) => {
    try {
        const {
            driver_id,
            license_number,
            date_exp,
            vehicle_register,
            date_exp_register,
            brand_vehicle,
            vehicle_model,
            vehicle_color,
            vehicle_year
        } = req.body

        const params = [
            driver_id,
            license_number,
            date_exp,
            vehicle_register,
            date_exp_register,
            brand_vehicle,
            vehicle_model,
            vehicle_color,
            vehicle_year
        ]

        const driverDocuments = await DriverDocuments.create(params)
        if (!driverDocuments) {
            return res.status(204).send()
        }

        res.status(200).send({
            message: 'Driver created',
            mensaje: 'Driver creado',
            driverDocuments
        })
    } catch (error) {
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })


    }
}
const getDriverDocuments = async (req: Request, res: Response) => {
    try {
        const { driver_id } = req.body;

        const driverDocuments = await DriverDocuments.findAll({
            where: { driver_id }
        })

        if (!driverDocuments.length) {
            return res.status(400).send()
        }

        res.status(200).send({
            message: 'Driver documentes',
            mensaje: 'Documentos del driver',
            driverDocuments
        })
    } catch (error) {
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })


    }
}
const updateDriverDocuments = async (req: Request, res: Response) => {
    try {
        const {
            driver_id,
            license_number,
            date_exp,
            vehicle_register,
            date_exp_register,
            brand_vehicle,
            vehicle_model,
            vehicle_color,
            vehicle_year
        } = req.body

        const params = [
            license_number,
            date_exp,
            vehicle_register,
            date_exp_register,
            brand_vehicle,
            vehicle_model,
            vehicle_color,
            vehicle_year
        ]

        const driver = await DriverDocuments.update(params, { where: { driver_id } })

        if (!driver.length) {
            return res.status(204).send()
        }

        res.status(200).send({
            message: 'Driver documents updated',
            mensaje: 'Documento del driver actualizado',
            driver
        })
    } catch (error) {
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })


    }
}
const getDriverUser = async (req: Request, res: Response) => {
    try {
        const { driver_id, pharmacy_id } = req.body

        const driver = await Driver.findOne({ where: { id: driver_id, pharmacy_id } })

        if (!driver) {
            return res.status(400).send()
        }

        res.status(200).send({
            message: 'Driver',
            driver
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })


    }
}
const getDriverByPharmacy = async (req: Request, res: Response) => {

    try {
        const { pharmacy_id } = req.body;
        if (!pharmacy_id) {
            return res.status(204).json({
                mensaje: "Id invalido",
                message: "Id invalid"
            })
        }
        const driver = await Driver.findAll({
            where: {
                pharmacy_id
            }
        })

        if (!driver.length) {
            return res.status(204).send()
        }

        res.status(200).send({
            message: 'Drivers',
            driver
        })
    } catch (error) {
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })


    }
}

const getDriverByAdmin = async (req: Request, res: Response) => {

    try {

        const driver = await Driver.findAll({
            where: {
                zip_code: "admin"
            }
        })

        if (!driver.length) {
            return res.status(204).send()
        }

        res.status(200).send({
            message: 'Drivers',
            driver
        })
    } catch (error) {
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })


    }
}
const updateDriverImage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(204).json({
                mensaje: "Id invalido",
                message: "Id invalid"
            })
        }
        const driver = await Driver.findOne({ where: { id } })
        if (!driver) {
            return res.status(204).send()
        }
        const url = driver.img;

        if (url) {
            deletFile(url);
        }
        uploadImg(req, res, (err) => {
            if (err) {
                res.status(400).send({
                    err
                })
            } else {
                if (req.file === undefined) {
                    res.status(400).send({
                        mensaje: 'Error: No image selected'
                    })
                }
            }
            const image = req.file as any;

            const driverUpdate = Driver.update({
                img: image.location
            }, {
                where: {
                    id
                }
            })
            if (!driverUpdate) {
                return res.status(204).send()
            }
            res.status(200).send({
                mensaje: 'Image actualizada',
                img: image.location
            })
        })
    } catch (error) {
        res.status(400).send({
            mensaje: "Algo anda mal",
            message: "Something goes wrog!!",
            error
        })


    }
}
const updateDriverLicenseImage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(204).json({
                mensaje: "Id invalido",
                message: "Id invalid"
            })
        }
        const driver = await DriverDocuments.findOne({ where: { id } })
        if (!driver) {
            return res.status(204).send()
        }
        const url = driver.img_license;
        if (url) {
            deletFile(url);
        }
        uploadImg(req, res, (err) => {
            if (err) {
                res.status(400).send({
                    err
                })
            } else {
                if (req.file === undefined) {
                    res.status(400).send({
                        mensaje: 'Error: No image selected'
                    })
                }
            }
            const image = req.file as any;

            const driverUpdate = DriverDocuments.update({
                img_license: image.location
            }, {
                where: {
                    id
                }
            })
            if (!driverUpdate) {
                return res.status(204).send()
            }
            res.status(200).send({
                mensaje: 'Image actualizada',
                img: image.location
            })
        })
    } catch (error) {
        res.status(400).send({
            mensaje: "Algo anda mal",
            message: "Something goes wrog!!",
            error
        })


    }
}
const updateDriverDocumentImage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(204).json({
                mensaje: "Id invalido",
                message: "Id invalid"
            })
        }
        const driver = await DriverDocuments.findOne({ where: { id } })
        if (!driver) {
            return res.status(204).send()
        }
        const url = driver.img_document;

        if (url) {
            return deletFile(url);
        }
        uploadImg(req, res, (err) => {
            if (err) {
                return res.status(400).send({
                    err
                })
            } else {
                if (req.file === undefined) {
                    return res.status(400).send({
                        mensaje: 'Error: No image selected'
                    })
                }
            }
            const image = req.file as any;

            const driverUpdate = DriverDocuments.update({
                img_document: image.location
            }, {
                where: {
                    id
                }
            })
            if (!driverUpdate) {
                return res.status(204).send()
            }
            res.status(200).send({
                mensaje: 'Image actualizada',
                img: image.location
            })
        })
    } catch (error) {
        res.status(400).send({
            mensaje: "Algo anda mal",
            message: "Something goes wrog!!",
            error
        })


    }
}
const deleteDriverByPharmacy = async (req: Request, res: Response) => {
    try {
        const { driver_id } = req.body

        const deleteDriver = await Driver.destroy({
            where: {
                id: driver_id
            }
        })
        const deleteDriverDocuments = await DriverDocuments.destroy({
            where: {
                driver_id
            }
        })
        if (!(deleteDriver && deleteDriverDocuments)) {
            return res.status(204).send()
        }

        res.status(200).send({
            message: 'Driver deleted',
            mensaje: 'Driver eliminado',
            deleteDriver
        })
    } catch (error) {
        res.status(400).send({
            mensaje: "Algo anda mal",
            message: "Something goes wrog!!",
            error
        })


    }
}
const updatedDriverActive = async (req: Request, res: Response) => {
    let farmacysInFirebase: any[] = [];
    try {
        const { id, active } = req.body
        console.log(id, active)
        const driver = await Driver.update({ active }, { where: { id } })
        const { pharmacy_id } = await Driver.findOne({ where: { id } })

        if (!driver.length) {
            return res.status(204).send()
        }

        const getList = await firebase.firestore().collection('driveActive').get()
        getList.forEach(snapHijo => {
            farmacysInFirebase.push({
                id: snapHijo.id,
                ...snapHijo.data()
            })
        })

        if (farmacysInFirebase.length <= 0) {
            const dbRef = firebase.firestore().collection('driveActive');
            dbRef.add({ driver_id: id, pharmacy_id, status: true });
        } else {
            const idFiltered = farmacysInFirebase.filter(e => {
                return e.driver_id == id
            })
            if (idFiltered.length != 0) {
                const id = idFiltered[0].id
                delete idFiltered[0].id
                idFiltered[0].status = !idFiltered[0].status
                firebase.firestore().doc(`/driveActive/${id}`).update({ ...idFiltered[0] });
            } else {
                const dbRef = firebase.firestore().collection('driveActive');
                dbRef.add({ driver_id: id, pharmacy_id, status: true });
            }
        }

        res.status(200).send({
            message: 'Driver active updated',
            mensaje: 'Driver estatus actualizado'
        })

    } catch (error) {
        res.status(400).send({
            mensaje: "Algo anda mal",
            message: "Something goes wrog!!",
            error
        })


    }
}

const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const user = await User.update({ isDeleted: true }, { where: { id }, returning: true })

        res.status(200).send({
            ok: true,
            user,
            message: 'User deleted ',
            mensaje: 'Usuario eliminado'
        })

    } catch (error) {
        console.log(500)
        res.status(500).send({
            ok: false,
            mensaje: "Algo anda mal",
            message: "Something goes wrog!!",
            error
        })


    }
}

const updateUser = (req: Request, res: Response) => {
    const {
        id_user,
        email,
        first_name,
        last_name,
        address_1,
        phone,
        rol_id,
        pharmacy_id,
        active
    } = req.body
    User.update({
        email,
        first_name,
        last_name,
        address_1,
        phone,
        rol_id,
        pharmacy_id,
        active
    }, {
        where: { id: id_user }
    })
        .then((result) => res.status(200).send({
            message: 'User updated',
            result
        }))
        .catch(error => {
            res.status(400).json({
                mensaje: "Ha ocurrido un error",
                messaje: "It has ocurred an error",
                error
            });


        })
}
const updateUserState = (req: Request, res: Response) => {
    const {
        user_id
    } = req.body
    if (!user_id) {
        return res.status(204).json({
            mensaje: "Id invalido",
            message: "Id invalid"
        })
    }
    User.update({
        active: 0
    }, { where: { id: user_id } })
        .then((result) => {
            if (!result) {
                return res.status(200).json({
                    mensaje: "No hay usuarios",
                    message: "There are not users"
                })
            }

            res.status(200).send({
                mensaje: 'El usuario ha sido modificado',
                message: 'The user has been modified'
            })
        }).catch(error => {
            res.status(400).json({
                mensaje: "Ha ocurrido un error",
                messaje: "It has ocurred an error",
                error
            })


        })
}
const getClientDirection = async (req: Request, res: Response) => {

    try {
        const { user_id } = req.body
        if (!user_id) {
            return res.status(204).json({
                mensaje: "Id invalido",
                message: "Id invalid"
            })
        }
        const clientDirection = await ClientDirection.findAll({ where: { user_id } })
        if (!clientDirection.length) {
            return res.status(204).json({
                message: 'Direction not found'
            })
        }
        res.status(200).send({
            message: 'Direction found',
            clientDirection
        })
    } catch (error) {
        res.status(400).send({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })
    }
}
const getClientDirectionById = async (req: Request, res: Response) => {

    try {
        const { id } = req.body
        if (!id) {
            return res.status(204).json({
                mensaje: "Id invalido",
                message: "Id invalid"
            })
        }
        const clientDirection = await ClientDirection.findOne({ where: { id } })
        if (!clientDirection) {
            return res.status(204).json()
        }
        res.status(200).send({
            message: 'Direction found',
            mensaje: 'Direccion encontrada',
            clientDirection
        })
    } catch (error) {
        res.status(400).send({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })
    }
}
const createClientDirection = async (req: Request, res: Response) => {

    try {
        const { user_id, phone, alias, address_1, address_2, city, state, zip_Code, notes, latitude, longitude } = req.body
        const params = {
            user_id,
            phone,
            alias,
            address_1,
            address_2,
            city,
            state,
            zip_Code,
            notes,
            latitude,
            longitude
        }
        const clientDirection = await ClientDirection.create(params)
        if (!clientDirection) {
            return res.status(203).json({
                message: 'Direction not created'
            })
        }
        User.update({
            client_direction_id: clientDirection.id
        }, { where: { id: user_id } })
        res.status(200).send({
            message: 'Drection created',
            clientDirection
        })
    } catch (error) {
        res.status(400).send({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })

    }
}
const updateClientDirection = async (req: Request, res: Response) => {
    try {
        const {
            user_id,
            id,
            phone,
            alias,
            address_1,
            address_2,
            city,
            state,
            zip_Code,
            latitude,
            longitude,
            notes
        } = req.body
        //console.log(latitude,longitude)
        const direction = await ClientDirection.update({
            phone,
            alias,
            address_1,
            address_2,
            city,
            state,
            zip_Code,
            latitude,
            longitude,
            notes
        }, {
            where: { user_id, id }
        })
        if (!direction.length) {
            return res.status(204).send()
        }
        res.status(200).send({
            message: 'Direction updated',
            mensaje: 'Direccion actualizada'
        })

    } catch (error) {
        res.status(400).send({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })

    }


}
const deleteClientDirection = async (req: Request, res: Response) => {
    try {
        const { id, user_id } = req.body
        if (!(user_id && id)) {
            return res.status(204).json({
                mensaje: "Id invalido",
                message: "Id invalid"
            })
        }
        await User.update({ client_direction_id: null }, { where: { id: user_id, client_direction_id: id } })
        const deleteDirection = await ClientDirection.destroy({
            where: {
                id,
                user_id
            }
        })
        if (!deleteDirection) {
            return res.status(204).send()
        }
        res.status(200).send({
            message: 'Direction deleted',
            mensaje: 'Direccion eliminada'
        })

    } catch (error) {
        res.status(400).send({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })

    }
}
const resetPasswordUser = async (req: Request, res: Response) => {

    try {
        const { token } = req.params
        const { password } = req.body;

        const passwordHash = await bcrypt.hash(password, 8);
        let jwtPayload = jwt.verify(token, config.SECRET);
        const user = await User.findOne({ where: { token } })

        if (!user) {
            return res.status(200).send({
                mensaje: "Ha ocurrido un error con el user",
                messaje: "It has ocurred an error with user",
            })
        }
        if (!(passwordHash && token && jwtPayload)) {
            return res.status(400).json({
                mensaje: "Algo anda mal",
                message: "Something goes wrog!"
            })
        }
        const userUpdate = await User.update({ password: passwordHash }, { where: { id: user.id } })

        if (!userUpdate) {
            return res.status(200).send({
                mensaje: "Ha ocurrido un error",
                messaje: "It has ocurred an error",
            })
        }
        res.status(200).json({
            mensaje: "Contraseña cambiada",
            message: "Password changed",
            userUpdate
        })
    } catch (error) {
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })
            ;
    }
}
const forgetPasswordUser = async (req: Request, res: Response) => {
    try {

        const { email } = req.body
        if (!email) {
            return res.status(204).json({
                mensaje: "Id invalido",
                message: "Id invalid"
            })
        }
        const user = await User.findOne({ where: { email } })
        if (!user) {
            return res.status(200).send({
                mensaje: 'No hay user'

            })
        }

        const token = jwt.sign({ user_id: user.id, email: user.email }, config.SECRET, { expiresIn: '1h' });
        if (!token) {
            return res.status(200).send({
                mensaje: 'No hay token'
            })
        }

        await User.update({ token }, { where: { id: user.id } })

        const verificationLink = `https://coopharma-panel.web.app/updatePasswordUser/${token}`

        forgotPassEmail(email, verificationLink)

        res.status(200).send({
            mensaje: "Revisa tu email para el link para restablecer tu password.",
            messaje: "Check your email for a link to reset your password.",
            verificationLink
        })

    } catch (error) {
        res.status(400).send({
            mensaje: "Algo anda mal",
            message: "Something goes wrog!!",
            error
        })


    }
}
const updateClientImage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(204).json({
                mensaje: "Id invalido",
                message: "Id invalid"
            })
        }
        const user = await User.findOne({ where: { id } })
        if (!user) {
            return res.status(204).send()
        }
        const url = user.img;

        if (url) {
            deletFile(url);
        }
        uploadImg(req, res, (err) => {
            if (err) {
                res.status(400).send({
                    err
                })
            } else {
                if (req.file === undefined) {
                    res.status(400).send({
                        mensaje: 'Error: No image selected'
                    })
                }
            }
            const image = req.file as any;

            const user = User.update({
                img: image.location
            }, {
                where: {
                    id
                }
            })
            if (!user) {
                return res.status(204).send()
            }
            res.status(200).send({
                mensaje: 'Image actualizada',
                img: image.location
            })
        })
    } catch (error) {
        res.status(400).send({
            mensaje: "Algo anda mal",
            message: "Something goes wrog!!",
            error
        })


    }
}


export {
    getUsers, createClient,
    getClientsTotal, getUserById,
    updateClient, createDriverUser, createDriverDocuments,
    updateDriverUser, updateDriverDocuments, updateDriverImage, updateDriverLicenseImage,
    updateDriverDocumentImage, getDriverUser, getDriverDocuments,
    getDriverByPharmacy, updateUser, updateUserState,
    getClientDirection, getClientDirectionById, createClientDirection,
    updateClientDirection, deleteClientDirection,
    forgetPasswordUser, updateClientImage,
    resetPasswordUser, deleteDriverByPharmacy, updatedDriverActive,
    deleteUser, getDriverByAdmin
}

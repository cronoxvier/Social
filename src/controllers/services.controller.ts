
import {
    ValidationError,
    col,
    ForeignKeyConstraintError,
    Sequelize,
    Op,
} from "sequelize";
import { TypeServices } from '../models/TypeServices'
import { services } from '../models/services'
import { deletFile, uploadImg } from './image.controller'
import { Imagen } from '../models/imagen'

import { dbf, firebase } from '../config/firebase';
import { User } from "../models/user";
import { ServicesStatus } from '../models/services-status';
import { Request, Response } from 'express';
import { Expo } from 'expo-server-sdk';
import { Pharmacy } from "../models/Pharmacy";
import { UserServices } from "../models/UserServices";
import { Driver } from "../models/driver";
import moment from 'moment';
import CryptoJS from 'crypto-js'
import axios from 'axios';
import { playTopayCredential } from "../helper/CreateCredentiaPlaytopay";
import { MaintenancePayments } from "../models/MaintenancePayments";
import { medicaSchools } from "../models/medicalSchools";


const createTypeServices = async (req, res) => {
    try {

        const { ...data } = req.body
        const services = await TypeServices.create(data)

        res.status(200).send({
            ok: true,
            services,
            mensaje: 'Could not create service',
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })
    }

}
const createInfoPriceService = async (req, res) => {
    try {
        let expo = new Expo({ accessToken: 'fsBgekH5wRpMOVN3h_ZDIy6bqMygQn3oAaJHAQje' });
        const { ...data } = req.body
        let messages = [];

        const Services = await UserServices.create(data)

        const token = await services.findByPk(data.service_id)

        const pushToken = token.token

        if (pushToken) {
            if (!Expo.isExpoPushToken(pushToken)) {
                console.error(`Push token ${pushToken} is not a valid Expo push token`);
            }
            messages.push(
                {
                    to: pushToken,
                    title: "Facilito📬",
                    subtitle: 'Service request',
                    sound: 'default',
                    body: 'New application process received check if you accept the service',
                    badge: 0,
                    data: { data: 'goes here' },
                }
            )
            let chunks = expo.chunkPushNotifications(messages);
            let tickets = [];

            for (let chunk of chunks) {
                let ticketChunk = await expo.sendPushNotificationsAsync(chunk);

                tickets.push(...ticketChunk);
            }
        }
        res.status(200).send({
            ok: true,
            Services,
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })
    }

}

const medicalSchool = async(req, res)=>{
    try {
        const {...data} = req.body
        const medical = await medicaSchools.create({...data })
        res.status(200).send({
            medical,
            ok:true
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false,
            error
        }) 
    }
}

const disableEnambleTypeServices = async (req, res) => {

    try {
        const { ...data } = req.body

        const service = await TypeServices.findByPk(data.id)

        if (!services) {
            return res.status(400).send({
                ok: false,
                mensaje: 'No existe este registro'
            })
        }

        const changedStatus = await TypeServices.update({ status: !data.status }, {
            where: {
                id: data.id
            }
        })
        res.status(200).send({
            ok: true,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })
    }
}

const createServices = async (req, res) => {

    try {
        const { ...data } = req.body;
        const service = await services.create(data);
        await firebase.firestore().collection('ServiceNotification').add({
            message: 'You have a new service request',
            seen: false,
            pharmacy_id: service.pharmacy_id,
            typeServices_id: service.typeServices_id
        })
        res.status(200).send({
            ok: true,
            services: service
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })
    }
}

const saveImgTypeServices = async (req, res) => {
    try {
        const { id } = req.params;
        const services = await TypeServices.findOne({ where: { id } })
        if (!services) {
            return res.status(400).send({
                ok: false,
                mensaje: 'This record does not exist'
            })
        }
        const url = services.img
        if (url) {
            deletFile(url);
        }
        uploadImg(req, res, (err) => {
            if (err) {
                console.log(err, '5')
                return res.status(400).send({
                    err
                })
            }
            else {
                if (req.file === undefined) {
                    return res.status(400).send({
                        ok: false,
                        mensaje: 'Error: No image selected'
                    })
                }
            }
            const image = req.file as any;
            const services = TypeServices.update({
                img: image.location
            }, {
                where: {
                    id
                }
            })
            if (!services) {
                return res.status(204).send()
            }
            res.status(200).send({
                ok: true,
                mensaje: 'Image actualizada'
            })
        })

        // res.status(200).send({
        //     ok: true,
        // })

    } catch (error) {
        console.log(error, "3")
        res.status(500).send({
            ok: false
        })
    }
}

const getTypeServiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const services = await TypeServices.findAll({ where: { pharmacy_id: id, status: true, deleted: false } })
        res.status(200).send({
            ok: true,
            services
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })
    }
}

const getTypeServiceByPharmacyId = async (req, res) => {
    try {
        const { id } = req.params;
        const services = await TypeServices.findAll({ where: { pharmacy_id: id, deleted: false } })
        res.status(200).send({
            ok: true,
            services
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })
    }
}

const saveImagesServices = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await services.findOne({ where: { id } })
        if (!service) {
            return res.status(400).send({
                ok: false,
                mensaje: 'No existe este registro'
            })
        }
        uploadImg(req, res, async (err) => {
            if (err) {
                console.log(err)
                return res.status(400).send({
                    ok: false,
                    err
                })
            } else {
                if (req.file === undefined) {
                    return res.status(400).send({
                        ok: false,
                        mensaje: 'Error: No image selected'
                    })
                }
            }
            const img = req.file as any;
            const imagen = await Imagen.create({ url: img.location, services_id: id })
            return res.status(200).send({
                imagen,
                ok: true
            })
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })
    }

}

const editTypeServices = async (req, res) => {
    try {
        const { id } = req.params;
        const { ...data } = req.body;
        const service = await TypeServices.findOne({ where: { id } })
        if (!service) {
            return res.status(400).send({
                ok: false,
                mensaje: 'This record does not exist'
            })
        }

        const editService = await TypeServices.update({
            ...data
        }, {
            where: {
                id
            }
        })
        return res.status(200).send({
            ok: true,
            // mensaje: 'Could not update this service',
            data
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })
    }

}

const getservices = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await services.findAll({
            include: [
                {
                    model: TypeServices,
                    as: "TypeServices",
                    attributes: [],
                },
                {
                    model: User,
                    as: "User",
                    attributes: [],
                },
                {
                    model: ServicesStatus,
                    as: "ServicesStatus",
                    attributes: [],
                },
            ],
            attributes: [
                "id", "description", "token",
                [col("TypeServices.name"), "name"],
                [col("TypeServices.nombre"), "nombre"],
                [col("TypeServices.id"), "typeServices_id"],
                [col("TypeServices.img"), "typeServices_img"],
                [col("User.first_name"), "first_name"],
                [col("User.last_name"), "last_name"],
                [col("ServicesStatus.name"), "services-status-name"],
                [col("ServicesStatus.nombre"), "services-status-nombre"],
                [col("ServicesStatus.code"), "code"],
            ], where: { pharmacy_id:id }
            
        })
        return res.status(200).send({
            ok: true,
            services: service
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })
    }
}

const selectService = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await services.findAll({
            include: [
                {
                    model: TypeServices,
                    as: "TypeServices",
                    attributes: [],
                },
                {
                    model: User,
                    as: "User",
                    attributes: [],
                },
                {
                    model: ServicesStatus,
                    as: "ServicesStatus",
                    attributes: [],
                },
            ],
            attributes: [
                "id", "description", "token",
                [col("TypeServices.name"), "name"],
                [col("TypeServices.nombre"), "nombre"],
                [col("TypeServices.id"), "typeServices_id"],
                [col("TypeServices.img"), "typeServices_img"],
                [col("TypeServices.fixedPriceStatus"), "fixedPriceStatus"],
                [col("TypeServices.amountOfPayments"), "amountOfPayments"],
                [col("TypeServices.fixedPrice"), "fixedPrice"],
                [col("User.first_name"), "first_name"],
                [col("User.last_name"), "last_name"],
                [col("ServicesStatus.name"), "servicesStatusName"],
                [col("ServicesStatus.nombre"), "services-status-nombre"],
                [col("ServicesStatus.code"), "code"],
                [col("User.img"), "user_img"],
                [col("User.id"), "user_id"],
            ], where: { id }
        })
        return res.status(200).send({
            ok: true,
            services: service
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })
    }
}

const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { ...data } = req.body;
        const service = await services.update({
            ...data
        }, {
            where: {
                id
            }
        })
        return res.status(200).send({
            ok: true,
            services: service
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })
    }

}

const searchImgByService = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await Imagen.findAll({
            where: {
                services_id:
                    id
            }
        })
        return res.status(200).send({
            ok: true,
            services: service
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })
    }

}

const sendToken = async (req: Request, res: Response) => {
    const { ...data } = req.body

    try {
        let expo = new Expo({ accessToken: 'fsBgekH5wRpMOVN3h_ZDIy6bqMygQn3oAaJHAQje' });
        let messages = [];
        const pushToken = data.token

        if (!data.token) {
            return res.status(200).send({
                ok: false,
                messages: "Token not available"
            })
        }

        if (!Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
        }
        if (data.servicesStatus_id == 2) {
            messages.push(
                {
                    to: pushToken,
                    title: "Del properties kc 📬",
                    subtitle: 'Requested service in process',
                    sound: 'default',
                    body: 'Your service is in the process of review and assignment.',
                    badge: 0,
                    data: { data: 'goes here' },
                }
            )
        }

        let chunks = expo.chunkPushNotifications(messages);
        let tickets = [];

        for (let chunk of chunks) {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);

            tickets.push(...ticketChunk);
        }

        res.status(200).send({
            ok: true,
            pushToken,
            data
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false,
            error
        })
    }
}

const getservicesByTypeServices = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await services.findAll({
            include: [
                {
                    model: TypeServices,
                    as: "TypeServices",
                    attributes: [],
                },
                {
                    model: User,
                    as: "User",
                    attributes: [],
                },
                {
                    model: ServicesStatus,
                    as: "ServicesStatus",
                    attributes: [],
                },
            ],
            attributes: [
                "id", "description", "token",
                [col("TypeServices.name"), "name"],
                [col("TypeServices.nombre"), "nombre"],
                [col("TypeServices.id"), "typeServices_id"],
                [col("TypeServices.fixedPriceStatus"), "fixedPriceStatus"],
                [col("TypeServices.amountOfPayments"), "amountOfPayments"],
                [col("TypeServices.img"), "typeServices_img"],
                [col("TypeServices.fixedPrice"), "fixedPrice"],
                [col("User.first_name"), "first_name"],
                [col("User.last_name"), "last_name"],
                [col("User.img"), "user_img"],
                [col("ServicesStatus.name"), "services-status-name"],
                [col("ServicesStatus.nombre"), "services-status-nombre"],
                [col("ServicesStatus.code"), "code"],
            ], where: { typeServices_id: id, servicesStatus_id: 1 }
        })
        return res.status(200).send({
            ok: true,
            services: service
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })
    }
}

const getservicesByPharmacy = async (req, res) => {
    const noExisten = []
    try {

        // const service = await services.findAll({
        //     include: [
        //         {
        //             model: TypeServices,
        //             as: "TypeServices",
        //             attributes: [],
        //         },
        //         {
        //             model: User,
        //             as: "User",
        //             attributes: [],
        //         },
        //         {
        //             model: ServicesStatus,
        //             as: "ServicesStatus",
        //             attributes: [],
        //         },
        //         {
        //             model: Pharmacy,
        //             as: "Pharmacy",
        //             attributes: [],
        //         }
        //     ],
        //     attributes: [
        //         "id", "description", "token",
        //         [col("TypeServices.name"), "name"],
        //         [col("TypeServices.nombre"), "nombre"],
        //         [col("TypeServices.id"), "typeServices_id"],
        //         [col("TypeServices.img"), "typeServices_img"],
        //         [col("User.first_name"), "first_name"],
        //         [col("User.last_name"), "last_name"],
        //         [col("User.img"), "user_img"],
        //         [col("ServicesStatus.name"), "services-status-name"],
        //         [col("ServicesStatus.nombre"), "services-status-nombre"],
        //         [col("ServicesStatus.code"), "code"],
        //         [col("Pharmacy.name"), "pname"],
        //     ]
        // })


        const pharmacy = await Pharmacy.findAll({
            where: {
                role_id: 2, disabled: 0
            }
        })

        for (let i in pharmacy) {
            const service = await TypeServices.findAll({ where: { pharmacy_id: pharmacy[i].id, deleted: false } })
            noExisten.push({ type: service })
        }

        return res.status(200).send({
            ok: true,
            service: noExisten

        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })
    }
}

const getInfoPriceService = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await UserServices.findAll({
            include: [
                {
                    model: Driver,
                    as: "Driver",
                    attributes: [],
                },
                {
                    model: ServicesStatus,
                    as: "ServicesStatus",
                    attributes: [],

                },
                {
                    model: services,
                    as: "Services",
                    include: [
                        {
                            model: TypeServices,
                            as: "TypeServices",
                        },
                        {
                            model: ServicesStatus,
                            as: "ServicesStatus",
                        },
                    ]
                },
            ],
            attributes: ['id', 'user_id', 'driver_id', 'service_id', 'price', 'startDate', 'finalDate', 'token_driver', 'accepted', 'deleted', 'servicesStatus_id',
                [col("Driver.first_name"), "driver_first_name"],
                [col("Driver.last_name"), "driver_last_name"],
                [col("Driver.phone"), "driver_phone"],
                [col("Driver.img"), "driver_img"],
                [col("Driver.first_name"), "driver_first_name"],

                [col("Services.description"), "services_description"],
                [col("Services.token"), "services_token"],
                [col("Services.typeServices_id"), "services_typeServices_id"],
                [col("Services.pharmacy_id"), "services_pharmacy_id"],
                [col("Services.servicesStatus_id"), "services_servicesStatus_id"],
                [col("ServicesStatus.id"), "ServicesStatus_id"],
                [col("ServicesStatus.name"), "ServicesStatus_name"],
                [col("ServicesStatus.nombre"), "ServicesStatus_nombre"],
                [col("ServicesStatus.code"), "ServicesStatus_code"],
            ],
            where: {
                user_id: id,
                [Op.or]: [{ servicesStatus_id: 1 }, { servicesStatus_id: 4 }, { servicesStatus_id: 3 }, { servicesStatus_id: 6 }],
                deleted: 0

            }
        })

        return res.status(200).send({
            ok: true,
            service
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })
    }
}

const getInfoPriceServiceByDriver = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await UserServices.findAll({
            include: [
                {
                    model: Driver,
                    as: "Driver",
                    attributes: [],
                },
                {
                    model: ServicesStatus,
                    as: "ServicesStatus",
                    attributes: [],

                },
                {
                    model: services,
                    as: "Services",
                    include: [
                        {
                            model: TypeServices,
                            as: "TypeServices",
                        },
                        {
                            model: ServicesStatus,
                            as: "ServicesStatus",
                        },
                    ]
                },
            ],
            attributes: ['id', 'user_id', 'driver_id', 'service_id', 'price', 'startDate', 'finalDate', 'token_driver', 'accepted', 'deleted', 'servicesStatus_id',
                [col("Driver.first_name"), "driver_first_name"],
                [col("Driver.last_name"), "driver_last_name"],
                [col("Driver.phone"), "driver_phone"],
                [col("Driver.img"), "driver_img"],
                [col("Driver.first_name"), "driver_first_name"],
                [col("Services.description"), "services_description"],
                [col("Services.token"), "services_token"],
                [col("Services.typeServices_id"), "services_typeServices_id"],
                [col("Services.pharmacy_id"), "services_pharmacy_id"],
                [col("Services.servicesStatus_id"), "services_servicesStatus_id"],
                [col("ServicesStatus.id"), "ServicesStatus_id"],
                [col("ServicesStatus.name"), "ServicesStatus_name"],
                [col("ServicesStatus.nombre"), "ServicesStatus_nombre"],
                [col("ServicesStatus.code"), "ServicesStatus_code"],
            ],
            where: {
                driver_id: id,
                // [Op.or]: [{ servicesStatus_id: 1 }, { servicesStatus_id: 4 }],
                deleted: 0

            }
        })

        return res.status(200).send({
            ok: true,
            service
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })
    }
}

const updateUserServicesAccepted = async (req, res) => {

    try {
        const { ...data } = req.body

        const updatedRows = await UserServices.update({ servicesStatus_id: 4, accepted: true }, {
            where: {
                id: data.id
            }
        })

        if (updatedRows) {
            const updateUserServices = await UserServices.update({ servicesStatus_id: 7, deleted: true }, {
                where: {
                    servicesStatus_id: 1,
                    service_id: data.service_id,
                    user_id: data.user_id
                }
            })

            if (!updatedRows) {
                res.status(400).send({
                    ok: false,
                })
            }

            await services.update({ servicesStatus_id: 4 }, { where: { id: data.service_id } })
            //mandar el push notification
            const push = await services.findByPk(data.service_id)

            let expo = new Expo({ accessToken: 'fsBgekH5wRpMOVN3h_ZDIy6bqMygQn3oAaJHAQje' });
            let messages = [];
            const pushToken = push.token

            if (pushToken) {
                if (!Expo.isExpoPushToken(pushToken)) {
                    console.error(`Push token ${pushToken} is not a valid Expo push token`);
                }
                messages.push(
                    {
                        to: pushToken,
                        title: "Facilito📬",
                        subtitle: 'service request',
                        sound: 'default',
                        body: 'Request accepted, you can check your service request',
                        badge: 0,
                        data: { data: 'goes here' },
                    }
                )
                let chunks = expo.chunkPushNotifications(messages);
                let tickets = [];

                for (let chunk of chunks) {
                    let ticketChunk = await expo.sendPushNotificationsAsync(chunk);

                    tickets.push(...ticketChunk);
                }
            }
        }
        res.status(200).send({
            ok: true,
            // serviceUpdate
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })

    }

}

const deleteUserServices = async (req, res) => {
    try {
        const { id } = req.params

        const updatedRows = UserServices.update({ deleted: true }, {
            where: {
                id
            }
        })
        res.status(200).send({
            ok: true,
            updatedRows
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })
    }

}

const updateDatePrice = async (req, res) => {
    try {
        const { id } = req.params
        const { ...data } = req.body

        const updatedRows = UserServices.update({ ...data }, {
            where: {
                id
            }
        })
        res.status(200).send({
            ok: true,
            data
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })
    }

}

const updateUserServicesCompleted = async (req, res) => {

    try {
        const { id } = req.params

        const updatedRows = await UserServices.update({ servicesStatus_id: 6, paymentStatus_id: 2 }, {
            where: {
                id
            }
        })

        const getService = await UserServices.findByPk(id)
        if (!getService) {
            return res.status(400).send({
                ok: false,

            })
        }

        const updatedRows2 = await services.update({ servicesStatus_id: 6 }, {
            where: {
                id: getService.service_id
            }
        })

        res.status(200).send({
            ok: true,
            getService
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })

    }

}

const signatureCompleted = async (req, res) => {
    try {
        const { id } = req.params

        const updatedRows = await UserServices.update({ servicesStatus_id: 3 }, {
            where: {
                id
            }
        })

        const getService = await UserServices.findByPk(id)
        if (!getService) {
            return res.status(400).send({
                ok: false,

            })
        }

        const updatedRows2 = await services.update({ servicesStatus_id: 3 }, {
            where: {
                id: getService.service_id
            }
        })

        res.status(200).send({
            ok: true,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })
    }
}


// const saveRequesIdServices = async (req, res) => {
//     try {
//         let respon = ''
//         let error = ''
//         let result
//         const url = `${process.env.URL}/api/session`;
//         const { ...data } = req.body
//         const credential = await playTopayCredential()
//         const datas = {
//             locale: "es_PR",
//             auth: {
//                 login: process.env.LOGIN,
//                 tranKey: credential.tranKey,
//                 nonce: btoa(credential.nonce),
//                 seed: credential.seed
//             },
//             //type: 'checkin',
//             payment: {
//                 reference: data.reference,
//                 description: data.description,
//                 amount: {
//                     currency: "USD",
//                     total: data.amount
//                 },
//                 allowPartial: false
//             },
//             expiration: credential.expiration,
//             returnUrl: data.returnUrl,
//             ipAddress: data.ipAdress,
//             userAgent: "PlacetoPay Sandbox"
//         }

//         await axios.post(url,
//             { ...datas }
//         ).then(async (e) => {
//             // console.log(e, 'e')
//             respon = e.data
//             result = await MaintenancePayments.create({ ...data, requestId: e.data.requestId })
//         }).catch(err => {
//             console.log(err, 'aqui')
//             error = err.response.data.status.status
//             respon = err.response.data
//         })

//         res.status(200).send({
//             ok: true,
//             data: respon,
//             result
//         })
//     } catch (error) {
//         console.log(error)
//         res.status(500).send({
//             ok: false
//         })
//     }
// }

// const consultSessionServices = async (req, res) => {
//     try {
//         const { requestId } = req.params
//         let result
//         let respon

//         const credential = await playTopayCredential()
//         const url = `${process.env.URL}/api/session/${requestId} `;
//         const datas = {
//             auth: {
//                 login: process.env.LOGIN,
//                 tranKey: credential.tranKey,
//                 nonce: btoa(credential.nonce),
//                 seed: credential.seed,
//                 url
//             },
//         }
//         await axios.post(url,
//             { ...datas }
//         ).then(async (e) => {
//             respon = e.data
//             // console.log("consult", respon)
//             const datos = {
//                 paymentStatus: e.data.status.status,
//                 date: e.data.status.date,
//             }
//             console.log("datos consult",datos)

//              const placeUpdate = await MaintenancePayments.update({ ...datos }, { where: { requestId: requestId }, returning: true })

//         }).catch(err => {
//             console.log(err)
//             respon = err.response.data
//         })

//         res.status(200).send({
//             ok: true,
//             respon
//         })
//     } catch (error) {
//         console.log(error)
//         res.status(500).send({
//             ok: false
//         })
//     }
// }

export {
    createTypeServices,
    saveImgTypeServices,
    getTypeServiceById,
    createServices,
    saveImagesServices,
    disableEnambleTypeServices,
    getTypeServiceByPharmacyId,
    editTypeServices,
    getservices,
    selectService,
    updateStatus,
    searchImgByService,
    sendToken,
    getservicesByTypeServices,
    getservicesByPharmacy,
    createInfoPriceService,
    getInfoPriceService,
    updateUserServicesAccepted,
    getInfoPriceServiceByDriver,
    deleteUserServices,
    updateDatePrice,
    updateUserServicesCompleted,
    signatureCompleted,
    medicalSchool
    // saveRequesIdServices,
    // consultSessionServices
}
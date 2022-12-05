
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

        const { ...data } = req.body
        const service = await services.create(data)

        await firebase.firestore().collection('ServiceNotification').add({
            message: 'You have a new service request',
            seen: false,
            pharmacy_id: service.pharmacy_id,
            typeServices_id: service.typeServices_id
        });

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
                "id", "description",
                [col("TypeServices.name"), "name"],
                [col("TypeServices.nombre"), "nombre"],
                [col("TypeServices.id"), "typeServices_id"],
                [col("TypeServices.img"), "typeServices_img"],
                [col("User.first_name"), "first_name"],
                [col("User.last_name"), "last_name"],
                [col("ServicesStatus.name"), "services-status-name"],
                [col("ServicesStatus.nombre"), "services-status-nombre"],
                [col("ServicesStatus.code"), "code"],
            ]
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

export { createTypeServices, saveImgTypeServices, getTypeServiceById, createServices, saveImagesServices, disableEnambleTypeServices, getTypeServiceByPharmacyId, editTypeServices, getservices }
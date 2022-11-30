

import { TypeServices } from '../models/TypeServices'
import { services } from '../models/services'
import { deletFile, uploadImg } from './image.controller'
import { Imagen } from '../models/imagen'

const createTypeServices = async (req, res) => {
    try {

        const { ...data } = req.body
        const services = await TypeServices.create(data)

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

const createServices = async (req, res) => {
    try {

        const { ...data } = req.body
        const service = await services.create(data)

        res.status(200).send({
            ok: true,
            services:service

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
                mensaje: 'No existe este registro'
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
                console.log(req.file, "1")
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
        const services = await TypeServices.findAll({ where: { pharmacy_id: id, status: true } })
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
            const imagen = await Imagen.create({ url: img.location, services_id:id})

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

export { createTypeServices, saveImgTypeServices, getTypeServiceById, createServices, saveImagesServices }
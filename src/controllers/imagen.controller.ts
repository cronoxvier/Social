import { Imagen } from "../models/imagen"
import { deletFile, uploadImg } from "./image.controller"



const createImg = async (req, res) => {
    try {
        const { ...data } = req.body
        const imagen = await Imagen.create(data)

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

const saveImg = async (req, res) => {

    try {
        const { id } = req.params;
        console.log(id)

        uploadImg(req, res, async (err) => {
            if (err) {
                console.log(err)
                return res.status(400).send({
                    ok: false,
                    err
                })
            } else {
                console.log(req.file)
                if (req.file === undefined) {
                    return res.status(400).send({
                        ok: false,
                        mensaje: 'Error: No image selected'
                    })
                }
            }
            const img = req.file as any;
            const imagen = await Imagen.create({ url: img.location, product_id: id })

            return res.status(200).send({
                imagen,
                ok: true
            })

        })

    } catch (error) {


    }

}

const getAllimgByProduct = async (req, res) => {
    try {
        const { id } = req.params
        const imagens = await Imagen.findAll({
            where: {
                product_id: id
            }
        })

        res.status(200).send({
            ok: true,
            imagens

        })


    } catch (error) {

        console.log(error)
        res.status(500).send({
            ok: false
        })
    }


}


const deleteImg = async (req, res) => {
    try {
        const { id } = req.params
        const img = await Imagen.findByPk(id)


        const url = img.url

        if (url) {
            deletFile(url);
        }

        const del = await Imagen.destroy(
            {
                where: {
                    id
                }
            }
        )

        res.status(200).send({
            ok: true,
            del


        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })
    }

}


const saveImgFacilito = async (req, res) => {

    try {
    

        uploadImg(req, res, async (err) => {
            if (err) {
                console.log(err)
                return res.status(400).send({
                    ok: false,
                    err
                })
            } else {
                console.log(req.file)
                if (req.file === undefined) {
                    return res.status(400).send({
                        ok: false,
                        mensaje: 'Error: No image selected'
                    })
                }
            }
            const img = req.file as any;
            const imagen = await Imagen.create({ url: img.location})

            return res.status(200).send({
                imagen,
                ok: true
            })

        })

    } catch (error) {
        res.status(500).send({
            error,
            ok: false
        })


    }

}

export { createImg, saveImg, getAllimgByProduct, deleteImg, saveImgFacilito }
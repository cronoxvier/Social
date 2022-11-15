import { Imagen } from "../models/imagen"



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


export { createImg, getAllimgByProduct }
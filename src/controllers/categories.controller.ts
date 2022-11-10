import { Response, Request } from 'express';
import { col, Model, Op } from 'sequelize'

import { CategoryStatus } from '../models/category-status';
import { Category } from '../models/category'
import { uploadImg, deletFile } from './image.controller';

const getCategories = async (req: Request, res: Response) => {
    try {
        const category = await Category.findAll()
        if (!category.length) {
            return res.status(200).json({
                message: "No hay categorias"
            })
        }

        res.status(200).json({
            message: "Retorna las categorias",
            category
        })
    } catch (error) {
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            status: 400
        })

        throw error
    }
}
const addCategories = async (req: Request, res: Response) => {
    try {
        const { name, nombre } = req.body
        const category = await Category.create({
            name,
            nombre,

        });


        if (!category) {
            return res.status(204).send({
                ok: false,
            })
        }

        res.status(200).send({
            mensage: 'Category created',
            mensae: 'Categoria creada',
            ok: true,
            category
        })

    } catch (error) {
        res.status(400).send({
            mensaje: "Ha ocurrido un error",
            message: "It has ocurred an error",
            error
        })
    }

}

const updateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, nombre } = req.body;
        const category = await Category.findOne({ where: { id } })

        const updatedCategory = await Category.update({
            name: name,
            nombre: nombre
        },
            {
                where: { id }
            }
        )
        if (updatedCategory) {
            res.status(200).send({
                ok: true,
                category

            })
        }

    } catch (error) {
        res.send({
            Message: 'Something went wrong with you request, try later or call an administrator',
            ok: false,
            error
        })
    }

}

const updateCategoryImage = async (req: Request, res: Response) => {
    const { id } = req.params;
    const category = await Category.findOne({ where: { id } })
    if (!category) {
        return res.status(400).send({
            ok: false
        })

    }

    const url = category.icon
    // console.log(url, "osir")

    
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
        //const {id} = req.params
        const image = req.file as any;
        const category = Category.update({
            icon: image.location
        }, {
            where: {
                id
            }
        })
        if (!category) {
            return res.status(204).send()
        }
        res.status(200).send({
            mensaje: 'Image actualizada'
        })
    })
}
const getCategoriesStatusMobile = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        

        if (!id) {
            return res.status(204).json({
                mensaje: "Id invalido",
                message: "Id invalid"
            })
        }
        const categoryStatus = await CategoryStatus.findAll({
            include: [
                {
                    model: Category,
                    as: 'Category',
                    attributes: [],
                }
            ],
            attributes: [
                [col('Category.id'), 'id'], 'status',
                [col('Category.icon'), 'icon'],
                [col('Category.name'), 'name'],
                [col('Category.nombre'), 'nombre'],
            ],
            where: { pharmacy_id: id, status: true },
        })
        // console.log(categoryStatus)

        var hash = {};
        const array = categoryStatus.filter(function(current) {
            var exists = !hash[current.id];
            hash[current.id] = true;
            return exists;

        })
  
        if (!categoryStatus) {
            return res.status(404).send({
                message: 'Not found',
                mensage: 'No encontrado'
            })
        }


        res.status(200).send({
            message: 'Pharmacy category status',
            mensaje: 'Estatus de categorias',
            categoryStatus:array
        })

        // console.log("getCategoriesStatusMobile)",categoryStatus)

    } catch (error) {
        console.log(error)
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            message: "It has ocurred an error",
        })

        //throw error
    }
}
const getCategoriesStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        console.log(id)

        if (!id) {
            return res.status(204).json({
                mensaje: "Id invalido",
                message: "Id invalid"
            })
        }
        const categoryStatus = await CategoryStatus.findAll({ where: { pharmacy_id: id } })

        if (!categoryStatus) {
            return res.status(404).send({
                message: 'Not found',
                mensage: 'No encontrado'
            })
        }
       
        var hash = {};
        const array = categoryStatus.filter(function(current) {
            var exists = !hash[current.id];
            hash[current.id] = true;
            return exists;

        })
        console.log(array[0], categoryStatus.length)

        res.status(200).send({
            message: 'Pharmacy category status',
            mensaje: 'Estatus de categorias',
            categoryStatus:array
        })



    } catch (error) {
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            message: "It has ocurred an error",
            error
        })

        //throw error
    }
}
const addCategoriesStatus = (req: Request, res: Response) => {
    try {
        const { pharmacy_id, category_id, status } = req.body
        const categoryStatus = CategoryStatus.create({
            pharmacy_id,
            category_id,
            status
        })

        if (!categoryStatus) {
            return res.status(204).send()
        }

        res.status(200).send({
            mensage: 'Category created',
            mensae: 'Categoria creada'
        })

    } catch (error) {
        res.status(400).json({
            mensage: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })

        //throw error
    }

}
const updateCategoriesStatus = async (req: Request, res: Response) => {
    try {
        const { pharmacy_id, category_id, status } = req.body;

        const findStatus = await CategoryStatus.findOne({ where: { pharmacy_id, category_id } })
        const categoryStatus = await CategoryStatus.update({ status }, { where: { pharmacy_id, category_id } })

        // if (findStatus.status == status) {
        //     return res.status(400).send({
        //         message: `The category already has the status`,
        //         mensaje: `La categoria ya tiene el estado`
        //     });
        // }

        if (!categoryStatus) {
            return res.status(204).send()
        }

        res.status(200).send({
            mensage: 'Category status updated',
            mensaje: 'Categoria status actualizada'
        })
    } catch (error) {
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })

        //throw error
    }

}


export {
    getCategories, addCategoriesStatus,
    updateCategoriesStatus, getCategoriesStatus, addCategories, updateCategoryImage, updateCategory, getCategoriesStatusMobile
}


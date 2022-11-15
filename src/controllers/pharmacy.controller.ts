import { Request, Response } from 'express'
import bcrypt from 'bcrypt';
import { deletFile, uploadImg } from './image.controller'
import { col, Model, Op, where } from 'sequelize'

import { Pharmacy } from '../models/Pharmacy'
import { PharmacySchedule } from '../models/pharmacy-schedule'
import { Products } from '../models/products';
import { Category } from '../models/category';
import { PharmacyProduct } from '../models/pharmacy-product';



const getPharmacies = async (req: Request, res: Response) => {
    try {
        const pharmacy = await Pharmacy.findAll({
            where: {
                role_id: 2, disabled:0
            }
        })
        console.log(pharmacy.length)

        if (!pharmacy.length) {
            return res.status(204).json({
                message: "No hay farmacias"
            })
        }

        res.status(200).json({
            message: "Retorna las farmacias",
            pharmacy
        })
    } catch (error) {
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })
    }
}
const getPharmaciesSelect = async (req: Request, res: Response) => {
    try {
        const pharmacy = await Pharmacy.findAll({
            where: {
                role_id: 2
            }
        })
        console.log(pharmacy.length)

        if (!pharmacy.length) {
            return res.status(204).json({
                message: "No hay farmacias"
            })
        }

        res.status(200).json({
            message: "Retorna las farmacias",
            pharmacy
        })
    } catch (error) {
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })
    }
}

const getPharmaciesNewMobile = async (req: Request, res: Response) => {
    try {
        const { limit, initial } = req.body
        console.log(limit, initial)
        const pharmacy = await Pharmacy.findAll({
            limit, offset: initial,
            where: {
                role_id: 2
            }
        })


        if (!pharmacy.length) {
            return res.status(204).json({
                message: "No hay farmacias"
            })
        }

        res.status(200).json({
            message: "Retorna las farmacias",
            pharmacy
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })

        //throw error
    }
}

const getPharmaciesNewMobileSearch = async (req: Request, res: Response) => {
    try {
        const { text } = req.body

        const pharmacy = await Pharmacy.findAll({
            where: { name: { [Op.substring]: text }, }
        })

        res.status(200).json({
            ok: true,
            message: "Retorna las farmacias",
            pharmacy
        })

    } catch (error) {
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })

    }



}
const getPharmacyById = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(204).json({
                mensaje: "Id invalido",
                message: "Id invalid"
            })
        }
        const pharmacy = await Pharmacy.findOne({
            where: {
                id: id
            }
        })
        if (!pharmacy) {
            return res.status(400).json({
                message: "No existe esta farmacia"
            })
        }

        res.status(200).json({
            message: "Retorna la farmacias",
            pharmacy
        })
    } catch (error) {
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })


    }
}
const createNewPharmacy = async (req: Request, res: Response) => {
    try {

        const code = new Date().getTime();
        // console.log(code)

        const {
            secret_key,
            pharmacy_name,
            email,
            add_1,
            npi,
            zip,
            city,
            phone,
            password
        } = req.body
        console.log(secret_key,
            pharmacy_name,
            email,
            add_1,
            npi,
            zip,
            city,
            phone,
            password, "l;llego")

        const passwordHash = await bcrypt.hash(password, 8);
        const params = {
            security_code: code,
            secret_key,
            email,
            name: pharmacy_name,
            address: add_1,
            password: passwordHash,
            npi,
            zip,
            city,
            phone,
        }

        const user = await Pharmacy.findOne({
            where: { email }

        })

        if (user) {
            return res.status(400).send({
                ok:false,
                message: 'That email is taken. Try another',
                mensaje: 'Ese email está tomado. Prueba otra',
                status: 409
            })
        }
        const pharmacy = await Pharmacy.create(params)

        if (!pharmacy) {
            return res.status(204).json({
                ok:false,
                mensaje: "Farmacia no creado",
                message: "Pharmacy not created"
            })
        }
        res.status(200).send({
            ok:true,
            message: 'Pharmacy created',
            mensaje: 'Farmacia creada',
            pharmacy
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok:false,
            mensaje: "Ha ocurrido un error",
            message: "It has ocurred an error",
            error
        })

    }

}
const getPharmacyNames = async (req: Request, res: Response) => {
    try {
        const pharmacy = await Pharmacy.findAll({
            where: {
                role_id: 2
            },
            attributes: [
                'id', 'name'
            ]
        })
        if (!pharmacy.length) {
            return res.status(200).json({
                message: "No hay farmacias"
            })
        }

        res.status(200).json({
            message: "Retorna la farmacias",
            pharmacy
        })
    } catch (error) {
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })


    }
}

const updatePharmacyPhoto = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        console.log(id);

        if (!id) {
            return res.status(204).json({
                mensaje: "Id invalido",
                message: "Id invalid"
            })
        }
        const user = await Pharmacy.findOne({ where: { id } })
        if (!user) {
            return res.status(204).send()
        }

        const url = user.img

        if (url) {
            deletFile(url);
        }

        uploadImg(req, res, (err) => {
            if (err) {
                console.log(err)
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

            const pharmacy = Pharmacy.update({
                img: image.location
            }, {
                where: {
                    id
                }
            })
            if (!pharmacy) {
                return res.status(204).send()
            }
            res.status(200).send({
                mensaje: 'Image actualizada'
            })
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            mensaje: "Algo anda mal",
            message: "Something goes wrog!!",
            error
        })


    }
}
const createdPharmacySchedule = async (req: Request, res: Response) => {
    try {
        const { pharmacy_id, open, close, day } = req.body;
        const pharamcySchedule = await PharmacySchedule.create({
            pharmacy_id,
            day,
            open,
            close
        })
        if (!pharamcySchedule) {
            return res.status(204).send()
        }
        res.status(200).send({
            message: 'Pharmacy schedule created',
            mensaje: 'Horario creado',
            pharamcySchedule
        })

    } catch (error) {
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })

    }
}
const getPharmacySchedule = async (req: Request, res: Response) => {
    try {
        const { pharmacy_id } = req.body

        const pharamcySchedule = await PharmacySchedule.findAll({ where: { pharmacy_id } })

        if (!pharamcySchedule.length) {
            return res.status(204).send()
        }

        res.status(200).send({
            message: 'Pharmacy Schedule',
            pharamcySchedule
        })
    } catch (error) {
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })

    }
}
const updatePharmacySchedule = async (req: Request, res: Response) => {
    try {
        const { id, pharmacy_id, open, close, day } = req.body
        const params = {
            open,
            close,
            day
        }

        const pharamcySchedule = await PharmacySchedule.update(params, { where: { id, pharmacy_id } })

        if (!pharamcySchedule.length) {
            return res.status(204).send()
        }

        res.status(200).send({
            message: 'Schedule updated',
            pharamcySchedule
        })

    } catch (error) {
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })

    }

}
const updateDriverStatus = async (req: Request, res: Response) => {
    try {
        const { pharmacy_id, driver_status } = req.body

        const driverStatus = await Pharmacy.update({ driver_status }, { where: { pharmacy_id } })

        if (!driverStatus.length) {
            return res.status(204).send()
        }

        res.status(200).send({
            message: 'Driver status updated',
            driverStatus
        })
    } catch (error) {
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })

    }
}
const updatePharmacy = async (req: Request, res: Response) => {
    try {
        const { id,
            email,
            npi,
            secret_key,
            name,
            address,
            city,
            phone,
            zip,
            bank_account,
            route_number,
            banking_institute,
            account_name, placeOfDispatch, dispatcher, dispatcherPhone } = req.body
            console.log("aqui")

        const params = {
            email,
            name,
            npi,
            secret_key,
            address,
            city,
            phone,
            zip,
            bank_account,
            route_number,
            banking_institute,
            account_name,
            placeOfDispatch, dispatcher, dispatcherPhone
        }

        const pharmacy = await Pharmacy.update(params, { where: { id: id } })

        if (!pharmacy.length) {
            return res.status(204).send()
        }

        res.status(200).send({
            message: 'Pharmacy updated',
            pharmacy
        })

    } catch (error) {
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })

    }
}
const changePassword = async (req: Request, res: Response) => {
    try {
        const { id, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 8);

        const pharmacy = await Pharmacy.update({ password: passwordHash }, { where: { id } });


        if (!pharmacy.length) {
            return res.status(204).send()
        }

        res.status(200).send({
            mensaje: 'Contraseña actualizada',
            menssage: 'Password updated',
            pharmacy
        })
    } catch (error) {
        res.status(400).send({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })

    }
}

const createAdmin = async (req: Request, res: Response) => {
    try {
        const {
            email,
            password,
            name
        } = req.body;

        const passwordHash = await bcrypt.hash(password, 8);
        const params = {
            email,
            password: passwordHash,
            name,
            role_id: 4
        }

        const admin = await Pharmacy.create(params);

        if (!admin) {
            return res.status(204).send()
        }

        res.status(200).send({
            message: 'Admin created',
            admin
        })
    } catch (error) {
        res.status(400).send({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })

    }
}

const prueba = async (req, res) => {
    try {
        const { ...data } = req.body
        const idPharmacy = req.params.id

        const cumplen = []
        const noCumpleFile = []
        const registrados = [] //  registrados en la tabla producto
        const noRegistrados = [] // no registrados en la tabla producto
        const registradoTablaPharmacyProduct = [] //  registrados en la tabla producto
        const noRegistradoTablaPharmacyProduct = [] // de lo que existe en la tabla producto que no estab registrados en la tabla paharmacias product
        const conCategoryProduct = []
        const registrarTablaProduct = []

        for (let i in data) {
            if (data[i].name != '' && data[i].name != null && data[i].name != undefined) {
                let stin = JSON.stringify(data[i]).toLowerCase().trim()
                let tre = JSON.parse(stin)
                // console.log(tre.hasOwnProperty('upc') == '',  tre.hasOwnProperty('name') == '', i)
                if (tre.hasOwnProperty('upc') && tre.hasOwnProperty('name')) {
                    // si existe las dos almcenar lo que tienenn tanto el name como el codigo
                    cumplen.push(tre)
                } else {
                    // almcenar lo que no cumplan esa condicion
                    noCumpleFile.push(tre)
                }
            }
        }

        for (let i in cumplen) {
            // verificr si existe los productos

            const product = await Products.findOne({
                where: { name: cumplen[i].name, upc: cumplen[i].upc }
            })
            // console.log(product.name=='', product.id , cumplen[i].name)
            if (product) {
                registrados.push(cumplen[i])
                // verficar si existe los productos en la tabla produtos farmacias
                const pharamcyProductbyId = await PharmacyProduct.findOne({ where: { pharmacy_id: idPharmacy, product_id: product.id } })
                if (pharamcyProductbyId) {
                    registrados.push(cumplen[i])
                    registradoTablaPharmacyProduct.push(cumplen[i])// productos registrado en pharmacy product
                } else {
                    noRegistradoTablaPharmacyProduct.push(cumplen[i])// productos no registrado en pharmacy product
                }
            } else {
                noRegistrados.push(cumplen[i])// productos no registrados 
            }
        }

        // verificar si tienen la categoria sino agregara
        for (let i in noRegistrados) {
            if (noRegistrados[i].category == undefined || noRegistrados[i].category == null || noRegistrados[i].category == '') {
                const getAllCategory = await Category.findOne({
                    where: { name: 'All', nombre: 'Todas' }
                })
                if (getAllCategory) {
                    // console.log(noRegistrados[i].name)
                    const params2 = {
                        upc: noRegistrados[i].upc,
                        category_id: getAllCategory.id,
                        name: noRegistrados[i].name.toUpperCase(),
                        price: noRegistrados[i].price ? noRegistrados[i].price : 0,
                        quantity: noRegistrados[i].quantity ? noRegistrados[i].quantity : 100000
                    }
                    // console.log(params2)
                    conCategoryProduct.push(params2)
                }
            } else {
                const category = await Category.findOne({
                    where: { name: noRegistrados[i].category }
                })

                if (category) {
                    //    si existe la categoria
                    let form = {
                        name: noRegistrados[i].name,
                        category_id: category.id,
                        upc: noRegistrados[i].upc,
                        price: noRegistrados[i].price ? noRegistrados[i].price : 0,
                        quantity: noRegistrados[i].quantity ? noRegistrados[i].quantity : 100000
                    }
                    conCategoryProduct.push(form)
                } else {
                    // si la categoria en el file no existe
                    const getAllCategory = await Category.findOne({
                        where: { name: 'All', nombre: 'Todas' }
                    })
                    if (getAllCategory) {
                        const params3 = {
                            upc: noRegistrados[i].upc,
                            category_id: getAllCategory.id,
                            name: noRegistrados[i].name,
                            price: noRegistrados[i].price ? noRegistrados[i].price : 0,
                            quantity: noRegistrados[i].quantity ? noRegistrados[i].quantity : 100000
                        }
                        // console.log(params2)
                        conCategoryProduct.push(params3)
                    }

                }
            }

        }

        for (let i in conCategoryProduct) {
            const newProductRegistered = await Products.create(conCategoryProduct[i])

            if (newProductRegistered) {
                const params = {
                    pharmacy_id: parseInt(idPharmacy),
                    product_id: newProductRegistered.id,
                    stock: conCategoryProduct[i].quantity ? conCategoryProduct[i].quantity : 100000,
                    price: conCategoryProduct[i].price ? conCategoryProduct[i].price : 0,
                    ivu_status: 1,
                    created_by: "",
                    gift_price: 0,
                    gift_status: 0,
                    active: 1,
                    ivu_municipal: 1,
                    ivu_statal: 1
                }
                registrarTablaProduct.push(params)

            }
        }
        for (let i in noRegistradoTablaPharmacyProduct) {
            const ProductRegistered = await Products.findOne({
                where: { name: noRegistradoTablaPharmacyProduct[i].name }
            })
            if (ProductRegistered) {
                const params = {
                    pharmacy_id: parseInt(idPharmacy),
                    product_id: ProductRegistered.id,
                    stock: noRegistradoTablaPharmacyProduct[i].quantity ? noRegistradoTablaPharmacyProduct[i].quantity : 100000,
                    price: noRegistradoTablaPharmacyProduct[i].price ? noRegistradoTablaPharmacyProduct[i].price : 0,
                    ivu_status: 1,
                    created_by: "",
                    gift_price: 1,
                    gift_status: 0,
                    active: 1,
                    ivu_municipal: 1,
                    ivu_statal: 1
                }
                registrarTablaProduct.push(params)
            }

        }

        const pharamcyProduct = await PharmacyProduct.bulkCreate(registrarTablaProduct)

        res.status(200).send({
            ok: true,
            // data,
            cumplen,
            // noCumpleFile,

            // idPharmacy,

            // registrados,
            // noRegistrados,

            // registradoTablaPharmacyProduct,
            // noRegistradoTablaPharmacyProduct,

            conCategoryProduct, //productos registrados
            // registrarTablaProduct,

            pharamcyProduct//productos registrados en la nueva tabla

            // newProductRegistered

        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false,
            msg: "Comuniquese con su administrador"
        })
    }
}

const productPharmacyById = async (req, res) => {
    try {
        const { id } = req.params
        const { ...data } = req.body
        const allProduct = []
        // limit:data.limit, offset:data.initial,
        const productPharmacy = await PharmacyProduct.findAll({
            limit: data.limit, offset: data.initial,
            include: [
                {
                    model: Products,
                    as: 'Products',
                    attributes: []
                }
            ],
            attributes: [
                'id', 'pharmacy_id', 'gift_price', 'ivu_municipal', 'ivu_statal',
                [col('Products.Name'), 'product_name'],
                'product_id', ['active', 'status'],
                [col('Products.Description'), 'product_description'],
                [col('Products.category_id'), 'product_category_id'],
                [col('Products.img'), 'product_img'],
                'stock', 'price', 'gift_status'
            ],

            where: { pharmacy_id: id }
        })
        // if(!productPharmacy){
        //     return res.status(400).send({
        //         mensaje: "Ha ocurrido un error",
        //         messaje: "It has ocurred an error",
        //     })
        // }
        // const Product = awai
        // console.log(productPharmacy)
        // for(let i in productPharmacy){
        //     // console.log(productPharmacy[i].product_id)
        //     const ptoduct = await Products.findByPk(productPharmacy[i].product_id)
        //     if(ptoduct){
        //         allProduct.push(ptoduct)
        //     }
        // }
        res.status(200).send({
            ok: true,
            total: productPharmacy.length,
            // id, 
            // data,
            productPharmacy,

        })

    } catch (error) {
        console.log(error)

    }

}

const enableDisblePharmacy = async (req, res) => {
    try {
        const { id, value } = req.body
        const pharmacy = await Pharmacy.update({ disabled:!value  }, { where: { id } })
        res.status(200).send({
            ok:true,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })

    }
}

export {
    getPharmacies, getPharmacyById, createNewPharmacy,
    getPharmacyNames, updatePharmacyPhoto,
    createdPharmacySchedule, getPharmacySchedule, updatePharmacySchedule,
    updateDriverStatus, updatePharmacy, createAdmin, changePassword, prueba, productPharmacyById,
    getPharmaciesNewMobile,
    getPharmaciesNewMobileSearch, enableDisblePharmacy, getPharmaciesSelect
}
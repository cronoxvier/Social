import { Request, Response } from 'express';
import { col, Model, Op, where } from 'sequelize'
import { deletFile, uploadImg } from './image.controller'

import { PharmacyProduct } from "../models/pharmacy-product";
import { Products } from "../models/products";
import { CartDetail } from '../models/cart-detail';
import { Category } from '../models/category';
import { AuthRequest } from '../interfaces/token';
import { CategoryStatus } from '../models/category-status';
import { ProductOrderStatus } from '../models/product-order-status';
import { OrderDetail } from '../models/order-detail';
import { Order } from '../models/orders';
import { User } from '../models/user';
import { ClientDirection } from '../models/client-direction';
const getProducts = async (req: Request, res: Response) => {
    try {
        const product = await Products.findAll()

        if (!product.length) {
            return res.status(204).json({
                mensaje: "No hay productos",
                message: "There are not products"
            })
        }

        res.status(200).send({
            mensaje: "Retorna los productos",
            message: "Returns the products",
            product
        })
    } catch (error) {
        res.status(400).send({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })


    }
}
const getProductsByPharmacy = async (req: Request, res: Response) => {
    try {
        let pharmacyproduct;
        const { pharmacy_id, category_id, limit, initial } = req.body;
        console.log(limit, initial, category_id, pharmacy_id, "aja")
        if (!pharmacy_id) {
            return res.status(204).json({
                mensaje: "Id invalido",
                message: "Id invalid",
                ok: false
            })
        }
        if (limit != undefined && category_id//&& initial != undefined
        ) {
            console.log("1")
            pharmacyproduct = await PharmacyProduct.findAll({
                limit: limit//, offset: initial,
                ,
                include: [
                    {
                        model: Products,
                        as: 'Products',
                        include: [{
                            model: Category,
                            as: 'Category',
                            include: [{
                                model: CategoryStatus,
                                as: 'CategoryStatus',
                                attributes: [],
                                where: {
                                    status: 1
                                }
                            }],
                            attributes: [[col('id'), 'category_id']],
                            where: { id: category_id }
                        }],
                        attributes: [],
                        where: {
                            img: {
                                [Op.not]: null

                            }
                        },
                        //order:[[col('PharmaciesProducts->Products.Name'), 'DESC']],

                    }
                ],
                attributes: [
                    ['id', 'pharmacy_product_id'], 'pharmacy_id', 'gift_price', 'ivu_municipal', 'ivu_statal',
                    [col('Products.Name'), 'product_name'],
                    'product_id', ['active', 'status'],
                    [col('Products.Description'), 'product_description'],
                    [col('Products.img'), 'product_img'],
                    'stock', 'price', 'gift_status',
                    [col('Products.category_id'), 'category']
                    // [col('Category.name'),'category_name']

                ],
                where: {
                    pharmacy_id: pharmacy_id,
                    active: 1
                },
                //order:[[{ model: Products, as: 'Products' },'name', 'DESC']],
            })
            // console.log(pharmacyproduct)
        }
        else if (limit != undefined) {
            console.log("sin category", 2)
            pharmacyproduct = await PharmacyProduct.findAll({
                limit: limit//, offset: initial,
                ,
                include: [
                    {
                        model: Products,
                        as: 'Products',
                        include: [{
                            model: Category,
                            as: 'Category',
                            include: [{
                                model: CategoryStatus,
                                as: 'CategoryStatus',
                                attributes: [],
                                where: {
                                    status: 1
                                }
                            }],
                            attributes: [[col('id'), 'category_id']],
                            // where: { id: category_id }
                        }],
                        attributes: [],
                        where: {
                            img: {
                                [Op.not]: null

                            }
                        }
                        // order: [
                        //     ['Products.Name', 'ASC']
                        // ]


                    }
                ],
                attributes: [
                    ['id', 'pharmacy_product_id'], 'pharmacy_id', 'gift_price', 'ivu_municipal', 'ivu_statal',
                    [col('Products.Name'), 'product_name'],
                    'product_id', ['active', 'status'],
                    [col('Products.Description'), 'product_description'],
                    [col('Products.img'), 'product_img'],
                    'stock', 'price', 'gift_status',
                    [col('Products.category_id'), 'category']
                    // [col('Products.Category.Id'), 'category']
                    // [col('Category.name'),'category_name']

                ],
                where: {
                    pharmacy_id: pharmacy_id,
                    active: 1
                },
                // order: [
                //     ['Products.Name', 'ASC']
                // ]
            })

        }
        else {
            console.log("3")
            pharmacyproduct = await PharmacyProduct.findAll({
                limit: 200,
                include: [
                    {
                        model: Products,
                        as: 'Products',
                        attributes: [],
                        where: {
                            img: {
                                [Op.not]: null
                            }
                        }
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
                where: { pharmacy_id, active: 1 },
                //  order: [
                //     [Products,'Products.Name', 'ASC']
                // ]
            })
        }

        if (!pharmacyproduct.length) {
            return res.status(204).json({
                mensaje: "No hay productos",
                message: "There are not products",
                ok: false,
                pharmacyproduct
            })
        }
        // for(let i in pharmacyproduct){
        //     console.log(pharmacyproduct[i].product_img, i)
        // }

        res.status(200).send({
            mensaje: "Retorna los productos",
            message: "Returns the products",
            ok: true,
            pharmacyproduct,
        })
        // console.log(pharmacyproduct)
    } catch (error) {
        console.log("get product by pharmacy error", error)
        res.status(400).send({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })

        //throw error
    }
}
const getProductsByPharmacyNewMobile = async (req: Request, res: Response) => {
    try {
        let pharmacyproduct;
        const { pharmacy_id, category_id, limit, initial } = req.body;
        console.log(limit, initial, category_id, pharmacy_id, "aqui")
        if (!pharmacy_id) {
            return res.status(204).json({
                mensaje: "Id invalido",
                message: "Id invalid",
                ok: false
            })
        }
        if (limit != undefined //&& initial != undefined
        ) {
            pharmacyproduct = await PharmacyProduct.findAll({
                limit: limit, offset: initial,

                include: [
                    {
                        model: Products,
                        as: 'Products',
                        include: [{
                            model: Category,
                            as: 'Category',
                            include: [{
                                model: CategoryStatus,
                                as: 'CategoryStatus',
                                attributes: [],
                                where: {
                                    status: 1
                                }
                            }],
                            attributes: [[col('id'), 'category_id']],
                            where: { id: category_id }
                        }],
                        attributes: [],
                        where: {
                            img: {
                                [Op.not]: null

                            }
                        }
                    }
                ],
                attributes: [
                    ['id', 'pharmacy_product_id'], 'pharmacy_id', 'gift_price', 'ivu_municipal', 'ivu_statal',
                    [col('Products.Name'), 'product_name'],
                    'product_id', ['active', 'status'],
                    [col('Products.Description'), 'product_description'],
                    [col('Products.img'), 'product_img'],
                    'stock', 'price', 'gift_status'
                    // [col('Products.Category.Id'), 'category']
                    // [col('Category.name'),'category_name']

                ],
                where: {
                    pharmacy_id: pharmacy_id,
                    active: 1
                }
            })
            // console.log(pharmacyproduct)
        } else {
            pharmacyproduct = await PharmacyProduct.findAll({
                limit: 200,
                include: [
                    {
                        model: Products,
                        as: 'Products',
                        attributes: [],
                        where: {
                            img: {
                                [Op.not]: null
                            }
                        }
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
                where: { pharmacy_id }
            })
        }

        if (!pharmacyproduct.length) {
            return res.status(200).json({
                mensaje: "No hay productos",
                message: "There are not products",
                ok: false,
                pharmacyproduct
            })
        }
        // for(let i in pharmacyproduct){
        //     console.log(pharmacyproduct[i].product_img, i)
        // }

        res.status(200).send({
            mensaje: "Retorna los productos",
            message: "Returns the products",
            ok: true,
            pharmacyproduct,
        })
    } catch (error) {
        res.status(400).send({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })

        //throw error
    }
}
const getProductsByPharmacyPanel = async (req: Request, res: Response) => {
    try {
        let pharmacyproduct;
        const { pharmacy_id, limit, initial } = req.body;

        if (!pharmacy_id) {
            return res.status(204).json({
                mensaje: "Id invalido",
                message: "Id invalid"
            })
        }
        if (limit != undefined && initial != undefined) {
            pharmacyproduct = await PharmacyProduct.findAll({
                limit: limit, offset: initial,
                include: [
                    {
                        model: Products,
                        as: 'Products',
                        attributes: [],
                    }
                ],
                attributes: [
                    'id', 'pharmacy_id', 'gift_price', 'ivu_municipal', 'ivu_statal',
                    [col('Products.Name'), 'product_name'],
                    'product_id', ['active', 'status'],
                    [col('Products.Description'), 'product_description'],
                    [col('Products.category_id'), 'product_category_id'],
                    [col('Products.img'), 'product_img'],
                    [col('Products.upc'), 'upc'],
                    'stock', 'price', 'gift_status'
                ],
                where: { pharmacy_id }
            })

        } else {
            pharmacyproduct = await PharmacyProduct.findAll({
                include: [
                    {
                        model: Products,
                        as: 'Products',
                        attributes: [],
                    }
                ],
                attributes: [
                    'id', 'pharmacy_id', 'gift_price', 'ivu_municipal', 'ivu_statal',
                    [col('Products.Name'), 'product_name'],
                    'product_id', ['active', 'status'],
                    [col('Products.Description'), 'product_description'],
                    [col('Products.category_id'), 'product_category_id'],
                    [col('Products.img'), 'product_img'],
                    [col('Products.upc'), 'upc'],
                    'stock', 'price', 'gift_status'
                ],
                where: { pharmacy_id }
            })
        }
        if (!pharmacyproduct.length) {
            return res.status(204).json({
                mensaje: "No hay productos",
                message: "There are not products"
            })
        }
        // for(let i in pharmacyproduct){
        //     console.log(pharmacyproduct[i].product_img, i)
        // }

        res.status(200).send({
            mensaje: "Retorna los productos",
            message: "Returns the products",
            pharmacyproduct
        })
    } catch (error) {
        res.status(400).send({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })


    }
}
const getProductsByPharmacyNewPanel = async (req: Request, res: Response) => {
    try {
        let pharmacyproduct;
        const { pharmacy_id, limit, initial, selectCategorie, active } = req.params;


        const productQuantity = await PharmacyProduct.findAll({
            include: [
                {
                    model: Products,
                    as: 'Products',
                    attributes: [],
                    include: [
                        {
                            model: Category,
                            as: 'Category',
                            attributes: [],

                        }
                    ],
                    where: { category_id: (Number(selectCategorie) == 0) ? { [Op.not]: null } : Number(selectCategorie) }
                }
            ],
            attributes: [
                'id', 'pharmacy_id', 'gift_price', 'ivu_municipal', 'ivu_statal',
                [col('Products.Name'), 'product_name'],
                'product_id', ['active', 'status'],
                [col('Products.Description'), 'product_description'],
                [col('Products.category_id'), 'product_category_id'],
                [col('Products.img'), 'product_img'],
                [col('Products.upc'), 'upc'],
                [col('Products.Category.name'), 'category_name'],
                'stock', 'price', 'gift_status'
            ],
            where: { pharmacy_id: pharmacy_id, active: (Number(active) == 2) ? { [Op.not]: null } : Number(active) }
        })

        pharmacyproduct = await PharmacyProduct.findAll({
            limit: Number(limit), offset: Number(initial),
            include: [
                {
                    model: Products,
                    as: 'Products',
                    attributes: [],
                    include: [
                        {
                            model: Category,
                            as: 'Category',
                            attributes: [],
                        }
                    ],
                    where: { category_id: (Number(selectCategorie) == 0) ? { [Op.not]: null } : Number(selectCategorie) }
                }
            ],
            attributes: [
                'id', 'pharmacy_id', 'gift_price', 'ivu_municipal', 'ivu_statal',
                [col('Products.Name'), 'product_name'],
                'product_id', ['active', 'status'],
                [col('Products.Description'), 'product_description'],
                [col('Products.category_id'), 'product_category_id'],
                [col('Products.img'), 'product_img'],
                [col('Products.upc'), 'upc'],
                [col('Products.Category.name'), 'category_name'],
                'stock', 'price', 'gift_status'
            ],
            where: { pharmacy_id: pharmacy_id, active: (Number(active) == 2) ? { [Op.not]: null } : Number(active) }
        })

        // if (!pharmacyproduct.length) {
        //     return res.status(204).json({
        //         mensaje: "No hay productos",
        //         message: "There are not products"
        //     })
        // }

        res.status(200).send({
            mensaje: "Retorna los productos",
            message: "Returns the products",
            pharmacyproduct,
            productQuantity: productQuantity.length
        })

    } catch (error) {
        console.log(error)
        res.status(400).send({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })

    }

}


const getProductsByPharmacyNewPanelSearch = async (req: Request, res: Response) => {
    try {
        let pharmacyproduct;
        const { pharmacy_id, limit, initial, selectCategorie, active } = req.params;
        const { text } = req.body


        const productQuantity = await PharmacyProduct.findAll({
            include: [
                {
                    model: Products,
                    as: 'Products',
                    attributes: [],
                    include: [
                        {
                            model: Category,
                            as: 'Category',
                            attributes: [],

                        }
                    ],
                    where: { Name: { [Op.substring]: text }, category_id: (Number(selectCategorie) == 0) ? { [Op.not]: null } : Number(selectCategorie) }
                }
            ],
            attributes: [
                'id', 'pharmacy_id', 'gift_price', 'ivu_municipal', 'ivu_statal',
                [col('Products.Name'), 'product_name'],
                'product_id', ['active', 'status'],
                [col('Products.Description'), 'product_description'],
                [col('Products.category_id'), 'product_category_id'],
                [col('Products.img'), 'product_img'],
                [col('Products.upc'), 'upc'],
                [col('Products.Category.name'), 'category_name'],
                'stock', 'price', 'gift_status'
            ],
            where: { pharmacy_id: pharmacy_id, active: (Number(active) == 2) ? { [Op.not]: null } : Number(active) }
        })


        pharmacyproduct = await PharmacyProduct.findAll({
            limit: Number(limit), offset: Number(initial),
            include: [
                {
                    model: Products,
                    as: 'Products',
                    attributes: [],
                    include: [
                        {
                            model: Category,
                            as: 'Category',
                            attributes: [],
                        }
                    ],
                    where: { Name: { [Op.substring]: text }, category_id: (Number(selectCategorie) == 0) ? { [Op.not]: null } : Number(selectCategorie) }
                }
            ],
            attributes: [
                'id', 'pharmacy_id', 'gift_price', 'ivu_municipal', 'ivu_statal',
                [col('Products.Name'), 'product_name'],
                'product_id', ['active', 'status'],
                [col('Products.Description'), 'product_description'],
                [col('Products.category_id'), 'product_category_id'],
                [col('Products.img'), 'product_img'],
                [col('Products.upc'), 'upc'],
                [col('Products.Category.name'), 'category_name'],
                'stock', 'price', 'gift_status'
            ],
            where: { pharmacy_id: pharmacy_id, active: (Number(active) == 2) ? { [Op.not]: null } : Number(active) }
        })

        // if (!pharmacyproduct.length) {
        //     return res.status(204).json({
        //         mensaje: "No hay productos",
        //         message: "There are not products"
        //     })
        // }

        res.status(200).send({
            mensaje: "Retorna los productos",
            message: "Returns the products",
            pharmacyproduct,
            productQuantity: productQuantity.length
        })

    } catch (error) {
        console.log(error)
        res.status(400).send({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })

    }
}

const createProduct = async (req: Request, res: Response) => {
    try {
        const {
            code_bar,
            gpi,
            upc,
            ndc,
            name,
            size,
            description,
            supplier,
            category_id
        } = req.body
        const parms = {
            code_bar,
            gpi,
            upc,
            ndc,
            name,
            packSize: size,
            description,
            supplierName: supplier,
            category_id
        }
        const verifyNameOfProduct = await Products.findOne({ where: { name: name } })
        if (verifyNameOfProduct) {
            return res.status(200).json({
                ok: false,
                mensaje: "this product is already registered",
                message: "Not product"
            })
        }

        const verifyUpcOfProduct = await Products.findOne({ where: { upc: upc } })
        if (verifyUpcOfProduct) {
            return res.status(200).json({
                ok: false,
                mensaje: "there is a product with this upc",
                message: "Not product"
            })
        }
        const product = await Products.create(parms)

        if (!product) {
            return res.status(204).json({
                ok: false,
                mensaje: "Producto no creado",
                message: "Not product"
            })
        }

        res.status(200).json({
            ok: true,
            mensaje: "Retorna los productos",
            message: "Returns the products",
            product
        })
    } catch (error) {
        res.status(400).send({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an errores",
            error
        })

        //
    }
}

// aqui
const createProductByPharmacy = async (req: Request, res: Response) => {
    try {
        const {
            name,
            category_id,
            description,
            upc,
            stock,
            price,
            ivu_statal,
            ivu_municipal,
            gift_status,
            gift_price,
            pharmacy_id,
            active
        } = req.body

        const product = {
            name,
            category_id,
            description,
            upc,
        }

        const verifyUpcOfProduct = await Products.findOne({ where: { upc: product.upc } })
        if (verifyUpcOfProduct) {
            return res.status(400).json({
                ok: false,
                mensaje: "This upc code already exists",
                message: "Not product"
            })
        }

        const createProduct = await Products.create(product)
        // console.log(createProduct.id)

        const productPharmacy = {
            stock,
            price,
            ivu_statal,
            ivu_municipal,
            gift_status,
            gift_price,
            pharmacy_id,
            product_id: createProduct.id,
            active
        }

        const createProductPharmacy = await PharmacyProduct.create(productPharmacy)

        res.status(200).json({
            ok: true,
            createProduct,
            createProductPharmacy
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
        })

    }

}

const createProductExistForPharmacy = async (req: Request, res: Response) => {
    try {
        const { pharmacy_id, product_id, stock, price, ivu_status, created_by, gift_price, gift_status } = req.body
        const params = {
            pharmacy_id,
            product_id,
            stock,
            price,
            ivu_status,
            created_by,
            gift_price,
            gift_status
        }
        const verify = await PharmacyProduct.findOne({ where: { pharmacy_id: pharmacy_id, product_id: product_id } })
        if (verify) {
            return res.status(400).send({
                message: 'This product already exists',
                mensaje: 'Este producto ya existe'
            })
        }
        const pharamcyProduct = await PharmacyProduct.create(params)
        if (!pharamcyProduct) {
            return res.status(400).send({
                message: 'Product not created',
                mensaje: 'Producto no creado'
            })

        }
        res.status(200).send({
            mensaje: "Producto creado",
            message: "Product created",
            pharamcyProduct
        })
    } catch (error) {
        res.status(400).send({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })
    }

}
const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(204).json({
                mensaje: "Id invalido",
                message: "Id invalid"
            })
        }
        const product = await Products.findOne({
            where: { id }
        })
        if (!product) {
            return res.status(204).json({
                message: "There are not products",
                mensaje: "No hay productos"
            })
        }

        res.status(200).send({
            mensaje: "Retorna la cantidad de productos",
            message: "Returns the products quantity",
            product
        })
    } catch (error) {
        res.status(400).send({
            message: "It has occurred an error",
            mensaje: "Ha ocurrido un error ",
            error
        })


    }
}
const getPharmacyProductByid = async (req: Request, res: Response) => {
    try {
        const { pharmacy_id, id } = req.body;
        console.log(id)

        if (!(pharmacy_id && id)) {
            return res.status(204).json({
                mensaje: "Id invalido",
                message: "Id invalid"
            })
        }
        const pharmacyProduct = await PharmacyProduct.findOne({
            include: [
                {
                    model: Products,
                    as: 'Products',
                    attributes: []
                },
                {
                    model: OrderDetail,
                    as: 'OrdersDetail',
                    attributes: [],
                    include: [{
                        model: Order,
                        as: 'Order',
                        attributes: [],
                        include:[{
                            model:User,
                            as:'Users',
                            attributes: [],
                        }]
                    }]
                }
            ],

            where: {
                id: id,
                pharmacy_id
            },
            attributes: [
                ['id', 'product_pharmacy_id'],
                ['active', 'status'],
                [col('Products.Name'), 'product_name'],
                [col('Products.img'), 'product_img'],
                [col('Products.id'), 'product_id'],
                [col('OrdersDetail.Order.Users.first_name'), 'first_name'],
                [col('OrdersDetail.Order.Users.last_name'), 'last_name'],
                [col('OrdersDetail.Order.Users.phone'), 'phone'],
                [col('OrdersDetail.Order.address_1'), 'address_1'],
                [col('OrdersDetail.Order.address_2'), 'address_2'],
                'price', 'stock', [col('Products.Description'), 'description'],
                'gift_price', 'gift_status', 'ivu_statal', 'ivu_municipal'
            ]

        })
        // console.log(pharmacyProduct);
        if (!pharmacyProduct) {
            return res.status(204).json({
                message: "There are not products",
                mensaje: "No hay productos"
            })
        }

        res.status(200).send({
            message: 'Send products',
            mensaje: 'Enviando productos',
            pharmacyProduct
        })
    } catch (error) {
        console.log("error pharmacies",error)
        res.status(400).send({
            message: 'It has ocurred an error',
            mensaje: 'Ha ocurrido un error',
            error
        })
        //throw error
    }
}
const updateProductByPharmacy = async (req: Request, res: Response) => {
    try {
        const {
            pharmacy_id,
            product_id,
            active,
            stock,
            price,
            gift_price,
            ivu_statal,
            ivu_municipal,
            gift_status,
            category_id,
            upc,
            name
        } = req.body
        const params = {
            stock,
            active,
            price,
            gift_price,
            ivu_statal,
            ivu_municipal,
            gift_status,
            category_id,
            upc
        }
        const paramsProducId = {
            name,
            category_id,
            upc
        }
        // console.log(paramsProducId, "params")

        const pharamcyProductId = await PharmacyProduct.findOne({
            where: {
                pharmacy_id,
                product_id
            }
        })


        const pharmacyProduct = await PharmacyProduct.update(params, {
            where: {
                pharmacy_id,
                product_id

            }
        })

        const product = await Products.update(paramsProducId, { where: { id: product_id, } })
        // console.log(product, 'produc')

        CartDetail.update(
            price, { where: { pharmacy_product_id: pharamcyProductId.id } }
        )
        if (!pharmacyProduct) {
            return res.status(400).send({
                ok: false,
                message: "Not updated",
                mensaje: "No actualizado"
            })
        }

        res.status(200).send({
            ok: true,
            mensaje: "Producto actualizado",
            message: "Producto updated",
        })
    } catch (error) {
        res.status(400).send({
            ok: false,
            message: "It has occurred an error",
            mensaje: "Ha ocurrido un error ",
            error
        })


    }
}
const uploadProduct = (req: Request, res: Response) => {
    try {
        const {
            id,
            gpi,
            upc,
            name,
            size,
            description,
            supplier,
            category_id,
        } = req.body
        const params = {
            gpi,
            upc,
            name,
            packSize: size,
            description,
            supplierName: supplier,
            category_id
        }

        const products = Products.update(params, {
            where: {
                id: id
            }
        })
        if (!products) {
            return res.status(200).json({
                mensaje: "No hay productos",
                message: "There are not products"
            })
        }

        res.status(200).send({
            mensaje: "Producto actualizado",
            message: "Product updated",
        })
    } catch (error) {
        res.status(400).send({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            status: 400
        })


    }
}
const createProductNotExistentForPharmacy = async (req: Request, res: Response) => {
    try {

        const {
            pharmacy_id,
            stock,
            price,
            taxes,
            created_by,
            gift_price,
            gpi,
            upc,
            ndc,
            name,
            size,
            description,
            supplier,
            category_id
        } = req.body

        const params = {
            gpi,
            upc,
            ndc,
            name,
            packSize: size,
            description,
            supplierName: supplier,
            category_id
        }
        const product = await Products.create(params)
        if (!product) {
            return res.status(400).json({
                message: 'Product not created',
                mensaje: 'Producto no creado'
            })
        }
        const pharmacyProduct = await PharmacyProduct.create({
            pharmacy_id,
            product_id: product.id,
            gift_price,
            stock,
            price,
            taxes,
            created_by
        })
        if (!pharmacyProduct) {
            return res.status(400).json({
                message: 'Product not created',
                mensaje: 'Producto no creado'
            })
        }
        res.status(200).send({
            messange: 'Return product',
            mensaje: 'Retorna los producto',
            pharmacyProduct
        })

    } catch (error) {
        res.status(400).send({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            status: 400
        })

    }
}

const updateProductPhoto = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(204).json({
                mensaje: "Id invalido",
                message: "Id invalid"
            })
        }
        const product = await Products.findOne({ where: { id } })

        if (!product) {
            res.status(204).send()
        }

        const url = product.img
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
            console.log(image)


            const product = Products.update({
                img: image.location
            }, {
                where: {
                    id
                }
            })
            if (!product) {
                return res.status(204).send()
            }
            res.status(200).send({
                ok: true,
                mensaje: 'Image actualizada'
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
const getProductsByCategory = async (req: Request, res: Response) => {

    try {
        const { pharmacy_id, category_id } = req.body;
        const products = await Products.findAll({
            where: { category_id }
        })
        let result = [];

        for (let i = 0; i < products.length; i++) {

            const { id } = products[i];
            const data = await PharmacyProduct.findAll({
                where: {
                    product_id: id,
                    pharmacy_id
                }
            });
            result = [...result, ...data];
        }
        if (!result.length) {
            return res.status(204).send()
        }
        res.status(200).send({
            message: 'Product found',
            result
        })
    } catch (error) {
        res.status(400).send({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })
    }

}

const getProductsWithCategory = async (req: AuthRequest, res: Response) => {
    try {

        const { limit, initial } = req.params;


        let numeroInitial: number = <number><any>Number(initial)
        let numeroLimit: number = <number><any>Number(limit)

        const productCount = await Products.findAll()

        const product = await Products.findAll({ limit: numeroLimit, offset: numeroInitial })
        const category = await Category.findAll()
        //console.log(numeroLimit, numeroInitial, 'klk', product.length)

        // const productWithCategory = []
        let productWithCategory = product.map(products => {
            let { category_id } = products
            let numero: number = <number><any>category_id
            let categorys = category.find(res2 => {
                return numero == res2.id
            })

            return {
                nameCategory: categorys.name,
                categoryId: categorys.id,
                name: products.name,
                upc: products.upc,
                img: products.img,
                id: products.id,
                description: products.description
            }
        })


        if (!product.length) {
            return res.status(204).json({
                mensaje: "No hay productos",
                message: "There are not products"
            })
        }

        res.status(200).send({
            mensaje: "Retorna los productos",
            message: "Returns the products",
            products: productWithCategory,
            productQuantity: productCount.length
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

const getProductsWithCategoryWhitowImg = async (req: AuthRequest, res: Response) => {
    try {
        const { limit, initial, category, img } = req.params;
        let product;
        let productCount;

        // Traer todo por default no categoria he img y sin img
        if (Number(category) == 0 && Number(img) == 0) {
            productCount = await Products.findAll()
            product = await Products.findAll({
                limit: Number(limit), offset: Number(initial),
                include: [
                    {
                        model: Category,
                        as: 'Category',
                        attributes: []
                    },

                ],
                attributes: [
                    'id', 'upc', 'name', 'category_id', 'img', 'description',
                    [col('Category.name'), 'category_name'],

                ],
            })
        }

        // tcategorias y imagen null
        if (Number(category) != 0 && Number(img) == 1) {
            //   console.log("es diferente de cep")

            productCount = await Products.findAll({
                include: [
                    {
                        model: Category,
                        as: 'Category',
                        attributes: []
                    }
                ],
                attributes: [
                    'id', 'upc', 'name', 'category_id', 'img',
                    [col('Category.name'), 'category_name'],

                ],
                where: { category_id: Number(category), img: null }

            })

            product = await Products.findAll({
                limit: Number(limit), offset: Number(initial),
                include: [
                    {
                        model: Category,
                        as: 'Category',
                        attributes: []
                    }
                ],
                attributes: [
                    'id', 'upc', 'name', 'category_id', 'img',
                    [col('Category.name'), 'category_name'],

                ],
                where: { category_id: Number(category), img: null }

            })
        }

        // categoria y todo las img null o no null
        if (Number(category) != 0 && Number(img) == 0) {
            // console.log("es diferente de cep")

            productCount = await Products.findAll({
                include: [
                    {
                        model: Category,
                        as: 'Category',
                        attributes: []
                    }
                ],
                attributes: [
                    'id', 'upc', 'name', 'category_id', 'img',
                    [col('Category.name'), 'category_name'],

                ],
                where: { category_id: Number(category) }

            })

            product = await Products.findAll({
                limit: Number(limit), offset: Number(initial),
                include: [
                    {
                        model: Category,
                        as: 'Category',
                        attributes: []
                    }
                ],
                attributes: [
                    'id', 'upc', 'name', 'category_id', 'img',
                    [col('Category.name'), 'category_name'],

                ],
                where: { category_id: Number(category) }

            })
        }

        // // lo que no tienen img no importa la categoria
        if (Number(category) == 0 && Number(img) == 1) {
            //  console.log("es diferente de cep")

            productCount = await Products.findAll({
                include: [
                    {
                        model: Category,
                        as: 'Category',
                        attributes: []
                    }
                ],
                attributes: [
                    'id', 'upc', 'name', 'category_id', 'img',
                    [col('Category.name'), 'category_name'],

                ],
                where: { img: null }

            })

            product = await Products.findAll({
                limit: Number(limit), offset: Number(initial),
                include: [
                    {
                        model: Category,
                        as: 'Category',
                        attributes: []
                    }
                ],
                attributes: [
                    'id', 'upc', 'name', 'category_id', 'img',
                    [col('Category.name'), 'category_name'],

                ],
                where: { img: null }

            })
        }

        res.status(200).send({
            ok: true,
            mensaje: "Retorna los productos",
            message: "Returns the products",
            products: product,
            productQuantity: productCount.length

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

const getProductsWithCategoryToAddPharmacies = async (req: AuthRequest, res: Response) => {
    try {
        const { limit, initial, category, id } = req.params;
        let product;
        let productCount;

        const pharmaciesProducts = await PharmacyProduct.findAll({ where: { pharmacy_id: id } })
        const product_id = pharmaciesProducts.map(x => x.product_id)
        // console.log("prueba", product_id)
        // Traer todo por default no categoria que ya no esten agregados en la farmacia
        if (Number(category) == 0) {
            productCount = await Products.findAll({
                where: {
                    id: {
                        [Op.notIn]: product_id
                    }
                }
            })

            product = await Products.findAll({
                limit: Number(limit), offset: Number(initial),
                include: [
                    {
                        model: Category,
                        as: 'Category',
                        attributes: []
                    },

                ],
                attributes: [
                    'id', 'upc', 'name', 'category_id', 'img',
                    [col('Category.name'), 'category_name'],

                ],
                where: {
                    id: {
                        [Op.notIn]: product_id
                    }
                }
            })
            // console.log(category)
        }

        // categoria y todo las img null o no null
        if (Number(category) != 0) {
            productCount = await Products.findAll({
                include: [
                    {
                        model: Category,
                        as: 'Category',
                        attributes: []
                    }
                ],
                attributes: [
                    'id', 'upc', 'name', 'category_id', 'img',
                    [col('Category.name'), 'category_name'],

                ],
                where: {
                    category_id: Number(category),
                    id: {
                        [Op.notIn]: product_id
                    }
                }

            })

            product = await Products.findAll({
                limit: Number(limit), offset: Number(initial),
                include: [
                    {
                        model: Category,
                        as: 'Category',
                        attributes: []
                    }
                ],
                attributes: [
                    'id', 'upc', 'name', 'category_id', 'img',
                    [col('Category.name'), 'category_name'],

                ],
                where: {
                    category_id: Number(category),
                    id: {
                        [Op.notIn]: product_id
                    }
                }

            })
        }

        // // lo que no tienen img no importa la categoria

        res.status(200).send({
            ok: true,
            mensaje: "Retorna los productos",
            message: "Returns the products",
            products: product,
            productQuantity: productCount.length

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

const getProduSearchToAddPharmacies = async (req: AuthRequest, res: Response) => {
    try {

        const { text } = req.body
        const { limit, initial, id } = req.params;

        const pharmaciesProducts = await PharmacyProduct.findAll({ where: { pharmacy_id: id } })
        const product_id = pharmaciesProducts.map(x => x.product_id)

        const productCount = await Products.findAll({
            where: {
                Name: {
                    [Op.substring]: text,

                },
                id: {
                    [Op.notIn]: product_id
                }
            }
        })
        const product = await Products.findAll({
            limit: Number(limit), offset: Number(initial),
            include: [
                {
                    model: Category,
                    as: 'Category',
                    attributes: []
                },
            ],
            attributes: [
                'id', 'upc', 'name', 'category_id', 'img',
                [col('Category.name'), 'category_name'],
            ], where: {
                Name: {
                    [Op.substring]: text,
                },
                id: {
                    [Op.notIn]: product_id
                }
            }
        })


        res.status(200).send({
            mensaje: "Retorna los productos",
            message: "Returns the products",
            product,
            productQuantity: productCount.length
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

const getProduSearch = async (req: AuthRequest, res: Response) => {
    try {

        const { text } = req.body
        const { limit, initial } = req.params;

        const productCount = await Products.findAll({ where: { Name: { [Op.substring]: text } } })
        const product = await Products.findAll({
            limit: Number(limit), offset: Number(initial),
            include: [
                {
                    model: Category,
                    as: 'Category',
                    attributes: []
                },
            ],
            attributes: [
                'id', 'upc', 'name', 'category_id', 'img', 'description',
                [col('Category.name'), 'category_name'],
            ], where: {
                Name: { [Op.substring]: text }
            }
        })
        // where: { img: (Number(img) != 0)?null:{[Op.not]: null} }
        // console.log(product)

        res.status(200).send({
            ok: true,
            mensaje: "Retorna los productos",
            message: "Returns the products",
            product: product,
            productQuantity: productCount.length
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false,
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })
    }

}

const pruebaProduct = async (req, res) => {
    try {
        const { ...data } = req.body
        const existen = []
        const noExisten = []
        let nuevosP = []
        let productCategoriAll = []

        for (let i in data) {
            let stin = JSON.stringify(data[i]).toLowerCase().trim()
            let tre = JSON.parse(stin)
            // console.log(data[i].hasOwnProperty('upc'), data[i].hasOwnProperty('name'))
            if (tre.hasOwnProperty('upc') && tre.hasOwnProperty('name')) {
                // si existe las dos almcenar lo que tienenn tanto el name como el codigo
                existen.push(tre)
            } else {
                // almcenar lo que no cumplan esa condicion
                noExisten.push(tre)
            }
        }
        const registrarProductfile = existen
        for (let i in registrarProductfile) {
            // buscar de lo que existe por nombre para almacenar su upc
            const product = await Products.findOne({
                where: { name: registrarProductfile[i].name }
            })
            if (product) {
                // validar el upc de los encontrado en la db para actulizarlos si no lo tienen
                if (product.upc == null || product.upc == '' || product.upc == undefined) {
                    const params = {
                        upc: registrarProductfile[i].upc,
                    }
                    // actulizar el producto que existe en la db agregadnole su upc si no lo tiene
                    const updateProduct = await Products.update(params, {
                        where: { name: registrarProductfile[i].name }
                    })
                    // console.log(updateProduct)
                } else {
                    // console.log('no hago nada')
                }
                // si el producto exite pero no tiene upc actulizarlo
            } else {
                // console.log(registrarProductfile[i].name, registrarProductfile[i].category, "no definida",)
                // validar si existe la categoria en el file
                if (registrarProductfile[i].category == undefined || registrarProductfile[i].category == null || registrarProductfile[i].category == '') {

                    // buscar la categoria all
                    const getAllCategory = await Category.findOne({
                        where: { name: 'All', nombre: 'Todas' }
                    })
                    // console.log(registrarProductfile[i].name, registrarProductfile[i].category, "no definida", getAllCategory.id)
                    if (getAllCategory) {
                        // registrar el producto con la cateoria 'all'  si no tiene una categoria
                        const params2 = {
                            upc: registrarProductfile[i].upc,
                            category_id: getAllCategory.id,
                            name: registrarProductfile[i].name.toUpperCase()
                        }
                        // registrar el producto con la categoria all
                        const newproduct = await Products.create(params2)
                        productCategoriAll.push(newproduct)
                    } else {
                        // retornar error indicando que no existe esa categoria
                    }
                } else {
                    // console.log(registrarProductfile[i].name, registrarProductfile[i].category, "definida")
                    // buscar la categoria que tiene y registrarla con esa en el file
                    const category = await Category.findOne({
                        where: { name: registrarProductfile[i].category }
                    })
                    if (category) {
                        let form = {
                            name: registrarProductfile[i].name.toUpperCase(),
                            category_id: category.id,
                            upc: registrarProductfile[i].upc
                        }
                        nuevosP.push(form)
                    }
                }
            }
        }
        const newP = await Products.bulkCreate(nuevosP)
        res.status(200).send({
            ok: true,
            products: newP,
            noProducts: noExisten,
            productCategoriAll
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false,
            msg: "Comuniquese con su administrador"
        })
    }
}

const updateProductById = async (req, res) => {
    try {
        const {
            upc,
            name,
            description,
            category_id,
        } = req.body

        const params = {
            upc,
            name,
            description,
            category_id,
        }

        const { id } = req.params;
        // console.log(id)
        const updateProduct = await Products.update({ ...params }, { where: { id: id } })
        const getProduct = await Products.findByPk(id)

        res.status(200).send({
            ok: true,
            updateProduct,
            id,
            product: getProduct

        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })
    }

}

const getProductWithout = async (req, res) => {
    const products = await Products.findAll({
        where: { img: null }
    })
    try {
        res.status(200).send({
            ok: true,
            products
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            ok: true
        })
    }
}


export {
    getProducts,
    getProductsByPharmacy,
    getProductsByPharmacyPanel,
    createProduct,
    createProductExistForPharmacy,
    getProductById,
    getPharmacyProductByid,
    updateProductByPharmacy,
    uploadProduct,
    createProductNotExistentForPharmacy,
    updateProductPhoto,
    getProductsByCategory,
    getProductsWithCategory,
    pruebaProduct,
    updateProductById,
    getProductWithout,
    createProductByPharmacy,
    getProductsWithCategoryWhitowImg,
    getProduSearch,
    getProduSearchToAddPharmacies,
    getProductsWithCategoryToAddPharmacies,
    getProductsByPharmacyNewPanel,
    getProductsByPharmacyNewPanelSearch,
    getProductsByPharmacyNewMobile
}
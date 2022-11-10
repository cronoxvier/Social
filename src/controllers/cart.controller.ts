import { Request, Response } from 'express';
import { Sequelize, col } from 'sequelize';

import { CartDetail } from '../models/cart-detail';
import { Pharmacy } from '../models/Pharmacy';
import { PharmacyProduct } from '../models/pharmacy-product';
import { Products } from '../models/products';


const getCart = async (req: Request, res: Response) => {
    try {
        const { user_id } = req.body
        if (!user_id) {
            return res.status(204).json({
                mensaje: "Id invalido",
                message: "Id invalid"
            })
        }
        const cartdetail = await CartDetail.findAll({
            include: [
                {
                    model: PharmacyProduct,
                    as: 'PharmacyProduct',
                    include:[{
                        model:Products,
                        as:'Products',
                        attributes: []
                    }],
                    attributes: []
                }
            ],
            attributes: [
                'id', 'user_id',
                'ammount', 'price', 'pharmacy_product_id',
                'from', 'message', 'gift_status_id',
                [col('PharmacyProduct.ivu_statal'), 'ivu_statal'],
                [col('PharmacyProduct.ivu_municipal'), 'ivu_municipal'],
                [col('PharmacyProduct.Products.id'), 'Product_Id'],
                [col('PharmacyProduct.Products.name'), 'Product_Name']
            ],
            where: {
                user_id
            }
        })

        if (!cartdetail.length) {
            return res.status(204).json({
                message: "Not products in the card"
            })
        }
        res.status(200).send({
            ok:true,
            message: "Cart detail",
            cartdetail
        })

    } catch (error) {
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })

       
    }

}
const getCart2 = async (req: Request, res: Response) => {
    try {
        const { user_id } = req.body
        if (!user_id) {
            return res.status(204).json({
                mensaje: "Id invalido",
                message: "Id invalid"
            })
        }
        const cartdetail = await CartDetail.findAll({
            include: [
                {
                    model: PharmacyProduct,
                    as: 'PharmacyProduct',
                    include:[{
                        model:Products,
                        as:'Products',
                        attributes: []
                    }],
                    attributes: []
                }
            ],
            attributes: [
                'id', 'user_id',
                'ammount', 'price', 'pharmacy_product_id',
                'from', 'message', 'gift_status_id',
                [col('PharmacyProduct.ivu_statal'), 'ivu_statal'],
                [col('PharmacyProduct.ivu_municipal'), 'ivu_municipal'],
                [col('PharmacyProduct.Products.id'), 'Product_Id'],
                [col('PharmacyProduct.Products.name'), 'Product_Name'],
                [col('PharmacyProduct.Products.img'), 'Product_img']
            ],
            where: {
                user_id
            }
        })

        if (!cartdetail.length) {
            return res.status(204).json({
                message: "Not products in the card"
            })
        }
        res.status(200).send({
            ok:true,
            message: "Cart detail",
            cartdetail
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
const addToCart = async (req: Request, res: Response) => {

    try {
        const { user_id, pharmacy_product_id, ammount, price } = req.body;
        const params = {
            user_id,
            pharmacy_product_id,
            ammount,
            price
        }
        console.log(params)
        const products = await CartDetail.findOne({
            where: { user_id, pharmacy_product_id }
        })
        if (products) {
            const product_updated = await CartDetail.update(
                {
                    ammount: Sequelize.literal(`ammount + ${ammount}`),
                    price: Sequelize.literal(`price + ${price}`)
                },
                { where: { id: products.id, user_id, pharmacy_product_id } })
            return res.status(200).send({
                ok:true,
                message: 'Product updated',
                product_updated
            })
        }
        const create = await CartDetail.create(params)

        if (!create) {
            return res.status(200).json({
                message: "Not products"
            })
        }

        return res.status(200).json({
            ok:true,
            message: "Product add in cart",
            create
        })
        

    } catch (error) {
        console.log(error)
        res.status(500).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })

        //throw error
    }
}
const clearCart = (req: Request, res: Response) => {
    try {
        const { user_id } = req.body;
        if (!user_id) {
            return res.status(204).json({
                mensaje: "Id invalido",
                message: "Id invalid"
            })
        }
        CartDetail.destroy({
            where: {
               user_id
            }
        })

        res.status(200).send({
            message: "Cart deleted"
        })
    } catch (error) {
        res.status(400).send({
            message: "It has ocurred an error",
            error
        })

       
    }
}
const removeFromCart = (req: Request, res: Response) => {

    try {
        const { id } = req.body;
        console.log(id)
        const cartDetail = CartDetail.destroy({
            where: {
                id
            }
        })
        if (!cartDetail) {
            return res.status(204).send()
        }

        res.status(200).send({
            ok:true,
            mensaje: 'Elminado',
            mensage: 'removed'
        })
    } catch (error) {
        res.status(400).json({
            message: "It has ocurred an error",
            error
        })

      
    }

}
const updateAmountCart = async (req: Request, res: Response) => {
    try {
        const { id, ammount, price, from, message, gift_status_id } = req.body;


        const params = {
            ammount,
            price,
            from,
            message,
            gift_status_id
        }
        const cart = await CartDetail.findOne({ where: { id } })


        const pharmacyProduct = await PharmacyProduct.findOne({ where: { id: cart.pharmacy_product_id } })


        if (!pharmacyProduct.gift_status && gift_status_id == 1) {
            return res.status(200).send({
                message: 'It cant be a gift',
                mensaje: 'No puede ser un regalo'
            })
        }

        const params2 = {
            ammount,
            price,

        }

        if (!pharmacyProduct.gift_status) {
            if (gift_status_id == 1) {
                return res.status(200).send({
                    message: 'It cant be a gift',
                    mensaje: 'No puede ser un regalo'
                })
            }
            const cartdetail = CartDetail.update(params2, {
                where: {
                    id
                }
            })
            if (!cartdetail) {
                return res.status(200).json({
                    message: "product not found"
                })
            }
            res.status(200).send({
                message: 'Ammount updated',
                cartdetail
            })
        }
        else {
            const cartdetail = CartDetail.update(params, {
                where: {
                    id: id
                }
            })

            if (!cartdetail) {
                return res.status(200).json({
                    message: "product not found"
                })
            }
            res.status(200).send({
                message: 'Ammount updated',
                cartdetail
            })
        }

    } catch (error) {
        res.status(400).json({
            message: "It has ocurred an error",
            error
        })

       
    }
}
const getCartByids = async (req: Request, res: Response) => {
    try {
        const { user_id, product_id } = req.body;
        if (!(user_id && product_id)) {
            return res.status(204).json({
                mensaje: "Id invalido",
                message: "Id invalid"
            })
        }
        const cartdetail = await CartDetail.findOne({
            where: {
                user_id,
                pharmacy_product_id: product_id
            }
        })
        if (!cartdetail) {
            console.log("no cart")
           return res.status(204).send({
                message: 'Not Found'
            })
        }
        res.status(200).send({
            message: 'Cart Found',
            cartdetail
        })
    } catch (error) {
        res.status(400).json({
            message: "It has ocurred an error",
            error
        })
      
    }

}


export {
    getCart, addToCart, clearCart,
    removeFromCart, updateAmountCart,
    getCartByids, getCart2
}
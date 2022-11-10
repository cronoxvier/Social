import { Request, Response } from 'express'
import { ClientDirection } from '../models/client-direction'
import { User } from '../models/user'
import {
    col
} from 'sequelize'
import { Order } from '../models/orders'
import { Pharmacy } from '../models/Pharmacy'
import { PharmacyProduct } from '../models/pharmacy-product'
import { OrderDetail } from '../models/order-detail'
import { Products } from '../models/products'
import { Category } from '../models/category'
import { Driver } from '../models/driver'

const userForCity = async (req: Request, res: Response) => {
    try {
        const { city } = req.body
        const user: any = await User.findAll({
            include: [
                {
                    model: ClientDirection,
                    as: 'ClientDirection',
                    attributes: []
                }
            ], attributes: [
                'id', 'first_name', 'last_name',
                [col('ClientDirection.address_1'), 'address'], [col('ClientDirection.phone'), 'phone'],
                [col('ClientDirection.alias'), 'alias'], [col('ClientDirection.city'), 'city'],
                [col('ClientDirection.state'), 'state'],
                [col('ClientDirection.zip_Code'), 'zip_code']
            ]
        })

        if (!user.length) {
            return res.status(204).send()
        }
        const users = user.filter((item) => item.city === city);
        res.status(200).send({
            message: 'User for city',
            mensaje: 'Usuarios por ciudad',
            users,
            ammount: users.length
        });


    } catch (error) {
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })


    }
}
const orderForPharmacyCity = async (req: Request, res: Response) => {
    try {
        const { city } = req.body;
        var order = [];
        const orders: any = await Order.findAll({
            include: [{
                model: Pharmacy,
                as: 'Pharmacy',
                attributes: []
            },
            ], attributes: [
                'id', 'code', 'total_order',
                [col('Pharmacy.name'), 'pharmacy_name'],
                [col('Pharmacy.city'), 'pharmacy_city']
            ]
        })

        if (!orders.length) {
            return res.status(204).send()
        }

        orders.forEach(({ dataValues }) => {
            const { pharmacy_city } = dataValues
            if (pharmacy_city == city) {
                order.push(dataValues)
            }
        })
        if (!order.length) {
            return res.status(204).send()
        }
        res.status(200).send({
            message: 'Ordenes for city',
            mensaje: 'Ordenes por ciudad',
            order,
            ammount: order.length
        });
    } catch (error) {
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })


    }
}
const ProductMostSales = async (req: Request, res: Response) => {
    try {
        const product: { id: number; name: string; amount: any; category: string; }[] = []
        const order = await OrderDetail.findAll();

        await Promise.all(order.map(async ({ pharmacy_product_id }) => {
            const { product_id } = await PharmacyProduct.findOne({
                where: {
                    id: pharmacy_product_id
                }
            });

            const productCategory: any = await Products.findAll({
                where: {
                    id: product_id
                }, include: [
                    {
                        model: Category,
                        as: 'Category',
                        attributes: []
                    }
                ],
                attributes: [
                    'id', 'Name', [col('Category.name'), 'category_name']
                ]
            });

            productCategory.forEach(({ dataValues }) => {
                const { Name, category_name, id } = dataValues;

                const foundCategory = product.findIndex(({ name }) => Name === name);
                if (foundCategory !== -1) {
                    return product[foundCategory].amount += 1;
                }
                else {
                    return product.push({
                        id,
                        name: Name,
                        category: category_name,
                        amount: 1
                    })
                }
            });
        }));

        res.status(200).send({
            message: 'Category sales',
            product
        })


    } catch (error) {
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })


    }
}
const transForUser = async (req: Request, res: Response) => {
    try {

        const { user_id } = req.body
        const user = await User.findAll();
        const userResult = user.map(element => element.id)
        const order = await Order.findAll({
            where: {
                user_id: userResult
            }
        })
        if (!order.length) {
            return res.status(204).send()
        }
        const filter = order.filter((item) => item.user_id === user_id)
        res.status(200).send({
            message: 'Transfers for users',
            filter
        })
    } catch (error) {
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })


    }

}
const mostSaleCategory = async (req: Request, res: Response) => {
    try {
        const category: { name: string; amount: any }[] = []
        const order = await OrderDetail.findAll();

        await Promise.all(order.map(async ({ pharmacy_product_id }) => {
            const { product_id } = await PharmacyProduct.findOne({
                where: {
                    id: pharmacy_product_id
                }
            });

            const productCategory: any = await Products.findAll({
                where: {
                    id: product_id
                }, include: [
                    {
                        model: Category,
                        as: 'Category',
                        attributes: []
                    }
                ],
                attributes: [
                    'id', 'Name', [col('Category.name'), 'category_name']
                ]
            });

            productCategory.forEach(({ dataValues }) => {
                const { category_name } = dataValues;

                const foundCategory = category.findIndex(({ name }) => category_name === name);
                if (foundCategory !== -1) {
                    return category[foundCategory].amount += 1;
                }
                else {
                    return category.push({
                        name: category_name,
                        amount: 1
                    })
                }
            });
        }));

        res.status(200).send({
            message: 'Category sales',
            category
        })


    } catch (error) {
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })


    }
}
const getUserAmmount = async (req: Request, res: Response) => {
    try {
        const user = await User.findAll();

        if (!user.length) {
            return res.status(204).send()
        }

        res.status(200).send({
            message: 'User ammount',
            users: user.length
        })
    } catch (error) {
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })


    }
}
const driverOrders = async (req: Request, res: Response) => {
    try {
        const { limit,offset,drivers, pharmacies, initialDate,finalDate } = req.body
        const orderDriver = await Order.findAll({
            include: [
              {
                model: Pharmacy,
                as: "Pharmacy",
                attributes: [],
              },
              {
                model: Driver,
                as: "Driver",
                attributes: [],
              }
            ],
      
            order: [
              ['hasBilling', 'ASC'],
              ['created_at', 'DESC'],
            ],
            attributes: [
              "id", "code", "total_order", "description_order", "pharmacy_id", "created_at", "updated_at",
              [col("Pharmacy.name"), "PharmacyName"], "phone", "client_state", "alias", "address_1", "address_2",
              "city", "zip_Code", "notes", "stripe_charged_id", "user_id", "order_state_id", "last_card_digit", "stripe_card_id",
              "driver_id", "pick_up_status", 'hasBilling', 'deposit_amount', 'totalDeliveryFee', 'delivery_fee_tax', 'totalTransactioFee', 'transaction_fee_tax',
              'clientBankFee','order_total_without_tax','product_state_tax','product_municipal_tax','delivery_fee_municipal_tax',
              [col("Driver.first_name"), "driver_name"],[col("Driver.zip_code"), "driver_zip_code"],[col("Driver.email"), "driver_email"],
              [col("Driver.first_name"), "driver_first_name"],[col("Driver.last_name"), "driver_last_name"],[col("Driver.img"), "driver_img"]
            ]
          });
        if (!orderDriver.length) {
            return res.status(204).send()
        }

        res.status(200).send({
            message: 'User ammount',
            orderDriver: orderDriver
        })
    } catch (error) {
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })


    }
}

export {
    userForCity,
    orderForPharmacyCity,
    ProductMostSales,
    transForUser,
    mostSaleCategory,
    getUserAmmount,
    driverOrders
}
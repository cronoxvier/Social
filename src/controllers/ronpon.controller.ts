import axios from 'axios';
import { Request, Response } from 'express';
import { OrderState } from '../models/order-state';
import { OrderStateHistory } from '../models/order-state-history';
import { Order } from '../models/orders';
import seqDb from "../config/connectionSequelize";
import { transaction } from '../config/connectionMySql2';
import { round } from '../utils/helpers';
import { ClientDirection } from '../models/client-direction';
import { User } from '../models/user';
import { Pharmacy } from '../models/Pharmacy';
import { CartDetail } from '../models/cart-detail';
import { PharmacyProduct } from '../models/pharmacy-product';
import { Products } from '../models/products';
import { col } from 'sequelize';
import { OrderDetail } from '../models/order-detail';

const getRonpon = async (req: Request, res: Response) => {
    try {
        const { status, id, ronpon_id } = req.body;
        console.log("status enviado", status)
        if (!(status || id || ronpon_id)) {
            return res.status(204).send()
        }
        const statusTransform = (status) => {
            if (status === 'activo') {

                return 4
            }
            if (status === 'cancelado') {
                return 6
            }
            if (status === 'completado') {
                return 5
            }
        }

        const state = statusTransform(status)
        console.log("status retornado", state)
        const order = await Order.findOne({
            where: { id }
        });
        const orderNames = await OrderState.findOne({
            where: { id: state }
        })
        const orderStates = await OrderStateHistory.findAll({
            where: { order_id: id }
        })

        if (!(order && orderStates && orderNames)) {
            return res.status(404).send({
                message: 'Order not found',
                mensaje: 'Orden no encontrada'
            });
        }
        const orderstatus = orderStates.find(({ order_state_id }) => {

            if (order_state_id == state) {
                return true;
            }
            return false;
        })
        if (orderstatus) {
            return res.status(400).send({
                message: `The order already has the status ${orderNames.name}`,
                mensaje: `La orden ya tiene el estado ${orderNames.nombre}`
            });
        }

        const updateOrderState = await Order.update({ order_state_id: state }, { where: { id } })
        if (updateOrderState) {
            // OrderStateHistory.create(
            //     {
            //         order_id: id,
            //         order_state_id: state,
            //         user_id: order.user_id,
            //         totalTransactioFee:1.00,
            //         ...order
            //     })
            return res.status(200).send({
                message: `The order status updated ${orderNames.name}`,
                mensaje: `El estatus de la orden ha sido actualizada ${orderNames.nombre}`
            })
        }
    } catch (error) {
        res.status(400).send({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })

        // throw error
    }
}




const getAvailablesZipCodes = async (req: Request, res: Response) => {
    try {
        const url = 'https://ronpon-prisma-9s0xuabkm-pixnabiteam.vercel.app/api/getAvailablesZipCodes';
        let response: any = [];
        const zipCodes = await axios.post(url).then((resp) => {
            response = resp
            res.status(200).send({
                resp,
                ok: true
            })
        }).catch((err) => {
            response = err
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })
    }
}

const sendToRonpon = async (req: Request, res: Response) => {
    const transaction = await seqDb.transaction({ autocommit: false });
    const {order_id}= req.body
    
    try {
        const commerceKey = process.env.COMMERCEKEY
        const r = await Order.findOne({where:{id:order_id}})
        const userInformation = await User.findOne({ where: { id: r.user_id } })
        const clientDirection = await ClientDirection.findOne({ where: { id: userInformation.client_direction_id } })
        const pharmacy = await Pharmacy.findOne({ where: { id: r.pharmacy_id } })
        const products = await OrderDetail.findAll({
            where: { order_id: r.id },
            include: [
              {
                model: PharmacyProduct,
                as: "PharmacyProduct",
                include: [{
                  model: Products,
                  as: "Products"
                }],
                attributes: [],
              },
            ],
            attributes: [
              "pharmacy_product_id", "quantity",
              "from",
              "message",
              "gift_status_id",
              [col("PharmacyProduct.ivu_municipal"), "ivu_municipal"],
              [col("PharmacyProduct.ivu_statal"), "ivu_statal"],
              [col("PharmacyProduct.price"), "price"],
              [col("PharmacyProduct.gift_price"), "gift_price"],
              [col("PharmacyProduct.Products.name"), "name"],
              [col("PharmacyProduct.Products.img"), "imageUrl"]
            ],
            raw: true,
            transaction,
          });
        console.table(products)
        let arrayProducst = [];
        const ronponOrder = {
          id: r.id.toString(),
          commerceKey: commerceKey,
          products:  products,
          // .map((x: any) => {
          //   console.log("lista de productos2", x)
          //   //const {product_name,product_image} = x
          //   //console.log("nameAndImage",product_name,product_image)"
          //   console.log("array product",arrayProducst)
          //   return {

          //   }
          // }),
          user: {
            firstName: userInformation.first_name,
            lastName: userInformation.last_name,
            phone: userInformation.phone,
            email: userInformation.email
          },
          address: {
            name: clientDirection.alias,
            line1: clientDirection.address_1,
            line2: clientDirection.address_2,
            zipcode: clientDirection.zip_Code,
            city: clientDirection.city,
            country: clientDirection.state,
            location: {
                latitude: r.latitude,
                longitude: r.longitude
                }
          },
          pointA: {
            name: pharmacy.name,
            line1: pharmacy.address,
            line2: "",
            zipcode: pharmacy.zip,
            city: pharmacy.city,
            state: "Puerto Rico",
            country: "PR",
          },
          note: r.notes,
          scheduleOption: "same day",
          subTotal: r.order_total_without_tax,
          taxes: round(r.order_total_tax+r.delivery_fee_tax+r.transaction_fee_tax+r.totalTransactioFee),
          deliveryFee: r.totalDeliveryFee,
          total: r.total_order
        }

        console.log("ronpon order", ronponOrder)
        const url =  process.env.RONPONURL
        //'https://ronpon-prisma.vercel.app/api/saveOrderCommerce'
        const data = await axios.post(url, ronponOrder).then(async ({ data }) => {
           console.log("ronpon data", data); 
           await Order.update({ ronpon_id: data.order_id }, { where: { id: r.id }, transaction }).then(async () =>{ 
               await transaction.commit()
               res.status(200).json({
                ok: true,
                mensaje: "Retorna los ronpon data",
                message: "Returns the ronpon data",
                data
            })
            })
       })
        //return data
    } catch (error) {
        await transaction.rollback()
        console.log(error)
        res.status(400).send({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an errores",
            error
        })
    }
}

const changeRonponStatus = async (req: Request, res: Response) => {
    try {
        console.log(req.body)
        const { status, id, ronpon_id } = req.body;

        if (!(status || id || ronpon_id)) {
            return res.status(204).send()
        }
        const statusTransform = (status) => {
            if (status === 'activo') {
                return 4
            }
            if (status === 'cancelado') {
                return 6
            }
            if (status === 'completado') {
                return 5
            }
        }

        const state = statusTransform(status)
        const order = await Order.findOne({
            where: { id }
        });
        const orderNames = await OrderState.findOne({
            where: { id: state }
        })
        const orderStates = await OrderStateHistory.findAll({
            where: { order_id: id }
        })

        if (!(order && orderStates && orderNames)) {
            return res.status(404).send({
                message: 'Order nor found',
                mensaje: 'Orden no encontrada'
            });
        }
        const orderstatus = orderStates.find(({ order_state_id }) => {

            if (order_state_id == state) {
                return true;
            }
            return false;
        })
        if (orderstatus) {
            return res.status(400).send({
                message: `The order already has the status ${orderNames.name}`,
                mensaje: `La orden ya tiene el estado ${orderNames.nombre}`
            });
        }

        const updateOrderState = await Order.update({ order_state_id: state }, { where: { id } })
        if (updateOrderState) {
            console.log(order)
            OrderStateHistory.create(
                {
                    order_id: id,
                    order_state_id: state,
                    user_id: order.user_id,
                    order_total: order.total_order,
                    order_total_without_tax: order.order_total_without_tax,
                    order_total_tax: order.order_total_tax,
                    delivery_fee_tax: order.delivery_fee_tax,
                    transaction_fee_tax: order.transaction_fee_tax,
                    totalDeliveryFee: order.totalDeliveryFee,
                    totalTransactioFee: order.totalTransactioFee,
                    created_by:"Ronpon",
                    ...order
                })
            return res.status(200).send({
                message: `The order status updated ${orderNames.name}`,
                mensaje: `El estatus de la orden ha sido actualizada ${orderNames.nombre}`
            })
        }
    } catch (error) {
        res.status(400).send({
            ok: false
        })
    }
}
export { getRonpon, getAvailablesZipCodes, changeRonponStatus, sendToRonpon }
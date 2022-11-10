import { Billing } from "../models/billing";
import { Response, Request } from 'express';
import { BillingDetail } from "../models/billing-detail";
import { Op, where } from "sequelize/dist";
import { BillingStatus } from "../models/billing-status";
import { Order } from "../models/orders";
import { OrderDetail } from "../models/order-detail";
import { PharmacyProduct } from "../models/pharmacy-product";
import { Products } from "../models/products";
import {
    ValidationError,
    col,
    ForeignKeyConstraintError,
    Sequelize,
} from "sequelize";
import { round } from "../utils/helpers";
//billing
const getBillingHeader = async (req: Request, res: Response) => {
    try {

        const billing = await Billing.findAll({
            include: [{
                model: BillingDetail,
                as: 'BillingDetail',
                include: [{
                    model: Order,
                    as: 'Order',
                }]
            }],
            attributes: [
                "id", "code", "created_at", "deposit_amount", "created_by", "billing_status_id", "deleted", "amount_orders",
                "pharmacyBankFee", "stimated_paid_date", "description_billing", "totalDeliveryFee", "totalTransactioFee", "total_billing", "updated_at",
                [col("BillingDetail.id"), "BillingDetail_id"], [col("BillingDetail.Order.id"), "order_id"], [col("BillingDetail.Order.order_total_without_tax"), "order_total_without_tax"],
                [col("BillingDetail.Order.product_municipal_tax"), "product_municipal_tax"], [col("BillingDetail.Order.product_state_tax"), "product_state_tax"],
                [col("BillingDetail.Order.deposit_amount"), "deposit_amount_client"]
            ],

            order: [
                ['created_at', 'DESC'],
            ],
        })
        if (!billing.length) {
            return res.status(204).json({
                mensaje: "No hay facturas",
                message: "there aren't billing"
            })
        }

        res.status(200).json({
            mensaje: "Facturas generadas",
            message: "Generated billings",
            billing
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            status: 400
        })

        // throw error
    }
}
const getBillingHeaderByPharmacyId = async (req: Request, res: Response) => {
    const { pharmacy_id } = req.body
    try {

        const billing = await Billing.findAll({
            include: [{
                model: BillingDetail,
                as: 'BillingDetail',
                include: [{
                    model: Order,
                    as: 'Order',
                    where: {
                        pharmacy_id
                    },

                }],
            }],
            attributes: [
                "id", "code", "created_at", "deposit_amount", "created_by", "billing_status_id", "deleted", "amount_orders",
                "pharmacyBankFee", "stimated_paid_date", "description_billing", "totalDeliveryFee", "totalTransactioFee", "total_billing", "updated_at",
                [col("BillingDetail.id"), "BillingDetail_id"], [col("BillingDetail.Order.id"), "order_id"], [col("BillingDetail.Order.order_total_without_tax"), "order_total_without_tax"],
                [col("BillingDetail.Order.product_municipal_tax"), "product_municipal_tax"], [col("BillingDetail.Order.product_state_tax"), "product_state_tax"],
                [col("BillingDetail.Order.deposit_amount"), "deposit_amount_client"], [col("BillingDetail.Order.pharmacy_id"), "pharmacy_id"]
            ],
            order: [
                ['created_at', 'DESC'],
            ],
        })
        if (!billing.length) {
            return res.status(204).json({
                mensaje: "No hay facturas",
                message: "there aren't billing"
            })
        }

        res.status(200).json({
            mensaje: "No hay facturas",
            message: "there aren't billing",
            billing
        })
    } catch (error) {
        res.status(500).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
        })
        console.log(error)

        // throw error
    }
}

const CreateBillingHeader = async (req, res) => {
    try {

        const { code, total_billing, description_billing, amount_orders, billing_status_id, stimated_paid_date, created_by, updated_by, orders } = req.body;
        //const s = await BillingStatus.create({ name: 'Pending', nombre: 'Pendiente', code: 'PENDING' })
        console.log(description_billing, stimated_paid_date)
        //const bankFee = (total_billing * 0.03) + 0.23
        let delivery = amount_orders * 6;
        let transaction = 1 * amount_orders;
        const BillingOrders = await Order.findAll({
            where: {
                id: orders
            }
        })
        // BillingOrders['Order'].map((o)=>{
        //    if( o.pickupStatus){
        //    // deliveryFee=6*amount_orders;
        //    }
        //    console.log(o)
        // })
        const deposit = BillingOrders.reduce((accumulator, current) => accumulator + current.deposit_amount - (((current.deposit_amount * 0.03) + 0.23) + round(((((current.deposit_amount * 0.03) + 0.23) * 0.04))) + round(current.clientBankFee + ((current.clientBankFee) * 0.115))), 0)//total_billing - delivery - bankFee - transaction
        const bankFee = (deposit * 0.03) + 0.23
        // console.log("billinOders",BillingOrders)
        const billing = await Billing.create({
            //code: new Date().getTime(),
            total_billing: BillingOrders.reduce((accumulator, current) => accumulator + current.deposit_amount, 0),//total_billing,
            description_billing: description_billing,
            amount_orders: amount_orders,
            deposit_amount: deposit,
            totalDeliveryFee: BillingOrders.reduce((accumulator, current) => accumulator + current.totalDeliveryFee > 0 ? current.totalDeliveryFee - 1 : 0.00, 0),
            totalTransactioFee: BillingOrders.reduce((accumulator, current) => accumulator + current.totalTransactioFee, 0),
            pharmacyBankFee: BillingOrders.reduce((accumulator, current) => accumulator + (current.deposit_amount - (((current.deposit_amount * 0.03) + 0.23) + round(((((current.deposit_amount * 0.03) + 0.23) * 0.04))) + round(current.clientBankFee + ((current.clientBankFee) * 0.115)))), 0), //BillingOrders.reduce((accumulator, current) => accumulator + current.clientBankFee, 0) ,//bankFee,
            billing_status_id: billing_status_id,
            stimated_paid_date: stimated_paid_date,
            created_by: created_by,
            updated_by: updated_by
        }).then(async (response) => {
            console.log(response, "test", orders)
            const { id } = response;
            const fieldUpdate = Order.update({ hasBilling: 1 }, {
                where: {
                    id: orders
                }
            })
            const newBillingDetail = orders.map((item, index) => {
                return {
                    billing_id: id,
                    order_id: item
                }

            })
            // console.log(newBillingDetail)
            const billingDetail = await BillingDetail.bulkCreate(newBillingDetail)
            return billingDetail
        }).catch((e) => console.log('Create billing has failed', e));



        if (!billing) {
            res.status(204).send({
                message: 'Billing not created',
                mensaje: 'Factura no creada',
                ok: false,
                billing
            })

        }
        res.status(200).send({
            mensaje: "Factura creada",
            message: "Billing created",
            ok: true,
            billing

        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an errores",
            error
        })
    }

}

const updateBillingHeader = async (req: Request, res: Response) => {
    try {
        //const { id } = req.params;
        const { id, total_billing, description_billing, billing_status_id, stimated_paid_date, updated_by } = req.body;
        const billing = await Billing.findOne({ where: { id } })

        const updatedBilling = await Billing.update({
            total_billing: total_billing,
            description_billing: description_billing,
            billing_status_id: billing_status_id,
            stimated_paid_date: stimated_paid_date,
            updated_by: updated_by
        },
            {
                where: { id }
            }
        )
        if (updatedBilling) {
            res.status(200).send({
                ok: true,
                billing

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


const getBillingDetail = async (req: Request, res: Response) => {
    const { billing_id } = req.body
    console.log(billing_id)
    try {

        const billingDetail = await BillingDetail.findAll(
            {
                include: [{
                    model: Order,
                    as: 'Order',
                    include: [{
                        model: OrderDetail,
                        as: 'OrdersDetail',
                        include: [{
                            model: PharmacyProduct,
                            as: 'PharmacyProduct',
                            include: [{
                                model: Products,
                                as: 'Products'
                            }]
                        }]
                    }]
                }],
                where: {
                    billing_id
                }

            }
        )
        if (!billingDetail.length) {
            return res.status(204).json({
                mensaje: "No hay facturas",
                message: "there aren't billing"
            })
        }

        res.status(200).json({
            mensaje: "Retorna billling",
            message: "billing returned",
            billingDetail
        })
    } catch (error) {
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            status: 400
        })

        // throw error
    }
}

const getBillingDetailByPharmacy = async (req: Request, res: Response) => {
    const { billing_id, pharmacy_id } = req.body
    console.log(billing_id, pharmacy_id)
    try {

        const billingDetail = await BillingDetail.findAll(
            {
                include: [{
                    model: Order,
                    as: 'Order',
                    include: [{
                        model: OrderDetail,
                        as: 'OrdersDetail',
                        include: [{
                            model: PharmacyProduct,
                            as: 'PharmacyProduct',
                            where: { pharmacy_id },
                            include: [{
                                model: Products,
                                as: 'Products'
                            }]
                        }]
                    }],
                    where: { pharmacy_id },
                }],
                where: {
                    billing_id
                }

            }
        )
        console.log(billingDetail)
        if (!billingDetail.length) {
            return res.status(204).json({
                mensaje: "No hay facturas",
                message: "there aren't billing"
            })
        }

        res.status(200).json({
            mensaje: "Retorna billling",
            message: "billing returned",
            billingDetail
        })
    } catch (error) {
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            status: 400
        })

        // throw error
    }
}


const updateBillingDetail = async (req: Request, res: Response) => {
    try {
        //const { id } = req.params;
        const { id, total_billing, description_billing, billing_status_id, stimated_paid_date, updated_by } = req.body;
        const billing = await Billing.findOne({ where: { id } })

        const updatedBilling = await Billing.update({
            total_billing: total_billing,
            description_billing: description_billing,
            billing_status_id: billing_status_id,
            stimated_paid_date: stimated_paid_date,
            updated_by: updated_by
        },
            {
                where: { id }
            }
        )
        if (updatedBilling) {
            res.status(200).send({
                ok: true,
                billing

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

const getBillingstatus = async (req: Request, res: Response) => {

    try {
        const billingStatus = await BillingStatus.findAll()
        if (!billingStatus.length) {
            return res.status(204).json({
                mensaje: "No hay estados creados",
                message: "there aren't status"
            })
        }

        res.status(200).json({
            mensaje: "No hay estados creados",
            message: "there aren't status",
            billingStatus
        })
    } catch (error) {
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            status: 400
        })

    }
}

export {
    CreateBillingHeader, updateBillingHeader, getBillingHeader, getBillingDetail, getBillingDetailByPharmacy, updateBillingDetail, getBillingstatus, getBillingHeaderByPharmacyId
}
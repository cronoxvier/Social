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
import { OccupancyRequests } from '../models/OccupancyRequest'
import { PharmacyProduct } from '../models/pharmacy-product';
import { Products } from '../models/products';
import { col, ForeignKeyConstraintError, Op } from 'sequelize';
import { OrderDetail } from '../models/order-detail';
import { placeToPayRequestId } from '../models/PlaceToPay-requesId';
import { dbf, firebase } from '../config/firebase';
import { Rent } from '../models/Rent';
import { RentDetails } from '../models/RentDetails';
import { Category } from '../models/category';
import { CategoryStatus } from '../models/category-status';

const createRent = async (req: Request, res: Response) => {
    const transaction = await seqDb.transaction({ autocommit: false });
    const code = new Date().getTime();
    try {
        const {
            id,
            code,
            total_payment,
            description,
            nota,
            first_payment,
            TOKEN,
            user_id,
            requestId,
            pharmacy_id,
            occupancy_request_id,
            pharmacy_product_id,
            RentDetail

        } = req.body
        console.log(req.body, "body")
        const rentRequest = {
            id,
            code,
            total_payment,
            description: first_payment ? 'Security deposit request' : description,
            nota,
            first_payment,
            TOKEN,
            user_id,
            pharmacy_id,
            occupancy_request_id,
            pharmacy_product_id,
            RentDetail
        }
        // console.log(OccupancyRequest,'OccupancyRequest created')
        const rent = await Rent.create(rentRequest, {
            include: [{
                model: RentDetails,
                as: 'RentDetail'
            }],
            transaction, returning: true
        }).then(async (r) => {
            const updatePlaceToPayRequestId = await placeToPayRequestId.update({ order_id: r.id }, { where: { requestId: requestId }, transaction, returning: true })
            const updateProduct = await PharmacyProduct.update({ active: false }, { where: { id: pharmacy_product_id }, transaction, returning: true })
                .catch((r) => console.log("error", r))
            console.log(r, requestId, 'test')
            await firebase.firestore().collection('propertiesOrder').add({
                message: 'A new order #' + r.code + ' has been placed.',
                seen: false,
                user_id,
                order_id: r.id,
                order_status: 1
            });

            //   await firebase.firestore().collection('orders').add({
            //     order_id: r.id,
            //     order_status: 1,
            //     farmacy_id: pharmacy_id
            //   });

            await firebase.firestore().collection('notificationsPush').add({
                message: 'A new order #' + rentRequest.code + ' has been placed.',
                seen: false,
                pharmacy_id: pharmacy_id + '',
                order_id: r.id,
                order_status: 1,
                token: TOKEN
            });
        })

        // if (!or) {
        //     res.status(204).send({
        //         message: 'Billing not created',
        //         mensaje: 'Factura no creada',
        //         ok: false,
        //         or
        //     })

        // }
        await transaction.commit();
        res.status(200).send({
            mensaje: "Renta creada",
            message: "Rent created",
            ok: true,
            rent
        })
    } catch (error) {
        console.log(error)
        await transaction.rollback();
        res.status(400).send({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an errores",
            error
        })
    }
}

const getRentByUser = async (req: Request, res: Response) => {
    const { user_id } = req.body
    try {
       
        const pharmacyproduct = await Rent.findAll({
            subQuery: false,
            include: [{
                model: OccupancyRequests,
                as: 'OccupancyRequests',
                required:true,
                include:[{
                    model:PharmacyProduct,
                    as:'PharmacyProduct',
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
                                //where: { id: category_id }
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
                }]
            },
            {
                model: RentDetails,
                as: 'RentDetail'
            }],
            attributes: [['id','rent_id'],['code','rent_code'],['description','rent_description'], 
            [col('OccupancyRequests.PharmacyProduct.id'),'pharmacy_product_id'],
           [col ('OccupancyRequests.id'),"occupancy_request_id"], [col('OccupancyRequests.PharmacyProduct.pharmacy_id'),'pharmacy_id'],
            [col('OccupancyRequests.PharmacyProduct.gift_price'),'security_deposit'], 
            [col('OccupancyRequests.PharmacyProduct.ivu_municipal'),'ivu_municipal'], [col('OccupancyRequests.PharmacyProduct.ivu_statal'),'ivu_statal'],
            [col('OccupancyRequests.PharmacyProduct.Products.Name'), 'product_name'],
            [col('OccupancyRequests.PharmacyProduct.product_id'),'product_id'], [col('OccupancyRequests.PharmacyProduct.active'), 'status'],
            [col('OccupancyRequests.PharmacyProduct.Products.Description'), 'product_description'],
            [col('OccupancyRequests.PharmacyProduct.Products.img'), 'product_img'],
           [col('OccupancyRequests.PharmacyProduct.stock'),'stock'], [col('OccupancyRequests.PharmacyProduct.price'),'price'],
           [ col('OccupancyRequests.PharmacyProduct.gift_status'),'gift_status'],
            [col('OccupancyRequests.PharmacyProduct.Products.category_id'), 'category']
        ],
            where: { user_id }
        })
        if (!pharmacyproduct) {
            return res.status(404).send({
                message: 'Requests not found',
                mensaje: 'Solicitudes no encontradas',
                ok: false
            });
        }
        return res.status(200).send({
            message: 'Requests found',
            mensaje: 'Solicitudes encontradas',
            ok: true,
            pharmacyproduct
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })
    }
}

const getRentById = async (req: Request, res: Response) => {
    const { id } = req.body
    try {
        const rent = await Rent.findOne({
            where: { id },
            include: [{
                model: OccupancyRequests,
                as: 'OccupancyRequests',
                include: [{
                    model: PharmacyProduct,
                    as: 'PharmacyProduct',
                    include: [{
                        model: Products,
                        as: 'Products'
                    }]
                }],
            }],
            attributes: [
                "product_pharmacy_id",
                "RequestFee",
                'code',
                [col('Full'), 'FullName'],
                'DateOfBirth',
                'SSN',
                'Phone',
                'Email',
                'Address',
                'City',
                'State',
                'Zipcode',

                'CurrentLandlord',

                'LandlordPhone',

                'RentAmount',

                'MoveInDate',

                'Expiration',

                'ReasonForMoving',

                'AreYouBeingEvicted',

                'WhoShouldWeContactInCaseEmergency',

                'EmergencyPhone',

                'EmergencyAddress',

                'EmergencyCity',

                'EmergencyState',

                'EmergencyZipcode',

                'EmergencyPersonRelationship',

                'FutureTenant',

                'FutureTenantBirthDay',
                'order_state_id',
                //  ["ammount", "quantity"],
                // ["price", "product_price"],
                // "from",
                // "message",
                //"gift_status_id",
                // [col("PharmacyProduct.ivu_municipal"), "ivu_municipal"],
                // [col("PharmacyProduct.ivu_statal"), "ivu_statal"],
                // [col("PharmacyProduct.price"), "original_price"],
                // [col("PharmacyProduct.gift_price"), "gift_price"],
                [col("PharmacyProduct.Products.name"), "name"],
                [col("PharmacyProduct.Products.img"), "imageUrl"]
            ]
        });
        //console.log(OccupancyRequest)
        if (!rent) {
            return res.status(404).send({
                message: 'Request not found',
                mensaje: 'Solicitud no encontrada',
                ok: false
            });
        }
        return res.status(200).send({
            message: 'Rent found',
            mensaje: 'Renta encontrada',
            ok: true,
            rent
        })
    } catch (error) {
        console.log("catch error", error)
        res.status(400).send({
            ok: false
        })
    }
}

const updateRentState = async (req: Request, res: Response) => {
    let { rent_id, state, user_id } = req.body;

    try {
        const rent = await Rent.findOne({
            where: { id: rent_id },
        });

        // console.log(order)
        const orderNames = await OrderState.findOne({
            where: { id: state },
        });
        //   const orderStates = await OrderStateHistory.findAll({
        //     where: { occupancy_id },
        //   });
        console.log(rent, orderNames, "rent")
        if (!(rent /*&& orderStates*/ && orderNames)) {
            res.status(404).send({
                ok: false,
                message: "Request not found",
                mensaje: "Solicitud no encontrada",
            });
        }
        //   const orderstatus = orderStates.find(({ order_state_id }) => {
        //     if (order_state_id == state) {
        //       return true;
        //     }
        //     return false;
        //   });
        //   if (orderstatus) {
        //     return res.status(400).send({
        //       ok:false,
        //       message: `The order already has the status ${orderNames.name}`,
        //       mensaje: `La orden ya tiene el estado ${orderNames.nombre}`,
        //     });
        //   }

        const updateRentState = await Rent.update(
            {
                order_state_id: state,
                updated_by: user_id,
                //   transaction_fee_tax: order.totalTransactioFee * 0.115,
                //   delivery_fee_tax: order.totalDeliveryFee * 0.115,
                //   totalTransactioFee:order.totalTransactioFee,
                //   totalDeliveryFee:order.totalDeliveryFee,
                //   order_total_without_tax:order.order_total_without_tax,
                //   order_total_tax:order.order_total_tax,
                //   order_total: order.total_order,
            },
            { where: { id: rent_id } }
        ).then(() => {
            return res.status(200).send({
                ok: true,
                message: `The request status updated ${orderNames.name}`,
                mensaje: `El estatus la solicitud ha sido actualizada ${orderNames.nombre}`,
            });
        })//.then( async()=>{
        //     //if (updateOrderState) {
        //       console.log("updating order status")
        //       await OrderStateHistory.create({
        //          order_id,
        //          order_state_id: state,
        //          user_id,
        //          created_by: user_id,
        //          transaction_fee_tax: order.totalTransactioFee * 0.115,
        //          delivery_fee_tax: order.totalDeliveryFee * 0.115,
        //          totalTransactioFee:order.totalTransactioFee,
        //          totalDeliveryFee:order.totalDeliveryFee,
        //          order_total_without_tax:order.order_total_without_tax,
        //          order_total_tax:order.order_total_tax,
        //          order_total: order.total_order,
        //          ...order
        //        }).catch((error) => console.log("Error updating order status",error)).then((r)=>{
        //         return res.status(200).send({
        //           ok:true,
        //           message: `The order status updated ${orderNames.name}`,
        //           mensaje: `El estatus de la orden ha sido actualizada ${orderNames.nombre}`,
        //         });
        //        });

        //      //}

        //   }).catch((err)=>console.log("Error updating order status",err))

    } catch (error) {
        console.log(error)
        if (error instanceof ForeignKeyConstraintError) {
            return res.status(400).send({
                ok: false,
                message: `The order status ${state} is invalid.`,
                mensaje: `El estado de orden ${state} es invalido.`,
                error,
            });
        }
        res.sendStatus(500);
        //throw error;
    }
};
const getAllRentByPharmacy = async (req: Request, res: Response) => {
    try {
        const { pharmacy_id } = req.body;

        if (!pharmacy_id) {
            return res.status(204).json({
                mensaje: "Id invalido",
                message: "Id invalid",
            });
        }
        const rent = await Rent.findAll({
            where: {
                //pharmacy_id,
                rent_state_id: { [Op.not]: 8 }
            },
            order: [
                ['created_at', 'DESC'],
            ],
        });
        if (!rent.length) {
            return res.status(204).send({
                message: "Order not found",
            });
        }
        res.status(200).json({
            message: "Completado!",
            rent,
        });
    } catch (error) {
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error,
        });

        ////getOrdersDriverAdmin;
    }
};
const getAparmentRentedByUser = async (req: Request, res: Response) => {
    const { user_id } = req.body
    try {
        const rent = await Rent.findAll({ where: { user_id } })
        if (!rent) {
            return res.status(404).send({
                message: 'Requests not found',
                mensaje: 'Solicitudes no encontradas',
                ok: false
            });
        }
        return res.status(200).send({
            message: 'Requests found',
            mensaje: 'Solicitudes encontradas',
            ok: true,
            rent
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })
    }
}
export { createRent, getRentByUser, getAparmentRentedByUser, getAllRentByPharmacy, getRentById, updateRentState }



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
import { not, or } from 'sequelize/lib/operators';
import { Expo } from 'expo-server-sdk';
import { Rent } from '../models/Rent';
import { RentDetails } from '../models/RentDetails';
const getDefaultrequest = async (req: Request, res: Response) => {
    const { user_id } = req.body
    try {
        const OccupancyRequest = await OccupancyRequests.findOne({ where: { deletedAt: { [Op.not]: null }, user_id }, paranoid: false })
        console.log("default", OccupancyRequest)
        if (OccupancyRequest === undefined || OccupancyRequest === null) {
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
            OccupancyRequest
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })
    }
}
const createOccupancyRequest = async (req: Request, res: Response) => {
    const transaction = await seqDb.transaction({ autocommit: false });
    const code = new Date().getTime();
    try {
        const {
            FullName,
            DateOfBirth,
            SSN,
            Phone,
            Email,
            Address,
            City,
            State,
            Zipcode,

            CurrentLandlord,

            LandlordPhone,

            RentAmount,

            MoveInDate,

            Expiration,

            ReasonForMoving,

            AreYouBeingEvicted,

            WhoShouldWeContactInCaseEmergency,

            EmergencyPhone,

            EmergencyAddress,

            EmergencyCity,

            EmergencyState,

            EmergencyZipcode,

            EmergencyPersonRelationship,

            FutureTenant,

            FutureTenantBirthDay,
            pharmacy_id,
            requestId,
            TOKEN,
            user_id,
            product_pharmacy_id
        } = req.body
        const Product = await PharmacyProduct.findOne({ where: { id: product_pharmacy_id} })
        console.log(req.body, "body")
        const OccupancyRequest = {
            code,
            FullName,
            DateOfBirth,
            SSN,
            Phone,
            Email,
            Address,
            City,
            State,
            Zipcode,

            CurrentLandlord,

            LandlordPhone,

            RentAmount,

            MoveInDate,

            Expiration,

            ReasonForMoving,

            AreYouBeingEvicted,

            WhoShouldWeContactInCaseEmergency,

            EmergencyPhone,

            EmergencyAddress,

            EmergencyCity,

            EmergencyState,

            EmergencyZipcode,

            EmergencyPersonRelationship,

            FutureTenant,

            FutureTenantBirthDay,
            user_id,
            product_pharmacy_id,
            RequestFee:Product.request_fee
        }
        // console.log(OccupancyRequest,'OccupancyRequest created')
        const oc = await OccupancyRequests.findOne({ where: { deletedAt: { [Op.not]: null }, user_id }, paranoid: false })
        if (!oc) {
            const or = await OccupancyRequests.create(OccupancyRequest, { transaction, returning: true }).then(async (r) => {
                await OccupancyRequests.destroy({ where: { id: r.id }, transaction })
                await transaction.commit();
                res.status(200).send({
                    mensaje: "Solicitud creada",
                    message: "Request created",
                    ok: true,
                    or
                })
                // await firebase.firestore().collection('propertiesOrder').add({
                //     message: 'A new order #' + r.code + ' has been placed.',
                //     seen: false,
                //     user_id: pharmacy_id + '',
                //     order_id: r.id,
                //     order_status: 1
                //   });

                // //   await firebase.firestore().collection('orders').add({
                // //     order_id: r.id,
                // //     order_status: 1,
                // //     farmacy_id: pharmacy_id
                // //   });

                //   await firebase.firestore().collection('notificationsPush').add({
                //     message: 'A new order #' + OccupancyRequest.code + ' has been placed.',
                //     seen: false,
                //     pharmacy_id: pharmacy_id + '',
                //     order_id: r.id,
                //     order_status: 1,
                //     token: TOKEN
                // });
            })
        }
        else {
            // await transaction.commit();
            const updatedRow = await OccupancyRequests.update({ ...OccupancyRequest }, { where: { user_id, deletedAt: { [Op.not]: null } }, transaction, paranoid: false, returning: true })
            console.log(updatedRow)
            if (updatedRow) {
                await transaction.commit();
                return res.status(200).send({
                    mensaje: "Solicitud  actualizada",
                    message: "Request updated",
                    ok: false,
                    or: oc
                })
            }
            res.status(204).send({
                mensaje: "Solicitud  no creada",
                message: "Request can't be created",
                ok: false,
                or: oc
            })
        }

        // if (!or) {
        //     res.status(204).send({
        //         message: 'Billing not created',
        //         mensaje: 'Factura no creada',
        //         ok: false,
        //         or
        //     })

        // }
        // await transaction.commit();
        // res.status(200).send({
        //     mensaje: "Solicitud creada",
        //     message: "Request created",
        //     ok: true,
        //     or
        // })
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
const confirmCreation = async (req: Request, res: Response) => {
    try {
        const transaction = await seqDb.transaction({ autocommit: false });
        const {
            FullName,
            DateOfBirth,
            SSN,
            Phone,
            Email,
            Address,
            City,
            State,
            Zipcode,

            CurrentLandlord,

            LandlordPhone,

            RentAmount,

            MoveInDate,

            Expiration,

            ReasonForMoving,

            AreYouBeingEvicted,

            WhoShouldWeContactInCaseEmergency,

            EmergencyPhone,

            EmergencyAddress,

            EmergencyCity,

            EmergencyState,

            EmergencyZipcode,

            EmergencyPersonRelationship,

            FutureTenant,

            FutureTenantBirthDay,
            pharmacy_id,
            requestId,
            TOKEN,
            user_id,
            product_pharmacy_id
        } = req.body
        const Product = await PharmacyProduct.findOne({ where: { id: product_pharmacy_id} })
        const OccupancyRequest = {
            FullName,
            DateOfBirth,
            SSN,
            Phone,
            Email,
            Address,
            City,
            State,
            Zipcode,

            CurrentLandlord,

            LandlordPhone,

            RentAmount,

            MoveInDate,

            Expiration,

            ReasonForMoving,

            AreYouBeingEvicted,

            WhoShouldWeContactInCaseEmergency,

            EmergencyPhone,

            EmergencyAddress,

            EmergencyCity,

            EmergencyState,

            EmergencyZipcode,

            EmergencyPersonRelationship,

            FutureTenant,

            FutureTenantBirthDay,
            product_pharmacy_id,
            RequestFee:Product.request_fee
        }
       // console.log("update o r", TOKEN)
        const trueCreate = await OccupancyRequests.findOne({ where: { deletedAt: { [Op.not]: null }, user_id }, paranoid: false })
        console.log(trueCreate,user_id,"r e r")
        if (trueCreate !== undefined && trueCreate !== null) {
            console.log("test")
            const updatePlaceToPayRequestId = await placeToPayRequestId.update({ order_id: trueCreate.id, token_client: TOKEN }, { where: { requestId: requestId }, transaction, returning: true })
                .catch((r) => console.log("error", r)).then(async () => {
                    // await OccupancyRequests.update({ ...OccupancyRequest }, { where: { user_id, deletedAt: { [Op.not]: null } }, transaction, paranoid: false })
                    await OccupancyRequests.restore({ where: { deletedAt: { [Op.not]: null }, user_id }, transaction }).then(async () => {
                        await firebase.firestore().collection('propertiesOrder').add({
                            message: 'A new order #' + trueCreate.code + ' has been placed.',
                            seen: false,
                            user_id: 534 + '',
                            order_id: trueCreate.id,
                            order_status: 1
                        });

                        //   await firebase.firestore().collection('orders').add({
                        //     order_id: r.id,
                        //     order_status: 1,
                        //     farmacy_id: pharmacy_id
                        //   });

                        await firebase.firestore().collection('notificationsPush').add({
                            message: 'A new order #' + trueCreate.code + ' has been placed.',
                            seen: false,
                            pharmacy_id: 534 + '',
                            order_id: trueCreate.id,
                            order_status: 1,
                            token: TOKEN
                        });
                    })
                    await transaction.commit();
                })
            return res.status(200).send({
                mensaje: "Solicitud creada",
                message: "Request created",
                ok: true,
            })
        } else {
            return res.status(204).send({
                mensaje: "Solicitud creada",
                message: "Request created",
                ok: true,
            })
        }

    } catch (error) {
        console.log(error)
        res.status(400).send({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an errores",
            error
        })
    }
}
const getOccupancyRequestsByUser = async (req: Request, res: Response) => {
    const { user_id } = req.body
    try {
        const OccupancyRequest = await OccupancyRequests.findAll({
            include: [{
                model: PharmacyProduct,
                as: 'PharmacyProduct',
                include: [{
                    model: Products,
                    as: 'Products'
                }]
            },
            {
                model: Rent,
                as: 'Rent',
                include: [{
                    model: RentDetails,
                    as: 'RentDetail'
                }]
            }
            ],
            where: { user_id },
            attributes: [
                'code', 'created_at', 'order_state_id', "id",
                [col('PharmacyProduct.id'), 'product_pharmacy_id'],
                [col('OccupancyRequests.id'), "occupancy_request_id"], [col('PharmacyProduct.pharmacy_id'), 'pharmacy_id'],
                [col('PharmacyProduct.gift_price'), 'security_deposit'], [col('PharmacyProduct.prorateo'), 'prorateo'],
                [col('PharmacyProduct.ivu_municipal'), 'ivu_municipal'], [col('PharmacyProduct.ivu_statal'), 'ivu_statal'],
                [col('PharmacyProduct.Products.Name'), 'product_name'],
                [col('PharmacyProduct.product_id'), 'product_id'], [col('PharmacyProduct.active'), 'status'],
                [col('PharmacyProduct.Products.Description'), 'product_description'],
                [col('PharmacyProduct.Products.img'), 'product_img'],
                [col('PharmacyProduct.stock'), 'stock'], [col('PharmacyProduct.price'), 'price'],
                [col('PharmacyProduct.gift_status'), 'gift_status'],
                [col('PharmacyProduct.Products.category_id'), 'category']]
        })
        console.log(OccupancyRequest)
        if (!OccupancyRequest) {
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
            OccupancyRequest
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })
    }
}

const getOccupancyRequestsById = async (req: Request, res: Response) => {
    const { id } = req.body
    try {
        const OccupancyRequest = await OccupancyRequests.findOne({
            where: { id },
            include: [{
                model: PharmacyProduct,
                as: 'PharmacyProduct',
                include: [{
                    model: Products,
                    as: 'Products'
                }]
            },
            {
                model: placeToPayRequestId,
                as: 'placeToPayRequestId'
            }
            ],
            attributes: [
                "id",
                "product_pharmacy_id",
                "RequestFee",
                'code',
                'FullName',
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
                [col("PharmacyProduct.Products.img"), "imageUrl"],
                [col("placeToPayRequestId.token_client"), "token_client"],
                [col("placeToPayRequestId.id"), "placeToPay_id"]
            ]
        });
        //console.log(OccupancyRequest)
        if (!OccupancyRequest) {
            return res.status(404).send({
                message: 'Request not found',
                mensaje: 'Solicitud no encontrada',
                ok: false
            });
        }
        return res.status(200).send({
            message: 'Request found',
            mensaje: 'Solicitud encontrada',
            ok: true,
            OccupancyRequest
        })
    } catch (error) {
        console.log("catch error", error)
        res.status(400).send({
            ok: false
        })
    }
}

const updateOccupancyState = async (req: Request, res: Response) => {
    let { occupancy_id, state, user_id } = req.body;

    try {
        const order = await OccupancyRequests.findOne({
            where: { id: occupancy_id },
        });

        // console.log(order)
        const orderNames = await OrderState.findOne({
            where: { id: state },
        });
        //   const orderStates = await OrderStateHistory.findAll({
        //     where: { occupancy_id },
        //   });
        console.log(order, orderNames, "order")
        if (!(order /*&& orderStates*/ && orderNames)) {
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

        const updateOccupancyState = await OccupancyRequests.update(
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
            { where: { id: occupancy_id } }
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
const getAllOccupancyByPharmacy = async (req: Request, res: Response) => {
    try {
        const { pharmacy_id } = req.body;

        if (!pharmacy_id) {
            return res.status(204).json({
                mensaje: "Id invalido",
                message: "Id invalid",
            });
        }
        const order = await OccupancyRequests.findAll({
            include: [{
                model: PharmacyProduct,
                as: 'PharmacyProduct',
                include: [{
                    model: Products,
                    as: 'Products'
                }]
            },
            {
                model: Rent,
                as: 'Rent'
            }],
            attributes: [
                'code', 'created_at', 'order_state_id', "id", 'RequestFee', 'isRented', 'isDocumentSigned',
                [col('PharmacyProduct.id'), 'product_pharmacy_id'],
                [col('OccupancyRequests.id'), "occupancy_request_id"], [col('PharmacyProduct.pharmacy_id'), 'pharmacy_id'],
                [col('PharmacyProduct.gift_price'), 'security_deposit'], [col('PharmacyProduct.prorateo'), 'prorateo'],
                [col('PharmacyProduct.ivu_municipal'), 'ivu_municipal'], [col('PharmacyProduct.ivu_statal'), 'ivu_statal'],
                [col('PharmacyProduct.Products.Name'), 'product_name'],
                [col('PharmacyProduct.product_id'), 'product_id'], [col('PharmacyProduct.active'), 'status'],
                [col('PharmacyProduct.Products.Description'), 'product_description'],
                [col('PharmacyProduct.Products.img'), 'product_img'],
                [col('PharmacyProduct.stock'), 'stock'], [col('PharmacyProduct.price'), 'price'],
                [col('PharmacyProduct.gift_status'), 'gift_status'],
                [col('PharmacyProduct.Products.category_id'), 'category']],
            where: {
                //pharmacy_id,
                order_state_id: { [Op.not]: 8 }
            },
            order: [
                ['created_at', 'DESC'],
            ],
        });
        if (!order.length) {
            return res.status(204).send({
                message: "Order not found",
            });
        }
        res.status(200).json({
            message: "Completado!",
            order,
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
const signDocuments = async (req: Request, res: Response) => {
    const { ocId } = req.body
    try {
        const { isDocumentSigned } = await OccupancyRequests.findOne({ where: { id: ocId } })
        const ocUpdated = await OccupancyRequests.update({ isDocumentSigned: !isDocumentSigned }, { where: { id: ocId } })
        if (ocUpdated[0] === 1) {
            res.status(200).json({
                message: "Completado!",
                ocUpdated,
            });
        } else {
            res.status(400).json({
                message: "El id indicado no existe!",
                ocUpdated,
            });
        }

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false,
            error
        })
    }
}

const sendTokenOccupancy = async (req: Request, res: Response) => {
    const { ...data } = req.body

    try {
        let expo = new Expo({ accessToken: 'fsBgekH5wRpMOVN3h_ZDIy6bqMygQn3oAaJHAQje' });
        let messages = [];
        const pushToken = data.token

        if (!data.token) {
            return res.status(200).send({
                ok: false,
                messages: "Token not available"
            })
        }

        if (!Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
        }
        if (data.state == 2) {
            messages.push(
                {
                    to: pushToken,
                    title: "Del properties kc 📬",
                    subtitle: 'Requested service in process',
                    sound: 'default',
                    body: 'Your service is in the process of review and assignment.',
                    badge: 0,
                    data: { data: 'goes here' },
                }
            )
        }
        // if (data.state == 3) {
        //     messages.push(
        //         {
        //             to: pushToken,
        //             title: "Coopharma my shop! 📬",
        //             subtitle: 'purchase order process',
        //             sound: 'default',
        //             body: 'Order is ready to be picked up, notification to carriers has been sent',
        //             badge: 0,
        //             data: { data: 'goes here' },
        //         }
        //     )
        // }
        // if (data.state == 4) {
        //     messages.push(
        //         {
        //             to: pushToken,
        //             title: "Coopharma my shop! 📬",
        //             sound: 'default',
        //             body: 'Added a new order',
        //             badge: 0,
        //             data: { data: 'goes here' },
        //         }
        //     )
        // }

        let chunks = expo.chunkPushNotifications(messages);
        let tickets = [];

        for (let chunk of chunks) {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);

            tickets.push(...ticketChunk);
        }

        res.status(200).send({
            ok: true,
            pushToken,
            data
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false,
            error
        })
    }
}

export {
    createOccupancyRequest,
    confirmCreation,
    getDefaultrequest,
    getOccupancyRequestsByUser,
    getAllOccupancyByPharmacy,
    getOccupancyRequestsById,
    updateOccupancyState,
    sendTokenOccupancy,
    signDocuments
}

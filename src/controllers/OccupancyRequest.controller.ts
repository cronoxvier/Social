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

const createOccupancyRequest = async (req: Request, res: Response) => {
    const transaction = await seqDb.transaction({ autocommit: false });
    const code = new Date().getTime();
    try {
        const {
            Full,
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
        console.log(req.body, "body")
        const OccupancyRequest = {
            code,
            Full,
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
            product_pharmacy_id
        }
        console.log(OccupancyRequest)
        const or = await OccupancyRequests.create(OccupancyRequest, { transaction, returning: true }).then(async (r) => {
            const updatePlaceToPayRequestId = await placeToPayRequestId.update({ order_id: r.id }, { where: { requestId: requestId }, transaction, returning: true })
            .catch((r)=>console.log("error",r))
            console.log(r,requestId,'test')
            await firebase.firestore().collection('propertiesOrder').add({
                message: 'A new order #' + r.code + ' has been placed.',
                seen: false,
                user_id: pharmacy_id + '',
                order_id: r.id,
                order_status: 1
              });
      
            //   await firebase.firestore().collection('orders').add({
            //     order_id: r.id,
            //     order_status: 1,
            //     farmacy_id: pharmacy_id
            //   });
      
              await firebase.firestore().collection('notificationsPush').add({
                message: 'A new order #' + OccupancyRequest.code + ' has been placed.',
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
            mensaje: "Solicitud creada",
            message: "Request created",
            ok: true,
            or
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

const getOccupancyRequestsByUser = async (req: Request, res: Response) => {
    const { user_id } = req.body
    try {
        const OccupancyRequest = await OccupancyRequests.findAll({ where: { user_id } })
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
        const OccupancyRequest = await OccupancyRequests.findOne({ where: { id },
            include:[{
                model:PharmacyProduct,
                as:'PharmacyProduct',
                include:[{
                    model:Products,
                    as:'Products'
                }]
            }],
            attributes: [
                "product_pharmacy_id", 
                "RequestFee",
                'code',
                [col ('Full'),'FullName'],
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
        console.log("catch error",error)
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
        console.log(order,orderNames,"order")
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
        where: {
          //pharmacy_id,
           order_state_id:{[Op.not]:8}
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
export { createOccupancyRequest, getOccupancyRequestsByUser,getAllOccupancyByPharmacy, getOccupancyRequestsById,updateOccupancyState }
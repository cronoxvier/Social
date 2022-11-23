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
import { col } from 'sequelize';
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
        console.log(req.body,"body")
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
        const or = await OccupancyRequests.create(OccupancyRequest,{transaction,returning:true}).then(async(r)=>{
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

const getOccupancyRequestsByUser=async(req: Request, res: Response)=>{
    const {user_id}= req.body
try {
    const OccupancyRequest= await OccupancyRequests.findAll({where:{user_id}})
    if (!OccupancyRequest) {
        return res.status(404).send({
            message: 'Requests not found',
            mensaje: 'Solicitudes no encontrada',
            ok: false
        });
    }
    return res.status(200).send({
        message: 'Requests found',
        mensaje: 'Solicitudes encontradas',
        ok:true,
        OccupancyRequest
    })
} catch (error) {
       console.log(error)
        res.status(500).send({
            ok: false
        })
}
}
export {createOccupancyRequest,getOccupancyRequestsByUser }
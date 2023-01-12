import { Request, Response } from "express";
import { Facilito_PlaceToPay } from "../../models/Facilito/facilitoPlaceToPay";
import { Imagen } from "../../models/imagen";
import { typesServicesFacilito } from "../../models/Facilito/types-services-facilito";
import { ServicesStatus } from "../../models/services-status";
import { col } from "sequelize";
import { firebase } from "../../config/firebase";
import moment from "moment";
import CryptoJS from "crypto-js";
import axios from "axios";
import { Client_Service } from "../../models/Facilito/ClientServices";
import { Pre_Services } from "../../models/Facilito/pre-services";

const createFacilitoPlaceToPay = async (req: Request, res: Response) => {
  try {
    const { ...data } = req.body;
    const params = { ...data };

    let respon = "";
    let error = "";
    let result;

    const url = `${process.env.URL}/api/session`;
    const nonce = Math.random().toString(36).substring(2);
    const seed = moment().format();
    const expiration = moment().add(32, "minutes").format();
    const hash = CryptoJS.SHA256(nonce + seed + process.env.SECRETKEY);
    const tranKey = hash.toString(CryptoJS.enc.Base64);

    const { ...paramsClient } = req.body;
   
    const ClientService = await Client_Service.create(paramsClient);

    const info = {
      locale: "es_PR",
      auth: {
        login: process.env.LOGIN,
        tranKey: tranKey,
        nonce: btoa(nonce),
        seed: seed,
      },
      payment: {
        reference: data.reference,
        description: data.description,
        amount: {
          currency: "USD",
          total: data.amount,
        },
        allowPartial: false,
      },
      expiration: expiration,
      returnUrl: data.returnUrl,
      ipAddress: data.ipAdress,
      userAgent: "PlacetoPay Sandbox",
    };

    await axios
      .post(url, { ...info })
      .then(async (e) => {
        respon = e.data;
        const newData = {
          requestId: e.data.requestId,
          ...params,
          clientServices_id: ClientService.id


        }
         const FacilitoPlaceToPay = await Facilito_PlaceToPay.create(newData) ;

       

         const createFireBase = await firebase.firestore().collection("facilitoPlaceToPay");
         createFireBase.add({
           ...newData,
           see: false,
           user_id: ClientService.user_id
         });


      })
      .catch((err) => {
        respon = err.response.data;
        error = err.response.data.status.status;
      });

    if (error == "FAILED") {
      return res.status(400).send({
        ok: false,
        respon,
      });
    }

   

    res.status(200).send({
      ok: true,
      result,
      data: respon,
            
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
      error,
    });
  }
};


const consult = async (req: Request, res: Response) => {
  try {

    const { requestId } = req.body;
    const { id } = req.body;
    let result;
    let respon;

    const url = `${process.env.URL}/api/session/${requestId} `;
    const nonce = Math.random().toString(36).substring(2);
    const seed = moment().format();
    const hash = CryptoJS.SHA256(nonce + seed + process.env.SECRETKEY);
    const tranKey = hash.toString(CryptoJS.enc.Base64);

    const datas = {
      auth: {
        login: process.env.LOGIN,
        tranKey: tranKey,
        nonce: btoa(nonce),
        seed: seed,
      },
    };

    await axios
      .post(url, { ...datas })
      .then(async (e) => {
        respon = e.data;
        const datos = {
          paymentStatus: e.data.status.status,
        };

        const payment = {
          payment: e.data.status.status
        }

        console.log(payment, id, "lk")

        const updateStatusPayment = await Pre_Services.update({ ...payment },{ where: { id: id }})

        const placeUpdate = await Facilito_PlaceToPay.update({ ...datos },{ where: { requestId: requestId }, returning: true })
.then((res) => {});
})
      .catch((err) => {
        console.log(err);
        respon = err.response.data;
      });

    res.status(200).send({
      ok: true,
      // url,
      respon,
      
      
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
    });
  }
}

export { createFacilitoPlaceToPay, consult };

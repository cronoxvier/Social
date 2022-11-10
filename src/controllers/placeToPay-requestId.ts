
import { Request, Response } from 'express';

import { placeToPayRequestId } from '../models/PlaceToPay-requesId';
import moment from 'moment';
import CryptoJS from 'crypto-js'
import axios from 'axios';
import { PlaceToPayRequestId } from '../interfaces/PlaceToPay-requesId';
import sha1 from 'js-sha1'
import { dbf, firebase } from '../config/firebase';
import { Expo } from 'expo-server-sdk';
import { Ads } from '../models/ads';
import { checkServerIdentity } from 'tls';
import { Order } from '../models/orders';

// const importDynamic = new Function('modulePath', 'return import(modulePath)');


// const fetch = async (...args: any[]) => {
//     const module = await importDynamic('node-fetch');
//     return module.default(...args);
// };

const reversePayment = async (req: Request, res: Response) => {
    try {
        const { ...data } = req.body
        console.log(data, "data enviada")
        const url = `${process.env.URL}/api/session`;
        const nonce = Math.random().toString(36).substring(2);
        const seed = moment().format();
        const expiration = moment().add(32, 'minutes').format();
        const hash = CryptoJS.SHA256(nonce + seed + process.env.SECRETKEY);
        const tranKey = hash.toString(CryptoJS.enc.Base64);
        const dataValues = {
            auth: {
                login: process.env.LOGIN,
                tranKey: tranKey,
                nonce: btoa(nonce),
                seed: seed
            },
            internalReference: data.internalReference
        }
        await axios.post(url,
            dataValues
        ).catch((e) => console.log(e))
    } catch (error) {
        //console.log(error)
        res.status(500).send({
            error,
            ok: false
        })
    }
}
const saveRequesId = async (req: Request, res: Response) => {
    try {
        let respon = ''
        let error = ''
        let result
        const { ...data } = req.body
        console.log(data, "data enviada")


        const url = `${process.env.URL}/api/session`;
        const nonce = Math.random().toString(36).substring(2);
        const seed = moment().format();
        const expiration = moment().add(32, 'minutes').format();
        const hash = CryptoJS.SHA256(nonce + seed + process.env.SECRETKEY);
        const tranKey = hash.toString(CryptoJS.enc.Base64);

        console.log(url, 'url')

        const datas = {
            locale: "es_PR",
            auth: {
                login: process.env.LOGIN,
                tranKey: tranKey,
                nonce: btoa(nonce),
                seed: seed
            },
            //type:'checkin',
            payment: {
                reference: data.reference,
                description: data.description,
                amount: {
                    currency: "USD",
                    total: data.amount
                },
                allowPartial: false
            },
            expiration: expiration,
            returnUrl: data.returnUrl,
            ipAddress: data.ipAdress,
            userAgent: "PlacetoPay Sandbox"
        }
        console.log(data)
        await axios.post(url,
            { ...datas }
        )
            .then(async (e) => {
                console.log(e, 'e')
                respon = e.data
                result = await placeToPayRequestId.create({ ...data, requestId: e.data.requestId })
                console.log("result", e)
            })
            .catch(err => {
                console.log(err, 'aqui')
                error = err.response.data.status.status
                respon = err.response.data
            })


        if (error == 'FAILED') {
            return res.status(400).send({
                ok: false,
                respon
            })
        } else {

        }

        res.status(200).send({
            ok: true,
            data: respon,
            result

        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            error,
            ok: false
        })
    }

}

const checkIn = async (req: Request, res: Response) => {
    try {
        let respon = ''
        let error = ''
        let result
        const { ...data } = req.body
        console.log(data, "data enviada")


        const url = `${process.env.URL}/api/session`;
        const nonce = Math.random().toString(36).substring(2);
        const seed = moment().format();
        const expiration = moment().add(32, 'minutes').format();
        const hash = CryptoJS.SHA256(nonce + seed + process.env.SECRETKEY);
        const tranKey = hash.toString(CryptoJS.enc.Base64);

        console.log(url, 'url')

        const datas = {
            locale: "es_PR",
            auth: {
                login: process.env.LOGIN,
                tranKey: tranKey,
                nonce: btoa(nonce),
                seed: seed
            },
            //type: 'checkin',
            payment: {
                reference: data.reference,
                description: data.description,
                amount: {
                    currency: "USD",
                    total: data.amount
                },
                allowPartial: false
            },
            expiration: expiration,
            returnUrl: data.returnUrl,
            ipAddress: data.ipAdress,
            userAgent: "PlacetoPay Sandbox"
        }
        console.log(data)
        await axios.post(url,
            { ...datas }
        )
            .then(async (e) => {
                console.log(e, 'e')
                respon = e.data
                result = await placeToPayRequestId.create({ ...data, requestId: e.data.requestId })
                console.log("result", e)
            })
            .catch(err => {
                console.log(err, 'aqui')
                error = err.response.data.status.status
                respon = err.response.data
            })


        if (error == 'FAILED') {
            return res.status(400).send({
                ok: false,
                respon
            })
        } else {

        }

        res.status(200).send({
            ok: true,
            data: respon,
            result

        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            error,
            ok: false
        })
    }

}

const checkOut = async (req: Request, res: Response) => {

    try {
        //const { requestId } = req.params
        const { order_id, type } = req.body
        const { internalReference, id } = await placeToPayRequestId.findOne({ where: { order_id } })
        //console.log( "find request",await placeToPayRequestId.findOne({where:{order_id}}))
        let result
        let respon
        let error = ''

        const url = `${process.env.URL}/api/transaction `;
        const nonce = Math.random().toString(36).substring(2);
        const seed = moment().format();
        const hash = CryptoJS.SHA256(nonce + seed + process.env.SECRETKEY);
        const tranKey = hash.toString(CryptoJS.enc.Base64);

        const { total_order } = await Order.findOne({ where: { id: order_id } })

        const datas = {
            auth: {
                login: process.env.LOGIN,
                tranKey: tranKey,
                nonce: btoa(nonce),
                seed: seed
            },
            internalReference, //código de referencia interna
            amount: {
                currency: "USD",
                total: type === "reverse" ? 0 : total_order
            },
            action: "checkout"
        }

        await axios.post(url,
            { ...datas }
        )
            .then(async (e) => {
                respon = e.data
                console.log(respon, 'by osiris')
                const datos = {
                    paymentStatus: "checked out",//e.data.status.status,
                    date: e.data.status.date,
                }
                console.log("update checkout", datos, id)

                const placeUpdate = await placeToPayRequestId.update({ ...datos }, { where: { id }, returning: true })
                console.log("updated request", placeUpdate)

            })
            .catch(err => {
                // error = err.response.data.status.status
                respon = err.response.data
                return res.status(400).send({
                    ok: false,
                    respon
                })
            })

        res.status(200).send({
            ok: true,
            //url,
            respon
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })
    }
}


const consultSession = async (req: Request, res: Response) => {

    try {
        const { requestId } = req.params
        let result
        let respon

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
                seed: seed
            },
        }

        await axios.post(url,
            { ...datas }
        )
            .then(async (e) => {
                respon = e.data
                console.log("consult",respon)
                const datos = {
                    paymentStatus: e.data.status.status,
                    date: e.data.status.date,
                    internalReference: e.data.payment[0].internalReference
                }
                //console.log("datos consult",datos)

                const placeUpdate = await placeToPayRequestId.update({ ...datos }, { where: { requestId: requestId }, returning: true }).then((res) => {

                })

            })
            .catch(err => {
                console.log(err)
                respon = err.response.data
            })

        res.status(200).send({
            ok: true,
            url,
            respon

        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })
    }
}

const notify = async (req: Request, res: Response) => {
    try {
        const { ...data } = req.body
        const place = await placeToPayRequestId.findOne({ where: { requestId: data.requestId } })
        //console.log("resquest",place)
        //console.log("request data",data)
        const { id, pharmacy_id, ads_id, order_id, advertisements, shopping, user_id, requestId, reference, description, amount, paymentStatus } = place
        // const dataPlace = {
        //     pharmacy_id:place
        // }

        // const seed = moment().format();
        const hash = sha1(data.requestId + data.status.status + data.status.date + process.env.SECRETKEY);
        //console.log("signature",hash)
        // + data.status.status + data.status.date + process.env.SECRETKEY
        // console.log(data.requestId+data.status.status+data.status.date+process.env.SECRETKEY)

        if (hash != data.signature) {
            return res.status(400).send({
                ok: false,
                msg: "signature no valid",
                hash

            })
        }
        else {

            if (place.pharmacy_id != null && place.user_id != null) {
                console.log('push notification mas email')

                let expo = new Expo({ accessToken: 'DTkss6v_Z9qdGvEZLwI2D0_eTs5h-M4XF6Wx5leW' });
                const pushToken = place.token_client
                let messages = [];
                const PlaceToPayRequest = await placeToPayRequestId.findOne({ where: { requestId: data.requestId } })
                let state;
                if (data.status.status === 'APPROVED') {
                    state = 1
                    if (!Expo.isExpoPushToken(pushToken)) {
                        console.error(`Push token ${pushToken} is not a valid Expo push token`);
                    }
                    else {
                        messages.push(
                            {
                                to: pushToken,
                                title: "Payment! 💵",
                                subtitle: 'The payment has been made successfully',
                                sound: 'default',
                                body: 'payment aproved',
                                badge: 0,
                                data: { data: '' },
                            }
                        )
                        if (messages.length > 0) {
                            console.log("if")
                            let chunks = expo.chunkPushNotifications(messages);
                            let tickets = [];

                            for (let chunk of chunks) {
                                let ticketChunk = await expo.sendPushNotificationsAsync(chunk);

                                tickets.push(...ticketChunk);
                            }
                        }
                    }
                }
                else if (data.status.status === 'PENDING') {
                    state = 1
                    if (!Expo.isExpoPushToken(pushToken)) {
                        console.error(`Push token ${pushToken} is not a valid Expo push token`);
                    }
                    else {
                        messages.push(
                            {
                                to: pushToken,
                                title: "Payment! 💵",
                                subtitle: 'The payment has been made successfully',
                                sound: 'default',
                                body: 'payment is pending',
                                badge: 0,
                                data: { data: '' },
                            }
                        )
                        if (messages.length > 0) {
                            console.log("if")
                            let chunks = expo.chunkPushNotifications(messages);
                            let tickets = [];

                            for (let chunk of chunks) {
                                let ticketChunk = await expo.sendPushNotificationsAsync(chunk);

                                tickets.push(...ticketChunk);
                            }
                        }
                    }
                }
                else {
                    state = 8
                    if (!Expo.isExpoPushToken(pushToken)) {
                        console.error(`Push token ${pushToken} is not a valid Expo push token`);
                    }
                    else {
                        messages.push(
                            {
                                to: pushToken,
                                title: "Payment! 💵",
                                subtitle: "The payment couldn't be charged",
                                sound: 'default',
                                body: 'payment rejected',
                                badge: 0,
                                data: { data: 'goes here' },
                            }
                        )
                        if (messages.length > 0) {
                            console.log("if")
                            let chunks = expo.chunkPushNotifications(messages);
                            let tickets = [];

                            for (let chunk of chunks) {
                                let ticketChunk = await expo.sendPushNotificationsAsync(chunk);

                                tickets.push(...ticketChunk);
                            }
                        }
                    }
                }
                await Order.update({ order_state_id: state }, { where: { id: PlaceToPayRequest.order_id } })

            }
            if (place.pharmacy_id != null && place.user_id == null) {
                // console.log('panel mas email')
                const ads = await Ads.update({ paymentStatus: 'APPROVED' }, { where: { id: ads_id } })

                const dbRef = await firebase.firestore().collection('notificationPlaceToPay');
                dbRef.add({ id, pharmacy_id, ads_id, order_id, advertisements, shopping, user_id, requestId, reference, description, amount, paymentStatus: data.status.status, see: false, date: data.status.date, });


            }
        }

        res.status(200).send({
            status: "OK",
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false,

        })
    }

}

const updateRequestIdStatus = async (req: Request, res: Response) => {
    try {

        const { requestId } = req.params
        const { ...data } = req.body

        const place = await placeToPayRequestId.update({ ...data }, { where: { requestId: requestId }, returning: true })
        console.log("requestId update", data, requestId, place)
        res.status(200).send({
            ok: true,
            msg: "Ads updated successfully",
            data: place
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })
    }

}

const updateStatusAds = async (req: Request, res: Response) => {
    try {

        const { requestId } = req.params
        const { ...data } = req.body
        console.log(data)
        const place = await placeToPayRequestId.findOne({ where: { requestId: requestId } })
        console.log(place.ads_id)

        const ads = await Ads.update({ ...data }, { where: { id: place.ads_id } })

        res.status(200).send({
            ok: true,

            place,
            data
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })

    }
}

const saveRequesIdEditAds = async (req: Request, res: Response) => {
    try {
        const { AdsId } = req.params
        console.log(AdsId)
        const { ...data } = req.body
        let respon = ''
        let error = ''
        let result

        const url = `${process.env.URL}/api/session`;
        const nonce = Math.random().toString(36).substring(2);
        const seed = moment().format();
        const expiration = moment().add(32, 'minutes').format();
        const hash = CryptoJS.SHA256(nonce + seed + process.env.SECRETKEY);
        const tranKey = hash.toString(CryptoJS.enc.Base64);

        const searchPlacerequesId = await placeToPayRequestId.findOne({
            where: {
                ads_id: AdsId
            }
        })
        console.log(searchPlacerequesId.id)

        const datas = {
            locale: "es_PR",
            auth: {
                login: process.env.LOGIN,
                tranKey: tranKey,
                nonce: btoa(nonce),
                seed: seed
            },
            payment: {
                reference: searchPlacerequesId.reference,
                description: searchPlacerequesId.description,
                amount: {
                    currency: "USD",
                    total: searchPlacerequesId.amount
                },
                allowPartial: false
            },
            expiration: expiration,
            returnUrl: data.returnUrl,
            ipAddress: data.ipAdress,
            userAgent: "PlacetoPay Sandbox"
        }

        await axios.post(url,
            { ...datas }
        ).then(async (e) => {
            respon = e.data

            const newData = {
                requestId: e.data.requestId,
            }
            console.log(newData)

            await placeToPayRequestId.update({ ...newData }, {
                where: {
                    ads_id: AdsId
                }
            })
            result = await placeToPayRequestId.findOne({
                where: {
                    ads_id: AdsId
                }
            })

        }).catch(err => {
            error = err.response.data.status.status
            respon = err.response.data
        })

        if (error == 'FAILED') {
            return res.status(400).send({
                ok: false,
                respon
            })
        }

        res.status(200).send({
            ok: true,
            data: respon,
            result
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })
    }
}


export { saveRequesId, consultSession, notify, updateRequestIdStatus, updateStatusAds, checkIn, checkOut, saveRequesIdEditAds, reversePayment }
import { Request, Response } from 'express';
import { placeToPayRequestId } from '../models/PlaceToPay-requesId';
import moment from 'moment';
import CryptoJS from 'crypto-js'
import axios from 'axios';
import { Ads } from '../models/ads';

export const verifyStatus = async () => {
    let respon = ''
    let error = ''
    let result

    const verificate = await placeToPayRequestId.findAll({
        where: { paymentStatus: 'PENDING' }
    })
    console.log(verificate.length)


    verificate.forEach(async (element) => {
        const url = `${process.env.URL}/api/session/${element.requestId} `;
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

                const datos = {
                    paymentStatus: e.data.status.status,
                    date: e.data.status.date
                }

                const placeUpdate = await placeToPayRequestId.update({ ...datos }, { where: { requestId: element.requestId }, returning: true })
               
                if(element.ads_id != null){
                    const ads = await Ads.update({...datos},{
                        where: { id: element.ads_id}
                    })
                    // const ads = await Ads.findAll({where:{id:element.ads_id}})
                    
                }
                
            })
            .catch(err => {
                console.log(err)
                respon = err.response.data
                // error = err.response.data.status.status
                // respon = err.response.data
            })
        
    });

    
}





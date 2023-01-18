import moment from 'moment';
import CryptoJS from 'crypto-js';


const playTopayCredential = async (text) => {

    const url = `${process.env.URL}/api/${text}`;
    const nonce = Math.random().toString(36).substring(2);
    const seed = moment().format();
    const expiration = moment().add(32, 'minutes').format();
    const hash = CryptoJS.SHA256(nonce + seed + process.env.SECRETKEY);
    const tranKey = hash.toString(CryptoJS.enc.Base64);

    const credential = {
        url,
        nonce,
        seed,
        expiration,
        hash,
        tranKey,
    }

    return credential

}

export { playTopayCredential }
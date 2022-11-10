import * as jwt from 'jsonwebtoken'

const generarJWT = (id) => {
    return new Promise((resolve, reject) => {
        const payload = { id };
        jwt.sign(payload, process.env.SECRET, {
            expiresIn: '10000h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el token')

            } else {
                resolve(token);
            }
        })
    })
}

export  {
    generarJWT
}

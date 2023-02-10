import { MailBox } from "../models/MailsBox"


const createMailbox = async(req, res)=>{
    try {
        const {...data} = req.body
        const date = new Date()

        await  MailBox.create({...data, date })

        res.status(200).send({
            ok:true
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false,
            error
        }) 
    }
}
export { createMailbox }
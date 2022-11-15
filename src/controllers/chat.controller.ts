import { Chat } from "../models/Chat"
import { dbf, firebase } from '../config/firebase';
import { User } from "../models/user";
import { Pharmacy } from "../models/Pharmacy";
import { PharmacyUser } from "../models/PharmacyUser";
import { col } from 'sequelize';


const creatMessage = async (req, res) => {
    try {
        const { ...data } = req.body
        const message = await Chat.create(data)

        const addMessage = await firebase.firestore().collection('chat')
        addMessage.add({
            ...data, see: false
        })
        console.log('aqui')
        res.status(200).send({
            ok: true,
            message
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })
    }
}
const getMessage = async (req, res) => {
    try {
        const { pharmacy_id, user_id } = req.params


        // const { ...data } = req.body
        const message = await Chat.findAll({
            include: [
                {
                    model: Pharmacy,
                    as: "Pharmacy",
                    attributes: [],
                },
                {
                    model: User,
                    as: "User",
                    attributes: [],
                },
            ],
            attributes: [
                "id", "pharmacy_id", "user_id", "message", "sendByUser",
                [col("Pharmacy.name"), "Pharmacy_name"],
                [col("Pharmacy.img"), "pharmacy_img"],
                [col("User.first_name"), "user_name"],
                [col("User.img"), "user_img"],
                //     [col("Pharmacy.address"), "pharmacy_address"], "phone", "client_state", "alias", "address_1", "address_2",
                //     "city", "zip_Code", "notes", "stripe_charged_id", "user_id", "order_state_id", "last_card_digit", "stripe_card_id",
                //     "driver_id", "pick_up_status", 'hasBilling', 'deposit_amount', 'totalDeliveryFee', 'totalTransactioFee',
                //     [col("Users.first_name"), "first_name"],
                //     [col("Users.last_name"), "last_name"],
                //     [col("Users.img"), "user_img"],
            ],

            where: { pharmacy_id, user_id }
        })
        res.status(200).send({
            ok: true,
            message
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })
    }
}

const pharmacyUser = async (req, res) => {

    try {
        const { ...data } = req.body

        const veriifyUser = await PharmacyUser.findOne({ where: { user_id: data.user_id, pharmacy_id: data.pharmacy_id } })
        console.log(veriifyUser, 'existe')
        if (veriifyUser) {
            return res.status(200).send({
                ok: true,
                msg: "existe"
            })

        }

        const phrmacyUser = await PharmacyUser.create(data)

        res.status(200).send({
            ok: true,
            phrmacyUser
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })
    }

}

const getPharmacyUser = async (req, res) => {
    const { pharmacy_id } = req.params

    try {
        const user = await PharmacyUser.findAll({
            include: [
                {
                    model: Pharmacy,
                    as: "Pharmacy",
                    attributes: [],
                },
                {
                    model: User,
                    as: "User",
                    attributes: [],
                },
            ],
            attributes: [
                "id", "pharmacy_id", "user_id",
                [col("Pharmacy.name"), "Pharmacy_name"],
                [col("Pharmacy.img"), "pharmacy_img"],
                [col("User.first_name"), "user_name"],
                [col("User.img"), "user_img"],
                //     [col("Pharmacy.address"), "pharmacy_address"], "phone", "client_state", "alias", "address_1", "address_2",
                //     "city", "zip_Code", "notes", "stripe_charged_id", "user_id", "order_state_id", "last_card_digit", "stripe_card_id",
                //     "driver_id", "pick_up_status", 'hasBilling', 'deposit_amount', 'totalDeliveryFee', 'totalTransactioFee',
                //     [col("Users.first_name"), "first_name"],
                //     [col("Users.last_name"), "last_name"],
                //     [col("Users.img"), "user_img"],
            ],
            where: { pharmacy_id }
        })
        res.status(200).send({
            ok: true,
            user
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })

    }
}


export { creatMessage, getMessage, pharmacyUser, getPharmacyUser }
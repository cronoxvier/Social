import { col, Model, Op } from 'sequelize'
import { AdminPharmaciesDriver } from '../models/AdminPharmaciesDriver';
import { Driver } from '../models/driver';
import { Order } from '../models/orders';
import { Pharmacy } from '../models/Pharmacy';

const AsignarPharmacyDriver = async (req, res) => {
    try {
        //commit
        const { ...data } = req.body

        console.log(data)
        const pharmacy_id = data.pharmacy_id
        const driver_id = data.driver_id
        const search = await AdminPharmaciesDriver.findAll({ where: { pharmacy_id, driver_id } })

        if (search.length > 0) {
            return res.status(200).send({
                ok: false,
                msg: "This pharmacy has been assigned to this drive"
            })
        }

        const driver = await AdminPharmaciesDriver.create(data)
        res.status(200).send({
            ok: true,
            driver,
            msg: "Pharmacy assigned correctly"

        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false,
            error
        })
    }
}

const getAsignarPharmacyDriver = async (req, res) => {
    try {
        const driver = await AdminPharmaciesDriver.findAll({
            include: [
                {
                    model: Pharmacy,
                    as: 'Pharmacy',
                    attributes: [],
                },
                {
                    model: Driver,
                    as: 'Driver',
                    attributes: [],
                }
            ],
            attributes: [
                'id', 'pharmacy_id', 'driver_id',
                [col('Pharmacy.name'), 'pharmacy_name'],
                [col('Pharmacy.id'), 'id_pharmacy'],
                [col('Driver.first_name'), 'driver_name'],
                [col('Driver.img'), 'driver_img'],
                [col('Pharmacy.img'), 'Pharmacy_img'],
                [col('Driver.email'), 'driver_email'],
            ]

        })
        res.status(200).send({
            ok: true,
            driver

        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false,
        })
    }
}

const getOrderToAsing = async (req, res) => {
    const { id } = req.params;
    let filterIdPharmacies = [];
    try {

        const driverIds = await AdminPharmaciesDriver.findAll({ where: { driver_id: id } })
        driverIds.forEach(e => {
            filterIdPharmacies.push(e.pharmacy_id)
        })

        const order = await Order.findAll({
            include: [
                {
                    model: Pharmacy,
                    as: "Pharmacy",
                    attributes: [],
                },
            ],
            attributes: [
                "id", "code", "total_order", "description_order", "pharmacy_id", "created_at", "updated_at",
                [col("Pharmacy.name"), "name"], "phone", "client_state", "alias", "address_1", "address_2",
                "city", "zip_Code", "notes", "stripe_charged_id", "user_id", "order_state_id", "last_card_digit", "stripe_card_id",
                "driver_id", "pick_up_status", 'hasBilling', 'deposit_amount', 'totalDeliveryFee', 'totalTransactioFee',//'clientBankFee'

            ],
            where: { pharmacy_id: filterIdPharmacies, order_state_id: [3], driver_id: null, pick_up_status: 0 }
        })

        res.status(200).send({
            ok: true,
            // driverIds,
            order,
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false,
        })

    }

}

const getOrders = async (req, res) => {
    const { id } = req.params;
    let filterIdPharmacies = [];
    try {

        const driverIds = await AdminPharmaciesDriver.findAll({ where: { driver_id: id } })
        driverIds.forEach(e => {
            filterIdPharmacies.push(e.pharmacy_id)
        })

        const order = await Order.findAll({
            include: [
                {
                    model: Pharmacy,
                    as: "Pharmacy",
                    attributes: [],
                },
            ],
            attributes: [
                "id", "code", "total_order", "description_order", "pharmacy_id", "created_at", "updated_at",
                [col("Pharmacy.name"), "name"], "phone", "client_state", "alias", "address_1", "address_2",
                "city", "zip_Code", "notes", "stripe_charged_id", "user_id", "order_state_id", "last_card_digit", "stripe_card_id",
                "driver_id", "pick_up_status", 'hasBilling', 'deposit_amount', 'totalDeliveryFee', 'totalTransactioFee',//'clientBankFee'

            ],
            where: { pharmacy_id: filterIdPharmacies, order_state_id: 1, driver_id: null, pick_up_status: 0 }
        })

        res.status(200).send({
            ok: true,
            // driverIds,
            order,
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false,
        })

    }

}

const updateOrderToAsing = async (req, res) => {
    try {

        const { ordersId } = req.body
        const { id } = req.params
        console.log(ordersId)


        const order = await Order.update({ driver_id: id, order_state_id: 3 }, { where: { id: ordersId } })
        console.log(order)


        res.status(200).send({
            ok: true,
            ordersId,
            id


        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false,
        })

    }
}


const getPharmaciesDriver = async (req, res) => {
    
    const { id } = req.params
    console.log(id, "aqio")
    try {
        const pharmacies = await AdminPharmaciesDriver.findAll({
            include: [
                {
                    model: Pharmacy,
                    as: 'Pharmacy',
                    attributes: [],
                },
                {
                    model: Driver,
                    as: 'Driver',
                    attributes: [],
                }
            ],
            attributes: [
                'id', 'pharmacy_id', 'driver_id',
                [col('Pharmacy.name'), 'label'],
                [col('Pharmacy.id'), 'value'],
                // [col('Driver.first_name'), 'driver_name'],
                // [col('Driver.img'), 'driver_img'],
                [col('Pharmacy.img'), 'Pharmacy_img'],
                // [col('Driver.email'), 'driver_email'],
            ],
            where:{driver_id:id}

        })
        res.status(200).send({
            ok: true,
            pharmacies

        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false,
        })
    }
}




export { AsignarPharmacyDriver, getAsignarPharmacyDriver, getOrderToAsing, updateOrderToAsing, getPharmaciesDriver }
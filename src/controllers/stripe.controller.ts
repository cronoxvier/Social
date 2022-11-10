import { Request, Response } from 'express';
import Stripe from 'stripe';
import { config } from '../config/config';
import db from '../config/connectionMySql2'
import { Driver } from '../models/driver';
import { OrderStateHistory } from '../models/order-state-history';
import { Order } from '../models/orders';
import { Pharmacy } from '../models/Pharmacy';
import { User } from '../models/user';

const stripe = new Stripe(config.stripeKey, {
    apiVersion: '2020-08-27',
});

const firstCard = (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
        return res.status(204).json({
            mensaje: "Id invalido",
            message: "Id invalid"
        })
    }
    User.findOne({
        where: {
            email: email
        }
    })
        .then((result) => {
            if (!result) {
                return res.status(200).json({
                    message: "User not Found"
                })
            }

            if (result.stripe_customer_id) {
                return res.status(200).json({
                    firstCard: false
                })
            }

            res.status(200).json({
                firstCard: true
            })
        }).catch(error => {
            res.status(400).json({
                mensaje: "Ha ocurrido un error",
                messaje: "It has ocurred an error",
                status: 400
            })

            //throw error
            
        })
}
const createCustomer = async (req: Request, res: Response) => {
    try {
        const { id, card_number, exp_month, exp_year, cvc, email, fullName } = req.body;

        const token = await stripe.tokens.create({
            card: {
                number: card_number,
                exp_month: exp_month,
                exp_year: exp_year,
                cvc: cvc,
            },
        });

        const params: Stripe.CustomerCreateParams = {
            email: email,
            source: token.id,
            name: fullName

        }

        const customer = await stripe.customers.create(params);

        User.update(
            {
                stripe_customer_id: customer.id
            },
            {
                where: {
                    id
                }
            }
        )
        res.status(200).json({
            message: "Customer creado con exito!",
            customer
        });
    } catch (error) {
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            status: 400
        })

        //throw error
        
    }
}
const addCard = async (req: Request, res: Response) => {

    try {
        const { id, card_number, exp_month, exp_year, cvc } = req.body;
        const token = await stripe.tokens.create({
            card: {
                number: card_number,
                exp_month: exp_month,
                exp_year: exp_year,
                cvc: cvc,
            },
        });

        const results = await User.findOne({
            where: {
                id: id
            }
        })

        let params: Stripe.CustomerSourceCreateParams = {
            source: token.id
        }

        let source = await stripe.customers.createSource(results.stripe_customer_id, params)

        res.status(200).json({
            message: "Tarjeta agregada con exito",
            source
        })
    } catch (err) {
        res.status(200).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error: err.raw.code,
            err
        })

       // throw err
    }
}
const getCards = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(204).json({
                mensaje: "Id invalido",
                message: "Id invalid"
            })
        }
        const user = await User.findOne({
            where: { id }
        })

        if (!user) {
            return res.status(400).json({
                message: 'User not found'
            })
        }

        let stripeCustomerId = user.stripe_customer_id
        let params: Stripe.CustomerSourceListParams = {
            limit: 10,
            object: "card"
        }

        if (!stripeCustomerId) {
            return res.status(200).json({
                cards: []
            })
        }
        let cards = await stripe.customers.listSources(stripeCustomerId, params)
        res.status(200).json({
            cards: cards.data
        });
    } catch (error) {
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            error
        })

        //throw error
        
    }
}
const pay = async (req: Request, res: Response) => {

    try {
        const { code } = req.body;
        if (!code) {
            return res.status(204).json({
                mensaje: "Id invalido",
                message: "Id invalid"
            })
        }
        const order = await Order.findOne(
            {
                attributes: ['id',
                    'total_order', 'pharmacy_id', 'stripe_card_id', 'user_id'
                ],

                where: {
                    code
                }
            }
        )
        if (!order) {
            return res.status(200).send({
                message: "Order Not Found"
            })
        }
        const resultUser = await User.findOne({
            attributes: [
                'stripe_customer_id'
            ],
            where: {
                id: order.user_id
            }
        })

        if (!resultUser) {
            return res.status(200).json({
                message: "The user asociate to this order was no found"
            })
        }

        let amount = order.total_order;

        let customerStripeId = resultUser.stripe_customer_id;
        let source = order.stripe_card_id;

        let params: Stripe.ChargeCreateParams = {
            amount: Math.round(amount * 100),
            currency: 'usd',
            source: source,
            customer: customerStripeId
        }
        const createCharges = await stripe.charges.create(params)
        Order.update({
            last_card_digit: createCharges.payment_method_details.card.last4
        }, {
            where: { code }
        })
        const pharmacy = await Pharmacy.findOne({
            where: {
                id: order.pharmacy_id
            },
            attributes: [
                'stripe_id'
            ]
        })
        let paramsTransfer: Stripe.TransferCreateParams = {
            amount: Math.round(amount * 100),
            currency: "usd",
            destination: pharmacy.stripe_id,
            source_transaction: createCharges.id
        }
        const createTransfer = await stripe.transfers.create(paramsTransfer)
        const paramsOrderUpdate = {
            stripe_charged_id: createCharges.id,
            stripe_transfer_id: createTransfer.id
        }
        Order.update(paramsOrderUpdate, {
            where: {
                code
            }
        })

        res.status(200).send({
            mensaje: 'Pago realizado con exito',
            message: 'successful payment'
        })
    } catch (error) {
        const { code } = req.body;
        const order = await Order.findOne(
            {
                attributes: ['id',
                    'total_order', 'pharmacy_id', 'stripe_card_id', 'user_id'
                ],

                where: {
                    code
                }
            }
        )
        if (!order) {
            return res.status(200).send({
                message: "Order Not Found"
            })
        }
        res.status(200).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            err: error.raw.code,
            error
        });

        
    }

}
const createAccount = async (req: Request, res: Response) => {
    try {
        const { pharmacy_id } = req.body
        if (!pharmacy_id) {
            return res.status(204).json({
                mensaje: "Id invalido",
                message: "Id invalid"
            })
        }
        const account = await stripe.accounts.create({ type: 'standard' });
        const accountLink = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: 'https://stripe.com',
            return_url: 'https://stripe.com',
            type: 'account_onboarding',
        });
        const result = await Pharmacy.update(
            {
                stripe_id: account.id
            },
            {
                where: {
                    id: pharmacy_id
                }
            })

        if (!result) {
          return res.status(204).send({
                message: 'Account not created'
            })
        }
        res.status(200).send({
            message: 'Account created',
            result: accountLink.url
        })
    } catch (error) {
        res.status(400).send({
            message: 'Error',
            error
        })
    }
}
const createAccountDriver = async (req: Request, res: Response) => {
    try {
        const { id } = req.body
        if (!id) {
            return res.status(204).json({
                mensaje: "Id invalido",
                message: "Id invalid"
            })
        }
        const account = await stripe.accounts.create({ type: 'standard' });
        const accountLink = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: 'https://stripe.com',
            return_url: 'https://stripe.com',
            type: 'account_onboarding',
        });
        const driver = await Driver.update(
            {
                stripe_account_id: account.id
            },
            {
                where: {
                    id
                }
            })

        if (!driver) {
           return res.status(204).send()
        }
        res.status(200).send({
            message: 'Account created',
            result: accountLink.url
        })
    } catch (error) {
        res.status(400).send({
            message: 'Error',
            error
        })
    }
}
const deleteCard = async (req: Request, res: Response) => {
    const { id, card_id } = req.body;

    await User.findOne({ where: { id: id } })
        .then(async (result) => {
            const stripe_customer_id = result.stripe_customer_id;
            let resultado = await stripe.customers.deleteSource(stripe_customer_id, card_id);
            await User.update({ card_id: null }, { where: { id, card_id } })
            res.status(200).json({ resultado })
        }).catch(error => {
            res.status(400).json({
                mensaje: "Ha ocurrido un error",
                messaje: "It has ocurred an error",
                error
            })

            
        })
}


//Sin modificar



export const oAuth = async (req: Request, res: Response) => {
    const { code, pharmacyID } = req.body;

    let params: Stripe.OAuthTokenParams = {
        grant_type: 'authorization_code',
        code: code
    }
    const response = await stripe.oauth.token(params);

    const query = 'Call UpdatePharmacyStripeAcc(?, ?)';
    db.query(query, [pharmacyID, response.stripe_user_id])
        .then(([result]) => {
            res.status(200).json({ response: result })
        }).catch(error => {
            res.status(400).json({
                mensaje: "Ha ocurrido un error",
                messaje: "It has ocurred an error",
                status: 400
            })

            
        })
}

export {
    firstCard, createCustomer,
    addCard, getCards, pay,
    createAccount, deleteCard,createAccountDriver
}
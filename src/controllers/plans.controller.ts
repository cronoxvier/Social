import { Request, Response } from 'express';
import { col, Model, Op } from 'sequelize';
import { Plans } from '../models/plans';

const createPlans = async (req, res) => {
    try {
        const {
            name,
            price,
            description,
            days
        } = req.body
        const params = {
            name,
            price,
            description,
            days
        }
        const plan = await Plans.create(params)
        res.status(200).send({
            ok: true,
            msg: 'plan created successfully',
            plan
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false,
            msg:error
        })
    }
}

const getPlans = async (req, res) => {
    try {
        const plans = await Plans.findAll()
        if (!plans) {
            return res.status(200).json({
                ok: false,
                msg: "no hay planes"
            })
        }
        res.status(200).json({
            ok: true,
            plans
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })

    }
}

const putPlans = async (req, res) => {
    try {
        const { id } = req.params
        const {...data} =req.body
        const plans = await Plans.findByPk(id)
        if (!plans) {
            return res.status(200).json({
                ok: false,
                msg: "this plan does not exist"
            })
        }
        const putPlan = await Plans.update({
           ...data
        },{
            where:{
                id
            }
        })
        res.status(200).json({
            ok: true,
            putPlan,
            msg:"plan updated successfully"
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })

    }

}

export { createPlans, getPlans, putPlans }
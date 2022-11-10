
import { Ads } from "../models/ads"
import { PlanAds } from "../models/planAds"
import { col, Model, Op } from 'sequelize'
import { Plans } from "../models/plans"
import { Category } from "../models/category"
import moment from 'moment';
import { Pharmacy } from "../models/Pharmacy"
import { AdminAdsToPharmacy } from "../models/AdminAdsTopharmacy"

const createPlanAds = async (req, res) => {
    try {
        let getPlan;
        let planAds
        let ads

        const {
            pharmacy_id,
            category_id,
            website,
            name,
            plan_id,
            publicationDate
        } = req.body

        const params = {
            pharmacy_id,
            website,
            name,
            category_id,
            status: true
        }
        ads = await Ads.create(params)

        if (plan_id != null) {
            getPlan = await Plans.findByPk(plan_id)

            const params2 = {
                ads_id: ads.id,
                plan_id: plan_id,
                publicationDate,
                lastPublicationDate: moment(publicationDate).add(getPlan.days, "days").format('YYYY-MM-DD'),
                status: true
            }
            planAds = await PlanAds.create(params2)
        } else {
            const params2 = {
                ads_id: ads.id,
                plan_id: null,
                publicationDate: null,
                lastPublicationDate: null,
                status: false
            }

            planAds = await PlanAds.create(params2)
        }

        res.status(200).send({
            ok: true,
            ads,
            planAds

        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false,
        })

    }
}

const updatePlanAds = async (req, res) => {
    try {
        const { id } = req.params
        let getPlan;
        let updatePlan

        const {
            pharmacy_id,
            category_id,
            website,
            name,
            plan_id,
            publicationDate,
            idAds
        } = req.body

        const params = {
            website,
            name,
            category_id,
            status: true
        }

        const ads = await Ads.findByPk(idAds)
        if (!ads) {
            return res.status(400).send({
                ok: false,
                msg: 'An error has occurred contact an administrator'
            })
        }

        const updateAds = await Ads.update(params, { where: { id: idAds } })
        //console.log(plan_id)

        //    const updateAds = await Ads.update(params, {where:{id:getPlanAds.ads_id}})
        // actualizar ads aqui
        if (plan_id != null) {
            getPlan = await Plans.findByPk(plan_id)
            const params2 = {
                plan_id: plan_id,
                publicationDate,
                lastPublicationDate: moment(publicationDate).add(getPlan.days, "days").format('YYYY-MM-DD'),
                status: true
            }
            // actualizar aqui
            updatePlan = await PlanAds.update(params2, { where: { id: id } })
        }

        res.status(200).send({
            ok: true,
            msg: "Successful update",
            ads,
            updatePlan
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false,
        })

    }
}

const getPlanAds = async (req, res) => {
    try {
        const { id } = req.params
        console.log(id)
        const planAds = await PlanAds.findAll({
            include: [
                {
                    model: Ads,
                    as: 'Ads',
                    attributes: [],
                    include: [{
                        model: Category,
                        as: 'Category',
                        attributes: [],
                    }],
                    where: {
                        pharmacy_id: id
                    },

                },
                {
                    model: Plans,
                    as: 'Plans',
                    attributes: [],
                }
            ],
            attributes: [
                'id', 'publicationDate', 'lastPublicationDate', 'status',
                [col('Ads.id'), 'ads_id'],
                [col('Ads.img'), 'img'],
                [col('Ads.website'), 'website'],
                [col('Ads.status'), 'status_ads'],
                [col('Ads.name'), 'name_ads'],
                [col('Plans.name'), 'plans_name'],
                [col('Ads.category_id'), 'category_id'],
                [col('Ads.Category.name'), 'name_category'],
                [col('Ads.paymentStatus'), 'paymentStatus'],
                [col('Ads.reference'), 'reference'],
            ]

        })
        res.status(200).send({
            ok: true,
            planAds
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false,
        })

    }
}

const getPlanAdsAdmin = async (req, res) => {
    try {
        const planAds = await PlanAds.findAll({
            include: [
                {
                    model: Ads,
                    as: 'Ads',
                    attributes: [],
                    include: [{
                        model: Category,
                        as: 'Category',
                        attributes: [],
                    },
                    {
                        model: Pharmacy,
                        as: 'Pharmacy',
                        attributes: [],
                    }],
                },
                {
                    model: Plans,
                    as: 'Plans',
                    attributes: [],
                }

            ],
            attributes: [
                'id', 'publicationDate', 'status', 'lastPublicationDate',
                [col('Ads.id'), 'ads_id'],
                [col('Ads.img'), 'img'],
                [col('Ads.website'), 'website'],
                [col('Ads.status'), 'status_ads'],
                [col('Ads.name'), 'name_ads'],
                [col('Plans.name'), 'plans_name'],
                [col('Ads.category_id'), 'category_id'],
                [col('Ads.Category.name'), 'name_category'],
                [col('Ads.Pharmacy.name'), 'name_pharmacy'],
                [col('Ads.Pharmacy.id'), 'id_pharmacy'],
                [col('Plans.id'), 'id_plans'],
            ]

        })

        res.status(200).send({
            ok: true,
            planAds
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false,
        })

    }
}

const getPlanAdsAdminByPharmcy = async (req, res) => {
    try {
        const planAds = await PlanAds.findAll({
            include: [
                {
                    model: Ads,
                    as: 'Ads',
                    attributes: [],
                    include: [{
                        model: Category,
                        as: 'Category',
                        attributes: [],
                    },
                    {
                        model: Pharmacy,
                        as: 'Pharmacy',
                        attributes: [],
                    }],
                },
                {
                    model: Plans,
                    as: 'Plans',
                    attributes: [],
                }

            ],
            attributes: [
                'id', 'publicationDate', 'status', 'lastPublicationDate',
                [col('Ads.id'), 'ads_id'],
                [col('Ads.img'), 'img'],
                [col('Ads.website'), 'website'],
                [col('Ads.status'), 'status_ads'],
                [col('Ads.name'), 'name_ads'],
                [col('Plans.name'), 'plans_name'],
                [col('Ads.category_id'), 'category_id'],
                [col('Ads.Category.name'), 'name_category'],
                [col('Ads.Pharmacy.name'), 'name_pharmacy'],
            ]

        })

    } catch (error) {
        console.log(error)
        res.status(200).send({
            ok: false,
        })
    }
}

const getPlanAdsActiveByPharmacy = async (req, res) => {

    try {
        const { id } = req.params
        const plan = await PlanAds.findAll({
            include: [
                {
                    model: Ads,
                    as: 'Ads',
                    attributes: [],
                    where: { pharmacy_id: id },
                }
            ],
            where: { status: true },
            attributes: [
                'id', 'status',
                [col('Ads.id'), 'ads_id'],
                [col('Ads.img'), 'img'],
                [col('Ads.website'), 'website'],
                [col('Ads.category_id'), 'category_id'],
            ]
        })

        const adsAdminToPharmacy: any = await AdminAdsToPharmacy.findAll({
            include: [
                {
                    model: Ads,
                    as: 'Ads',
                    attributes: [],
                },
            ],
            where: { pharmacy_id: id, status: true },
            attributes: [
                'id', 'status',
                [col('Ads.id'), 'ads_id'],
                [col('Ads.img'), 'img'],
                [col('Ads.website'), 'website'],
                [col('Ads.category_id'), 'category_id'],
            ]
        })

        const plans = plan.concat(adsAdminToPharmacy)

        res.status(200).send({
            ok: true,
            plans
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false,
        })
    }

}


const getPlanAdsActiveByPharmacyCategory = (req, res) => {
    try {

        res.status(200).send({
            ok: true,
            
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false,
        })
    }
}


// const deleteAds
export {
    createPlanAds,
    getPlanAds,
    getPlanAdsAdmin,
    updatePlanAds,
    getPlanAdsActiveByPharmacy,
    getPlanAdsActiveByPharmacyCategory
}
import { Request, Response } from 'express';
import { col, Model, Op } from 'sequelize'
import { AdminAdsToPharmacy } from '../models/AdminAdsTopharmacy';
import { Ads } from '../models/ads';
import { Category } from '../models/category';
import { Pharmacy } from '../models/Pharmacy';
import { PlanAds } from '../models/planAds';
import { deletFile, uploadImg } from './image.controller'
import { placeToPayRequestId } from '../models/PlaceToPay-requesId';


const createAds = async (req, res) => {
    try {
        const {
            pharmacy_id,
            category_id,
            website,
            name
        } = req.body
        const params = {
            pharmacy_id,
            website,
            name,
            category_id
        }

        const ads = await Ads.create(params)
        res.status(200).send({
            ok: true,
            ads
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })
    }
}

const getAds = async (req, res) => {
    try {
        const ads = await Ads.findAll({
            include: [
                {
                    model: Pharmacy,
                    as: 'Pharmacy',
                    attributes: [],
                },
                {
                    model: Category,
                    as: 'Category',
                    attributes: [],
                }

            ],
            attributes: [
                'id', 'img', 'website', 'name', 'status',
                [col('Pharmacy.name'), 'pharmacy_name'],
                [col('Category.name'), 'category_name'],
                [col('Pharmacy.id'), 'id_pharmacy'],
                [col('Category.id'), 'category_id'],
            ]
        })

        res.status(200).send({
            ok: true,
            ads

        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })
    }
}

const getAdsByFarmacies = async (req, res) => {
    try {
        const { id } = req.params;
        const ads = await Ads.findAll({
            include: [
                {
                    model: Category,
                    as: 'Category',
                    attributes: [],
                },
                {
                    model: Pharmacy,
                    as: 'Pharmacy',
                    attributes: [],
                }
            ],
            attributes: [
                'id', 'img', 'name', 'website', 'category_id', 'pharmacy_id',
                [col('Category.name'), 'category_name'],
                [col('Pharmacy.name'), 'pharmacy_name'],
                [col('Pharmacy.id'), 'id_pharmacy'],
            ],
            where: {
                pharmacy_id: id
            },
        })
        console.log(id)
        res.status(200).send({
            ok: true,
            ads

        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })
    }

}

const updatePhotoAds = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(204).json({
                mensaje: "Id invalido",
                message: "Id invalid"
            })
        }

        const ads = await Ads.findOne({ where: { id } })
        if (!ads) {
            return res.status(400).send({
                ok: false,
                mensaje: 'No existe este registro'
            })
        }


        const url = ads.img
        if (url) {
            deletFile(url);
        }

        uploadImg(req, res, (err) => {
            if (err) {
                console.log(err)
                return res.status(400).send({
                    err
                })
            } else {
                if (req.file === undefined) {
                    return res.status(400).send({
                        mensaje: 'Error: No image selected'
                    })
                }
            }
            const image = req.file as any;

            const ads = Ads.update({
                img: image.location
            }, {
                where: {
                    id
                }
            })
            if (!ads) {
                return res.status(204).send()
            }
            res.status(200).send({
                mensaje: 'Image actualizada'
            })
        })
    } catch (error) {
        res.status(400).send({
            mensaje: "Algo anda mal",
            message: "Something goes wrog!!",
            error
        })

       
    }
}
const updateAds = async (req, res) => {
    const { id } = req.params
    const { ...data } = req.body
    const ads = await Ads.update({ ...data, }, { where: { id: id } })
    try {
        console.log(id)
        res.status(200).send({
            ok: true,
            msg: "Ads updated successfully",
            ads
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })
    }
}

const activeDisable = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body
    const ads = await Ads.findOne({
        include: [
            {
                model: Pharmacy,
                as: 'Pharmacy',
                attributes: [],
            },
            {
                model: Category,
                as: 'Category',
                attributes: [],
            }

        ],
        attributes: [
            'id', 'img', 'website', 'name', 'status',
            [col('Pharmacy.name'), 'pharmacy_name'],
            [col('Category.name'), 'category_name'],
        ], where: { id }
    })
    if (!ads) {
        return res.status(400).send({
            ok: false,
            mensaje: 'No existe este registro'
        })
    }

    const updateStatus = await Ads.update({ status }, {
        where: { id }
    })

    if (!updateStatus) {
        res.status(400).send({
            ok: false,
        })
    }

    res.status(200).send({
        ok: true,
        ads
    })

}

const createAdminAdsToPharmacy = async (req: Request, res: Response) => {
    try {
        const { data } = req.body

        const createAdminAdsToPharmacy = await AdminAdsToPharmacy.bulkCreate(data)

        res.status(201).send({ ok: true, msg: " Ads add to pharmacy", ads: createAdminAdsToPharmacy })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })

    }
}

const getAdminAdsToPharmacyByPharmacy = async (req: Request, res: Response) => {

    try {
        const { id } = req.params

        const AdsToPharmacyByPharmacy = await AdminAdsToPharmacy.findAll({ where: { pharmacy_id: id } })

        res.status(200).send({ ok: true, ads: AdsToPharmacyByPharmacy })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })

    }

}

const getAdminAdsToPharmacy = async (req: Request, res: Response) => {
    try {
        const AdsToPharmacyByPharmacy = await AdminAdsToPharmacy.findAll({
            include: [
                {
                    model: Ads,
                    as: 'Ads',
                    attributes: [],
                    include: [
                        {
                            model: Category,
                            as: 'Category',
                            attributes: [],
                        }
                    ]
                },
                {
                    model: Pharmacy,
                    as: 'Pharmacy',
                    attributes: [],
                }
            ],
            attributes: [
                'id', 'status',
                [col('Ads.id'), 'ads_id'],
                [col('Ads.name'), 'name_ads'],
                [col('Ads.img'), 'img'],
                [col('Pharmacy.name'), 'name_pharmacy'],
                [col('Pharmacy.id'), 'Pharmacy_id'],
                [col('Ads.category_id'), 'category_id'],
                [col('Ads.Category.name'), 'name_category'],

            ]
        })

        res.status(200).send({ ok: true, ads: AdsToPharmacyByPharmacy })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })

    }
}

const deleteAds = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const placeToPay = await placeToPayRequestId.destroy({
            where: {
                ads_id: id
            }
        })

        const plan = await PlanAds.destroy({
            where: {
                ads_id: id
            }
        })

        const ads = await Ads.destroy({
            where: {
                id: id
            }
        })

        if (plan == null || ads == null || placeToPay == null) {
            return res.status(400).send({ ok: false })
        }

        res.status(200).send({ ok: true })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })
    }

}
export { createAds, getAds, updatePhotoAds, activeDisable, getAdsByFarmacies, createAdminAdsToPharmacy, getAdminAdsToPharmacyByPharmacy, getAdminAdsToPharmacy, updateAds, deleteAds }
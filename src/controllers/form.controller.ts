

import { Response, Request } from 'express';
import { Op, where } from "sequelize/dist";
import {
    ValidationError,
    col,
    fn,
    ForeignKeyConstraintError,
    Sequelize,
} from "sequelize";
import { fieldsType } from '../models/fieldsType'
import { fields } from '../models/fields';
import { stepFormc } from '../models/stepFormc';
import { TypeServices } from '../models/TypeServices';
import { fieldsValue } from '../models/fieldsValue';
import { services } from '../models/services';
import { dbf, firebase } from '../config/firebase';
var serviceController = require('../controllers/services.controller')
const createStepForm = async (req: Request, res: Response) => {
    try {
        const { nameStep,
            nombreStep,
            descriptionStep,
            orderStep,
            enabledStep, typeServiceId, pharmacy_id } = req.body

        const StepForm = await stepFormc.findOne({ where: { name: nameStep, pharmacy_id } })
        let newStepForm;
        if (!StepForm) {
            newStepForm = await stepFormc.create({ name: nameStep, nombre: nombreStep, description: descriptionStep, order: orderStep, typeServiceId, pharmacy_id })
        }
        res.status(200).json({
            mensaje: "Paso creado exitosamente",
            message: "Step created succefuly",
            newStepForm,
            ok: true
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            status: 400,
            ok: false
        })

    }
}
const getFieldType = async (req: Request, res: Response) => {
    try {
        const fieldType = await fieldsType.findAll({})
        res.status(200).json({
            mensaje: "Creado exitosamente",
            message: "Created succefuly",
            fieldType,
            ok: true
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            status: 400,
            ok: false
        })
    }
}
const createFieldType = async (req: Request, res: Response) => {
    try {
        const { name, code, description } = req.body
        console.log(name)
        const fieldType = await fieldsType.create({ name, description, code }).catch((e) => console.log(e))
        res.status(200).json({
            mensaje: "Creado exitosamente",
            message: "Created succefuly",
            fieldType,
            ok: true
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            ok: false
        })

    }
}

const createField = async (req: Request, res: Response) => {
    try {
        const { nameField, NombreField, code, descriptionField, stepFormId, fieldTypeId, orderField } = req.body

        const field = await fields.create({ name: nameField, Nombre: NombreField, description: descriptionField, stepFormId, fieldTypeId, order: orderField })
            .catch((e) => console.log(e))
        res.status(200).json({
            mensaje: "Creado exitosamente",
            message: "Created succefuly",
            field,
            ok: true
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            ok: false
        })

    }
}
const saveFieldAnswer = async (req: Request, res: Response) => {
    try {
        const{ fields, ...data } = req.body
        console.log(fields, "fieldsValue")
        const service = await services.create({
            typeServices_id: data.typeServices_id,
            servicesStatus_id: data.servicesStatus_id,
            description: "",
            pharmacy_id: data.pharmacy_id,
            user_id: data.user_id
        }).then(async (res) => {
            await firebase.firestore().collection('ServiceNotification').add({
                message: 'You have a new service request',
                seen: false,
                pharmacy_id: res.pharmacy_id,
                typeServices_id: res.typeServices_id
            })
            const f= fields.map(x=>{return{...x,serviceId:res.id}})
            console.log(res,"test",f,"fff")
            await fieldsValue.bulkCreate(f)
        })
        res.status(200).json({
            mensaje: "Creado exitosamente",
            message: "Created succefuly",
            ok: true
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            ok: false
        })
    }
}

const getFields = async (req: Request, res: Response) => {
    try {
        const { pharmacy_id, typeServiceId, typeServiceCode } = req.body

        const id = typeServiceCode !== undefined ? (await TypeServices.findOne({ where: { code: typeServiceCode } })).id : typeServiceId
        console.log(pharmacy_id, typeServiceId)
        //const field = await fields.create({ name, Nombre, code, description, stepFormId, fieldTypeId,  order }).catch((e)=>console.log(e))
        let count = await stepFormc.count({
            where: { pharmacy_id, typeServiceId: id, enabled: true }
        });
        const field = await stepFormc.findAll({

            include: [{
                model: fields,
                as: 'fields',
                required: false,
                order: [
                    ['order', 'name'],
                    ['name', 'DESC'],

                ],
                include: [{
                    model: fieldsType,
                    as: 'fieldsType'
                }],
                where: { enabled: true }
            }],

            //attributes: [['id', 'stepFormId'], ['name', 'formName'], ['nombre', 'formNombre'], 'code', 'order',
            //[fn('count', col('stepFormId')), 'stepAmount'],
            //[col('fields.id'), 'fieldId'], [col('fields.name'), 'fieldName'],[col('fields.nombre'), 'fieldNombre'],
            //[col('fields.code'), 'fieldCode'],[col('fields.order'), 'fieldOrder'],[col('fields.fieldsType.id'), 'fieldsTypeId'],
            //[col('fields.fieldsType.id'), 'fieldsTypeId'],[col('fields.fieldsType.name'), 'fieldsTypeName'],[col('fields.fieldsType.nombre'), 'fieldsTypeNombre'],
            //[col('fields.fieldsType.id'), 'fieldsTypeId'],[col('fields.fieldsType.id'), 'fieldsTypeId'],[col('fields.fieldsType.name'), 'fieldsTypeName'],
            //[col('fields.fieldsType.nombre'), 'fieldsTypeNombre'],[col('fields.fieldsType.code'), 'fieldsTypeCode'],
            // ],
            where: { pharmacy_id, typeServiceId: id, enabled: true },
            order: [
                ['order', 'ASC'],
                ['name', 'DESC'],
            ],
        })
        res.status(200).json({
            mensaje: "Creado exitosamente",
            message: "Created succefuly",
            count,
            field,
            ok: true
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            ok: false
        })

    }

}
const getFieldsPanel = async (req: Request, res: Response) => {
    try {
        const { pharmacy_id, typeServiceId, typeServiceCode } = req.body

        const id = typeServiceCode !== undefined ? (await TypeServices.findOne({ where: { code: typeServiceCode } })).id : typeServiceId
        console.log(pharmacy_id, typeServiceId)
        //const field = await fields.create({ name, Nombre, code, description, stepFormId, fieldTypeId,  order }).catch((e)=>console.log(e))
        let count = await stepFormc.count({
            where: { pharmacy_id, typeServiceId: id }
        });
        const field = await stepFormc.findAll({
            include: [{
                model: fields,
                as: 'fields',
                order: [
                    ['order', 'name'],
                    ['name', 'DESC'],

                ],
                include: [{
                    model: fieldsType,
                    as: 'fieldsType'
                }]
            }],
            //attributes: [['id', 'stepFormId'], ['name', 'formName'], ['nombre', 'formNombre'], 'code', 'order',
            //[fn('count', col('stepFormId')), 'stepAmount'],
            //[col('fields.id'), 'fieldId'], [col('fields.name'), 'fieldName'],[col('fields.nombre'), 'fieldNombre'],
            //[col('fields.code'), 'fieldCode'],[col('fields.order'), 'fieldOrder'],[col('fields.fieldsType.id'), 'fieldsTypeId'],
            //[col('fields.fieldsType.id'), 'fieldsTypeId'],[col('fields.fieldsType.name'), 'fieldsTypeName'],[col('fields.fieldsType.nombre'), 'fieldsTypeNombre'],
            //[col('fields.fieldsType.id'), 'fieldsTypeId'],[col('fields.fieldsType.id'), 'fieldsTypeId'],[col('fields.fieldsType.name'), 'fieldsTypeName'],
            //[col('fields.fieldsType.nombre'), 'fieldsTypeNombre'],[col('fields.fieldsType.code'), 'fieldsTypeCode'],
            // ],
            where: { pharmacy_id, typeServiceId: id },
            order: [
                ['order', 'ASC'],
                ['name', 'DESC'],
            ]
        })
        res.status(200).json({
            mensaje: "Creado exitosamente",
            message: "Created succefuly",
            count,
            field,
            ok: true
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            ok: false
        })

    }

}
const updateStep = async (req: Request, res: Response) => {
    try {
        const { stepId, nameStep, nombreStep, descriptionStep, orderStep, enabledStep } = req.body

        const field = await stepFormc.update(
            { name: nameStep, nombre: nombreStep, description: descriptionStep, order: orderStep, enabled: enabledStep },
            { where: { id: stepId } }
        )
        res.status(200).json({
            mensaje: "Actualizado exitosamente",
            message: "Updated succefuly",
            field,
            ok: true
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            ok: false
        })
    }
}
const updateField = async (req: Request, res: Response) => {
    try {
        const { fieldId, nameField, nombreField, descriptionField, orderField, enabledField } = req.body
        console.log(fieldId, nameField, nombreField, descriptionField, orderField, enabledField, "test")
        const field = await fields.update(
            { name: nameField, nombre: nombreField, description: descriptionField, order: orderField, enabled: enabledField },
            { where: { id: fieldId } }
        )
        res.status(200).json({
            mensaje: "Actualizado exitosamente",
            message: "Updated succefuly",
            field,
            ok: true
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            ok: false
        })
    }
}
const deleteStep = async (req: Request, res: Response) => {
    try {
        const { stepId } = req.body
        const field = await stepFormc.update({ enabled: false }, { where: { id: stepId } })
        res.status(200).json({
            mensaje: "Actualizado exitosamente",
            message: "Updated succefuly",
            field,
            ok: true
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            ok: false
        })
    }
}
const deleteField = async (req: Request, res: Response) => {
    try {
        const { fieldId } = req.body
        const field = await fields.update({ enabled: false }, { where: { id: fieldId } })
        res.status(200).json({
            mensaje: "Actualizado exitosamente",
            message: "Updated succefuly",
            field,
            ok: true
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            mensaje: "Ha ocurrido un error",
            messaje: "It has ocurred an error",
            ok: false
        })
    }
}
export { getFieldType, createStepForm, createFieldType, createField, getFields, getFieldsPanel, deleteStep, deleteField, updateStep, updateField, saveFieldAnswer }
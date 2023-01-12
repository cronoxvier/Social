import { Request, Response } from "express";
import { Pre_Services } from "../../models/Facilito/pre-services";
import { Imagen } from "../../models/imagen";
import { typesServicesFacilito } from "../../models/Facilito/types-services-facilito";

import { Client_Service } from "../../models/Facilito/ClientServices";
import { ServicesStatus } from "../../models/services-status";
import { col } from "sequelize";
import { firebase } from "../../config/firebase";
import { User } from "../../models/user";

const createPreServices = async (req: Request, res: Response) => {
  try {
    const { ...data } = req.body;

    const params = { ...data };

    const PreServices = await Pre_Services.create(params);

    const createFireBase = await firebase.firestore().collection("preServices");
    createFireBase.add({
      ...data,
      see: false,
    });

    res.status(200).send({
      ok: true,
      PreServices,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
      error,
    });
  }
};

const getPreServices = async (req: Request, res: Response) => {
  try {
    const preServices = await Pre_Services.findAll({
      include: [
        {
          model: Imagen,
          as: "Imagen",
          attributes: [],
        },
        {
          model: typesServicesFacilito,
          as: "TypesServicesFacilito",
          attributes: [],
        },
        {
          model: ServicesStatus,
          as: "servicesStatus",
          attributes: [],
        },
      ],

      attributes: [
        "id",
        "payment",
        "company_name",
        "full_name",
        "phone_number",
        "amount_client",
        "country",
        "email",
        "imagen_id",
        "condominium_name",
        "total_units",
        "service_need",
        "location",
        "medical_plan",
        "age",
        "medical_center",
        "consult_descri",
        "date_of_birth",
        "smoker",
        "amount_insurance",
        "type_car",
        "brand",
        "model",
        "year",
        "description",
        "created_at",
        "updated_at",
        [col("servicesStatus.name"), "Statusname"],
        [col("servicesStatus.nombre"), "Statusnombre"],
        [col("servicesStatus.code"), "code"],
        [col("Imagen.url"), "url"],
        [col("TypesServicesFacilito.nombre"), "Typenombre"],
        [col("TypesServicesFacilito.descripcion"), "descripcion"],
      ],
    });

    res.status(200).send({
      ok: true,
      preServices,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
    });
  }
};

const getPreServicesById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const preServices = await Pre_Services.findAll({
      include: [
        {
          model: Imagen,
          as: "Imagen",
          attributes: [],
        },
        {
          model: typesServicesFacilito,
          as: "TypesServicesFacilito",
          attributes: [],
        },
        {
          model: ServicesStatus,
          as: "servicesStatus",
          attributes: [],
        },
      ],

      attributes: [
        "id",
        "payment",
        "company_name",
        "full_name",
        "phone_number",
        "amount_client",
        "country",
        "email",
        "imagen_id",
        "condominium_name",
        "total_units",
        "service_need",
        "location",
        "medical_plan",
        "age",
        "medical_center",
        "consult_descri",
        "date_of_birth",
        "smoker",
        "amount_insurance",
        "type_car",
        "brand",
        "model",
        "year",
        "description",
        "created_at",
        "updated_at",
        [col("servicesStatus.name"), "statusname"],
        [col("servicesStatus.nombre"), "statusnombre"],
        [col("servicesStatus.code"), "code"],
        [col("Imagen.url"), "url"],
        [col("TypesServicesFacilito.nombre"), "typenombre"],
        [col("TypesServicesFacilito.descripcion"), "descripcion"],
      ],
      where: { id: id },
    });

    res.status(200).send({
      ok: true,
      preServices,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
    });
  }
};

const changeStatus = async (req: Request, res: Response) => {
  const { id, status } = req.body;

  console.log(id, status)

  try {
    const changeStatus = await Pre_Services.update(
      { status_id: status },
      { where: { id: id } }
    );

    res.status(200).send({
      ok: true,
      changeStatus,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
    });
  }
};


const getPreServicesByClient = async (req: Request, res: Response) => {
  const { userId } = req.body;
  try {

    const PreServices = await Pre_Services.findAll({

      include: [
  
        {
          model: typesServicesFacilito,
          as: "TypesServicesFacilito",
          attributes: [],
        },
      
      ],

      attributes: [
        "id",
        "payment",
        "company_name",
        "full_name",
        "phone_number",
        "amount_client",
        "country",
        "email",
        "imagen_id",
        "condominium_name",
        "total_units",
        "service_need",
        "location",
        "medical_plan",
        "age",
        "medical_center",
        "consult_descri",
        "date_of_birth",
        "smoker",
        "amount_insurance",
        "type_car",
        "brand",
        "model",
        "year",
        "description",
        "payment",
        "created_at",
        "updated_at",
        [col("TypesServicesFacilito.nombre"), "Typenombre"],
        [col("TypesServicesFacilito.descripcion"), "descripcion"],
      ],
      
      where: { user_id: userId },
    });

    // include:[{
    //   model:Client_Service,
    //   as:'Client_Service',
    //   include:[{model:User}]    }],

    // let f = clientServices.length

    // console.log(clientServices[], "g", clientServices.length, "hh", (clientServices.length - 0))


    // const typesServicesFacilitos = await typesServicesFacilito.findAll({
    //   where: { id: clientServices[1][1].services_id },
    // });


    res.status(200).send({
      ok: true,
      PreServices
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
    });
  }
};







export { createPreServices, getPreServices, getPreServicesById, changeStatus, getPreServicesByClient };

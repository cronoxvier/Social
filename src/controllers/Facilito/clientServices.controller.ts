import { Request, Response } from "express";
import { Client_Service } from "../../models/Facilito/ClientServices";
import { typesServicesFacilito } from "../../models/Facilito/types-services-facilito";
// import { user } from "../../models/user";
import { col } from "sequelize";
import { firebase } from "../../config/firebase";

const createClientService = async (req: Request, res: Response) => {
  try {
    const { ...data } = req.body;

    const params = { ...data };

    const ClientService = await Client_Service.create(params);  1 



    res.status(200).send({
      ok: true,
      ClientService,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
      error,
    });
  }
};



export {  createClientService };

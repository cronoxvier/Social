import { Request, Response } from "express";
import { AppRelatedFacilito } from '../models/AppRelatedFacilito';

const createAppRelatedFacilito = async (req: Request, res: Response) => {

  try {

    const { ...data } = req.body
    const params = { ...data};

    const resAppRelatedFacilito = await AppRelatedFacilito.create(params)

    res.status(200).send({
      ok: true,
      resAppRelatedFacilito
  })
    
  } catch (error) {
    console.log(error)
    res.status(500).send({
        ok: false
    })
    
  }


    
 
};



export {
    createAppRelatedFacilito
  
};

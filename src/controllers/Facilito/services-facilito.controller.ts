import { Request, Response } from "express";
import { typesServicesFacilito } from '../../models/Facilito/types-services-facilito';

const createTypeServicesFacilito = async (req: Request, res: Response) => {

  try {

    // name, description, img, nombre, descripcion, router, type, orden, price
    const { ...data } = req.body
    const params = { ...data}
    const typeServicesFacilito = await typesServicesFacilito.create(params)




    res.status(200).send({
      ok: true,
      typeServicesFacilito
  })
    
  } catch (error) {
    console.log(error)
    res.status(500).send({
        ok: false
    })
    
  }


    
 
};

const getTypeServicesFacilito = async (req: Request, res: Response) => {

  try {

    const typeServicesFacilito = await typesServicesFacilito.findAll()
    res.status(200).send({
      ok: true,
      typeServicesFacilito
  })
    
  } catch (error) {
    console.log(error)
    res.status(500).send({
        ok: false
    })
    
  }


    
 
};

export {
  createTypeServicesFacilito,
  getTypeServicesFacilito
  
};

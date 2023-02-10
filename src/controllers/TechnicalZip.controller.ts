import { Request, Response } from "express";
import { User } from "../models/user";
import { col} from 'sequelize';
import { AppRelatedFacilito } from "../models/AppRelatedFacilito";


import { TechnicalZip } from "../models/TechnicalZipCode";


const createTechnicalZip = async (req: Request, res: Response) => {
    try {

        const { ...data } = req.body;


        const technical = await TechnicalZip.findOne({
            where: { user_id: data.user_id, zip_code: data.zip_code }

        })

        if (technical) {

            return res.status(400).send({
                ok: false,
                message: 'That zip code is assigned to this user. Try another',
                mensaje: 'Ese código postal está asignado a este usuario. Pruebe otro',

            })
        }

        
        const technicalZipCode = await TechnicalZip.create(data)

        res.status(200).send({
            ok: true,
            technicalZipCode,
           
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })
    }

}

const getTechnicalZipCode = async (req: Request, res: Response) => {
    try {


        const { ...data } = req.body;
        
        // const getAppRelatedFacilito = await AppRelatedFacilito.findOne({
        //     where: {
        //       id: 2,
        //     },
        //   });

    const getTechnical = await User.findAll({
        include:[{
         model: TechnicalZip,
         as: "TechnicalZipCode",
         attributes: [],
  
        }],
            
        attributes: [
             'id', "first_name",
             "last_name",
             "email",
             "phone",
             "access_code",
             "ext",
             "status",
             [col('TechnicalZipCode.zip_code'), 'TechnicalZipCode_zip_code'],
            
         ],
   
       where: {
         pharmacy_id: data.pharmacy_id,
       },
     });

        res.status(200).send({
            ok: true,
            getTechnical,
           
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })
    }

}

const getTechnicalZipByUser = async (req: Request, res: Response) => {
    try {

        const { ...data } = req.body;

        

        const getTechnical = await TechnicalZip.findAll({
            where: { user_id: data.user_id}

        })

       

    

        res.status(200).send({
            ok: true,
            getTechnical,
           
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false
        })
    }

}

const deleteZipCode = async (req: Request, res: Response) => {
    try {
      const { ...data } = req.body;
  
      const resDeleteZipCode = await TechnicalZip.destroy({
        where: {
            id: data.id
        }
      });
  
  
  
      res.status(200).send({
        ok: true,
        resDeleteZipCode,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        ok: false,
      });
    }
  };
  




export {
    createTechnicalZip,
    deleteZipCode,
    getTechnicalZipByUser,
    getTechnicalZipCode

}
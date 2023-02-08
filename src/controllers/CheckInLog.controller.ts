import { Request, Response } from "express";
import { CheckInLog } from "../models/CheckInLog";
import { col} from 'sequelize'
import { User } from "../models/user";
import { AppRelatedFacilito } from "../models/AppRelatedFacilito";

import { TechnicalZip } from "../models/TechnicalZipCode";

const createCheckInLog = async (req: Request, res: Response) => {
  try {
    const { ...data } = req.body;
    const params = { ...data };

    const resCheckInLog = await CheckInLog.create(params);

    const users = await User.update(
      { status: data.status },
      { where: { id: data.user_id } }
    );

    res.status(200).send({
      ok: true,
      resCheckInLog,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
    });
  }
};

const getCheckInLog = async (req: Request, res: Response) => {
  try {
    const getAppRelatedFacilito = await AppRelatedFacilito.findOne({
      where: {
        code: "PLANET_COMMUNICATION",
      },
    });


    const getCheckInLog = await User.findAll({
       include:[{
        model: CheckInLog,
        as: "CheckInLog",
        attributes: [],
  
       },
       {
        model: TechnicalZip,
        as: "TechnicalZipCode",
        attributes: [],
  
       }
      
      ],
           
       attributes: [
            'id', "first_name",
            "last_name",
            "email",
            "phone",
            "access_code",
            "ext",
            "status",
            // "created_at",
            [col('CheckInLog.fecha'), 'checkInLog_fecha'],
            [col('CheckInLog.hora'), 'checkInLog_hora'],
            [col('CheckInLog.createdAt'), 'checkInLog_createdAt'],
            [col('TechnicalZipCode.zip_code'), 'technicalZipCode_zip_code'],
        ],
  
      where: {
        app_related_code: getAppRelatedFacilito.code,
        isDeleted: false
      },
    });



    

    res.status(200).send({
      ok: true,
      getCheckInLog,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
    });
  }
};


const getCheckInLogByUser = async (req: Request, res: Response) => {
  try {

    const { id } = req.body;

   
    
    const CheckInLogByUser = await CheckInLog.findOne({

      order: [
        // ['status', 'ASC'],
        ['createdAt', 'DESC'],
      
      ],

      where: {
        user_id: id,
      },
    });

    // const getCheckInLog = await User.findAll({
    //   where: {
    //     app_related_id: getAppRelatedFacilito.id,
    //   },
    // });

    res.status(200).send({
      ok: true,
      CheckInLogByUser
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
    });
  }
};

export { createCheckInLog, getCheckInLog, getCheckInLogByUser };

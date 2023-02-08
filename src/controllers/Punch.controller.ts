import { Request, Response } from "express";
import { col, Op, where} from 'sequelize'
import { CheckInLog } from "../models/CheckInLog";
// import { HistoryWorkOrder } from "../models/HistoryWorkOrder";
import moment from "moment";



const getPunchByUser = async (req: Request, res: Response) => {
  try {
    const { ...data } = req.body;
    // const params = { ...data };

    const dateToday = moment().format('l');


    const punch = await CheckInLog.findAll({
      where: { fecha: dateToday, user_id: 72 }})

      console.log(punch)



    res.status(200).send({
      ok: true,
      punch
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
    });
  }
};



export { getPunchByUser };
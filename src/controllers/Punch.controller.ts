import { Request, Response } from "express";
import { col, Op, where} from 'sequelize'
import { CheckInLog } from "../models/CheckInLog";
// import { HistoryWorkOrder } from "../models/HistoryWorkOrder";
import moment from "moment";



const getPunchByUser = async (req: Request, res: Response) => {
  try {
    const { ...data } = req.body;
    // const params = { ...data };


    // const dateToday = moment().format('l');

    const dateToday = '2/8/2023';


    // const punch = await CheckInLog.findAll({
    //   where: { fecha: dateToday, user_id: 104 }})

      // console.log(punch)


      let hora1 = ("17:29:01").split(":");
      let hora2 = ("01:28:56").split(":");
      let t1 = new Date();
      let t2 = new Date();
   
      t1.setHours(Number(hora1[0]), Number(hora1[1]), Number(hora1[2]));
      t2.setHours(Number(hora2[0]), Number(hora2[1]), Number(hora2[2]));
   
  //Aquí hago la resta
  t1.setHours(t1.getHours() - t2.getHours(), t1.getMinutes() - t2.getMinutes(), t1.getSeconds() - t2.getSeconds());
   
  //Imprimo el resultado
  let pp = "La diferencia es de: " + (t1.getHours() ? t1.getHours() + (t1.getHours() > 1 ? " horas" : " hora") : "") + (t1.getMinutes() ? ", " + t1.getMinutes() + (t1.getMinutes() > 1 ? " minutos" : " minuto") : "") + (t1.getSeconds() ? (t1.getHours() || t1.getMinutes() ? " y " : "") + t1.getSeconds() + (t1.getSeconds() > 1 ? " segundos" : " segundo") : "");





    res.status(200).send({
      ok: true,
      // punch
      pp
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
    });
  }
};



export { getPunchByUser };
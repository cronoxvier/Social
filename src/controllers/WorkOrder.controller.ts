import { Request, Response } from "express";
import { col, Op, where} from 'sequelize'
import { WorkOrder } from "../models/WorkOrder";
import { HistoryWorkOrder } from "../models/HistoryWorkOrder";
import moment from "moment";



const createWorkOrder = async (req: Request, res: Response) => {
  try {
    const { ...data } = req.body;
 

    const workOrder = await WorkOrder.findOne({
      where: { number_order: data.number_order }})


  if (workOrder) {
      return res.status(400).send({
          ok: false,
          message: 'That Work Order is taken. Try another',
          mensaje: 'Esta orden de trabajo está tomado. Prueba otro',

      })
  }

    const resWorkOrder = await WorkOrder.create(data);



    res.status(200).send({
      ok: true,
      resWorkOrder,
      workOrder
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
    });
  }
};

const getWorkOrder = async (req: Request, res: Response) => {
  try {
    
    const { ...data } = req.body;

    const resGetWorkOrder = await WorkOrder.findAll({
      where:{
        pharmacy_id: data.pharmacy_id
      },
        order: [
        ['created_at', 'DESC'],
    ]});

    res.status(200).send({
      ok: true,
      resGetWorkOrder,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
    });
  }
};

const updateWorkOrder = async (req: Request, res: Response) => {
  try {
    const { ...data } = req.body;

    const resUpdateWorkOrder = await WorkOrder.update({ ...data }, {
      where: {
          id: data.id
      }
    }
    
    )
  
      const Historydata = {
        id: '',
        full_name: data.full_name,
        date: data.date,
        phone: data.phone,
        request_details: data.request_details,
        location: data.location,
        zip_code: data.zip_code,
        category: data.category,
        priority: data.priority,
        status: data.status,
          user_id: data.user_id,
        number_order: data.number_order,
        hour: data.hour,
        message: data.message,
        type_client: data.type_client,
        type_business: data.type_business,
        pay: data.pay,
        finished_date: data.finished_date,
          workOrder_id: data.id
      }

    const resHistorialWorkOrder = await HistoryWorkOrder.create(Historydata)

    res.status(200).send({
      ok: true,
      resUpdateWorkOrder,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
    });
  }
};

const deleteWorkOrder = async (req: Request, res: Response) => {
  try {
    const { ...data } = req.params;

    const resDeleteWorkOrder = await WorkOrder.destroy({
      where: {
          id: data.id
      }
    });



    res.status(200).send({
      ok: true,
      resDeleteWorkOrder,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
    });
  }
};




const assignedWorkOrder = async (req: Request, res: Response) => {
  try {

    const { ...data } = req.body;


    const assignedWorkOrderByUser = await WorkOrder.update({ user_id: data.userId, status: data.status}, { where: { id: data.id }})

    const Historydata = {
      id: '',
      full_name: data.full_name,
      date: data.date,
      phone: data.phone,
      request_details: data.request_details,
      location: data.location,
      zip_code: data.zip_code,
      category: data.category,
      priority: data.priority,
      status: data.status,
      user_id: data.userId,
      number_order: data.number_order,
      hour: data.hour,
      message: data.message,
      type_client: data.type_client,
      type_business: data.type_business,
      pay: data.pay,
      finished_date: data.finished_date,
        workOrder_id: data.id
    }

  const resHistorialWorkOrder = await HistoryWorkOrder.create(Historydata)

    res.status(200).send({
      ok: true,
      assignedWorkOrderByUser
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
    });
  }
};

const getWorkOrderByUser = async (req: Request, res: Response) => {
  try {


    const  {...data}  = req.body;

    const WorkOrderByUser = await WorkOrder.findAll({
      order: [['hour', 'ASC']],    
    where: { user_id: data.userId, [Op.or]: [{status: "Pending"}, {status: "Processing"}]  }});


    res.status(200).send({
      ok: true,
      WorkOrderByUser,
      
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
    });
  }
};


const changeStatusWorkOrder = async (req: Request, res: Response) => {
  try {
    const  {...data}  = req.body;
  
    let WorkOrderByUser: any;

    const workOrder = await WorkOrder.findOne({
      where: { id: data.id, user_id: data.userId }})

    if(workOrder.status === 'Pending'){

      WorkOrderByUser = await WorkOrder.update({status: 'Processing', message: data.message},{ where: {id: data.id, user_id: data.userId   }})

      const Historydata = {
        id: '',
        full_name: data.full_name,
        date: data.date,
        phone: data.phone,
        request_details: data.request_details,
        location: data.location,
        zip_code: data.zip_code,
        category: data.category,
        priority: data.priority,
        status: 'Processing',
        user_id: data.userId,
        number_order: data.number_order,
        hour: data.hour,
        message: data.message,
        type_client: data.type_client,
        type_business: data.type_business,
        pay: data.pay,
        workOrder_id: data.id
      }
  
    const resHistorialWorkOrder = await HistoryWorkOrder.create(Historydata)
  
    }

    if(workOrder.status === 'Processing'){

      WorkOrderByUser = await WorkOrder.update({status: 'Completed', message: data.message, finished_date: data.finished_date},{ where: {id: data.id, user_id: data.userId   }})

      const Historydata = {
        id: '',
        full_name: data.full_name,
        date: data.date,
        phone: data.phone,
        request_details: data.request_details,
        location: data.location,
        zip_code: data.zip_code,
        category: data.category,
        priority: data.priority,
        status: 'Completed',
        user_id: data.userId,
        number_order: data.number_order,
        hour: data.hour,
        message: data.message,
        type_client: data.type_client,
        type_business: data.type_business,
        pay: data.pay,
        finished_date: data.finished_date,
          workOrder_id: data.id
      }
    
    const resHistorialWorkOrder = await HistoryWorkOrder.create(Historydata)


    }

  
   
    
    



    res.status(200).send({
      ok: true,
      WorkOrderByUser
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
    });
  }
};

const changeStatusWorkOrderByUser = async (req: Request, res: Response) => {
  try {
    const  {...data}  = req.body;
  
    let WorkOrderByUser: any;

    const workOrder = await WorkOrder.findOne({
      where: { id: data.id, user_id: data.userId }})


    if(workOrder.status === 'Pending'){

      WorkOrderByUser = await WorkOrder.update({status: 'Processing', message: data.message},{ where: {id: data.id, user_id: data.userId   }})

      const Historydata = {
        id: '',
        full_name: data.full_name,
        date: data.date,
        phone: data.phone,
        request_details: data.request_details,
        location: data.location,
        zip_code: data.zip_code,
        category: data.category,
        priority: data.priority,
        status: data.status,
          user_id: data.userId,
        number_order: data.number_order,
        hour: data.hour,
        message: data.message,
        type_client: data.type_client,
        type_business: data.type_business,
        pay: data.pay,
        finished_date: data.finished_date,
          workOrder_id: data.id
      }
  
    const resHistorialWorkOrder = await HistoryWorkOrder.create(Historydata)

    }

    if(workOrder.status === 'Processing'){

      WorkOrderByUser = await WorkOrder.update({status: 'Completed', message: data.message},{ where: {id: data.id, user_id: data.userId   }})

      const Historydata = {
        id: '',
        full_name: data.full_name,
        date: data.date,
        phone: data.phone,
        request_details: data.request_details,
        location: data.location,
        zip_code: data.zip_code,
        category: data.category,
        priority: data.priority,
        status: data.status,
          user_id: data.userId,
        number_order: data.number_order,
        hour: data.hour,
        message: data.message,
        type_client: data.type_client,
        type_business: data.type_business,
        pay: data.pay,
        finished_date: data.finished_date,
          workOrder_id: data.id
      }
   
  
    const resHistorialWorkOrder = await HistoryWorkOrder.create(Historydata)

    }

    res.status(200).send({
      ok: true,
      WorkOrderByUser
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
    });
  }
};

const getWorkOrderByNumberOrder = async (req: Request, res: Response) => {
  try {
    const  {...data}  = req.body;
    const WorkOrderByNumber = await WorkOrder.findOne({ where: { number_order: data.number_order}})

    res.status(200).send({
      ok: true,
      WorkOrderByNumber
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
    });
  }
};

const getWorkOrderById = async (req: Request, res: Response) => {
  try {


    const  {...data}  = req.body;
  
    const WorkOrderById = await WorkOrder.findOne({    
    where: { id: data.id  }});

    res.status(200).send({
      ok: true,
      WorkOrderById,
      
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
    });
  }
};

const reactOrderByUser = async (req: Request, res: Response) => {
  try {
    const  {...data}  = req.body;
  
    const workOrders = await WorkOrder.update({
      status: 'Not assigned', user_id: null
    },
      { where: {user_id: data.userId, [Op.or]: [{status: "Pending"}, {status: "Processing"}]}})

    res.status(200).send({
      ok: true,
      workOrders
      
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
    });
  }
};

const getCompleted = async (req: Request, res: Response) => {
  try {

    const { ...data } = req.body;
    
    const dateToday = moment().format("YYYY-MM-DD");

    const workOrdersToday = await WorkOrder.findAll(
      { where:{ date: dateToday, pharmacy_id: data.pharmacy_id} })
  
    const workOrdersCompleted = await WorkOrder.findAll(
      { where:{ date: dateToday, pharmacy_id: data.pharmacy_id, status: 'Completed'} })

      let division = Number(workOrdersCompleted.length)/Number(workOrdersToday.length);

      let porcentage = division*100;
      const finalPorcentage = Math.round(porcentage); 
    
      res.status(200).send({
      ok: true,
      finalPorcentage
      
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
    });
  }
};






export { createWorkOrder, getWorkOrder, assignedWorkOrder, getWorkOrderByUser, changeStatusWorkOrder, deleteWorkOrder, updateWorkOrder, getWorkOrderByNumberOrder, getWorkOrderById, reactOrderByUser, changeStatusWorkOrderByUser, getCompleted};

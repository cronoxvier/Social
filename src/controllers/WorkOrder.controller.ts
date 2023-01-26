import { Request, Response } from "express";
import { col, Op, where} from 'sequelize'
import { WorkOrder } from "../models/WorkOrder";




const createWorkOrder = async (req: Request, res: Response) => {
  try {
    const { ...data } = req.body;
    // const params = { ...data };

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
    const resGetWorkOrder = await WorkOrder.findAll({
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
  

    const resUpdateWorkOrder = await WorkOrder.update({ ...data, }, {
      where: {
          id: data.id
      }
    });



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
    const { ...data } = req.body;

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







const getWorkOrderCompleted = async (req: Request, res: Response) => {
  try {

    const resWorkOrderStatusPending = await WorkOrder.findAll({
      where: {
        status: "Pending"
      }
    });

    const resWorkOrderStatusNotAssi = await WorkOrder.findAll({
      where: {
        status: "Not assigned"
      }
    });

    const resWorkOrderStatusProcessing = await WorkOrder.findAll({
      where: {
        status: "Processing"
      }
    });


    const resWorkOrderCompleted = await WorkOrder.findAll({
      where: {
        status: "Completed"
      }
    });

    let addNotCompleted = resWorkOrderStatusPending.length+resWorkOrderStatusNotAssi.length+resWorkOrderStatusProcessing.length;

    let completed = resWorkOrderCompleted.length;

    // let percentage = addNotCompleted/100;
    // let dc = resWorkOrderCompleted.length * 10
    // console.log(percentage)

        //     order: [
    //     ['created_at', 'DESC'],
    // ]
      
     
    res.status(200).send({
      ok: true,
      completed,
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


    // const  id  = 3;
    // const  userId  = 71;
    // const status = "Pending"
   
    console.log(data)
    
    const assignedWorkOrderByUser = await WorkOrder.update({ user_id: data.userId, status: data.status }, { where: { id: data.id }})


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

   
    // const  userId  = 71;

  
    const WorkOrderByUser = await WorkOrder.findAll({    
    where: { user_id: data.userId, [Op.or]: [{status: "Pending"}, {status: "Processing"}]  }});
   
    
    // const WorkOrderByUserProcessing = await WorkOrder.findAll({
      
      
    //   where: { user_id: data.userId, status: 'Processing'  }});



// console.log("fff", WorkOrderByUserPending)




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

    }

    if(workOrder.status === 'Processing'){

      WorkOrderByUser = await WorkOrder.update({status: 'Completed', message: data.message},{ where: {id: data.id, user_id: data.userId   }})

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

export { createWorkOrder, getWorkOrder, getWorkOrderCompleted, assignedWorkOrder, getWorkOrderByUser, changeStatusWorkOrder, deleteWorkOrder, updateWorkOrder, getWorkOrderByNumberOrder};

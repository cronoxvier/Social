import { Request, Response } from "express";
import {
  ValidationError,
  col,
  ForeignKeyConstraintError,
  Sequelize,
  Op,
} from "sequelize";
import moment from "moment";
//commentario
import seqDb from "../config/connectionSequelize";
import { Order } from "../models/orders";
import { OrderDetail } from "../models/order-detail";
import { CartDetail } from "../models/cart-detail";
import { User } from "../models/user";
import { PharmacyProduct } from "../models/pharmacy-product";
import { OrderStateHistory } from "../models/order-state-history";
import { OrderState } from "../models/order-state";
import { round, errorMessage } from "../utils/helpers";
import { OrderDriver } from "../models/order-driver";
import { Pharmacy } from "../models/Pharmacy";
import { ProductOrderStatus } from "../models/product-order-status";
import { Billing } from "../models/billing";
import { BillingDetail } from "../models/billing-detail";
import { OrderDetailHistory } from "../models/OrderDetailHistory";
import { placeToPayRequestId } from "../models/PlaceToPay-requesId";
import { dbf, firebase } from '../config/firebase';
import { Products } from "../models/products";
import { ClientDirection } from "../models/client-direction";
import { sendToRonpon } from "./ronpon.controller";
import { Driver } from "../models/driver";
import { AdminPharmaciesDriver } from "../models/AdminPharmaciesDriver";
import e from "connect-timeout";


/**
 * Formatea objeto Date a string con formato `DD de MMM YYYY, hh:mm AA`
 * @param date fecha
 * @param lang idioma
 * @returns string con fecha fecha formateada (20 de April 2021, 01:59 PM)
 */

const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: Pharmacy,
          as: "Pharmacy",
          attributes: [],
        },
        {
          model: Driver,
          as: "Driver",
          attributes: [],
        },
        {
          model: BillingDetail,
          as: "BillingDetail",
          attributes: [],
          include: [
            {
              model: Billing,
              as: "Billing",
            }
          ]
        }
      ],

      order: [
        ['hasBilling', 'ASC'],
        ['created_at', 'DESC'],
      ],
      attributes: [
        "id", "code", "total_order", "description_order", "pharmacy_id", "created_at", "updated_at",
        [col("Pharmacy.name"), "name"], "phone", "client_state", "alias", "address_1", "address_2",
        "city", "zip_Code", "notes", "stripe_charged_id", "user_id", "order_state_id", "last_card_digit", "stripe_card_id",
        "driver_id", "pick_up_status", 'hasBilling', 'deposit_amount', 'totalDeliveryFee', 'delivery_fee_tax', 'totalTransactioFee', 'transaction_fee_tax',
        'clientBankFee','order_total_without_tax','product_state_tax','product_municipal_tax','delivery_fee_municipal_tax',
        [col("BillingDetail.Billing.billing_status_id"), "billing_status_id"],
        [col("BillingDetail.Billing.code"), "billingCode"],
        [col("BillingDetail.Billing.stimated_paid_date"), "stimated_paid_date"],
        [col("Driver.first_name"), "driver_name"],[col("Driver.zip_code"), "driver_zip_code"],
      ],
      where:{order_state_id:{[Op.not]:8}}
    });
    //console.log(orders)
    if (!orders.length) {
      return res.status(204).send();
    }

    res.status(200).send({
      message: "All orders",
      mensaje: "Todas las ordenes",
      orders,
    });
  } catch (error) {
    console.log(error)
    res.status(400).json({
      mensaje: "Ha ocurrido un error ",
      messaje: "It has ocurred an error",
      error,
    });

    ////throw error;
  }
};
// const saveHistory =async (req:Request, res: Response) => {
//   try {

//   } catch (error) {

//   }
// }

const createOrder = async (req: Request, res: Response) => {
  const transaction = await seqDb.transaction({ autocommit: false });
  const code = new Date().getTime();


  try {
    const {
      total_order,
      product_state_tax,
      product_municipal_tax,
      pharmacy_id,
      description_order,
      user_id,
      phone,
      client_state,
      alias,
      address_1,
      address_2,
      city,
      zip_Code,
      latitude,
      longitude,
      deposit_amount,
      totalDeliveryFee,
      totalTransactioFee,
      order_total_without_tax,
      order_total_tax,
      clientBankFee_state_tax,
      clientBankFee_municipal_tax,
      clientBankFee,//bankFee,
      notes,
      card_id,
      pick_up_status,
      requestId,
      TOKEN
    } = req.body;
    //console.log("body", req.body)

    //console.log(pharmacy_id, "zip_Code")

    // buscar farmcaia para guardar el zip_code

    const pharmacy = await Pharmacy.findByPk(pharmacy_id)



    /**
     * Valida que haya pasado 1 minuto desde la ultima orden
     */
    const lastOrder = await Order.findOne({
      where: { user_id: user_id },
      order: [["created_at", "DESC"]],
      transaction,
    });

    if (lastOrder) {
      const { created_at } = lastOrder;
      const diff = moment().diff(created_at, "minute");
      if (diff < 1) {
        //console.log("Debe esperar")
        return res.status(400).send({
          diff,
          mensaje: "Debe esperar un minuto para realizar otra orden",
          message: "You must wait a minute to place another order",
        });
      }
    }

    /**
     * Obtiene la lista de products del carrito
     */
    const products = await CartDetail.findAll({
      where: { user_id: user_id },
      include: [
        {
          model: PharmacyProduct,
          as: "PharmacyProduct",
          include: [{
            model: Products,
            as: "Products"
          }],
          attributes: [],
        },
      ],
      attributes: [
        "pharmacy_product_id", "ammount", "price",
        ["ammount", "quantity"],
        ["price", "product_price"],
        "from",
        "message",
        "gift_status_id",
        [col("PharmacyProduct.ivu_municipal"), "ivu_municipal"],
        [col("PharmacyProduct.ivu_statal"), "ivu_statal"],
        [col("PharmacyProduct.price"), "original_price"],
        [col("PharmacyProduct.gift_price"), "gift_price"],
        [col("PharmacyProduct.Products.name"), "name"],
        [col("PharmacyProduct.Products.img"), "imageUrl"]
      ],
      transaction,
    });
    //console.log("cart detail",products[0].product_price)
    if (!products.length) {
      console.log("No hay productos en el carrito")
      return res.status(400).send({
        message: "No hay productos en el carrito",
        mensaje: "There are no products in the cart.",
      });
    }
    const incomeForPhamaciesDeliveryFee=pick_up_status?0.00:totalDeliveryFee-1
  
    const moneyToBePaid=order_total_without_tax+(order_total_without_tax* 0.01)+incomeForPhamaciesDeliveryFee+(incomeForPhamaciesDeliveryFee*0.04)
    const incomeForFacilito = (moneyToBePaid*0.03)+0.23
    const incomeForFacilitoTax =incomeForFacilito*0.105
    //console.log("deposit ammount",moneyToBePaid,incomeForFacilito,incomeForFacilitoTax)
    /***/
    // let deliveryFee=0.0;
    // let transactionFee=0.0;
    //let clientBankFee = (total_order * 0.0175) + 0.18;
    //commit
    const order = {
      code,
      description_order,
      total_order,
      product_state_tax:order_total_without_tax* 0.105,
      product_municipal_tax:order_total_without_tax* 0.01,
      pharmacy_id,
      user_id,
      phone,
      client_state,
      alias,
      address_1,
      address_2,
      city,
      zip_Code: pharmacy.zip,
      latitude,
      longitude,
      notes,
      stripe_card_id: card_id,
      pick_up_status,
      deposit_amount:round( moneyToBePaid),//-incomeForFacilito-incomeForFacilitoTax,
      totalDeliveryFee,
      totalTransactioFee,
      order_total_without_tax,
      order_total_tax,
      delivery_fee_state_tax: totalDeliveryFee * 0.105,
      delivery_fee_municipal_tax: totalDeliveryFee*0.01,
      transaction_fee_state_tax: totalTransactioFee * 0.105,
      transaction_fee_municipal_tax: totalTransactioFee*0.01,
      delivery_fee_tax: totalDeliveryFee * 0.115,
      transaction_fee_tax: totalTransactioFee * 0.115,
      clientBankFee,
      clientBankFee_state_tax:clientBankFee*0.105,
      clientBankFee_municipal_tax:clientBankFee*0.01,
      created_by: user_id,
      updated_by: user_id,
      OrdersDetail: products.map((product: any) => {
        product = product.toJSON();
        //console.log("cart", product)
        const {
          original_price,
          product_price,
          gift_price,
          from,
          message,
          gift_status_id,
          ivu_municipal,
          ivu_statal,
        } = product;
        let total_product;

        if (ivu_municipal && ivu_statal) {
          //const taxes = pick_up_status?1:6+1//Estoy no puede ir hard codeado, arreglarlo cuanto antes
          // console.log("taxes",ivu_municipal, ivu_statal,product_price,( taxes))
          total_product = (product_price)// * (11.5 / 100) + product_price
        } else if (ivu_statal) {
          //const taxes = pick_up_status?1:6+1//Estoy no puede ir hard codeado, arreglarlo cuanto antes
          total_product = (product_price) //* (10.5 / 100) + product_price

        } else if (ivu_municipal) {
          //const taxes = pick_up_status?1:6+1//Estoy no puede ir hard codeado, arreglarlo cuanto antes
          total_product = (product_price) //* (1 / 100) + product_price
        } else {
          total_product = product_price
        }


        return {
          ...product,
          ivu_municipal,
          ivu_statal,
          total_product: round(total_product),
          original_price,
          gift_price,
          from,
          message,
          gift_status_id,
        };
      }),
      OrdersStatesHistory: [
        {
          order_state_id: 1,
          created_by: user_id,
          transaction_fee_tax: totalTransactioFee * 0.115,
          delivery_fee_tax: totalDeliveryFee * 0.115,
          totalTransactioFee,
          totalDeliveryFee,
          order_total_without_tax,
          order_total_tax,
          order_total: total_order,
        },
      ],
    };
    /**
     * Validamos que el total de los productos coincida con el total de la orden
     */
    const totalProducts = pick_up_status ? order.OrdersDetail.reduce(
      (total, { total_product }) => round(total + total_product), 0) + 1 :
      order.OrdersDetail.reduce(
        (total, { total_product }) => round(total + (total_product)), 0) + 1 + 6;
    const totalsDifference = Math.abs(total_order - (totalProducts + (totalProducts * 0.115)
   //  + clientBankFee+clientBankFee_state_tax+clientBankFee_municipal_tax
    ));

    if (totalsDifference > 0.03) {
    //  console.log("test", totalsDifference, totalProducts, totalProducts + (totalProducts * 0.115) + clientBankFee, total_order)
      return res.status(400).send({
        total_order,
        totalProducts,
      });
    }

    const orderResults = await Order.create(order, {
      include: [
        {
          model: OrderDetail,
          as: "OrdersDetail",
        },
        {
          model: OrderStateHistory,
          as: "OrdersStatesHistory",
        },
      ],
      transaction,
    })
      .then(async (r) => {
       // console.log("order has been created", r)
        const updatePlaceToPayRequestId = await placeToPayRequestId.update({ order_id: r.id }, { where: { requestId: requestId }, transaction, returning: true })
       // console.log("order actualizado en request", r.id, requestId)
        const orderHistoryDetail = products.map((product: any) => {
          return {
            order_id: r.id,
            order_state_id: 1,
            user_id: r.user_id,
            created_by: r.created_by,
            product_quantity: product.ammount,
            order_detail_product_total: product.price,
            change_type: "Create"
          }
        })
        // console.log(orderHistoryDetail)
        const resultOrderHistoryDetail = await OrderDetailHistory.bulkCreate(orderHistoryDetail)

        // const dbRefPush = await firebase.firestore().collection('notificationsPush').add({
        //   message: 'A new order #' + order.code + ' has been placed.',
        //   seen: false,
        //   pharmacy_id: r.pharmacy_id + '',
        //   order_id: r.id,
        //   order_status: 1,
        //   token: TOKEN
        // });
        // const dbRef = await firebase.firestore().collection('notifications').add({
        //   message: 'A new order #' + r.code + ' has been placed.',
        //   seen: false,
        //   user_id: r.pharmacy_id + '',
        //   order_id: r.id,
        //   order_status: 1
        // });
        
        //const respRonpon = await sendToRonpon(ronponOrder, r)//.then(({data})=>{console.log("ronpon data",data) ; Order.update({ronpon_id:data.order_id},{where:{id:r.id},transaction})})
       // console.table("res ronpon", respRonpon)
        await firebase.firestore().collection('notifications').add({
          message: 'A new order #' + r.code + ' has been placed.',
          seen: false,
          user_id: r.pharmacy_id + '',
          order_id: r.id,
          order_status: 1
        });

        await firebase.firestore().collection('orders').add({
          order_id: r.id,
          order_status: 1,
          farmacy_id: r.pharmacy_id
        });

        await firebase.firestore().collection('notificationsPush').add({
          message: 'A new order #' + order.code + ' has been placed.',
          seen: false,
          pharmacy_id: r.pharmacy_id + '',
          order_id: r.id,
          order_status: 1,
          token: TOKEN
        });


        return orderHistoryDetail
      }).catch((error) => console.log("create order has failed", error))
    // console.log("Order to be inserted",order)
    //const orderHistory = await OrderStateHistory.create(order)
    // const orderHistoryDetail = await OrderDetailHistory.bulkCreate()
    //console.log(orderResults)
    //const updatePlaceToPayRequestId= await placeToPayRequestId.update({orderId:order.id},{})
    //Restar la cantidad de producto ordenado al stock
    const cartDetail = await CartDetail.findAll({
      where: { user_id },
    });
    for (let i = 0; i < cartDetail.length; i++) {
      const { pharmacy_product_id, ammount } = cartDetail[i];

      const result = await PharmacyProduct.findAll({
        where: {
          id: pharmacy_product_id,
        },
      });
      const checkStock = result.filter(({ stock }) => stock - ammount < 0);

      if (checkStock.length) {
        return res.status(200).send({
          message: "Not product in stock",
        });
      }
      //descomentar esto para produccion
      await PharmacyProduct.update(
        {
          stock: Sequelize.literal(`stock - ${ammount}`),
        },
        {
          where: { id: pharmacy_product_id },
        }
      );
    }
    /**
     * Actualiza campo first_transaction
     */
    await User.update(
      {
        first_transaction: false,
      },
      {
        where: { id: user_id },
        transaction,
      }
    );

    /**
     * Limpia Carrito
     */
    await CartDetail.destroy({
      where: { user_id },
      transaction,
    });

    await transaction.commit();

    res.status(201).json({
      message: "The order has been created successfully!",
      mensaje: "Se ha creado la orden con exito!",
      orderResults,
    });
  } catch (error) {
    console.log("error", error)
    await transaction.rollback();

    if (error instanceof ValidationError) {
      const { message } = error.errors[0];
      console.log("error", error)
      return res.status(400).send({ message, mensaje: message, err: error });
    }

    res.status(500).json({
      mensaje: "Ha ocurrido un error ",
      messaje: "It has ocurred an error",
      error,
    });

    ////throw error;

  }
};
const getOrderById = async (req: Request, res: Response) => {
  try {
    const { order_id } = req.body;
    if (!order_id) {
      return res.status(204).json({
        mensaje: "Id invalido",
        message: "Id invalid",
      });
    }
    const order = await Order.findOne({
      where: {
        id: order_id,
      },
    });

    if (!order) {
      return res.status(204).json({
        message: "Product not found",
      });
    }
    res.status(201).json({
      message: "Completado!",
      order,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "Ha ocurrido un error",
      messaje: "It has ocurred an error",
      error,
    });

    // //throw error;
  }
};
const getOrderbyUser = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.body;
    if (!user_id) {
      return res.status(204).json({
        mensaje: "Id invalido",
        message: "Id invalid",
      });
    }
    const order = await Order.findAll({
      where: {
        user_id,
      },
    });
    if (!order.length) {
      return res.status(204).send({
        message: "Order not found",
      });
    }
    res.status(201).json({
      message: "Completado!",
      order,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "Ha ocurrido un error",
      messaje: "It has ocurred an error",
      error,
    });

    // //throw error;
  }
};
const getOrderDetails = async (req: Request, res: Response) => {
  try {
    const { order_id } = req.body;
    if (!order_id) {
      return res.status(204).json({
        mensaje: "Id invalido",
        message: "Id invalid",
      });
    }
    const orderdetail = await OrderDetail.findAll({
      where: {
        order_id,
      },
    });
    if (!orderdetail.length) {
      return res.status(204).send({
        message: "Product not found",
      });
    }
    res.status(200).json({
      message: "Completado!",
      orderdetail,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "Ha ocurrido un error",
      messaje: "It has ocurred an error",
      error,
    });

    //throw error;
  }
};
const updateOrderState = async (req: Request, res: Response) => {
  let { order_id, state, user_id } = req.body;

  try {
    const order = await Order.findOne({
      where: { id: order_id },
    });
   // console.log(order)
    const orderNames = await OrderState.findOne({
      where: { id: state },
    });
    const orderStates = await OrderStateHistory.findAll({
      where: { order_id },
    });

    if (!(order && orderStates && orderNames)) {
      return res.status(404).send({
        ok:false,
        message: "Order nor found",
        mensaje: "Orden no encontrada",
      });
    }
    const orderstatus = orderStates.find(({ order_state_id }) => {
      if (order_state_id == state) {
        return true;
      }
      return false;
    });
    if (orderstatus) {
      return res.status(400).send({
        ok:false,
        message: `The order already has the status ${orderNames.name}`,
        mensaje: `La orden ya tiene el estado ${orderNames.nombre}`,
      });
    }

    const updateOrderState = await Order.update(
      { order_state_id: state ,
        updated_by: user_id,
        transaction_fee_tax: order.totalTransactioFee * 0.115,
        delivery_fee_tax: order.totalDeliveryFee * 0.115,
        totalTransactioFee:order.totalTransactioFee,
        totalDeliveryFee:order.totalDeliveryFee,
        order_total_without_tax:order.order_total_without_tax,
        order_total_tax:order.order_total_tax,
        order_total: order.total_order,
      },
      { where: { id: order_id } }
    ).then( async()=>{
      //if (updateOrderState) {
        console.log("updating order status")
        await OrderStateHistory.create({
           order_id,
           order_state_id: state,
           user_id,
           created_by: user_id,
           transaction_fee_tax: order.totalTransactioFee * 0.115,
           delivery_fee_tax: order.totalDeliveryFee * 0.115,
           totalTransactioFee:order.totalTransactioFee,
           totalDeliveryFee:order.totalDeliveryFee,
           order_total_without_tax:order.order_total_without_tax,
           order_total_tax:order.order_total_tax,
           order_total: order.total_order,
           ...order
         }).catch((error) => console.log("Error updating order status",error)).then((r)=>{
          return res.status(200).send({
            ok:true,
            message: `The order status updated ${orderNames.name}`,
            mensaje: `El estatus de la orden ha sido actualizada ${orderNames.nombre}`,
          });
         });
        
       //}

    }).catch((err)=>console.log("Error updating order status",err))
  
  } catch (error) {
    console.log(error)
    if (error instanceof ForeignKeyConstraintError) {
      return res.status(400).send({
        ok:false,
        message: `The order status ${state} is invalid.`,
        mensaje: `El estado de orden ${state} es invalido.`,
        error,
      });
    }
    res.sendStatus(500);
    //throw error;
  }
};
const getStates = async (req: Request, res: Response) => {
  try {
    const orderStates = await OrderState.findAll();

    if (!orderStates.length) {
      return res.status(200).json({
        message: "There are not states",
        mensaje: "No hay estados",
      });
    }

    res.status(200).send({
      mensaje: "Retorna los estados de orden",
      message: "Returns the order states",
      orderStates,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "Ha ocurrido un error",
      messaje: "It has ocurred an error",
      error,
    });

    //throw error;
  }
};
const getOrderStates = async (req: Request, res: Response) => {
  try {
    const order = await Order.findAll({
      include: [
        {
          model: OrderState,
          as: "OrdersState",
          attributes: [],
        },
      ],
      attributes: ["id", [col("OrdersState.name"), "state"]],
    });

    if (!order.length) {
      return res.status(200).json({
        message: "There are not states",
        mensaje: "No hay estados",
      });
    }

    res.status(200).send({
      mensaje: "Retorna los estados de orden",
      message: "Returns the order states",
      order,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "Ha ocurrido un error",
      messaje: "It has ocurred an error",
      error,
    });

    //throw error;
  }
};
const updateOrderDetail = (req: Request, res: Response) => {
  const { orderId, validated } = req.body;

  OrderDetail.update(
    { validated },
    {
      where: { id: orderId },
    }
  )
    .then(() => {
      res.status(200).send({
        message: `Product ${validated ? "marked" : "unmarked"} for delivery`,
        mensaje: `Producto ${validated ? "marcado" : "desmarcado"
          } para entrega`,
      });
    })
    .catch((error) => {
      res.sendStatus(500);
      //throw error;
    });
};
const getAllOrdersByPharmacy = async (req: Request, res: Response) => {
  try {
    const { pharmacy_id } = req.body;

    if (!pharmacy_id) {
      return res.status(204).json({
        mensaje: "Id invalido",
        message: "Id invalid",
      });
    }
    const order = await Order.findAll({
      where: {
        pharmacy_id,
         order_state_id:{[Op.not]:8}
      },
      order: [
        ['created_at', 'DESC'],
      ],
    });
    if (!order.length) {
      return res.status(204).send({
        message: "Order not found",
      });
    }
    res.status(200).json({
      message: "Completado!",
      order,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "Ha ocurrido un error",
      messaje: "It has ocurred an error",
      error,
    });

    ////getOrdersDriverAdmin;
  }
};
const getOrderAmountByPharmacy = async (req: Request, res: Response) => {
  try {
    const { pharmacy_id, status } = req.body;

    const order = await Order.findAll({
      include: [
        {
          model: OrderDetail,
          as: "OrderDetail",
          attributes: [],
        },
      ],
      where: {
        pharmacy_id,
        order_state_id: status,
      },
      attributes: ["id", [col("OrderDetail.quantity"), "quantity"]],
    });
    if (!order.length) {
      return res.status(200).json({
        message: "There are not products",
        mensaje: "No hay productos",
      });
    }

    res.status(200).json({
      mensaje: "Retorna la cantidad de productos",
      message: "Returns the products quantity",
      order,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "Ha ocurrido un error",
      messaje: "It has ocurred an error",
      error,
    });

    //throw error;
  }
};
const getHistoryOrdersByPharmacy = async (req: Request, res: Response) => {
  try {
    const { pharmacy_id } = req.body;
    if (!pharmacy_id) {
      return res.status(204).json({
        mensaje: "Id invalido",
        message: "Id invalid",
      });
    }
    const order = await Order.findAll({
      include: [
        {
          model: OrderStateHistory,
          as: "OrderStateHistory",
          attributes: [],
        },
      ],
      where: {
        pharmacy_id,
      },
      attributes: [
        ["id", "order_id"],
        [col("OrderStateHistory.id"), "history_id"],
        [col("OrderStateHistory.order_state_id"), "order_states"],
        [col("OrderStateHistory.user_id"), "user_id"],
        [col("OrderStateHistory.created_by"), "creadted_by"],
      ],
    });

    if (!order.length) {
      return res.status(400).send();
    }

    res.status(200).send({
      message: "Order status history",
      mensaje: "Historial de status de la orden",
      order,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "Ha ocurrido un error",
      messaje: "It has ocurred an error",
      error,
    });

    //throw error;
  }
};
const createOrderDriver = async (req: Request, res: Response) => {
  try {
    const { driver_id, order_id } = req.body;

    const params = {
      driver_id,
      order_id,
    };

    const order = await OrderDriver.create(params);

    if (order) {
      await Order.update({ order_state_id: 6 }, { where: { id: order_id } });
      await OrderStateHistory.create({ order_id, order_state_id: 6 });
    }
    res.status(200).send({
      message: "Order accepted",
      mensaje: "Orden aceptada",
      order,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "Ha ocurrido un error",
      messaje: "It has ocurred an error",
      error,
    });

    //throw error;
  }
};
const driverSelectOrder = async (req: Request, res: Response) => {
  try {
    const { driver_id, order_id } = req.body;
    const order = await Order.findOne({ where: { id: order_id } });

    if (order.driver_id) {
      return res.status(200).send({
        message: "The order has been selected",
        mensaje: "La orden ya ha sido seleccionada",
      });
    }
    const orderDetail = await Order.update(
      { driver_id },
      { where: { id: order_id } }
    );

    if (!orderDetail.length) {
      return res.status(204).send();
    }

    res.status(200).send({
      message: "Order selected",
      mensaje: "Orden seleccionada",
      orderDetail,
    });
  } catch (error) {
    res.status(400).send({
      mensaje: "Ha ocurrido un error",
      messaje: "It has ocurred an error",
      error,
    });

    //throw error;
  }
};
const createdProductsOrderStatus = async (req: Request, res: Response) => {
  try {
    const ProductOrderState = ProductOrderStatus.bulkCreate([
      { code: 'AVAILABLE', name: 'Available', nombre: 'Disponible' },
      { code: 'NOT_AVAILABLE', name: 'Notavailable', nombre: 'No disponible' },
      { code: 'LATE_DELIVERY', name: 'Late delivery', nombre: 'Entrega tardia' },
      { code: 'SCHEDULE_DELIVERY', name: 'Schedule delivery', nombre: 'Agendar entrega' },
    ])
    res.status(200).send({
      message: "Status created",
      mensaje: "estatus creado",
      ProductOrderState,
    });
  } catch (error) {
    res.status(400).send({
      mensaje: "Ha ocurrido un error",
      messaje: "It has ocurred an error",
      error,
    });

  }
}

const updateProductStatusInOrderDetail = async (req: Request, res: Response) => {
  try {

    const { order_detail_id, status } = req.body;
    const Order_Detail = await OrderDetail.findOne({ where: { id: order_detail_id } })

    const updatedStatus = await OrderDetail.update({
      product_order_status_id: status
    },
      {
        where: { id: order_detail_id }
      }
    )
    if (updatedStatus) {
      res.status(200).send({
        ok: true,
        Order_Detail,
        updatedStatus
      })
    }

  } catch (error) {
    res.send({
      Message: 'Something went wrong with you request, try later or call an administrator',
      ok: false,
      error
    })
  }

}
const getProductOrderStatus = async (req: Request, res: Response) => {
  try {
    const ProductStatus = await ProductOrderStatus.findAll()
    if (ProductStatus) {
      res.status(200).send({
        ok: true,
        ProductStatus
      })
    }
  } catch (error) {
    res.send({
      Message: 'Something went wrong with you request, try later or call an administrator',
      ok: false,
      error
    })
  }
}

const getDriverOrderpharmacy = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    console.log('aqui', id)
    const order = await Order.findAll({
      include: [
        {
          model: Pharmacy,
          as: "Pharmacy",
          attributes: [],
        },
        {
          model: User,
          as: "Users",
          attributes: [],
        },
      ],
      attributes: [
        "id", "code", "total_order", "description_order", "pharmacy_id", "created_at", "updated_at",
        [col("Pharmacy.name"), "name"],
        [col("Pharmacy.address"), "pharmacy_address"], "phone", "client_state", "alias", "address_1", "address_2",
        "city", "zip_Code", "notes", "stripe_charged_id", "user_id", "order_state_id", "last_card_digit", "stripe_card_id",
        "driver_id", "pick_up_status", 'hasBilling', 'deposit_amount', 'totalDeliveryFee', 'totalTransactioFee',
        [col("Users.first_name"), "first_name"],
        [col("Users.last_name"), "last_name"],
        [col("Users.img"), "user_img"],
        [col("Pharmacy.dispatcher"), "dispatcher"],
        [col("Pharmacy.placeOfDispatch"), "placeOfDispatch"],
        [col("Pharmacy.dispatcherPhone"), "dispatcherPhone"],
      ],
      where: {
        pharmacy_id: id,
        order_state_id: 3,
        driver_id: null
      },
    });
    res.status(200).send({
      ok: true,
      order,

    })

  } catch (error) {
    res.send({
      Message: 'Something went wrong with you request, try later or call an administrator',
      ok: false,
      error
    })
  }

}

const getOrdersDriverAdmin = async (req, res) => {
  const { driver_id } = req.params;
  let filterIdPharmacies = [];
  try {

    const driverIds = await AdminPharmaciesDriver.findAll({ where: { driver_id: driver_id } })
    // console.log(driverIds)
    driverIds.forEach(e => {
      filterIdPharmacies.push(e.pharmacy_id)
    })

    const order = await Order.findAll({
      include: [
        {
          model: Pharmacy,
          as: "Pharmacy",
          attributes: [],
        },
        {
          model: User,
          as: "Users",
          attributes: [],
        },
      ],
      attributes: [
        "id", "code", "total_order", "description_order", "pharmacy_id", "created_at", "updated_at",
        [col("Pharmacy.name"), "name"],
        [col("Pharmacy.address"), "pharmacy_address"], "phone", "client_state", "alias", "address_1", "address_2",
        "city", "zip_Code", "notes", "stripe_charged_id", "user_id", "order_state_id", "last_card_digit", "stripe_card_id",
        "driver_id", "pick_up_status", 'hasBilling', 'deposit_amount', 'totalDeliveryFee', 'totalTransactioFee',
        [col("Users.first_name"), "first_name"],
        [col("Users.last_name"), "last_name"],
        [col("Users.img"), "user_img"],
        [col("Pharmacy.dispatcher"), "dispatcher"],
        [col("Pharmacy.placeOfDispatch"), "placeOfDispatch"],
        [col("Pharmacy.dispatcherPhone"), "dispatcherPhone"],



      ],
      where: { pharmacy_id: filterIdPharmacies, order_state_id: 3, driver_id: null }
    })


    res.status(200).send({
      ok: true,
      order,
    })

  } catch (error) {
    console.log(error)
    res.status(500).send({
      ok: false,
    })

  }

}

const getOrderSelectedByPharmacy = async (req, res) => {
  try {
    const { driverId } = req.params

    const order = await Order.findAll({
      include: [
        {
          model: Pharmacy,
          as: "Pharmacy",
          attributes: [],
        },
        {
          model: User,
          as: "Users",
          attributes: [],
        },
      ],
      attributes: [
        "id", "code", "total_order", "description_order", "pharmacy_id", "created_at", "updated_at",
        [col("Pharmacy.name"), "name"],
        [col("Pharmacy.address"), "pharmacy_address"], "phone", "client_state", "alias", "address_1", "address_2",
        "city", "zip_Code", "notes", "stripe_charged_id", "user_id", "order_state_id", "last_card_digit", "stripe_card_id",
        "driver_id", "pick_up_status", 'hasBilling', 'deposit_amount', 'totalDeliveryFee', 'totalTransactioFee',
        [col("Users.first_name"), "first_name"],
        [col("Users.last_name"), "last_name"],
        [col("Users.img"), "user_img"],
        [col("Pharmacy.dispatcher"), "dispatcher"],
        [col("Pharmacy.placeOfDispatch"), "placeOfDispatch"],
        [col("Pharmacy.dispatcherPhone"), "dispatcherPhone"],


      ],
      where: { order_state_id: [3, 4], driver_id: driverId }
    })

    res.status(200).send({
      ok: true,
      order,
    })

  } catch (error) {
    console.log(error)
    res.status(500).send({
      ok: false,
    })

  }
}

const getNewOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
   // console.log(id)

    const order = await Order.findOne({
      include: [
        {
          model: Pharmacy,
          as: "Pharmacy",
          attributes: [],
        },
        {
          model: User,
          as: "Users",
          attributes: [],
        },
      ],
      attributes: [
        "id", "code", "total_order", "description_order", "pharmacy_id", "created_at", "updated_at",
        [col("Pharmacy.name"), "name"],
        [col("Pharmacy.address"), "pharmacy_address"], "phone", "client_state", "alias", "address_1", "address_2",
        "city", "zip_Code", "notes", "stripe_charged_id", "user_id", "order_state_id", "last_card_digit", "stripe_card_id",
        "driver_id", "pick_up_status", 'hasBilling', 'deposit_amount', 'totalDeliveryFee', 'totalTransactioFee',
        [col("Users.first_name"), "first_name"],
        [col("Users.last_name"), "last_name"],
        [col("Users.img"), "user_img"],
        [col("Pharmacy.dispatcher"), "dispatcher"],
        [col("Pharmacy.placeOfDispatch"), "placeOfDispatch"],
        [col("Pharmacy.dispatcherPhone"), "dispatcherPhone"],
      ],
      where: {
        id: id,
      },
    });


    res.status(200).json({
      message: "Completado!",
      order
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      mensaje: "Ha ocurrido un error",
      messaje: "It has ocurred an error",
      error,
    });

    // //throw error;
  }
};
export {
  createOrder,
  getOrderById,
  getOrderbyUser,
  getOrderDetails,
  updateOrderState,
  getOrderStates,
  updateOrderDetail,
  getAllOrdersByPharmacy,
  getOrderAmountByPharmacy,
  getHistoryOrdersByPharmacy,
  createOrderDriver,
  driverSelectOrder,
  getOrders,
  getStates,
  createdProductsOrderStatus,
  updateProductStatusInOrderDetail,
  getProductOrderStatus,
  getDriverOrderpharmacy,
  getOrdersDriverAdmin,
  getOrderSelectedByPharmacy,
  getNewOrderById
};

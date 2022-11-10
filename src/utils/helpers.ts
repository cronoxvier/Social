import nodemailer from 'nodemailer';
import { Op, literal } from 'sequelize';

import db from '../config/connectionSequelize';
import { User } from '../models/user';
import { Order } from '../models/orders'

/**
 * Redondea con 2 puntos decimales
 * No se usa .toFixeed porque esta eleva al siguiente numero a partir de 6 
 * y no a partir de 5 como se podria esperar, esto por la forma extraña en
 * la que las computadoras manejan los decimales
 * @param value valor numerico a redondear
 */
export function round(value: number): number{
	return Math.round((value+Number.EPSILON) * 100) / 100
}

/**
 * Devuelve mensajes de error con codigo
 */
export function errorMessage(code: 'BI01' | 'CI01' | 'WG01' | 'WB01' | 'ME01' | 'OT01'){
	const link = '<a href="tel:7875170775">(787) 517-0775</a>'

	return {
		mensaje: 
			'Su orden necesita atención.\n' +
			`Favor de llamar a asistencia técnica al ${link}.\n` +
			`Código: ${code}`,
		message: 
			'Your order needs attention.\n' +
			`Please call technical assistance at ${link}.\n` +
			`Code: ${code}`,
		code
	}
}

/**
 * Envia correo electronico a una lista de correos
 */
export function sendEmail(emails: string[], subject: string, body: string, isHtml: boolean = false){
	const transporter = nodemailer.createTransport({
		host: 'email-smtp.us-west-1.amazonaws.com',
		port: 465,
		secure: true,
		auth: {
			user: process.env.emailAuthUser,
			pass: process.env.emailAuthPass
		}
	});

	transporter.sendMail({
		from: 'serviciotecnico@coopharma.coop',
		to: emails,
		subject,
		...(isHtml) && {
			html: body
		},
		...(!isHtml) && {
			text: body
		}
	}).catch(error => {
		 
	})
}

/**
 * Obtiene el monto total consumido en walgreens para el periodo actual
 */
export async function walgreensAmount(member_id: string, plan_type_name: string, start_date: string): Promise<number>{
	const query = `
		SELECT
			COALESCE(SUM(accumulation), 0) AS amount
		FROM
			walgreens
		WHERE
			member_id = ? AND
			DATE(date_of_service) >= DATE(?) AND
			(
				(
					? = 'Anual' AND
					YEAR(date_of_service) = YEAR(CURDATE())
				) OR
				(
					? = 'Trimestral' AND
					YEAR(date_of_service) = YEAR(CURDATE()) AND
					QUARTER(date_of_service) = QUARTER(CURDATE())
				) OR
				(
					? = 'Mensual' AND
					YEAR(date_of_service) = YEAR(CURDATE()) AND
					MONTH(date_of_service) = MONTH(CURDATE())
				)
			)
		`

	const [{ amount }]: any = await db.query(query, {
		replacements: [
			member_id,
			start_date,
			plan_type_name,
			plan_type_name,
			plan_type_name
		],
		type: 'SELECT'
	});

	return amount;
}

/**
 * Obtiene el monto total consumido en ordenes para el periodo actual
 */
export async function ordersAmount(user_id: number, plan_type_name: string, start_date: string): Promise<number>{
	const query = `
		SELECT
			COALESCE(SUM(total_balance), 0) AS amount
		FROM
			Orders
		WHERE
			user_id = ? AND
			order_state_id NOT IN (5, 6) AND
			created_at >= DATE(?) AND
			(
				(
					? = 'Anual' AND
					YEAR(created_at) = YEAR(CURDATE())
				) OR
				(
					? = 'Trimestral' AND
					YEAR(created_at) = YEAR(CURDATE()) AND
					QUARTER(created_at) = QUARTER(CURDATE())
				) OR
				(
					? = 'Mensual' AND
					YEAR(created_at) = YEAR(CURDATE()) AND
					MONTH(created_at) = MONTH(CURDATE())
				)
			)
		`
	const [{ amount }]: any = await db.query(query, {
		replacements: [
			user_id,
			start_date,
			plan_type_name,
			plan_type_name,
			plan_type_name
		],
		type: 'SELECT'
	});

	return amount;
}

/**
 * Obriene el valor de credito disponible para un usuarios dado
 */
// export async function availableCredit(user_id: number){
// 	const credits = await Credit.findAll({
// 		where: { 
// 			user_id,
// 			expire_at: {
// 				[Op.gte]: literal('CURDATE()')
// 			}
// 		},
// 		order: [['created_at', 'ASC']]
// 	})

// 	if(credits.length == 0)
// 		return 0

// 	const total_credit = credits.reduce((total, { amount }) => total +	amount, 0)
// 	const credit_consumed = await Order.sum('total_credit', {
// 		where: {
// 			user_id,
// 			order_state_id: { [Op.lt]: 5 },
// 			created_at: {
// 				[Op.gte]: credits[0].created_at
// 			}
// 		}
// 	})

// 	return total_credit - credit_consumed;
// }

/**
 * Obtener el balance de un usuario tomando en cuenta sus consumos en MCS, Walgreens y Creditos otorgados
 */
// export async function userBalance(id: number, includeCredit: boolean = false): Promise<number> {
// 	try {
// 		const user = await User.findOne({
// 			where: { id },
// 			include: [
// 				{
// 					model: UserPlan,
// 					as: 'plans',
// 					include: [{
// 						model: Plan,
// 						as: 'plan',
// 						include: [{
// 							model: PlanType,
// 							as: 'type'
// 						}]
// 					}],
// 					where: {
// 						[Op.and]: [
// 							{
// 								start_date: {
// 									[Op.lte]: literal('CURDATE()')
// 								}
// 							},
// 							{
// 								[Op.or]: [
// 									{
// 										finish_date: {
// 											[Op.gte]: literal('CURDATE()')
// 										}
// 									},
// 									{
// 										finish_date: null
// 									}
// 								]
// 							}
// 						]
// 					},
// 					required: false
// 				},
// 				{
// 					model: Credit,
// 					as: 'credits',
// 					where: {
// 						expire_at: {
// 							[Op.gte]: literal('CURDATE()')
// 						}
// 					},
// 					required: false
// 				}
// 			],
// 			order: [
//                 [
//                     {
//                         model: UserPlan,
//                         as: 'plans'
//                     },
//                     'start_date',
//                     'DESC'
//                 ],
//                 [
//                     {
//                         model: UserPlan,
//                         as: 'plans'
//                     },
//                     'id',
//                     'DESC'
//                 ]
//             ]
// 		});

// 		if(!user)
// 			return 0;

// 		if(user.plans.length == 0)
// 			return 0;

// 		const { start_date, plan } = user.plans[0];
// 		const { member_id } = user;

// 		const walgreen = await walgreensAmount(member_id, plan.type.name, start_date);
// 		const orders = await ordersAmount(id, plan.type.name, start_date);
// 		const credit = (includeCredit)
// 			? await availableCredit(id)
// 			: 0;
// 		const balance = plan.price - walgreen - orders + credit;

// 		return round(balance);
// 	} catch (error) {
// 		return 0;
// 	}
// }
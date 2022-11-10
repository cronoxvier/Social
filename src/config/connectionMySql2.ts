import { PoolConfig } from 'mysql'
const mysql = require('mysql2/promise')

const { dbHost, dbName, dbPass, dbUser, dbPort } = process.env

const config: PoolConfig = {
	host: dbHost,
	database: dbName,
	user: dbUser,
	password: dbPass,
	port: +dbPort,
	dateStrings: true,
	waitForConnections: true,
	connectionLimit: 5000,
	queueLimit: 0,
	typeCast: (field, next) => {
		if (field.type == 'NEWDECIMAL')
			return Number(field.string()) || 0
		
		return next()
	}
}

const db = mysql.createPool(config)

/**
 * Metodo de conexion MySql que ejecuta query usando transaccion,
 * en caso de fallo hace rollback
 * @param query query SQL a ejecutar
 * @param arg argumentos que se pasaran al query para reemplazar los simbolos ?
 */
function transaction(query: string, args: any[] = []) {
	return new Promise<[any, any]>(async (resolve, reject) => {
		const con = await db.getConnection();
		try {
			await con.beginTransaction();
			const results = await con.query(query, args);
			await con.commit();
			await con.release();
			resolve(results);
		} catch (error) {
			await con.rollback();
			await con.release();
			reject(error);
		}
	})
}

export default db
export { transaction }
import { Sequelize } from 'sequelize'

const { dbHost, dbName, dbPass, dbPort, dbUser, NODE_ENV } = process.env



const db = new Sequelize({
	dialect: 'mysql',
	dialectOptions: {
		...(NODE_ENV == 'prod') && {
			ssl:'Amazon RDS'
		},
		multipleStatements: true,
		dateStrings: true,
		typeCast: (field, next) => {
			if (field.type == 'NEWDECIMAL')
				return Number(field.string()) || 0
		
			return next()
		}
	},
	define: {
		charset: 'utf8',
		collate: 'utf8_general_ci'
	},
	timezone: '-04:00',
	host: dbHost,
	username: dbUser,
	password: dbPass,
	port: Number(dbPort) || 3306,
	database: dbName,
	pool: {
		max: 100,
		acquire: 30000
	},
	logging: false
})

db.query('SET FOREIGN_KEY_CHECKS = 0')
.then(function(){
return db.sync({alter:{drop:false} /*force: true*/ });
})
.then(function(){
    return db.query('SET FOREIGN_KEY_CHECKS = 1')
})
.then(function(){
    console.log('Database synchronised.');
}, function(err){
    console.log(err);
});

export default db
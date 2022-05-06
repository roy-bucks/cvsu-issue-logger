//Production
// module.exports = {
// 	connectionLimit: 10,
//   	host: 'us-cdbr-east-05.cleardb.net',
//   	user: 'bc2a0cb1f8df38',
//   	password: '9af74747',
//   	database: 'heroku_542edf34eb684c9',
//   	createDatabaseTable: true,   	
// 	schema: {
// 		tableName: 'sessions',
// 		columnNames: {
// 			session_id: 'session_id',
// 			expires: 'expires',
// 			data: 'data',
// 		}
// 	}

// }

//development
module.exports = {
	connectionLimit: 10,
  	host: 'localhost',
  	user: 'root',
  	password: 'root',
  	database: 'issuelogger',
  	createDatabaseTable: true,   	/* Create table and save the session data */
	schema: {
		tableName: 'sessions',
		columnNames: {
			session_id: 'session_id',
			expires: 'expires',
			data: 'data',
		}
	}

}
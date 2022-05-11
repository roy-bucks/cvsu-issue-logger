

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
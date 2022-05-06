//My SQL Configuration
const Mysql = require('mysql');
const dbconfig = require('../db/config');
const pool = Mysql.createPool(dbconfig);



//fixed the pooling method
const mysql = {

	db: async function(query, values){
		return  result = new Promise(function(resolve, reject){
        	pool.query(query, values,  function(error, result){
        		if(!error){
        			resolve({success: true, message: result});
        		}else{
        			reject({success: false, message: error.sqlMessage}); 
        		}
        	});
        });
	},
}


module.exports = mysql; 
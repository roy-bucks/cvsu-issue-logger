const {db} = require("../config/db/query");

const setup ={


	checkAdminExist: async function(){

		const query = "SELECT COUNT(1) AS exist FROM users WHERE admin =  ?";
		const value =1;
		const response = await db(query, value)
			.then(function(res){
				return{
					error: false,
					exist: res.message[0].exist, 
				}
			})
			.catch(function(error){
				console.log(error);
				return{
					error: true,
					message: "Sorry we encountered an error on checking the admin.. Please reload"
				}
				
			})
		return response; 
	}

}

module.exports = setup;
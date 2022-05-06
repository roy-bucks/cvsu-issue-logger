const {db} = require("../config/db/query");

//has Algo SHA2
var crypto = require('crypto');

const portal = {

	/*	 process the login
	*/
	login: async function(email){

		//step1 check if the email address is exist
		const emailExist = await portal.checkEmialExist(email);
		if(emailExist){

			//check the user type status
			const status = await portal.checkUserType(email);

			if(status){

				const user_id = await portal.getUserIdbyEmail(email);

				if(user_id){

					if(status.admin && status.user){
						//dual user type 
						return{
							error: false,
							user_type: "all", 
							user_id: user_id,
							redirect: "/user/login/barier/"+user_id
						} 
					}
					if(! status.admin && status.user){
						//dual user type 
						return{
							error: false,
							user_type: "user", 
							user_id: user_id,
							redirect:"/"
						} 
					}
					if(status.admin && ! status.user){
						//dual user type 
						return{
							error: false,
							user_type: "admin", 
							user_id: user_id,
							redirect:"/"
						} 
					}
				}
				else{

					return{
						error: true, 
						message: "Something went wrong"
					}
				}
			}
			else{

				return{
					error: true, 
					message: "Something went wrong"
				}
			}
		}
		else{
			return{
				error: true, 
				message: "This email address is not registered",
			}
		}
	},

	entry: async function(data){

		//step1. checkif the  id exist 
		const idExist = await portal.checkIdExist(data.user_id);
		if(idExist){

			//step 2 get email by id 
			const email = await portal.getUserEmailbyId(data.user_id);
			if(email){

				//step3.check user access
				const access = await portal.checkUserType(email);

				if(access){

					if(access[data.user_type]){
						return{
							error: false, 
							email: email,
						}
					}
					else{
						return{
							error: true, 
							message: "Invalid user access"
						}
					}

				}
				else{

					return{
						error: true, 
						message: "Sorry Something went wrong",
					}
				}

			}
			else{
				return{
					error: true, 
					message: "Sorry Something went wrong", 
				}
			}
		}
		else{
			return{
				error: true, 
				message: "This id didn't exist"
			}
		}
	},
	adminLogin: async function(data){

		const user_id = await portal.getUserIdbyEmail(data.email);
		if(user_id){

			const next_id = await portal.getUserIdByPassword(data.pass);
			if(next_id){
				if(next_id == user_id){
					return{
						error: false,
						redirect: "/",
						user_type: 'admin',
						user_id: user_id,
					}
				}
				else{
					return {
						error: true,
						message: "Invalid password" 
					}
				}
			}
			else{
				return{
					error: true, 
					message: "Invalid password"
				}
			}
		}
		else{

			return{
				error: true, 
				message: "Something went wrong"
			}
		}
	},

	//global functions 
	/***********************************************************/

	//admin
	getUserIdByPassword: async function(password){

		const pass = await portal.encrypt(password);
		const query = "SELECT user_id FROM admin_users WHERE password = ?";
		const value = pass;
		
		const response = await db(query, value)
			.then(function(res){
				const len = res.message.length;
				if(len){
					return res.message[0].user_id;
				}
				else{
					return false;
				}
			})
			.catch(function(error){
				console.log(error);
				return false; 
			})

		return response;

	},
	checkIdExist: async function(id){

			const query = "SELECT COUNT(1) AS exist FROM users WHERE id = ?";
			const value = id;

			const response = await db(query, value)
				.then(function(res){
					return res.message[0].exist;
				})
				.catch(function(error){
					return false; 
				})

			return response;

		},


	//get user email by id
	getUserEmailbyId: async function(id){

		const query = "SELECT email FROM users WHERE id = ?";
		const value = id; 

		const response = await db(query, value)
			.then(function(res){
				const len = res.message.length;
				if(len){
					return res.message[0].email; 
				}
				else{
					return false; 
				}
			})
			.catch(function(error){
				return false; 
			})

		return response;

	},


	//get user id by emial
	getUserIdbyEmail: async function(email){

		const query = "SELECT id FROM users WHERE email = ?";
		const value = email; 

		const response = await db(query, value)
			.then(function(res){
				const len = res.message.length;
				if(len){
					return res.message[0].id; 
				}
				else{
					return false; 
				}
			})
			.catch(function(error){
				return false; 
			})

		return response;

	},
	checkEmialExist: async function(email){

		const query = "SELECT COUNT(1) AS exist FROM users WHERE email = ?";
		const value = email;

		const response = await db(query, value)
			.then(function(res){
				return res.message[0].exist;
			})
			.catch(function(error){
				return false; 
			})

		return response;

	},

	//return an object user: admin: 
	checkUserType: async function(email){

		const query = "SELECT admin, user FROM users WHERE email = ?";
		const value = email;
		const response = await db(query, value)
			.then(function(res){

				slen = res.message.length; 
				if(slen){
					return res.message[0];
				}
				else{
					return false;
				}
				
			})
			.catch(function(error){
				return false; 
			})
		return response;
	},

	/*
		Hash the string SHA256
		return the hash
	*/
	encrypt: async function(string){
		const hash = crypto.createHash('sha256').update(string).digest('hex');
		return hash; 
	},


}

module.exports = portal;
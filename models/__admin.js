
const {db} = require("../config/db/query");
const moment = require("moment"); 

//has Algo SHA2
var crypto = require('crypto');

const { registration, admin_registration } = require("../controllers/email");


const admin = {


	/* 	Account Management 
		registration
	*/

	/* Steps 
		1. check if the user email is already registered
	*/
	register: async function(data){

		data["admin"] =0;
		data["user"] = 0;

		if(data.user_type == "admin"){
			data["admin"] = 1; 
		}
		if(data.user_type == "user"){
			data["user"] = 1; 
		}

		const isExist = await admin.checkEmailExist(data.email);
		if(isExist){
			//2. check the user type 
			/* if the user type of the existing email is equals to new registry
				abort regisrtration and return error i
				if not update the user and the type of user 
			*/
			const userType = await admin.checkUserType(data.email);

			const user_type ={
				admin: 0,
				user: 0,
			}

			if(userType){

				if(userType.admin){
					user_type["admin"] =1; 
					if(data.admin){
						return{
							error: true,
							message: data.first_name+ " is already registered as admin if you want to register this user as normal user please change the user type and process the registration again",
						}
					}
				}

				if(userType.user){
					user_type["user"] =1; 
					if(data.user){
						return{
							error: true,
							message: data.first_name+" is already registered as user if you want to register this user as admin please change the user type and process the registration again",
						}
					}
				}

				//Update 
				if(data.admin){
					user_type["admin"] =1; 
				}

				if(data.user){
					user_type["user"] =1; 
				}


				const isUpdated = await admin.updateUserType(data.email, user_type)
				if(isUpdated){

					const id = await admin.getidbyEmail(data.email);
					if(id){

						const userData = {
							user: id,
							admin: data.admin_id,
							password: data.password,
						}


						if(data.user_type == "user"){
							admin.newAccountNotif(userData, "user");
						}

						 if(data.user_type == "admin"){

						 	await admin.saveAdminPassword(userData.user, data.password);
						 	admin.newAccountNotif(userData, "admin");
						 }

						return{
							error: false, 
							id: id,
							message:  data.first_name+" successfully registered as ["+data.user_type+"]", 
						}
					}
					else{
						return{
							error: true,
							message: "Something went wrong",
						}
					}
				}
				else{
					return{
						error: true,
						message: "Something went wrong",
					}
				}

			}else{

				return{
					error: true, 
					message: "Something went wrong please try again",
				}
			}

		}
		else{

			const response = await admin.saveNewUser(data); 
			if(response){

				const id = await admin.getidbyEmail(data.email);
				if(id){

					const userData = {
						user: id,
						admin: data.admin_id,
						password: data.password
					}

					if(data.user_type == "user"){
						admin.newAccountNotif(userData, "user");
					}
					if(data.user_type == "admin"){
						await admin.saveAdminPassword(userData.user, data.password);
					 	admin.newAccountNotif(userData, "admin");
					}

					 return{
					 	error: false,
					 	id: id,
					 	message:  data.first_name+" successfully registered as ["+data.user_type+"]", 
					 }

				}
				else{

					return{
						error: true, 
						message: "Something went wrong please try again"
					}
				}
				
			}
			else{
				return{
					error: true, 
					message: "Something went wrong on saving this credentials, Please try again"
				}
			}

		}
	},
	//email password user id
	updateAdmin: async function(data){

		//check email first

		const emailExist = await admin.checkEmailExist(data.email)
		if(emailExist){
			const adminData = await admin.getProfileById(data.user_id);
			if(adminData){
				if(adminData.email != data.email){
					return{
						error: true, 
						message: "This email address is already registered"
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
		
		 const emailUpdate = await admin.updateEmailbyId(data.user_id, data.email);
		 if(emailUpdate){

		 	const passwordUpadte = await admin.updatePassbyId(data.user_id, data.password);
		 	if(passwordUpadte){

		 		return {
		 			error: false,
		 			message: "successfully updated"
		 		}
		 	}
		 	else{

		 		return{
			 		error: true, 
			 		message: "We emcountered error on updating your password",
			 	}
		 	}
		 }
		 else{

		 	return{
		 		error: true, 
		 		message: "We emcountered error on updating your email address",
		 	}
		 }

	}, 
	newAccountNotif: async function(credentials, type){


		const user = await admin.getProfileById(credentials.user);
		const admin_data = await admin.getProfileById(credentials.admin);

		const data = {

			user_name: user.first_name,
			user_email: user.email, 
			admin_name: admin_data.first_name +" "+admin_data.last_name,
			password: credentials.password

		}

		if(type == "user"){
			registration(data);	
		}

		if(type == "admin"){
			admin_registration(data);
		}
	
	},
	emailChecker: async function(email){

		const user_type = await admin.checkUserType(email);
		return user_type;
	}, 
	getAdminProfile: async function(userId){

		const profile = await admin.getProfileById(userId);
		if(profile){
			return {
				error: false,
				data:{
					first_name: profile.first_name,
					last_name: profile.last_name, 
					image: profile.profile_picture
				}
			}
		}
		else{
			return{
				error: true, 
				message: "Something went wrong",
			}
		}

	},

	getAllUsersData: async function(userId){


		function yesOrNo(data){

			if(parseInt(data) == 1 ){
				return "Yes";
			}

			return"No";
		}

		const users = await admin.getAllUsers();
		if(users){

			const data = [];
			for(let a=0; a<users.length; a++){

				let self = 0;
				if(users[a].id == userId){
					self =1; 
				}

				data.push({
					id: users[a].id,
					created_at: moment(new Date(users[a].created_at)).format('ll'),
					first_name: users[a].first_name,
					last_name: users[a].last_name,
					email: users[a].email,
					admin: yesOrNo(users[a].admin),
					user: yesOrNo(users[a].user),
					self: self,
				})
			}

			return {
				error: false,
				data: data,
			}
		}
		else{
			return{
				error: true, 
				message: "Something went wrong",
			}
		}
	}, 

	deleteInitiate: async function(userId){

		const res = await admin.deleteUserbyId(userId);
		if(res){
			return{
				error: false
			}
		}
		else{
			return{
				error: true, 
				message:"Something went wrong",
			}
		}
	},


	//global query 
	/******************************************************************/

	updatePassbyId: async function(user_id, password){

		const pass = await admin.encrypt(password)
		const query = "UPDATE admin_users SET password = ? WHERE user_id = ?";
		const value = [pass, user_id];
		const response = await db(query, value)
			.then(function(res){
				return true;
			})
			.catch(function(error){
				console.log(error);
				return false; 
			})
		return response;
	}, 
	updateEmailbyId: async function(user_id, email){

		const query = "UPDATE users SET email = ? WHERE id = ?";
		const value = [email, user_id];
		const response = await db(query, value)
			.then(function(res){
				return true;
			})
			.catch(function(error){
				console.log(error);
				return false; 
			})
		return response;

	},
	saveAdminPassword: async function(user_id, password){

		const hash = await admin.encrypt(password);
		const query = "INSERT INTO admin_users SET user_id = ?, password = ?, created_at =?, updated_at = ?";
		const value = [user_id, hash, new Date(), new Date()];
		const response = await db(query, value)
			.then(function(res){
				return true;
			})
			.catch(function(error){
				console.log(error);
				return false; 
			})
		return response;
	}, 


	deleteUserbyId: async function(userId){

		const query = "DELETE FROM users WHERE id = ?";
		const value = userId; 
		const response = await db(query, value)
			.then(function(res){
				return true;
			})
			.catch(function(error){
				return false; 
			})
		return response;
	},

	getProfileById: async function(userId){

		const query = "SELECT * FROM users WHERE id = ?";
		const value = userId;

		const response = await db(query, value)
			.then(function(res){
				const len = res.message.length;
				if(len){
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

	// Update the user type
	updateUserType: async function(email, type){

		const query = "UPDATE users SET admin = ?, user = ? WHERE email = ?";
		const value = [type.admin, type.user, email];

		const response = await db(query, value)
			.then(function(res){
				return true;
			})
			.catch(function(error){
				return false; 
			})
		return response;
	}, 

	//check if th email is exist
	checkEmailExist: async function(email){

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

	//save the new user
	saveNewUser: async function(data){

		let profile_picture = '/img/male.png';
		if(data.gender == "female"){
			profile_picture = '/img/female.png';
		}

		const query = "INSERT INTO users SET first_name =?, last_name =?, email = ?, gender =?, admin = ?, user =?, profile_picture =?,  created_at = ?, updated_at = ? ";
		const value = [data.first_name, data.last_name, data.email, data.gender, data.admin, data.user, profile_picture,  new Date(), new Date()];
		const response = await db(query, value)
			.then(function(res){
				return true;
			})
			.catch(function(error){
				console.log(error);
				return false; 
			})

		return response;
	}, 
	//get all users 
	getAllUsers: async function(){

		const query = "SELECT * FROM users ORDER BY created_at DESC";
		const response = await db(query)
			.then(function(res){
				return res.message;
			})
			.catch(function(error){
				console.log(error);
				return false; 
			})
		return response;
	},
	//get id by email
	getidbyEmail: async function(email){

		const query = "SELECT id FROM users WHERE email = ?";
		const value = email;
		const response = await db(query, value)
			.then(function(res){
				const len = res.message[0].id;
				if(len){
					return res.message[0].id;
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

	/*
		Hash the string SHA256
		return the hash
	*/
	encrypt: async function(string){
		const hash = crypto.createHash('sha256').update(string).digest('hex');
		return hash; 
	},


}


module.exports = admin;
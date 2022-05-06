

const validator = require('validator');

const adminModel = require("../models/__admin");

const admin = {

	/* validator 

		Note 
		rgn field means register 
	*/
	validate: function(data, field){

		if(field == "rgn"){

			if(! validator.isLength(data.first_name, {min: 1, max: 20})){

				return{
					error: true,
					message: "Invalid First Name"
				}
			}
			if(! validator.isLength(data.last_name, {min: 1, max: 20})){

				return{
					error: true,
					message: "Invalid Last Name"
				}
			}

			if(! validator.isEmail(data.email)){
				return{
					error: true,
					message: "Invalid email address"
				}
			}

			if(! validator.isIn(data.user_type,["admin", "user"])){
				return{
					error: true,
					message: "Invalid user type"
				}
			}

			if(! validator.isIn(data.gender,["male", "female"])){
				return{
					error: true,
					message: "Invalid gender"
				}
			}
		}

		if(field == "admin"){


			if(! validator.isEmail(data.email)){
				return{
					error: true,
					message: "Invalid email address"
				}
			}

			if(! validator.isLength(data.password, {min: 1, max: 50})){

				return{
					error: true,
					message: "Invalid password"
				}
			}
		}
		return {
			error: false,
		}

	}, 
	updateAdmin: async function(req, res){

		const data = req.body.data;
		const is = admin.validate(data, "admin");
		data["user_id"] = req.session.user_id; 

		if(! is.error){

			const response = await adminModel.updateAdmin(data);
			res.json(response);
		}
		else{
			res.json(is);
		}
		
	}, 
	getEmail: async function(req, res){

		const id = req.session.user_id;
		const data = await adminModel.getProfileById(id);
		if(data){
			res.json(data.email);
		}
	}, 
	emailListener: async function(req, res){

		const email = req.body.email;
		const response = await adminModel.emailChecker(email); 
		res.json(response);
	},

	/*Account Management
	  Registration process
	*/
	registerAccount: function(req, res){

		res.render("admin/account/register"); 
	},
	crateAccount: async function(req, res){

		const data = req.body.data;
		data["admin_id"] = req.session.user_id;
		data["password"] = "admin";

		const is = admin.validate(data, "rgn");

		if(! is.error){
			const response = await adminModel.register(data);
			res.json(response);
		}
		else{
			res.json(is);
		}
	},

	adminRegister: async function(req, res){

		const data = req.body.data;	
		const is = admin.validate(data, "rgn");

		if(! is.error){
			const response = await adminModel.register(data);
			if(! response.error){

				req.session.user_id = response.id;
				req.session.auth = data.user_type;
				res.json(response);
			}
			else{
				res.json(response);
			}
		}
		else{
			res.json(is);
		}

	},
	/* Account Management 
	   Viw all the accounts 
	*/
	viewAccounts: function(req, res){
		res.render("admin/account/users")
	},

	/* Account Management
		view the admin account option
	*/
	viewAdmin: function(req, res){
		res.render("admin/account/main");
	},


	/* Get the user self profile  */
	selfProfile: async function(req, res){
		
		const userId = req.session.user_id;
		const response = await adminModel.getAdminProfile(userId);
		res.json(response);
	}, 

	//get all users 
	getAllUsers: async function(req, res){

		const userId = req.session.user_id; 
		const response = await adminModel.getAllUsersData(userId);
		res.json(response);
	}, 

	deleteUsers: async function(req, res){

		const user_id = req.body.selected_id;
		const response = await adminModel.deleteInitiate(user_id);
		res.json(response);
	}, 
}


module.exports = admin; 
const validator = require('validator');
const portalModel = require("../models/__portal");


const main = {

	//admin portal 
	admin_auth: function(req, res){

		const email = req.params.email;
		res.render("admin_auth", {email});
	}, 

	//signout 
	logout: function(req, res){

		req.session.destroy( function(error){
			
			res.clearCookie('sid');
			res.redirect("/");
		})
	},

	/*	Render the main  page 
	*/
	portal: function(req, res){
		res.render("portal"); 
	},

	validate: function(data, field){
		if(field == "email"){
			if( !validator.isEmail(data)){
				return false;
			}
		}

		if(field == "entry"){
			if( ! validator.isAlphanumeric(data)){
				return false;
			}
		}
		return true; 
	},
	/* Entry set up 
	*/
	entry: async function(req, res){

		const data = req.body.data;

		const isValid = main.validate(data.user_id, "entry");
		if(isValid){
			const response = await portalModel.entry(data);
			if(! response.error){

				if(data.user_type == "user"){

					//create the session here 
					req.session.user_id = data.user_id;
					req.session.auth = data.user_type;

					res.json({
						error: false,
						redirect: "/",
					})
				}
				else{

					res.json({
						error: false, 
						redirect: "/user/admin/auth/"+response.email
					})
				}


			}
			else{
				res.json(response);
			}
		}
		else{

			return{
				error: true, 
				message: "Invalid user id",
			}
		}

	},

	/* Render the option 
	*/
	barier: function(req, res){

		const user_id = req.params.userId; 
		res.render("barier", {user_id});
	},

	/* Login 
	*/
	login: async function(req, res){

		const email = req.body.email;
		const isValid = main.validate(email, "email");
		if(isValid){
			const response = await portalModel.login(email); 
		
			if( ! response.error){
				if(response.user_type == "user"){

					//create the session here 
					req.session.user_id = response.user_id;
					req.session.auth = response.user_type;

					res.json(response);
				}
				else{
					res.json(response);
				}
			}
			else{
				res.json(response);
			}
		}
		else{

			res.json({
				error: true, 
				message: "Invalid email address"
			})
		}
	},
	admin_login: async function(req, res){

		const data = req.body.data;
		const isValid = main.validate(data.email, "email");
		if(isValid){

			const response = await portalModel.adminLogin(data);
			if(response.error){
				res.json(response);
			}
			else{
				req.session.user_id = response.user_id;
				req.session.auth = response.user_type;
				res.json(response);
			}
		}
		else{
			res.json({
				error: false, 
				message: "Email is Invalid"
			})
		}

	}


}

module.exports = main;
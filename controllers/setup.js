
const setupModel = require("../models/__setup");
const validator = require('validator');

const setup ={

	checkadmin: async function(){
		const res = await setupModel.checkAdminExist();
		return res;
	},
	start: function(req, res){

		res.render("setup/start");
	},
	adminSetup: function(req, res){

		res.render("setup/form");
	},
	auth: function(req, res){

		const password = req.body.password;

		if(validator.equals(password, "solus2021")){
			res.json({
				error: false,
				code: "rightkey"
			});
		}
		else{
			res.json({
				error: true,
				message: "Invalid code",
			})
		}
	},
	setup: function(req, res){

		const code = req.params.code;
		if(validator.equals(code, "rightkey")){
			res.render("setup/form");
		}
		else{
			res.send("We detected anusual access");
		}
	}

}


module.exports = setup;
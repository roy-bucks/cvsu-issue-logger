
/* Security Features all Middleware 
	prevent from user access on diffeent webpages
*/

const { checkadmin } = require("../controllers/setup");

const main = {

	setup: async function(req, res, next){

		const admin = await checkadmin();

		if(admin.error){
			res.send(admin.message);
		}
		else{
			if(admin.exist){
				next();
			}
			else{
				
				res.redirect("/setup/start");
				return;
			}
		}

	},
	home: function(req,res, next){

		if(req.session.user_id){

			const access = req.session.auth;

			if(access == "admin"){

				res.redirect("/admin/ticket/all");
				return;
			}

			if(access == "user"){

				res.redirect("/user/ticket/create");
				return;
			}

			res.send("Something went wrong");
		}
		else{
			next();
		}

	}, 
	admin: function(req, res, next){

		const access = req.session.auth;

		if(req.session.user_id){
			if( access != "admin"){
				// res.send("You are trying to go in at admin and you are not authorized");
				res.redirect("/");
			}
			else{
				next();
			}
		}
		else{
			res.redirect("/");
		}

	}, 
	user: function(req, res, next){

		const access = req.session.auth;

		if(req.session.user_id){
			if( access != "user"){
				// res.send("You are trying to access the user and u r not authorized here");
				res.redirect("/");
			}
			else{
				next(); 
			}
		}
		else{

			res.redirect("/");
		}

	}, 

	auth: function(req, res, next){

		if(req.session.user_id){
			next();
		}
		else{
			res.send("You do not have access");
		}
	}


}


module.exports = main;
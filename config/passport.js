const GoogleStrategy = require('passport-google-oauth20').Strategy;

//import the env file for session secret
const path=require("path");


//Import the user_module Model
const UserModel = require("../models/__user");

module.exports = function(passport){

	passport.use(new GoogleStrategy({
			clientID: "367134849558-63luah58q74kib71g6j300h4fnvs6n5g.apps.googleusercontent.com", 
			clientSecret: "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", 
			callbackURL: "/users/googleauth/callback",
	},

	async function(token, tokenSecret, profile, done){
		const user = {
			id: profile.id,
			first_name: profile.name.givenName,
			last_name: profile.name.familyName,
			profile_pic: profile.photos[0].value,
			email: profile.emails[0].value,
			email_verified: 1,
			admin: 0, 
			user: 1, 
			gender: 0,
		}
        const domain = user.email.split("@"); 
		
		if(domain[1] == "cvsu.edu.ph"){
			//check if the email already registered
			const isExist = await UserModel.checkUserExist(user.email);
			if(!isExist){
				//save the user
				const save = await UserModel.saveNewUser(user); 
				
				if(save){
					//succesfully save
					const user_id = await UserModel.getUserIdbyEmail(user.email);
					user['id'] = user_id;
					return done(null, user);
				}
				else{
					//not save
					return done(null, false, {message: "Access denied!"});
				}
			}
			else{

				//succesfully save
				const user_id = await UserModel.getUserIdbyEmail(user.email);
				user['id'] = user_id;

				//proceed to login
				return done(null, user);
			}
		}
		else{
			return done(null, false, {message: "Access denied!"});
		}
	}));
	passport.serializeUser(function(user, done) {
	  done(null, user);
	});

	passport.deserializeUser(function(user, done) {
	  done(null, user);
	});



}
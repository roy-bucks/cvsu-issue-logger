const nodemailer = require("nodemailer");
const {smtp_config} = require("../config/nodeMailer/config");


const email = {

	/* registration 
		data ={
			user_name:
			user_email: 
			admin_name:
		}
	*/
	registration: function(data){

		let content = "<strong>Hi "+data.user_name+",</strong>";
			content += "<p>The admin successfully created your account at Issue Logger System. Please use your email address to login</p>";
			content += "<p>If you encountered any issue with the Orbit Tool, please submit a ticket to this link https://cvsu-ccat-issue-logger.com/  so we can help you resolve your CvSU CCAT related issue  </p>";
			content += "<p>Thanks, <br>Orbit WorkFlow Team</p><hr><span>This is automated email, Please do not reply</span>";

		let tranpost_config = smtp_config();
		let transporter = nodemailer.createTransport(tranpost_config);

		const mailOptions = {
		    from: '"Issue Logger" <centralproject>', 
		    to: data.user_email, 
		    subject: 'CvSU CCAT -issue logger', 
		    html: content
		};

		transporter.sendMail(mailOptions, function (err, info) {

			console.log(info);
			

		    if(err){
		        console.log(err)
		    }
		})
	},

	/* Admin registration 
		data ={
			user_name:
			user_email: 
			admin_name:
			password:
		}
	*/
	admin_registration: function(data){

		let content = "<strong>Hi "+data.user_name+",</strong><br><br>";
			content += "<span>Your email address successfully registered as admin at Issue Logger. </span>";
			content += "<span>Plase go to https://cvsu-ccat-issue-logger.com/ and login as admin and use this following credentials. </span><br><br>";
			content += "<span>Email: "+data.user_email+"</span><br>";
			content += "<span>Password: "+data.password+"</span><br>";
			content += "<p>Thanks, <br>Orbit WorkFlow Team</p><hr><span>This is automated email, please do not reply.</span>";

		let tranpost_config = smtp_config();
		let transporter = nodemailer.createTransport(tranpost_config);

		const mailOptions = {
		    from: '"Issue Logger" <centralproject>', 
		    to: data.user_email, 
		    subject: 'CvSU CCAT -issue logger', 
		    html: content
		};

		transporter.sendMail(mailOptions, function (err, info) {
		    if(err){
		        console.log(err)
		    }
		})
	},


	/*	Admin Notification when the new ticket arrived

		param
		data:{
			subject:
			ticket_id:
			priority:
			admin_email: //array
		}
	*/
	admin_notif: function(data){

		let	content = "<span>New ticket arrived, to view the submitted ticket  <a href='https://cvsu-ccat-issue-logger.com/'>click here</a> </span><br>";
			content += "<span>Ticket basic details </span><br><br>";
			content += "<span>Ticket Id: "+data.ticket_id+"</span><br>";
			content += "<span>Subject: "+data.subject+"</span><br>";
			content += "<span>Priority Level: "+data.priority+"</span><br>";
			content += "<p>Thanks, <br>This is automated email, please do not reply/</p>";

		let tranpost_config = smtp_config();
		let transporter = nodemailer.createTransport(tranpost_config);

		const mailOptions = {
		    from: '"Issue Logger" <centralproject>', 
		    to: data.admin_emails, 
		    subject: 'New Ticked Arrived', 
		    html: content
		};

		transporter.sendMail(mailOptions, function (err, info) {
		    if(err){
		        console.log(err)
		    }
		})
	},


}


module.exports = email; 
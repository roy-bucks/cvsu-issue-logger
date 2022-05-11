const {db} = require("../config/db/query");

const { admin_notif } = require("../controllers/email");

const user = {


	//get user profile by id
	getUserById: async function(user_id){

		const query = "SELECT * FROM users WHERE id = ?";
		const value = user_id;
		
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
				console.log(error);
				return false; 
			})
		return response;
	}, 

	//send notif to the admin once new ticket submitted
	sendAdminNotif: async function(data){

		const emails = await user.getAllAdminEmailAddress();

		if(emails){
			const email_data ={
				ticket_id: data.ticket_id,
				subject: data.issue, 
				priority: data.priority,
				admin_emails: emails,
			}

			admin_notif(email_data);
		}
		else{

		}


	}, 
	saveTicketInitalize: async function(data){

		const res = await user.saveTicket(data);
		if(res){

			const daTa = {
				ticket_id: res,
				user_id: data.user_id,
				subject: "Ticket Submitted",
				details: "waiting to process the issue",
				status: "pending"
			}
			await user.userUpdateTicketTrack(daTa);

			data["ticket_id"] = res;
			await user.sendAdminNotif(data);

			return{
				error: false, 
				message: "Ticket Submitted",
			}
		}
		else{
			return{
				error: true, 
				message: "Failed to submit the ticket"
			}
		}
	}, 
	//this return the ticet id after the succesfully save the ticket
	saveTicket: async function(data){
		const ticket_id = await user.generateTicketNumber();
		const query = "INSERT INTO issues SET user_id = ?, issue_id = ?, priority= ?, course = ?, admin_instruc = ?, file = ?, issue = ?, description = ?, status = ?, active =?, created_at = ?, updated_at = ? "; 
		const value = [ data.user_id, ticket_id, data.priority, data.course, data.admin_instruc, data.file , data.issue, data.description, "open", 0,  new Date(), new Date()];
		const response = await db(query, value)
			.then(function(res){
				return ticket_id;
			})
			.catch(function(error){
				console.log(error);
				return false; 
			})
		return response;
	}, 

	//User upadate the ticket trakc
	userUpdateTicketTrack: async function(data){

		const query = "INSERT INTO ticket_track SET ticket_id = ?, subject = ?, details = ?, handle_user_id =?, status = ?,  created_at = ?, updated_at = ?";
		const value = [data.ticket_id, data.subject, data.details, data.user_id, data.status,  new Date(), new Date()];
		const response = await db(query, value)
			.then(function(res){
				return true;
			})
			.catch(function(error){
				return false; 
			})
		return response;
	}, 


	generateTicketNumber: async function(){

		let generate = '';

		async function retry(){
			let randomNumber = user.NumRandomGenerator(5);
			ticketId = "ISSUE-"+randomNumber;

			const idExist = await user.checkTicketIdExist(ticketId); 
			return {
				exist: idExist,
				id: ticketId,
			};
		}

		do{
			generate = await retry();	
		}
		while(generate.exist);
		return generate.id;
	}, 
	NumRandomGenerator: function(length){
	    let result           = '';
	    let characters       = '0123456789';
	    let charactersLength = characters.length;
	    for ( let i = 0; i < length; i++ ) {
	      result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result.toUpperCase();
	},
	checkTicketIdExist: async function(id){

		const query = "SELECT COUNT(1) AS exist FROM tickets WHERE ticket_id = ?";
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

	//count the active ticket of the user
	activeTickets: async function(userid){

		const query = "SELECT COUNT(1) AS active FROM issues WHERE user_id = ? and status != ?";
		const value = [userid, "close"];
		const response = await db(query, value)
			.then(function(res){
				return res.message[0].active;
			})
			.catch(function(error){
				console.log(error);
				return false; 
			})
		return response;
	}, 
	getAllTicketsById: async function(userid){

		const query = "SELECT * FROM issues WHERE user_id = ? ORDER BY updated_at DESC";
		const value = userid;
		const response = await db(query, value)
			.then(function(res){
				const len = res.message.length;
				if(len){
					return res.message;
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
	getAllAdminEmailAddress: async function(){

		const query ="SELECT email FROM users WHERE admin = ?";
		const value = 1;
		const response = await db(query, value)
			.then(function(res){

				const len = res.message.length;
				if(len){
					let emails = [];
					for(let a=0; a<res.message.length; a++){
						emails.push(res.message[a].email);
					}
					return emails;
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

	//check if the user exist
	checkUserExist: async function(email){

		const query = "SELECT COUNT(id) as exist FROM users WHERE email = ?"; 
		const value = email;
		const response = await db(query, value)
			.then(function(res){	
				return  res.message[0].exist; 
			})
			.catch(function(error){
				console.log(error);
				return false;
			})

		return response;
	}, 
	//save the new user
	saveNewUser: async function(data){

		const query = "INSERT INTO users SET first_name = ?, last_name = ?, email = ?, gender = ?, admin = ? , user= ?, profile_picture = ?,  created_at = ?, updated_at = ? "; 
		const value = [data.first_name, data.last_name, data.email, data.gender, data.admin, data.user, data.profile_pic, new Date(), new Date() ]; 
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

	//get the user id by email 
	getUserIdbyEmail: async function(email){

		const query = "SELECT id FROM users WHERE email = ?";
		const value = email; 
		const response = await db(query, value)
			.then(function(res){
				return res.message[0].id;
			})
			.catch(function(error){
				console.log(error);
				return false;
			})

		return response;
	}
} 

module.exports = user; 

const {db} = require("../config/db/query");
const moment = require("moment"); 

const admin = {

	ticketsCount: async function(){

		let open = 0, on_hold =0, close =0;
		const tickets = await admin.getAllTickets();
		if(!tickets.error){
			for(let a=0; a<tickets.data.length; a++){

				if(tickets.data[a].status == "open"){
					open++;
				}
				if(tickets.data[a].status == "On Hold"){
					on_hold++;
				}
				if(tickets.data[a].status == "Closed"){
					close++;
				}
			}
		}

		let total = 0;
		if(tickets.data.length){
			total = tickets.data.length;
		}
		return{
			open: open,
			on_hold: on_hold, 
			close: close,
			total: total,
		}
	},
	searchTicket: async function(ticket_id){
		
		const tickets = await admin.getLikeTicketById(ticket_id);
		if(! tickets.error){
			if(tickets.data){

				const data =[];
				for(let a=0; a<tickets.data.length; a++){
					let name ='-';
						const getName = await admin.getProfileById(tickets.data[a].active);
						if(getName){
							name = getName.first_name +" "+getName.last_name;
						}
					data.push({
						ticket_id: tickets.data[a].ticket_id,
						status: tickets.data[a].status,
						subject: tickets.data[a].issue,
						created_at: moment( new Date(tickets.data[a].created_at)).format('lll'),
						updated_at: moment( new Date(tickets.data[a].updated_at)).format('lll'),
						description: tickets.data[a].description,
						erp: tickets.data[a].erp,
						assigned: name
					})
				}
				return{
					error: false,
					data: data
				}
			}
			else{
				return{
					error: false, 
					data: false, 
				}
			}
		}
		else{
			return{
				error: true, 
			}
		}

	},
	// get all the new tickets 
	getNewTickets: async function(){

		const data = []; 
		const tickets = await admin.getAllTickets();

		if(! tickets.error){
			if(tickets.data){
				for(let a=0; a<tickets.data.length; a++){
					if(tickets.data[a].status == "open"){
						
						let name ='-';
						const getName = await admin.getProfileById(tickets.data[a].user_id);
						if(getName){
							name = getName.first_name +" "+getName.last_name;
						}
						
						data.push({

							 user_id: tickets.data[a].user_id,
							 created_by: name,
							 created_at: moment(new Date(tickets.data[a].created_at)).format('lll'),
							 priority: tickets.data[a].priority,
							 issue: tickets.data[a].issue, 
							 ticket_id: tickets.data[a].issue_id
						})
					}
				}

				return {
					error: false,
					data: data,
				}
			}
			else{
				return{
					error: false, 
					data: false, 
					message: "No tickets found"
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
	getTicketData: async function(daTa){

		const ticket = await admin.getTicketById(daTa.ticket_id);
		if(! ticket.error){
			if(ticket.data){
				
				const data = ticket.data[0];
				const getName = await admin.getProfileById(data.user_id);
				if(getName){
					data["created_by"] = getName.first_name +" "+ getName.last_name;
				}
				else{

					data["created_by"] ='-'
				}

				return {
					error: false, 
					data: data,
				}
			}
			else{
				return{
					error: false, 
					data: false, 
					message: "No tickets found"
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
	updateTicketTrack: async function(data){

		if(data.status == "On Hold"){
			const daTa = {
				ticket_id: data.ticket_id,
				user_id: data.admin_id,
				subject: "Ticket on Hold",
				details: data.response,
				status: "On hold"
			}
			await admin.userUpdateTicketTrack(daTa);
		}

		if(data.status == "Closed"){
			const daTa = {
				ticket_id: data.ticket_id,
				user_id: data.admin_id,
				subject: "Ticket in Closed",
				details: data.response,
				status: "In Closed"
			}
			await admin.userUpdateTicketTrack(daTa);
		}

	},
	processTicket: async function(data){
		// update the status
		const statusUpadte = await admin.updateTicketStatusbyId(data.ticket_id, data.new_status);
		if(statusUpadte){

			// set the response
			const adminResponse = await admin.setTheAdminResponse(data);
			if(adminResponse){

				//Update the track 

				const daTa ={
					ticket_id: data.ticket_id,
					admin_id: data.admin_id,
					status:  data.new_status,
					response: data.response
				}

				await admin.updateTicketTrack(daTa);

				return{
					error: false, 
					message: "Processed"
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
				message: "Something went wrong", 
			}
		}
	},
	getAllTicketsInitiate: async function(){

		const tickets = await admin.getAllTickets();
		if(! tickets.error){
			if(tickets.data){

				const data =[];
				for(let a=0; a<tickets.data.length; a++){
					let name ='-';
						const getName = await admin.getProfileById(tickets.data[a].active);
						if(getName){
							name = getName.first_name +" "+getName.last_name;
						}
					data.push({
						ticket_id: tickets.data[a].issue_id,
						status: tickets.data[a].status,
						subject: tickets.data[a].issue,
						created_at: moment( new Date(tickets.data[a].created_at)).format('lll'),
						updated_at: moment( new Date(tickets.data[a].updated_at)).format('lll'),
						assigned: name,
						description: tickets.data[a].description,
					})
				}
				return{
					error: false,
					data: data
				}
			}
			else{
				return{
					error: false, 
					data: false, 
				}
			}
		}
		else{
			return{
				error: true, 
			}
		}
	}, 
	updateTicket: async function(data){
		const isUpdated = await admin.updateTicketStatusbyId(data.ticket_id, data.new_status);
		if(isUpdated){
			const daTa ={
				ticket_id: data.ticket_id,
				admin_id: data.admin_id,
				status:  data.new_status,
				response: data.response
			}
			await admin.updateTicketTrack(daTa);

			return{
				error: false, 
				message: "Updated"
			}
		}
		else{
			return{
				error: true, 
				message: "Something went wrong"
			}
		}
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
	/*
		How this works?
		If active true means other admin is viewing the ticket
		active false means no one is viewing the ticket
	*/
	setCheckTicket: async function(data){

		const ticketActive = await admin.checkTicketActive(data.ticket_id);

		if(ticketActive){

			if(ticketActive == data.admin_id || ticketActive == "0"){

				const setActive = await admin.setTicketActive(data);
				if(setActive){
					return{
						error: false,
						active: false, 
						message: "You are assigned on this ticket"
					}
				}
				else{
					return{
						error: true,
						active: true,
						message: "We encountered error"
					}
				}
			}
			else{
				return{
					error: false,
					active: true, 
					message: "Someone is viewing this ticket rn",
				}
			}
		}
		else{
			return{
				error: true,
				active: true,
				message: "We encountered error",  
			}
		}
	}, 

	ticketDisactivate: async function(data){

		const ticketActive = await admin.checkTicketActive(data.ticket_id);

		if(ticketActive){
			if(ticketActive == data.admin_id){
				data["admin_id"] = '0';
				await admin.setTicketActive(data);
			}
		}
	}, 

	getTickets: async function(data){

		const tickets = await admin.getTicketsDetailsBYid(data.admin_id, data.status);
		if( !tickets.error){
			if(tickets.data){
				const data =[];
				for(let a=0; a<tickets.data.length; a++){						
						let name ='-';
						const getName = await admin.getProfileById(tickets.data[a].user_id);
						if(getName){
							name = getName.first_name +" "+getName.last_name;
						}
						
						data.push({

							 user_id: tickets.data[a].user_id,
							 created_by: name,
							 created_at: moment(new Date(tickets.data[a].created_at)).format('lll'),
							 priority: tickets.data[a].priority,
							 issue: tickets.data[a].issue, 
							 ticket_id: tickets.data[a].issue_id
						})
				}
				return {
					error: false,
					data: data,
				}
			}
			else{
				return{
					error: false,
					data: false, 
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
	//******************************************Global
	getTicketsDetailsBYid: async function(admin_id, status){
		const query = "SELECT issues.issue_id, issues.created_at, issues.user_id, issues.priority, issues.issue FROM issues INNER JOIN admin_response ON admin_response.ticket_id = issues.issue_id WHERE admin_response.admin_id = ? AND issues.status = ?";
		const value = [admin_id, status]

		const response = await db(query, value)
			.then(function(res){
				const len = res.message.length;
				if(len){
					return{
						error:false, 
						data: res.message, 
					}
				}
				else{
					return{
						error: false, 
						data: false, 
					}
				}
			})
			.catch(function(error){
				console.log(error);
				return{
					error: true, 
				};
			})
		return response;

	},

	//set the view ticket to active
	setTicketActive: async function(data){
		const query = "UPDATE issues SET active = ? WHERE issue_id = ?";
		const value = [data.admin_id, data.ticket_id];
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

	//check if the ticket is view 
	checkTicketActive: async function(ticket_id){

		const query = "SELECT active FROM issues WHERE issue_id = ?";
		const value = ticket_id;
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
	setTheAdminResponse: async function(data){

		const query = "INSERT INTO admin_response SET ticket_id = ?, admin_id =?, admin_name = ?, created_at =?, updated_at =? ";
		const value = [data.ticket_id, data.admin_id, data.admin_name, new Date(), new Date()];
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
	updateTicketStatusbyId: async function(ticket_id, new_status){

		const query = "UPDATE issues SET status = ?, updated_at = ? WHERE issue_id = ?";
		const value = [new_status, new Date(), ticket_id]; 
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
	getTicketById: async function(id){

		const query = "SELECT * FROM issues WHERE issue_id = ?";
		const value = id; 
		const response = await db(query, value)
			.then(function(res){
				const len = res.message.length;
				if(len){
					return{
						error: false,
						data: res.message, 
					}
				}
				else{
					return{
						error: false, 
						data: false, 
					}
				}
			})
			.catch(function(error){
				console.log(error);
				return{
					error: true, 
				}
			})
		return response;
	}, 
	getLikeTicketById: async function(id){

		const query = "SELECT * FROM tickets WHERE ticket_id LIKE ?";
		const value = '%' + id + '%'; 
		const response = await db(query, value)
			.then(function(res){

				const len = res.message.length;
				if(len){
					return{
						error: false,
						data: res.message, 
					}
				}
				else{
					return{
						error: false, 
						data: false, 
					}
				}
			})
			.catch(function(error){
				console.log(error);
				return{
					error: true, 
				}
			})
		return response;
	},
	getAllTickets: async function(){

		const query = "SELECT * FROM issues ORDER BY created_at DESC";
		const response = await db(query)
			.then(function(res){
				const len = res.message.length;
				if(len){
					return{
						error: false,
						data: res.message, 
					}
				}
				else{
					return{
						error: false, 
						data: false, 
					}
				}
			})
			.catch(function(error){
				console.log(error);
				return{
					error: true, 
				}
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

	//ticket track

	trackTicket: async function(ticket_id){


		const details = await admin.getTrackDetailsById(ticket_id);

		if(details){

			const data = [];
			for(let a=0; a<details.length; a++){

				let name = '-';
				const userDetails = await admin.getProfileById(details[a].handle_user_id);
				if(userDetails){
					name = userDetails.first_name + " "+ userDetails.last_name;
				}

				data.push({
					subject: details[a].subject,
					details: details[a].details, 
					status: details[a].status, 
					created_date: moment(new Date(details[a].created_at)).format('LT'),
					created_time: moment(new Date(details[a].created_at)).format('ll'),
					name: name
				})
			}

			return{
				error: false, 
				data: data
			}

		}
		else{
			return{
				error: true, 
			}
		}


	}, 

	getTrackDetailsById: async function(ticket_id){
		const query = "SELECT * FROM ticket_track WHERE ticket_id = ? ORDER BY created_at DESC";
		const value = ticket_id;
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
				return false; 
			})
		return response;
	}

}


module.exports = admin; 
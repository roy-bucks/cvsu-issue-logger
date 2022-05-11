

const validator = require('validator');

const adminTicketModel = require("../models/__adminTicket");

const admin = {

	//render the new tickets 
	new_tickets: function(req, res){
		res.render("admin/ticket/new_tickets"); 
	}, 

	//get all the tickets count 
	count: async function(req, res){
		const data = await adminTicketModel.ticketsCount(); 
		res.json(data);
	}, 
	getAlNew: async function(req, res){
		const data = await adminTicketModel.getNewTickets();

		res.json(data); 
	},
	getTicketData: async function(req, res){
		const data = {
			ticket_id: req.body.ticket_id,
			admin_id: req.session.user_id,
		} 
		const response = await adminTicketModel.getTicketData(data);
		
		res.json(response);
	},
	processTicket: async function(req, res){

		const data = req.body.data;
		data["admin_id"] = req.session.user_id;
		
		const response = await adminTicketModel.processTicket(data);
		res.json(response);
	},
	setCheckTicket: async function(req, res){

		const data = {
			ticket_id: req.body.ticket_id,
			admin_id: req.session.user_id, 
		}

		const response = await adminTicketModel.setCheckTicket(data); 
		res.json(response); 
	}, 



	//On hold tickets 
	getOnHold: function(req, res){

		res.render("admin/ticket/on_hold"); 
	},
	//disactivate mechanism
	ticketDisactivate: async function(req, res){
		const data = {
			ticket_id: req.body.ticket_id,
			admin_id: req.session.user_id,
		}

		await adminTicketModel.ticketDisactivate(data); 
	},


	//***********************************On hold tickets 
	getOnHoldTickets: async function(req, res){

		const data ={
			admin_id: req.session.user_id,
			status: "On Hold"
		}
		const response = await adminTicketModel.getTickets(data);
		res.json(response);  
	}, 
	updateProcess: async function(req, res){
		 const data = req.body.data;
		 data["admin_id"] = req.session.user_id;
		 const response = await adminTicketModel.updateTicket(data); 
		 res.json(response);
	}, 


	//***************************************In close
	getInClose: async function(req, res){
		res.render("admin/ticket/in_close"); 
	}, 

	getInCloseTickets: async function(req,res){
		const data ={
			admin_id: req.session.user_id,
			status: "Closed"
		}
		const response = await adminTicketModel.getTickets(data);
		res.json(response); 
	}, 

	trackTicket: async function(req, res){
		const ticket_id = req.body.ticket_id;
		const response = await adminTicketModel.trackTicket(ticket_id);
		res.json(response);  
	},



	//******************************************All ticket
	adminGetAllTicket: async function(req, res){
		res.render("admin/ticket/all_tickets")
	}, 
	getAllTickets: async function(req, res){

		const response = await adminTicketModel.getAllTicketsInitiate(); 
		res.json(response);
	},

	searchTicket: async function(req, res){

		const ticket_id = req.body.ticket_id;
		
		const response = await adminTicketModel.searchTicket(ticket_id);
		res.json(response);
	}




}



module.exports = admin; 
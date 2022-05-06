
const userModel = require("../models/__user");

const multer  = require('multer');

const storage = multer.diskStorage({
				  destination: function (req, file, cb) {
				    cb(null, 'assets/upload')
				  },
				   filename: function (req, file, cb) {        
				        // null as first argument means no error
				        let fileUpload = file.originalname;
				        const FileName = fileUpload.replace(' ', '-').toLowerCase();
				        cb(null, Date.now() + '-' + FileName)
				    }
				})

const upload = multer({ storage: storage })

const users = {
	
	//file upload
	fileUploadMiddleware: upload.single('file'),

	createTicket: function(req, res){
		res.render("user/ticket/create");
	}, 
	viewTicket: function(req, res){
		res.render("user/ticket/view"); 
	}, 
	getProfile: async function(req, res){

		const user_id = req.session.user_id;
		const response = await userModel.getUserById(user_id);

		if(response){
			res.json({
				first_name: response.first_name,
				last_name: response.last_name,
				profile: response.profile_picture, 
			})
		}
	},
	submitTicket: async function(req, res){
		const data = JSON.parse(req.body.data);
		if(req.file){
			data["file"] = req.file.path.replace(/\\/g, "/").substring("public".length); 	
		}
		else{
			data["file"] = ''
		}
		data["user_id"] = req.session.user_id;

		const response = await userModel.saveTicketInitalize(data); 
		res.json(response);
	},

	activeTickets: async function(req, res){

		const user_id = req.session.user_id;
		const count = await userModel.activeTickets(user_id); 
		res.json(count);
	},
	getAllTickets: async function(req, res){

		const user_id  = req.session.user_id;
		const data = await userModel.getAllTicketsById(user_id)
		res.json(data);
	}
}

module.exports = users; 
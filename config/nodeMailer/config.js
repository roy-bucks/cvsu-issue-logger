
const email = {
	
	smtp_config: function(){
		return{
			service: 'gmail',
			secure: false,
    		port: 465,
			auth: {
				user: 'centralproject001@gmail.com',
				pass:  'cgigpfawzjpxtpbn',
			}
		}

	},

}
module.exports = email;
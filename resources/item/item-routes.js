const auth = require('../../helpers/auth/middleware');

module.exports = (app)=>{
	
	app.get('/items', auth,(req, res)=>{
		
		res.send(['items']);
	});
	
};
const controller = require('./account-controller');
const auth = require('../../helpers/auth/middleware');

module.exports = (app)=>{
	
	
	app.post('/account/login', controller.login);
	
	app.post('/account/checkLogin', auth ,controller.checkLogin);
	
	app.post('/account', controller.register);
		
};
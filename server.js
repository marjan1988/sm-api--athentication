const express 	= require('express');
const server 	= express();
const chalk		= require('chalk');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const auth = require('./helpers/auth/middleware');

//server.use(auth);

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended:true}));
server.use(expressValidator());


exports.init = ()=>{
	
	server.listen(3000, ()=>{
		
		console.log(chalk.green('All is well'));
});
	return server;
};

exports.getServer = ()=>{
	
	
};  
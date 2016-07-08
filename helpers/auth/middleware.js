'use strict';

const mongoose	 = require('mongoose');
const aclList 	 = require('../../config/acl');
const _ 		 = require('lodash');	

module.exports = (req, res, next)=>{
	
	console.log('Method: ', req.method);
	console.log('Path: ', req.path);
	
	const AccountModel = mongoose.model('Account');
	
	const token = req.headers.authorization;
	
	AccountModel.findOne({'tokens.value':token})
		.then((doc)=>{
		
		const isAllowed = checkAccess(req, doc)
		
		if(!doc){
			next('Failed');
		}else if(isAllowed){
			req.account = doc;
			next();
		}else{
			next('Not allowed');
		}
		
	});
	
};

function checkAccess(req, accountDoc){
	
	const method 	= req.method.toLowerCase();
	const path 		= req.path;
	const role 		= accountDoc.role;
	let allowed 	= false;
	
	_.each(aclList, (aclItem, i)=>{
		
		if(aclItem.role === role){
			
			_.each(aclItem.methods, (_method, i)=>{
				
				if(_method === method && path === aclItem.path){
					
					allowed = true;
				}
			});
		}
		
	});
	
	return allowed;
};
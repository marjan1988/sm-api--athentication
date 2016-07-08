const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const randToken = require('rand-token');

const AccountModel = mongoose.model('Account');

exports.register = (req, res)=>{
	
			//console.log(req.body);
		/*
		requiramo v server.js in ga nastavimo kot MIDDLEWARE na server.use(expressValidator());
		
		expressValidator is a Middleware, ki nam omogoča, da na določenih rautih definiramo, kakšen naj bo naš parameter. Da je string, da ima toliko znakov, da ni prazen.
		Damo pogoje, in če ne ustreza tem pogojem, nam vrne error s pravim sporocilom
		*/
		
		// preveri, da je email dejansko email
		// email--> kateri parameter poizvedujemo, druga vrednost je message error |.isEmail()-> je pogoj | lahko naprej chainas
		req.checkBody('email', 'Not a valid email').isEmail(); 
		req.checkBody('password', 'Not a valid password, min 6 characters').notEmpty().isLength({min:6}); 
		// vrne nam vse errorje, ki so povezani s pogojem vrstico visje
		var errors = req.validationErrors();
		//izpisemo error
		if(errors) return res.send(errors, 400);
 		//number 10 - saltRounds koliko ciklov si naj vzame da generira (salt, hash), gre za varnost
		bcrypt.genSalt(10, function(err, salt){
			
			bcrypt.hash(req.body.password, salt, (err, hash)=>{
				
				if(!err){
					
				const token = randToken.generate(255);
					
				var newAccount = new AccountModel({
					email		:req.body.email,
					name		:req.body.name,
					surename	:req.body.surename,
					password	:hash,
					tokens		: [{value: token}]
			
				});
				newAccount.save()
				.then(()=>{
					res.send({
						token:token,
						email:newAccount.email
					});
				})
				.catch((err)=>{
					res.send(err, 400); 
				});
				}else{
					res.send(err, 400);
				}
				
			
			});
		});
	
};

exports.login = (req, res)=>{
	
	req.checkBody('email', 'Not a valid email').isEmail(); 
	req.checkBody('password', 'Not a valid password, min 6 characters').notEmpty().isLength({min:6}); 
	// vrne nam vse errorje, ki so povezani s pogojem vrstico visje
	var errors = req.validationErrors();
	//izpisemo error
	if(errors) return res.send(errors, 400);
	
	AccountModel.findOne({email:req.body.email})
		.then((doc)=>{
		
		if(!doc){
			res.send('Failed', 401);
		}else{
			bcrypt.compare(req.body.password, doc.password, (err, match)=>{
				if(match){
					
					const token = randToken.generate(255);
					doc.tokens.push({
						value:token
					});
					doc.save()
						.then(()=>{
						res.send({
							token:token,
							email:doc.email
						});
					})
					.catch((err)=>{
						res.send(err, 400);
					});
					
				}else{
					res.send('Failed', 401);
				}
			});
		}
	})
	.catch((err)=>{
		res.send(err, 400);
	});
};

exports.checkLogin = (req, res)=>{
	
	res.send(` ${req.account.email} is logged in`); //string templating ` back-tick
	//res.send('Account' + req.account.email + 'logged in'); starejsi nacin OPCIJA 2
	
};
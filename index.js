const express = require('express');
const fs = require('fs').promises;
const mysql = require('mysql2/promise');
const dateET = require('./src/dateTimeET');

require('dotenv').config();
const bodyparser = require('body-parser');

const textRef = 'public/txt/vanasonad.txt';
const regTextRef = 'public/txt/visits.txt';

//Käivitan express() funktsiooni ja Tähistan tähistatava asja nimega "app"
const app = express();
//määarame veebilehe mallide järgi renderdamise mootori (EJS)
app.set('view engine', 'ejs');
//muudan "public" veebiserverile kättesaadavaks
app.use(express.static('public'));
//hakkame päringuid parsima
app.use(bodyparser.urlencoded({extended: false}));

app.get('/', (req, res)=>{
	//res.send('Express.js veeb käivitus!');
	const day = dateET.dayET();
	const date = dateET.dateET(0);
	const time = dateET.timeET();
	res.render('index', {weekDay: day, dateNormal: date, timeNow: time});
});

app.get('/vanasona', async (req, res)=>{
	try {
		const data = await fs.readFile(textRef, 'utf8');
		let folkWisdom = data.split(';');
		let wisdom = folkWisdom[Math.round(Math.random() * (folkWisdom.length - 1))];
		res.render('wisdom', {wisdom: wisdom});
	}
	catch (err){
		console.log(err);
		res.render('wisdom', {wisdom: 'Kahjuks ühtegi vanasõna ei leitud!'});
	}
});

app.get('/regvisit', (req, res)=>{
	res.render('regvisit');
});
app.post('/regvisit', async (req, res)=>{
	console.log(req.body);
	try {
		const date = dateET.dateET(0);
		const time = dateET.timeET();
		await fs.open(regTextRef, 'a');
		await fs.appendFile(regTextRef, req.body.nameInput + ',' + date + ',' + time + ';');
		res.render('regvisit');
	}
	catch (err){
		console.log(err);
		res.render('regvisit');
	}
});

app.get('/miks-tlu', (req, res)=>{
	res.render('miks-tlu');
});

app.get('/lastvisit', async (req, res)=>{
	try{
		const data = await fs.readFile(regTextRef, 'utf8');
		let visits = data.split(';');
		let lastVisit = visits[visits.length -2];
		let parts = lastVisit.split(',');
		res.render('lastvisit', {name: parts[0], date: parts[1], time: parts[2]});
	}
	catch (err){
		console.logg(err);
		res.render('lastvisit', {name: '-', date: '-', time: '-'});
	}
});
	
app.get('/eestifilm', (req, res)=>{
	res.render('eestifilm');
});

app.get('/eestifilm/film_inimesed', async (req, res)=>{
	let conn;
	try{
		conn = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_DATABASE
		});
		//defineerime SQL päringu
		let sqlReq = 'SELECT * FROM person';
		//käivitame päringu
		const[sqlRes] = await conn.execute(sqlReq);
		console.log(sqlRes);
		res.render('film_inimesed', {personList: sqlRes});
	}
	catch(err) {
		console.log('Andmebaasiga suhtlemise viga: ' + err);
		res.render('film_inimesed', {personList: []});
	}
	finally{
		if(conn){
			await conn.end();
		}
	}
});

app.get('/eestifilm/lisa_film_inimesed', (req, res)=>{
	res.render('lisa_film_inimesed', {notice: 'Ootan andmeid!'});
});

app.post('/eestifilm/lisa_film_inimesed', async (req, res)=>{
	console.log(req.body);
	//kontrollime andmeid, teeme kõige lahjema kontrolli
	let deceasedDate = null;
	if(req.body.deceasedInput != ''){
		deceasedDate = req.body.deceasedInput;
	}
	
	//sünnikuupäeva võrdlemine
	const bornDate = new Date(req.body.bornInput);
	const timeNow = new Date();
	
	
	
	if(!req.body.firstNameInput|| !req.body.lastNameInput || !req.body.bornInput || isNaN(bornDate.getTime()) || bornDate > timeNow){
		console.log("Andmed pole korrektsed!");
		return res.render('lisa_film_inimesed', {notice: 'Sisestatud andmed pole korrektsed!'});
	}
	let conn;
	try{
		conn = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_DATABASE
		});
		let sqlReq= 'INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)';
		await conn.execute(sqlReq, [
			req.body.firstNameInput,
			req.body.lastNameInput,
			req.body.bornInput,
			deceasedDate
		]);
			res.render('lisa_film_inimesed', {notice: req.body.firstNameInput + ' ' + req.body.lastNameInput + ' andmebaasi salvestatud.'});
	}
	catch (err){
		console.log('Andmebaasiga suhtlemise viga: ' + err);
		res.render('lisa_film_inimesed', {notice: 'Tekkis viga, andmeid ei salvestatud'});
	}
	finally{
		if(conn){
			await conn.end();
		}
	}
});

app.listen(5310);
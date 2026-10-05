const express = require('express');
const dateET = require('./src/dateTimeET');
const fs = require('fs').promises;
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

app.listen(5310);
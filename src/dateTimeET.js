//function dateFormattedET(){
	const dateFormattedET = function(monthType){
	let timeNow = new Date();
	const monthNamesET = ['jaanuar', 'veebruar', 'märts', 'aprill', 'mai', 'juuni', 'juuli', 'august', 'september', 'oktoober', 'november', 'detsember'];
	const folkMonthNamesET = ['näärikuu', 'küünlakuu', 'paastukuu', 'jürikuu', 'lehekuu', 'jaanikuu', 'heinakuu', 'lõikuskuu', 'mihklikuu', 'viinakuu', 'mardikuu', 'jõulukuu'];
	
	let monthName = ' ';
	if(monthType === 1){
		monthName = folkMonthNamesET[timeNow.getMonth()];
	} else {
		monthName = monthNamesET[timeNow.getMonth()];
	}
	
	return timeNow.getDate() + '. ' + monthName + ' ' + timeNow.getFullYear();
}

function addLeadZero(numValue){
	if(numValue < 10){
		numValue = '0' + numValue;
	}
	return numValue;
}

const weekDayET = function(){
	let timeNow = new Date();
	let weekNow = timeNow.getDay();
	const weekNamesET = ['pühapäev', 'esmaspäev', 'teisipäev', 'kolmapäev', 'neljapäev', 'reede', 'laupäev'];
	return weekNamesET[weekNow];
}

const timeFormattedET = function(){
	let timeNow = new Date();
	let hourNow = timeNow.getHours();
	let minuteNow = timeNow.getMinutes();
	let secondNow = timeNow.getSeconds();
	return hourNow +':' + addLeadZero(minuteNow) + ':' + addLeadZero(secondNow);
}

module.exports = {dateET: dateFormattedET, timeET: timeFormattedET, dayET: weekDayET}
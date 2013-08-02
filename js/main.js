$(document).ready(function() {
	$.getJSON(host + "/", {'checksum' : checkSum}, function(data) {
		loadCalculators(data.data);
	});

});

function loadCalculators(calcs) {
	var calcObjects = [];
	$.each(calcs, function(index, value) {
		var calculator = new Calculator(calcs[index]);
		calcObjects.push(calculator);
	});
	makeList(calcObjects);
}
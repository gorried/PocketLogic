/*
* Algorithm Object. This is our algoithmn that processes a json object of input
*/
function Calculator(json) {
	var fields = [];
	$.each(json.fields, function(index, value) {
		fields.push(new Field(value));
	});
	this.fields = fields;
	this.name = json.name;
	this.description = json.description;
	this.algorithm = json.algorithm;
	this.maxVal = json.max;
	this.minVal = json.min;
	this.rating = json.rating;
	this.taglines = json.taglines;
	this.score = json.score || false;
}

Calculator.method("run", function(data){
	var variables = "";
	$.each(data, function(index, value) {
		variables += value.name + "=" + value.value + ";";
	});
	eval(variables);
	var val = eval(this.algorithm);
	var result = 0;
	if(this.score) {
		result = val;
	} else {
		result = (val - this.minVal) / (this.maxVal - this.minVal);
	}

	return result;
});

Calculator.method("getFields", function() {
	return this.fields;
});

Calculator.method("getTags", function(result) {
	var tags = [];
	if(this.taglines) {
		$.each(this.taglines, function(index, val) {
			var add = false;
			if(val.when == '>') {
				if(result > val.value)
					add = true;
			} else if(val.when == '<') {
				if(result < val.value)
					add = true;
			} else if(val.when == '=') {
				if(result == val.value)
					add = true;
			} else if(val.when == '><') {
				if(result < val.max && result > val.min)
					add = true;
			}
			if(add)
				tags.push(val.msg);
		});
	}
	return tags;
});
/*
* Field object. Contains data and a name
*/
function Field(json) {
	this.type = json.type;
	this.name = json.name;
	this.f = json.f;
	this.t = json.t;
	this.min = json.min;
	this.max = json.max;
	this.varName = json.var_name;
	this.options = json.options;
};
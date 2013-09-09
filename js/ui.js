var host = "http://pocketlogic.herokuapp.com/";
var checkSum = "aeb465f791cd86548155010b2f5b7140";
var currentCalc;
var allCalcs;

$(document).ready(function() {
	$('#submitButton').click(function() {
		var inputBlob = makeBlob();
		var result = currentCalc.run(inputBlob);
		var tags = currentCalc.getTags(result);
		var tagsHtml = '';
		$.each(tags, function(index, value) {
			tagsHtml += ', ' + value;
		});
		tagsHtml += tagsHtml.length ? '.' : '';
		$('#resultBox').html('');
		$('#resultBox').append('<div class="centerit"><h3>Result: ' + (Math.round(result*1000)/10) + (!currentCalc.score ? '%, ' : '') + tagsHtml + '</h3></div>').trigger('create');
		$('#beforeShow').hide();
		$('#resultBox').show();
	});
});

function compareRanking(a,b) {
  if (a.rating < b.rating)
     return 1;
  if (a.rating > b.rating)
    return -1;
  return 0;
}

function makeList(calcs){
	allCalcs = calcs;
	allCalcs.sort(compareRanking);
	$.each(calcs, function(index, value) {
		$('#calcList').append('<li data-index="' + index + '" class="loadCalc"><a href="#calc" style="text-decoration:none !important;"><div class="topbar" ><p>' + value.name + '</p></div><div class="midbar"><p>' + value.description + '</p><div id="separator"><div class="featured"><div class="text">Featured</div></div><div class="starred"><div class="text">' + value.rating + '</div></div></div></div></a></li>');
	});
	$('.loadCalc').click(function() {
		currentCalc = allCalcs[$(this).data('index')];
		renderCalc(currentCalc);
	});
	$(".starred").click(function (e) {
		currentCalc = allCalcs[$(this).parent().parent().parent().parent().data('index')];
		starCalculator(currentCalc, this);
		e.stopPropagation();
		e.preventDefault();
	});
}

function renderCalc(calc){
	var fields = calc.getFields();
	$('#beforeShow').show();
	$('#resultBox').hide();
	$('#fieldList').html('');
	$('#resultBox').html('');
	$('#calcTitle').html('<a data-role="button" data-icon="back" href="#home"></a><h1>' + calc.name + '</h1>').trigger('create');
	var out = "";
	$.each(fields, function(index, value){

		out += '<div class="inputPair" data-role="listview"><div class="topbar2" ><p class="ui-li-desc">' + value.name + '</p></div>';
		if(value.type == "slider"){
			out += '<div class="midbar2"><input class="field" type="range" step="'+ ((value.max+1)-value.min)/100 +'" name="' + value.varName + '" id="' + value.varName + '" value="' + value.min + '" min="' + value.min + '" max="' + value.max + '"></div></div><div id="separator"></div>';
		} else if(value.type == "select") {
			var options = '';
			$.each(value.options, function(key, opt) {
				options += '<option value="' + opt.value + '">' + opt.name + '</option>';
			});
			out += '<div class="midbar2"><select class="field select" name="' + value.varName + '" id="' + value.varName + '">' + options + '</select></div></div><div id="separator"></div>';
		} else if(value.type == "bool") {
			out += '<div class="midbar2"><select class="field bool" name="' + value.varName + '" id="' + value.varName + '" data-role="slider"><option value="' + value.f + '">' + value.falseName + '</option><option value="' + value.t + '">' + value.trueName + '</option></select></div></div></div><div id="separator">';
		}

	});
	$('#fieldList').append(out).trigger('create');
	
}

function makeBlob() {
	return $('.field').serializeArray();
}

function starCalculator(calc, ref) {
	$.post(host + "/star/", {"name" : calc.name, "checksum" : checkSum}, function(data) {
		if(data.success) {
			$(ref).children('.text').html(data.data.rating);
			calc.rating = data.rating;
		}
	});
}



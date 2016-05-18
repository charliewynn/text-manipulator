var states = [];

var a;


function log(data){
	$("#output").append(data + "<br>").scrollTop($("#output").prop("scrollHeight"));
	console.log(data);
}

function loadState(){
	log("loading...");
	var state = states[$(this).index()/2];
	$("#text").val(state[0]);
	$("#p1").val(state[2]);
	$("#p2").val(state[3]);
	$("#preview").val(state[4]);
	$(".action[value="+state[1]+"]").click();
}

$(function(){

	attachActionClick();
	$("#p2").hide();
	$("#text,#p1,#p2").keyup(evaluate);
	$("#write").click(function(){
		states.push($("#text,.action:disabled,#p1,#p2,#preview").map((i,a)=>$(a).val()));
		$("#states").append('<label class="state">' + (states.length) +')'+ $("#text").val() + ' -> ' + $("#preview").val() + "</label><br>");
		$("label").unbind('click').click(loadState);
		$("#text").val($("#preview").val());
	})

});

function attachActionClick(){ $(".action").unbind("click").click(doAction); }

function doAction(el){
	$(".action").prop("disabled",false);
	$(this).prop("disabled",true);
	log(this.value);

	$("#p2").hide();
	if(['reduce','replace','other'].indexOf(this.value) > -1) $("#p2").show();

	evaluate();
}

function evaluate(){

	var value;
	try
	{
		eval( "value = " + $("#text").val());
	}catch(e){
		value = $("#text").val();
	}
	log(value + ' | ' + JSON.stringify(value));

	var fn = $(".action:disabled").val();
	var output;
	try{
		if(fn == 'map')     output = value.map(eval($("#p1").val()));
		if(fn == 'reduce')  output = value.reduce(eval($("#p1").val()),eval($("#p2").val()));
		if(fn == 'split')   output = value.split(eval('"'+$("#p1").val()+'"'));
		if(fn == 'join')    output = value.join(eval('"'+$("#p1").val()+'"'));
		if(fn == 'replace') output = value.replace(eval($("#p1").val()));
		if(fn == 'other')   output = eval("value = "+ $("#p1").val() + $("#text").val() +$("#p2").val() );
	} catch(e){
		log("Error: " + e);
	}

	$("#preview").val(JSON.stringify(output));
}

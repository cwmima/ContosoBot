function discussion_send(el){
	input_text = $(el).parent().prev().val();
	if (input_text != ""){
		$(el).parent().parent().prev().find("p").append("<span style='color:#5bc0de;'><b>Amy: </b></span>" +input_text+"<br>");
		$(el).parent().prev().val("");
	}
}
function dismiss(el){
	document.getElementById("submission-confirm").style.display = "none";
}
function confirmed(){
	document.getElementById("submission-confirm").style.display = "none";
	document.getElementById("submission-succes").style.display = "block";
	document.getElementById("submit-btn").style.display = "none";
	x = document.getElementsByClassName("questions-nav");
	for (i = 0; i < x.length; i++) {
    	$(x[i]).addClass("not-active");
    	$(x[i]).next().addClass("not-active");
	}
}
function submit(){
	document.getElementById("submission-confirm").style.display = "block";
}

function notification_click(el){
	caller = $(el).find('.badge');
	//caller.css("display", "none");
	caller.html("");
}
function live_chat_close(el){
	$(document.getElementById("live-chat")).addClass("invisible");
}
function live_chat_toggle(){
	live_chat = $(document.getElementById("live-chat"));
	if (live_chat.hasClass("invisible")){
		live_chat.removeClass("invisible");
	}else{
		live_chat.addClass("invisible");
	}
}
function chat_send(){
	input_text = $(document.getElementById("chat-input")).val();
	if (input_text != ""){
		$(document.getElementById("chat-box")).children().append("<span style='color:#5bc0de;'><b>Amy: </b></span>" +input_text+"<br>");
		$(document.getElementById("chat-input")).val("");
	}
}


$(document).ready(function(){

	//required_fields = $(".required");
	//$("#response_area p").html("There are " + required_fields.length + " required fields");
});
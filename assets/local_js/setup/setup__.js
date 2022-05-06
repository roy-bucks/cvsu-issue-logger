$(document).ready(function(){


$(".start").click(function(){

	$(".conf-modal").modal("show");

})

$(".auth").click(function(){

	const password = $(".pass").val();
	$.post("/setup/confirm", {password}, function(res){
		if(res.error){
			setAlert(res.message, "danger");
		}else{
			location.replace("/setup/admin/"+res.code);
		}
	})
})

function setAlert(text, type){

	let html = '';
	html += "<div class='alert fw-bold alert-"+type+" alert-dismissible fade show' role='alert'>";
    html += text;
    html += "<button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button>";
    html += "</div>"
    $(".alert")
    	.html(html)
    	.removeClass("d-none");

}

$(".alert").addClass("d-none");

$(document).on("click", ".btn-close", function(){
	$(".alert").addClass("d-none");
})


$(".setup").click(function(res){

	const data = {
		first_name: $(".fname").val(),
		last_name:  $(".lname").val(),
		email: $(".email").val(), 
		user_type: "admin", 
		gender:  $(".gender").val(), 
		password: $(".password").val()
	}

	$.post("/admin/account/register-admin", {data}, function(res){

		if(res.error){
			setAlert(res.message, "danger");
		}
		else{
			$(".conf-modal").modal("show");
			setTimeout(function(){
				location.replace("/admin/account/register");
			}, 3000);
		}
	})
})




})
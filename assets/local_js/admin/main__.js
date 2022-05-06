$(document).ready(function(){


	function setAlert(text, type){
		let html = '';
		html += "<div class='alert fw-bold alert-"+type+" alert-dismissible fade show' role='alert'>";
	    html += text;
	    html += "<button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button>";
	    html += "</div>"
	    $(".alert").html(html);
	}


	$(".update").click(function(){

		const data = {
			email: $(".email").val(),
			password: $(".password").val(),
		}

		$.post("/admin/account/update/credentials", {data}, function(res){

			if(res.error){
				setAlert(res.message, "danger");
			}
			else{
				setAlert(res.message, "success");
			}
		})
	})

	//get user email 
	$.post("/admin/account/get-email", function(email){
		$(".email").val(email);
	});

})
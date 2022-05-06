$(document).ready(function(){



	function setAlert(text, type){
		let html = '';
		html += "<div class='alert fw-bold alert-"+type+" alert-dismissible fade show' role='alert'>";
	    html += text;
	    html += "<button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button>";
	    html += "</div>"
	    $(".alert").html(html);
	}



	$(".register").click(function(){

		const data = {
			first_name: $(".fname").val(),
			last_name:  $(".lname").val(),
			email: $(".email").val(), 
			user_type: $(".userType").val(), 
			gender:  $(".gender").val(), 
		}

		$.post("/admin/account/register", {data}, function(res){
			if(res.error){
				setAlert(res.message, "danger");
			}
			else{
				$(".success-message").text(res.message); 
				$(".success").modal("show");
			}
		})

	})


	$(".add-new").click(function(){
		$(".success").modal("toggle");
		location.reload();
	})


	$(".email").blur(function(){
		const email = $(this).val();

		$.post("/admin/account/email-listener", {email}, function(res){
			if(res){
				if(res.admin && res.user){
					setAlert("This email is already registered as admin and user", "warning");
					return;
				}
				if(res.admin && ! res.user){
					//admin
					setAlert("This email is already registered as admin you can continue by selecting other user type", "success");
				}
				if( res.user && res.admin){
					//user
					setAlert("This email is already registered as user you can continueby selecting other user tyoe", "success");
				}

			}
		})
	})

	


})
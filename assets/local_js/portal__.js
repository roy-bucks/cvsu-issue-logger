$(document).ready(function(){



	function resetBtnLogIn(){
		$(".enter-btn").each(function(){

			$(this).addClass("d-none"); 

		})	
	}



	$(".login").click(function(){

		resetBtnLogIn(); 
		$(".btn-load").removeClass("d-none");


		const email = $("#Email1").val();

		if(validator.isEmpty(email)){
			$(".email").addClass("is-invalid");

			resetBtnLogIn();
			$(".btn-dflt").removeClass("d-none");
		}
		else{

			$.post("/user/login", {email}, function(res){
				
				resetBtnLogIn();
				$(".btn-dflt").removeClass("d-none");

				if(! res.error){
					if(res.user_type == 'admin'){
						location.replace("/user/admin/auth/"+email);
					}
					else{
						window.location.replace(res.redirect);
					}
				}
				else{
					//with error
					setAlert(res.message, "danger");
				}
			})

		}

	})

	function resetBtn(){
		$(".admin_auth").each(function(){
			$(this).addClass("d-none");
		})
	}


	function setAlert(text, type){
		let html = '';
		html += "<div class='alert fw-bold alert-"+type+" alert-dismissible fade show' role='alert'>";
	    html += text;
	    html += "<button type='button' class='btn-close alert-close' data-bs-dismiss='alert' aria-label='Close'></button>";
	    html += "</div>"
	    $(".alert").html(html);
	}


	$(".email").keyup(function(){
		$(this).removeClass("is-invalid");
	})


	$(".admin-login").click(function(res){

		resetBtn();
		$(".btn-load").removeClass("d-none");

		const data ={
			email: $(".email").val(),
			pass: $(".password").val(),
		}

		$.post("/user/admin/auth", {data}, function(res){

			resetBtn();
			$(".btn-dflt").removeClass("d-none");

			if(res.error){
				setAlert(res.message, "danger");
				$(".alert").removeClass("d-none");
			}
			else{
				location.replace(res.redirect);
			}
		})
	})

	$(document).on("click", ".alert-close", function(){

		$(".alert").empty();
	})



})
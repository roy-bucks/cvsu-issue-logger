$(document).ready(function(){


$(".bri").each(function(){

	$(this).click(function(){
		setUpLoading(this);
		const data = {
			user_id: $(".userId").val(),
			user_type: $(this).attr("userType")
		}

		$.post("/user/entry", {data}, function(res){

			if(! res.error){
				location.replace(res.redirect);
			}
			else{
				setAlert(res.message, "danger");
				location.reload();
			}
		})

	})
})


function setUpLoading(target){

	$(target).children(".bi").addClass("d-none");
	$(target).children(".spinner").removeClass("d-none");

	$(".bri").each(function(){	
		$(this).addClass("disabled");
	});

}



function setAlert(text, type){
	let html = '';
	html += "<div class='alert fw-bold alert-"+type+" alert-dismissible fade show' role='alert'>";
    html += text;
    html += "<button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button>";
    html += "</div>"
    $(".alert").html(html);
}



})
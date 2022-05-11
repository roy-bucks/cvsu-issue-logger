$(document).ready(function(){



//get the user name and profile 
function getUserData(){
	$.post("/user/profile",function(res){
		
		if(res){
			const data = {
				img: res.profile,
				first_name: res.first_name,
				last_name: res.last_name
			}
			localStorage.setItem("profile", JSON.stringify(data));
			setProfile();
		}
	})
}

function setProfile(){

	const profile = JSON.parse(localStorage.getItem("profile"));

	if(profile != null){
		$(".profile").attr("src", profile.img)
		$(".name").text(profile.first_name + " "+ profile.last_name)
	}
	else{
		getUserData(); 
	}
}

setProfile();



function validate(data){

	let flag = 0;
	if( validator.isEmpty(data.priority)){
		$(".priority")
			.addClass("is-invalid")
			.siblings(".feedback")
			.addClass("invalid-feedback")
			.text("Please select priority");
		
		flag = 1;
	}

	if( validator.isEmpty(data.course)){
		$(".course")
			.addClass("is-invalid")
			.siblings(".feedback")
			.addClass("invalid-feedback")
			.text("Please select sector");
		
		flag = 1;
	}

	if( validator.isEmpty(data.admin_instruc)){
		$(".admin_instruc")
			.addClass("is-invalid")
			.siblings(".feedback")
			.addClass("invalid-feedback")
			.text("Please select ERP");
		
		flag = 1;
	}
	if( validator.isEmpty(data.issue)){
		$(".issue")
			.addClass("is-invalid")
			.siblings(".feedback")
			.addClass("invalid-feedback")
			.text("Please select issue");
		
		flag = 1;
	}

	if( ! validator.isLength(data.description, {min:0,  max: 500})){
		$(".description")
			.addClass("is-invalid")
			.siblings(".feedback")
			.addClass("invalid-feedback")
			.text("Description is too long");
		
		flag = 1;
	}
	
	if(flag == 0){
		return true;
	}
	else{
		return false;
	}
}


$(".need").each(function(){
	$(this).change(function(){
		$(this)
			.removeClass("is-invalid")
			.siblings(".feedback")
			.removeClass("invalid-feedback")
			.text('');
	})
})

function reset_submit(){
	$(".submit").each(function(){
		$(this).addClass("d-none"); 
	})
}


$(".submit").click(function(){

	reset_submit(); 
	$(".btn-load").removeClass("d-none"); 

	const data ={
		priority: $(".priority").val(),
		course: $(".course").val(),
		admin_instruc: $(".admin_instruc").val(),
		issue: $(".issue").val(),
		description: $(".description").val(),
		
	}


	const isValid = validate(data);
	if(isValid){ 
		
		let file = $(".file").prop('files')[0];

		let dataForm   = new FormData();
		dataForm.append("data",JSON.stringify(data));
		dataForm.append("file", file);

		$.ajax({
		    url: "/user/ticket/submit",
		    type: 'post',
		    data: dataForm,
		    contentType: false,
		    processData: false,
		    success: function(res) {

		    	reset_submit(); 
				$(".btn-static").removeClass("d-none"); 

		       if(res.error){
		       		setAlert(res.message, "danger");
		       }
		       else{
		       		$(".success").modal("show");
					setTimeout( ()=>{
						location.reload();
					}, 3000)
		       } 
		    }
		});
	}
	else{
		
		reset_submit(); 
		$(".btn-static").removeClass("d-none"); 
	}
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

$(document).on("click", ".btn-close", function(){
	$(".alert").addClass("d-none");
})


function getActiveTicket(){
	$.post("/user/ticket/active/count", function(res){
		if(res){

			$(".ticket-badge").text(res)
		}
	})
}


function getAllTickets(){

	$(".noTicketFound").addClass("d-none");
	$(".loadTicket").removeClass("d-none")

	$.post("/user/tickets/all", function(res){

		$(".loadTicket").addClass("d-none")
		if(res){
			//set the data
			setTickets(res);
		}
		else{
			//
			$(".noTicketFound").removeClass("d-none");
		}
	})
}


function setTickets(data){

	for(let a=0; a<data.length; a++){

		let created_at = moment(new Date(data[a].created_at)).format('lll');
		let updated_at = moment(new Date(data[a].updated_at)).format('lll');
		let status_badge = 'success';
		let priority_badge = "success";
		if(data[a].status == "open"){
			status_badge = "warning"
		}
		if(data[a].status == "On Hold"){
			status_badge = "danger"
		}
		if(data[a].priority =="High"){
			priority_badge = "danger";
		}
		if(data[a].priority == "Medium"){
			priority_badge = "primary";
		}
		let html = "<tr>";
            html += "<td>"+data[a].issue_id+"</td>";
            html += "<td>"+created_at+"</td>";
           	html += "<td>"+updated_at+"</td>";
            html += "<td><span class='badge bg-"+status_badge+"'>"+data[a].status+"</span></td>";
            html += "<td>"+data[a].issue+"</td>";
            html += "<td><span class='badge bg-"+priority_badge+"'>"+data[a].priority+"</span></td>";
            html += "<td><input type='hidden' class='ticket_id' value = '"+data[a].issue_id+"'><button class='btn btn-secondary btn-sm view'>view</button></td>";
            html += "</tr>"
         $(".tickets-table-content").append(html);
    }

}

getActiveTicket();
getAllTickets();

})
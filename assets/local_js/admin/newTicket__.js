$(document).ready(function(){


function resetNotif(){

	$(".notif").each(function(){
		$(this).addClass("d-none"); 
	})
}


function getTicketsCount(){
	$.post("/admin/tickets/count", function(res){
		$(".new").text(res.open);
		$(".on_hold").text(res.on_hold);
		$(".close").text(res.close);
		$(".all").text(res.total);
	})
}

function getNewTickets() {

	resetNotif(); 
	$(".load").removeClass("d-none")

	$.post("/admin/tickets/get/new", function(res){
		resetNotif(); 
		
		if(! res.error){
			//no error
			if(res.data.length){
				//have a ticket
				setNewTickets(res.data);
			}
			else{
				//no ticket
				$(".no-data").removeClass("d-none");
			}
		}
		else{
			$(".error").removeClass("d-none");
			//erro exist
		}	
	})
}


function setNewTickets(data){

	for(let a=0; a< data.length; a++){

		let badge = "success";

		if(data[a].priority == "High"){
			badge = "danger";
		}
		if(data[a].priority == "Medium"){
			badge = "primary"
		}


		let html = "<tr>";
            html += "<td>"+data[a].ticket_id+"</td>";
            html += "<td>"+data[a].created_at+"</td>";
            html += "<td>"+data[a].created_by+"</td>";
            html += "<td><span class='badge bg-"+badge+"'>"+data[a].priority+"</span></td>";
            html += "<td>"+data[a].issue+"</td>";
            html += "<td>";
            html += "<input class='ticket_id' type='hidden' value='"+data[a].ticket_id+"'>";
            html += "<button class='btn-sm btn btn-primary view'>view</button>";
            html += "</td>";
            html += "</tr>";

        $(".new-tickets-content").append(html);
	}
}


function checkSetActive(ticket_id){

	$(".submit-process").removeClass("disabled");
	$(".ticket-active").addClass("d-none");

	$.post("/admin/ticket/set-check/", {ticket_id},function(res){

		if(res.active){
			$(".submit-process").addClass("disabled");
			$(".ticket-active").removeClass("d-none");
		}
	})
}


/*********************Process the ticket ****************/
$(document).on("click", ".view", function(){

	const ticket_id = $(this).siblings(".ticket_id").val();

	$(".view-process").modal("show");
	$(".view-load").removeClass("d-none");
	$(".view-error").addClass("d-none");

	$.post("/admin/ticket/view-process", {ticket_id}, function(res){

		$(".view-load").addClass("d-none");
		if(res.error){
			//something went wrong
			$(".view-error").removeClass("d-none");
		}
		else{
			if(res.data){
				//no error
				checkSetActive(ticket_id); 
				setPreviewTicket(res.data);

			}	
			else{
				//no data found
				alert("No Data Found");
				$(".view-process").modal("toggle");
			}
		}
	})
})


function setPreviewTicket(data){

	$(".ticket-id-process").val(data.issue_id);

	const updated_at= moment(new Date(data.updated_at)).format('lll');
	const created_at = moment(new Date(data.created_at)).format('lll')

	//Basic Ticket Details 
	$(".ticket-id").text(data.issue_id);
	$(".ticket-createdBy").text(data.created_by);
	$(".ticket-status").text(data.status);
	$(".ticket-priority").text(data.priority);
	$(".ticket-updatedAt").text(updated_at);
	$(".ticket-createdAt").text(created_at);

	//Ticket more details
	$(".ticket-issue").text(data.issue);
	$(".ticket-sector").text(data.course);
	$(".ticket-erp").text(data.admin_instruc);


	const description = data.description; 
	if(description){
		//desrcriptin  exist
		$(".ticket-description").text(description);
	}
	else{
		//user didnt provide description
		$(".ticket-description").html("<i class='bi bi-dash-circle-fill text-warning'></i></i><span class='fw-bold text-muted'>  No Description</span>");
	}

	$(".ticket-file").empty();

	const file = data.file;
	if(file){
		$(".ticket-file").html("<i class='i bi-file-earmark-fill'></i><a href='"+file+"'> download </a>");
		$(".file-image").attr("src", file);
	}
	else{
		$(".ticket-file").html("<i class='bi bi-dash-circle-fill text-warning'></i></i><span class='fw-bold text-muted'>  No File Attached</span>");
	}


	const profile_name = $(".profile-name").text();
	$(".profile-name-assigned").val(profile_name);	
}


function resetbtn(){
	$(".submit-process").each(function(){
		$(this).addClass("d-none");
	})
}

$(".submit-process").click(function(){

	resetbtn();
	$(".asign-load").removeClass("d-none")

	const ticket_id = $(this).siblings(".ticket-id-process").val();

	const data = {
		ticket_id: ticket_id, 
		new_status: $(".ticket-update-status").val(),
		response: $(".ticket-update-description").val(),
		admin_name: $(".profile-name-assigned").val(),
	}

	$.post("/admin/ticket/process", {data}, function(res){
		resetbtn();
		$(".asign").removeClass("d-none")
		if(! res.error){
			$(".view-process").modal("toggle");
			$(".success").modal("show");
			setTimeout(()=>{ location.reload() }, 2000);  	
		}
		else{
			$(".view-error").removeClass("d-none");
		}
	})
})

$(".ticket-close").click(function(){
	const ticket_id = $(this).siblings(".ticket-id-process").val();
	$.post("/admin/ticket/disactive",{ticket_id});
})


getTicketsCount();
getNewTickets(); 

})
$(document).ready(function(){


function getTicketsCount(){
	$.post("/admin/tickets/count", function(res){
		$(".new").text(res.open);
		$(".on_hold").text(res.on_hold);
		$(".close").text(res.close);
		$(".all").text(res.total);
	})
}


function resetNotif(){

	$(".notif").each(function(){
		$(this).addClass("d-none"); 
	})
}


function getInCloseTickets() {

	resetNotif();
	$(".load").removeClass("d-none");

	$.post("/admin/tickets/get/in_close", function(res){

		resetNotif();

		if(! res.error){
			//no error
			if(res.data.length){
				//have a ticket
				setInCloseTickets(res.data);
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


function setInCloseTickets(data){

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
				setPreviewTicket(res.data);

			}	
			else{
				//no data found
				alert("No Data Found");
				$(".view-process").modal("toggle");
			}
		}
	})

	ticketTrack(ticket_id); 
})


function setPreviewTicket(data){

	console.log(data);

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
}


function ticketTrack(ticket_id){
	$.post("/ticket/track", {ticket_id}, function(res){

		if(!res.error){
			 setTrack(res.data)
		}
		else{
			//error
		}

	});
}


function setTrack(data){

	console.log(data);

	$(".track-content").empty();

	for(let a=0; a<data.length; a++){
		let line = '';
		if(a <  data.length -1 ){
			line ='vline';
		}

		let badge = 'success';
		if(data[a].status == "On hold"){
			badge = 'danger';
		}

		if(data[a].status == "pending"){
			badge = 'primary';
		}

		let html = "<div class='container d-flex  justify-content-start align-items-center mt-3 position-relative'>";
	        html += "<div class='d-flex flex-column align-items-center' style='width: 150px'>";
	        html += "<span>"+data[a].created_date+"</span>";
	        html += "<span>"+data[a].created_time+"</span>";
	        html += "</div>";
	        html += "<i class='bi bi-circle-fill ms-2 fs-6 text-secondary "+line+"'></i>";
	        html += "<div class='d-flex flex-column align-items-start ms-4' style='width: 300px;'>";
	        html += "<span class='fw-bold'>"+data[a].subject+"</span>";
	        html += "<span class='badge bg-"+badge+"'>"+data[a].status+"</span>";
	        html += "<span class='f-12'>"+data[a].details+"</span>";
	        html += "<span class='f-12'> <i class='bi bi-person'></i>  "+data[a].name+"</span>";
	        html += "</div>";
	        html += " </div>";
		
		$(".track-content").append(html); 
	}
}



getInCloseTickets();
getTicketsCount();

})